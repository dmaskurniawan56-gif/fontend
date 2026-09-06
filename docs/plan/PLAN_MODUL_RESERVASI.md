# 🏛️ Rencana Implementasi Produksi: Modul Reservasi (`reservation`)

Dokumen ini merupakan cetak biru (*blueprint*) dan spesifikasi teknis arsitektur mendalam untuk mengimplementasikan **Modul Reservasi (Appointment & Booking Management)** pada ekosistem Wahide (Backend Go `wahide` dan Frontend Next.js 16 `fontwahide`).

Implementasi ini mematuhi standar resmi **`wahide/docs/module-anatomy.md`**, kaidah *Clean Architecture*, prinsip **Zero Resource Leaks**, dan optimasi **Anti-N+1 Query**. Modul ini terhubung secara mulus dengan **Modul Pengingat (Reminder)** via Hexagonal Port Adapter serta terintegrasi dengan **WhatsApp Multi-Device Engine**.

---

## 1. Nilai Bisnis & Alur Integrasi Antar-Modul

Buku janji temu digital (*digital appointment book*) dibutuhkan oleh bisnis berbasis jadwal (klinik, dokter gigi, salon kecantikan, barbershop, bengkel servis, konsultan, dan restoran):
1. **Pencatatan Cepat Sekali Jalan**: Reservasi dicatat hanya satu kali melalui antarmuka Kalender Bulanan / Agenda Harian.
2. **Konfirmasi Instan WhatsApp**: Notifikasi instan dikirimkan ke nomor WhatsApp pelanggan begitu booking dibuat.
3. **Penyelarasan Pengingat Otomatis (Zero Entri Ganda)**:
   - Reservasi secara otomatis mendaftarkan tanggal target janji temu ke **Modul Pengingat (Reminder)** via `ReminderContract`.
   - Modul Reminder akan mengevaluasi aturan drip ($H-1$, Hari H, $H+3$) dan mengeksekusi pengiriman pesan otomatis tanpa perlu input ulang.
   - Jika reservasi dibatalkan (*CANCELLED*), jadwal pengingat di Modul Reminder otomatis dibatalkan (*CANCELLED*).
4. **Kalender Bulanan Bebas N+1 Query**: Agregasi jumlah booking per tanggal dalam 1 bulan diambil dalam **1 query SQL tunggal** (*single GROUP BY query*).

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND: /reservations (Next.js 16)           │
│  ┌───────────────────────┐    ┌───────────────────────────┐ │
│  │ MonthlyCalendar (Grid)│    │ DailyAgendaList (Timeline)│ │
│  └───────────┬───────────┘    └─────────────┬─────────────┘ │
│              │ (Select Date)                │ (Quick Add)   │
│              └───────────────┬──────────────┘               │
└──────────────────────────────┼──────────────────────────────┘
                               │ REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          BACKEND: Modul Reservation (wahide Go Echo)        │
│                                                             │
│  1. Single Query Monthly Aggregate (Anti-N+1):              │
│     SELECT booking_date, COUNT(*) FROM reservations...      │
│                                                             │
│  2. Create Booking + Safe Bounded Context (Zero Leak)       │
│     ├─► Persist to DB `reservations`                        │
│     ├─► Instant WhatsApp Port confirmation                  │
│     └─► Sync with ReminderContract:                         │
│         ScheduleReminder(tenant_id, name, phone, date, ...) │
│                                                             │
│  3. Status Lifecycle Update (PENDING/CONFIRMED/CANCELLED)   │
│     └─► If CANCELLED: CancelReminder(tenant_id, reminder_id)│
└──────────────────────────────┬──────────────────────────────┘
                               │ Inter-module Contract
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             BACKEND: Modul Reminder (internal/modules)      │
│  - Bounded cron evaluator evaluates H-1, Hari H, H+3        │
│  - Idempotency guard prevents duplicate messages            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Standar Arsitektur Backend (`wahide`)

Sesuai `wahide/docs/module-anatomy.md` dan mengacu pada standardisasi modul `template` dan `reminder`, struktur modul `reservation` disusun sebagai berikut:

```
wahide/internal/modules/reservation/
├── reservation.go                  # Module bootstrapper, auto-migration, & dependency injection wiring
├── delivery/
│   └── http/
│       ├── error_mapper.go         # Domain error mapper (ErrReservationNotFound ➔ HTTP 404, etc.)
│       ├── router.go               # Route registration (Public, Protected, Admin)
│       └── reservation_handler.go  # HTTP controller (Request binding, noxss validation, envelope response)
├── domain/
│   ├── contract.go                 # ReservationContract publik (jika modul lain butuh cek kuota/booking)
│   ├── errors.go                   # Domain sentinel errors (ErrReservationNotFound, ErrInvalidBookingDate, dll)
│   ├── ports.go                    # Outbound ports (ReminderPort, WhatsAppPort)
│   ├── repository.go               # Outbound repository interfaces
│   ├── usecase.go                  # Inbound usecase interfaces (dengan *sharedCtx.Auth)
│   ├── entity/
│   │   └── reservation.go          # GORM model entity dengan ULID BeforeCreate & composite indexes
│   └── dto/                        # SINGLE ENTITY DTO RULE (Pemisahan ketat per entitas, no entity import)
│       ├── reservation_dto.go      # Create, Update, UpdateStatus, List, Response khusus Reservation
│       └── calendar_dto.go         # CalendarSummaryRequest, DaySummaryItem, CalendarSummaryResponse
├── repository/
│   └── reservation_repository.go   # Lean GORM repository dengan explicit SQL & Single Group-By Query
├── usecase/
│   ├── contract_adapter.go         # Implementasi ReservationContract untuk modul eksternal
│   └── reservation_crud_usecase.go # Logika bisnis, fail-closed RBAC, reminder sync, & zero info logs
└── test/
    ├── mocks_test.go               # Mock repositories, mock ports, test logger, test validator
    ├── reservation_crud_usecase_test.go # Test isolasi tenant, lifecycle status, & reminder sync
    ├── reservation_handler_test.go # Test HTTP endpoint, error codes, & response formats
    └── reservation_security_xss_test.go # Test pencegahan injeksi XSS pada input nama & catatan
```

---

## 3. Desain Skema Basis Data & Optimasi Query (Anti-N+1)

### A. Tabel `reservations` ([`domain/entity/reservation.go`](file:///G:/WEB2026/wahide/internal/modules/reservation/domain/entity/reservation.go))

```go
package entity

import (
    "time"

    "github.com/oklog/ulid/v2"
    "gorm.io/gorm"
)

type ReservationStatus string

const (
    ReservationStatusPending   ReservationStatus = "PENDING"
    ReservationStatusConfirmed ReservationStatus = "CONFIRMED"
    ReservationStatusCompleted ReservationStatus = "COMPLETED"
    ReservationStatusCancelled ReservationStatus = "CANCELLED"
)

type Reservation struct {
    ID           string            `gorm:"primaryKey;type:varchar(26)" json:"id"`
    TenantID     string            `gorm:"type:varchar(26);not null;index:idx_reservations_tenant_date,priority:1;index:idx_reservations_tenant_status,priority:1;index:idx_reservations_tenant_phone,priority:1" json:"tenant_id"`
    CustomerName string            `gorm:"size:150;not null" json:"customer_name"`
    Phone        string            `gorm:"size:30;not null;index:idx_reservations_tenant_phone,priority:2" json:"phone"`
    BookingDate  time.Time         `gorm:"type:date;not null;index:idx_reservations_tenant_date,priority:2" json:"booking_date"`
    BookingTime  string            `gorm:"size:5" json:"booking_time"` // Format "HH:mm" (contoh: "09:30")
    ServiceName  string            `gorm:"size:150" json:"service_name"`
    Notes        string            `gorm:"size:255" json:"notes"`
    Status       ReservationStatus `gorm:"size:20;not null;default:'CONFIRMED';check:chk_reservation_status,status IN ('PENDING','CONFIRMED','COMPLETED','CANCELLED');index:idx_reservations_tenant_status,priority:2" json:"status"`
    ReminderID   string            `gorm:"size:26" json:"reminder_id"` // ID pengingat pada modul reminder
    CreatedAt    time.Time         `gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt    time.Time         `gorm:"autoUpdateTime" json:"updated_at"`
}

func (r *Reservation) BeforeCreate(tx *gorm.DB) error {
    if r.ID == "" {
        r.ID = ulid.Make().String()
    }
    return nil
}
```

### B. Optimasi Query Anti-N+1 pada Kalender Bulanan
Untuk merender kalender bulanan, sistem **DILARANG** melakukan query per hari ($30 \times$ query).
Sebaliknya, repository wajib menyediakan query agregasi tunggal:
```go
// GetCalendarSummary: 1 Single Query untuk seluruh bulan
func (r *reservationRepository) GetCalendarSummary(ctx context.Context, tenantID string, startDate, endDate time.Time) (map[string]int, error) {
    type DateCount struct {
        Date  string `gorm:"column:date_str"`
        Count int    `gorm:"column:total_count"`
    }
    var counts []DateCount
    db := r.GetDB(ctx).Model(&entity.Reservation{}).
        Select("to_char(booking_date, 'YYYY-MM-DD') as date_str, COUNT(*) as total_count").
        Where("booking_date >= ? AND booking_date <= ? AND status != ?", startDate, endDate, entity.ReservationStatusCancelled)

    if tenantID != "" {
        db = db.Where("tenant_id = ?", tenantID)
    }

    if err := db.Group("to_char(booking_date, 'YYYY-MM-DD')").Scan(&counts).Error; err != nil {
        return nil, err
    }

    result := make(map[string]int, len(counts))
    for _, c := range counts {
        result[c.Date] = c.Count
    }
    return result, nil
}
```

---

## 4. DTO & Standar Keamanan XSS (Single Entity DTO Rule)

### A. File `domain/dto/reservation_dto.go`
* `CreateReservationRequest`:
  - `CustomerName` (`validate:"required,min=2,max=150,noxss"`)
  - `Phone` (`validate:"required,min=8,max=30,noxss"`)
  - `BookingDate` (`validate:"required"`, format `"YYYY-MM-DD"`)
  - `BookingTime` (`validate:"omitempty,len=5"`, format `"HH:mm"`)
  - `ServiceName` (`validate:"omitempty,max=150,noxss"`)
  - `Notes` (`validate:"omitempty,max=255,noxss"`)
  - Method `.SanitizeFields()` untuk membersihkan karakter berbahaya.
* `UpdateReservationRequest`:
  - Pointer fields (`*string`, `*time.Time`, `*ReservationStatus`) untuk patch parsial yang aman.
* `UpdateReservationStatusRequest`:
  - `Status` (`validate:"required,oneof=PENDING CONFIRMED COMPLETED CANCELLED"`)
* `ListReservationRequest`:
  - `Page`, `PageSize`, `Search` (`noxss`), `Date` (`YYYY-MM-DD`), `Status`, `StartDate`, `EndDate`.
* `ReservationResponse`:
  - Mapping aman bebas kebocoran field internal.

### B. File `domain/dto/calendar_dto.go`
* `CalendarSummaryRequest`:
  - `Month` (`validate:"required,len=7"`, format `"YYYY-MM"` contoh: `"2026-09"`).
* `CalendarSummaryResponse`:
  - `Month` (string)
  - `Summary` (map tanggal ke jumlah booking: `map[string]int`)
  - `TotalBookings` (int)

---

## 5. Standar Logika UseCase & Keamanan Akses (Ref: Modul Template & Reminder)

### A. Resolusi Tenancy & Fail-Closed RBAC
1. **Pada `FindAll` dan `GetCalendarSummary`**:
   ```go
   _, filterTenantID, err := auth.ResolveFilterOwnership()
   if err != nil {
       return nil, err
   }
   // Admin platform-wide: filterTenantID == ""
   // Seller/User: filterTenantID == auth.TenantID
   ```
2. **Pada `GetByID`, `Update`, `UpdateStatus`, dan `Delete`**:
   ```go
   tenantID := auth.TenantID
   if auth.IsAdmin() {
       tenantID = "" // Admin global resolution
   }
   res, err := u.repo.GetByID(ctx, tenantID, id)
   if err != nil {
       return nil, err
   }
   if err := auth.CheckOwnership("", res.TenantID); err != nil {
       return nil, sharedErrors.ErrForbidden
   }
   ```
   Saat mutasi, `res.TenantID` asli selalu dikunci dan tidak pernah di-override oleh Admin.

### B. Aturan Logging Bersih (Zero Info Logs on Success Path)
* Dilarang mencetak `u.Log(ctx, ...).Infof(...)` pada jalur sukses.
* Hanya mencatat `Warn` untuk 4xx dan `Error` untuk 5xx.

### C. Jaminan Zero Resource Leaks pada Integrasi WhatsApp & Reminder
* Panggilan inter-modul ke `ReminderPort` dan `WhatsAppPort` dibatasi oleh context timeout aman (`time.WithTimeout(ctx, 3*time.Second)`).
* Kegagalan pengiriman WhatsApp konfirmasi tidak menggagalkan penyimpanan transaksi reservasi (*graceful degradation* dengan log `Warn`).
* Ketika status diubah menjadi `CANCELLED`, UseCase secara aman memanggil `u.reminderPort.CancelReminder(ctx, res.TenantID, res.ReminderID)` untuk membatalkan pengingat tanpa kebocoran resource.

---

## 6. Rencana Teknis Frontend Next.js 16 (`fontwahide`)

### A. Struktur Direktori Frontend
```
fontwahide/src/
├── app/(dashboard)/reservations/
│   └── page.tsx                      # Protected Route via SellerRouteGuard
└── modules/reservation/
    ├── api/
    │   └── reservation.api.ts        # REST API client via httpClient
    ├── types/
    │   └── reservation.types.ts      # TypeScript interfaces DTO & Status
    ├── hooks/
    │   └── useReservations.ts        # Hook kalender, filter tanggal, & mutasi booking
    ├── components/
    │   ├── MonthlyCalendar.tsx       # Grid kalender 7-kolom dengan indikator badge booking
    │   ├── DailyAgendaList.tsx       # Timeline agenda harian, status badge, & aksi cepat
    │   ├── AddReservationForm.tsx    # Card form input cepat booking janji temu
    │   └── DeleteReservationModal.tsx# Dialog konfirmasi hapus reservasi
    └── views/
        └── ReservationsView.tsx      # Layout utama split view (Kalender di kiri/atas, Agenda & Form di kanan/bawah)
```

### B. Integrasi Antarmuka Pengguna & Navigasi
1. **Navigasi Sidebar (`DashboardSidebar.tsx`)**:
   - Menambahkan menu `Reservasi` (`/reservations`) dengan ikon `CalendarCheck2` di bawah grup WhatsApp Engine tepat setelah `Pengingat`.
2. **Breadcrumb (`DashboardBreadcrumb.tsx`)**:
   - Menambahkan `case "reservations": return t("dashboardMenu.reservations");`.
3. **Edge Middleware (`src/proxy.ts`)**:
   - Mendaftarkan `"/reservations"` ke dalam `PROTECTED_PREFIXES` (0ms Edge redirect).
4. **Kamus Bahasa (*i18n*)**:
   - `src/locales/id/reservation.json` & `src/locales/en/reservation.json`.
   - Registrasi di `id/common.json`, `en/common.json`, dan `src/lib/i18n/context.tsx`.

---

## 7. Rencana Pengujian & Kriteria Kelulusan

1. **Pengujian Unit & Keamanan Backend (`go test`)**:
   - `TestReservationCrudUseCase_Create`: Verifikasi penyimpanan, normalisasi tanggal, dan auto-sync `ReminderPort`.
   - `TestReservationCrudUseCase_GetAndFindAll`: Isolasi tenant Seller vs Admin global view.
   - `TestReservationCrudUseCase_UpdateStatus`: Mutasi status ke `CANCELLED` otomatis membatalkan pengingat di Reminder module.
   - `TestReservationCrudUseCase_CalendarSummary`: Verifikasi agregasi bulanan bebas N+1 query.
   - `TestReservationSecurity_XSS`: Sanitasi tag XSS pada nama pelanggan, layanan, dan catatan.
   - `TestReservationHandler_Endpoints`: HTTP status 200, 201, 400, 404, 422.
2. **Kompilasi Biner Go**:
   - `go build ./cmd/web/main.go` harus sukses **EXIT 0**.
3. **Frontend Type Check**:
   - `bun x tsc --noEmit` harus sukses **EXIT 0** (0 type errors).
   - *(Aturan absolut: Dilarang menjalankan `bun run build`)*.
