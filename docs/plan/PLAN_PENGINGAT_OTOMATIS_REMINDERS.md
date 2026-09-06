# 🏛️ Cetak Biru Arsitektur & Rencana Implementasi: Modul Pengingat Otomatis (`reminder`)

Dokumen ini merupakan spesifikasi teknis dan cetak biru arsitektur resmi untuk **Tahap 2: Modul Pengingat Otomatis (*Automated Drip & Scheduled Reminders*)** pada platform SaaS WhatsApp Wahide. Rencana ini diselaraskan 100% dengan standar produksi Wahide: [`wahide/docs/module-anatomy.md`](file:///G:/WEB2026/wahide/docs/module-anatomy.md), [`wahide/docs/clean-architecture.md`](file:///G:/WEB2026/wahide/docs/clean-architecture.md), dan pola modular yang telah terverifikasi pada Modul Template (`internal/modules/template`).

---

## 1. Latar Belakang & Nilai Bisnis

Fitur **Pengingat Otomatis** memfasilitasi kebutuhan esensial pelaku bisnis (klinik kesehatan, dokter gigi, salon kecantikan, barbershop, bengkel servis mobil/motor, kursus/pendidikan, agen properti/kos, dan ritel) untuk mengirimkan pesan berkala berbasis **tanggal acuan pelanggan** secara otomatis.

### Nilai Unggul Dibanding WhatsApp Cloud API (Meta):
1. **Bebas Biaya Percakapan Meta**: Menggunakan engine Whatsmeow multi-device internal tanpa pungutan biaya per percakapan (Meta conversation fee Rp 400 - Rp 600+).
2. **Fleksibilitas Template Tanpa Persetujuan Meta**: Pengguna bebas menulis template pesan dan menyisipkan variabel dinamis (`{{nama}}`, `{{tanggal}}`, `{{catatan}}`, `{{nomor}}`) tanpa risiko ditolak Meta.
3. **Proteksi Anti-Ban 5-Layer**: Otomatis terlindungi oleh simulasi ketik manusia (*human typing simulation*), variasi spintax, dan jeda acak dinamis (*dynamic jitter delay*).

---

## 2. Batas Domain & Pemisahan Arsitektur

Fitur ini diimplementasikan sebagai **modul mandiri (`reminder`)** dan **DIPISAHKAN** dari modul `campaign` karena:
* **Pola Eksekusi Berbeda**: `campaign` bersifat *batch mass-broadcast* (ribuan pesan dikirim sekaligus ke segmentasi tag), sedangkan `reminder` bersifat *individual event-driven* (setiap pelanggan memiliki tanggal acuan unik: tanggal kontrol gigi, tanggal jatuh tempo cicilan, tanggal servis berkala).
* **Anti-Bloat & SRP**: Menghindarkan modul `campaign` dari beban komputasi evaluasi selisih tanggal harian ($H-1, H-0, H+3$).
* **Clean Port-Based Integration**: Modul `reminder` berkomunikasi dengan engine WhatsApp melalui antarmuka `WhatsAppPort` (Inversion of Control), bukan import silang antar-package.

---

## 3. Alur Kerja Sistem (*System Workflow*)

```
[ Frontend: /reminders ]
       │
       ├─► 1. Form Jadwal Cepat (Nama, Nomor WhatsApp, Tanggal Acuan, Catatan)
       ├─► 2. Pengaturan Jam Kirim (Contoh: "09:00" WIB) & Switch "Tampilkan di Chat"
       ├─► 3. Pengaturan Aturan Drip (Template H-1, Hari H, H+3)
       └─► 4. Tabel Monitoring (Antrean Jadwal & Riwayat Log Terkirim)
       │
       ▼ (REST API /api/v1/reminders via Echo Router)
[ Backend: Modul Reminder (wahide) ]
       │
       ├─► Database PostgreSQL:
       │    - `reminders` (Antrean penerima per tenant)
       │    - `reminder_rules` (Konfigurasi jam & aturan template drip per tenant)
       │    - `reminder_logs` (Riwayat pengiriman idempoten: Unique reminder_id + days_offset)
       │
       ▼ (Cron Runner: POST /api/cronjob/reminders/dispatch via X-Cron-Secret)
[ Evaluator Selisih Hari (Offset = TargetDate - Today) ]
       │
       ├─► 1. Hitung selisih hari untuk setiap reminder yang ACTIVE
       ├─► 2. Cocokkan offset dengan aturan rule yang aktif pada tenant tersebut
       ├─► 3. Cek apakah sudah pernah terkirim di `reminder_logs` (Idempotent Guard)
       ├─► 4. Render variabel: {{nama}}, {{tanggal}}, {{catatan}}, {{nomor}}
       ├─► 5. Ambil slot device WhatsApp yang terhubung via `DevicePort`
       │
       ▼
[ WhatsAppPort ] ──► [ WhatsMeow Engine ] ──► [ WhatsApp Pelanggan ]
```

---

## 4. Spesifikasi Standar Backend Go (`wahide`)

### A. Struktur Folder Modul (Strict Compliance with `module-anatomy.md`)

```
wahide/internal/modules/reminder/
├── reminder.go                      # Module Bootstrapper, DB AutoMigrate, Wire Routes & ErrorMapper
├── delivery/
│   └── http/
│       ├── error_mapper.go          # Translasi Domain Sentinel Error ➔ HTTP Status Code
│       ├── router.go                # Pendaftaran Route Echo (Public, Protected, Seller, Admin)
│       ├── reminder_handler.go      # REST Handler CRUD Antrean Reminder (Create, Get, List, Update, Delete)
│       ├── reminder_rule_handler.go # REST Handler Pengaturan Jam Kirim & Template Drip (Get, Update)
│       └── cron_handler.go          # Cron Dispatch Handler (Evaluasi dan trigger kirim pengingat)
├── domain/
│   ├── contract.go                  # Public Contract ReminderContract (untuk dipanggil modul Reservasi/Formulir)
│   ├── errors.go                    # Domain Sentinel Errors
│   ├── ports.go                     # Outbound Ports ke WhatsApp & Device Engine
│   ├── repository.go                # Outbound Port Interfaces (Reminder, Rule, Log)
│   ├── usecase.go                   # Inbound Port Interfaces (Crud, Rule, Dispatch)
│   ├── entity/                      # GORM Models
│   │   ├── reminder.go              # Entitas Antrean Pengingat Penerima
│   │   ├── reminder_rule.go         # Entitas Konfigurasi Aturan Drip Tenant
│   │   └── reminder_log.go          # Entitas Catatan Riwayat Pengiriman Idempoten
│   └── dto/                         # DTO DIPISAH PER ENTITAS (Aturan 1 module-anatomy.md)
│       ├── reminder_dto.go          # Create, Update, List, Response khusus Reminder
│       ├── reminder_rule_dto.go     # Update, Response khusus ReminderRule & DripRuleItem
│       └── reminder_log_dto.go      # List, Response khusus ReminderLog
├── repository/
│   ├── reminder_repository.go       # Lean GORM Implementation (Normalized limit/offset, explicit SQL)
│   ├── reminder_rule_repository.go  # GORM Implementation for Rules
│   └── reminder_log_repository.go   # GORM Implementation for Idempotent Logs
├── usecase/
│   ├── contract_adapter.go          # Implementasi ReminderContract untuk modul eksternal
│   ├── reminder_crud_usecase.go     # Pure CRUD, Multi-tenancy Isolation, Admin Global Resolution
│   ├── reminder_rule_usecase.go     # Pengelolaan Jam Kirim & Aturan Drip
│   └── reminder_dispatch_usecase.go # Evaluasi Tanggal, Idempotency Guard, & Dispatch via WhatsAppPort
└── test/
    ├── mocks_test.go                # Mock Repositories, Mock WhatsAppPort, Test Logger
    ├── reminder_crud_usecase_test.go
    ├── reminder_rule_usecase_test.go
    ├── reminder_dispatch_usecase_test.go
    ├── reminder_security_xss_test.go
    └── reminder_handler_test.go
```

---

### B. Desain Skema Database GORM & Composite Index

#### 1. Tabel `reminders` ([`domain/entity/reminder.go`](file:///G:/WEB2026/wahide/internal/modules/reminder/domain/entity/reminder.go))
```go
type Reminder struct {
    ID            string    `gorm:"primaryKey;type:varchar(26)" json:"id"`
    TenantID      string    `gorm:"type:varchar(26);not null;index:idx_reminders_tenant_target,priority:1;index:idx_reminders_tenant_phone,priority:1;index:idx_reminders_tenant_status,priority:1" json:"tenant_id"`
    RecipientName string    `gorm:"size:150;not null" json:"recipient_name"`
    Phone         string    `gorm:"size:30;not null;index:idx_reminders_tenant_phone,priority:2" json:"phone"`
    TargetDate    time.Time `gorm:"type:date;not null;index:idx_reminders_tenant_target,priority:2" json:"target_date"`
    Notes         string    `gorm:"size:255" json:"notes"`
    Status        string    `gorm:"size:20;not null;default:'ACTIVE';check:chk_reminder_status,status IN ('ACTIVE','PAUSED','COMPLETED','CANCELLED');index:idx_reminders_tenant_status,priority:2" json:"status"`
    CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
```

#### 2. Tabel `reminder_rules` ([`domain/entity/reminder_rule.go`](file:///G:/WEB2026/wahide/internal/modules/reminder/domain/entity/reminder_rule.go))
```go
type ReminderRule struct {
    ID         string         `gorm:"primaryKey;type:varchar(26)" json:"id"`
    TenantID   string         `gorm:"type:varchar(26);not null;uniqueIndex:idx_reminder_rules_tenant" json:"tenant_id"`
    DeviceID   string         `gorm:"size:26" json:"device_id"`
    SendTime   string         `gorm:"size:5;not null;default:'09:00'" json:"send_time"` // Format "HH:mm"
    ShowInChat bool           `gorm:"not null;default:true" json:"show_in_chat"`
    Rules      datatypes.JSON `gorm:"type:json;not null" json:"rules"` // Array DripRuleItem
    CreatedAt  time.Time      `gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt  time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
}
```

#### 3. Tabel `reminder_logs` ([`domain/entity/reminder_log.go`](file:///G:/WEB2026/wahide/internal/modules/reminder/domain/entity/reminder_log.go))
```go
type ReminderLog struct {
    ID             string    `gorm:"primaryKey;type:varchar(26)" json:"id"`
    ReminderID     string    `gorm:"type:varchar(26);not null;uniqueIndex:idx_reminder_log_idempotent,priority:1" json:"reminder_id"`
    TenantID       string    `gorm:"type:varchar(26);not null;index:idx_reminder_logs_tenant_sent,priority:1" json:"tenant_id"`
    DaysOffset     int       `gorm:"not null;uniqueIndex:idx_reminder_log_idempotent,priority:2" json:"days_offset"` // -1, 0, 3
    RecipientName  string    `gorm:"size:150;not null" json:"recipient_name"`
    Phone          string    `gorm:"size:30;not null" json:"phone"`
    MessageContent string    `gorm:"type:text;not null" json:"message_content"`
    Status         string    `gorm:"size:20;not null;default:'SENT';check:chk_reminder_log_status,status IN ('SENT','FAILED')" json:"status"`
    ErrorReason    string    `gorm:"type:text" json:"error_reason,omitempty"`
    SentAt         time.Time `gorm:"autoCreateTime;index:idx_reminder_logs_tenant_sent,priority:2" json:"sent_at"`
}
```
* **Kunci Idempotensi Database**: *Composite Unique Index* `(reminder_id, days_offset)` menjamin bahwa pengingat untuk offset tertentu (misal $H-1$) **mustahil terkirim dua kali**, bahkan jika cron dipanggil berulang kali pada hari yang sama.

---

### C. DTO & Standar Keamanan XSS (Pemisahan per Entitas)

1. **`reminder_dto.go`**:
   - `CreateReminderRequest`: Validasi `validate:"required,min=2,max=150,noxss"`, tanggal valid, sanitasi nomor telepon.
   - `UpdateReminderRequest`: Pointer fields (`*string`, `*time.Time`), `noxss`.
   - `ListReminderRequest`: `Page`, `PageSize`, `Search` (`noxss`), `Status`, `StartDate`, `EndDate`.
   - `ReminderResponse`: Mapping response aman.
2. **`reminder_rule_dto.go`**:
   - `UpdateReminderRuleRequest`: `DeviceID`, `SendTime` (regex `^([01]?[0-9]|2[0-3]):[0-5][0-9]$`), `ShowInChat`, `Rules` (`[]DripRuleItemDTO`).
   - `ReminderRuleResponse`: Payload konfigurasi tenant.
3. **`reminder_log_dto.go`**:
   - `ListReminderLogRequest`: Pagination, Search, Status filter.
   - `ReminderLogResponse`: Detail pengiriman terkirim.

---

### D. Standar Logika UseCase & Konsistensi Akses Admin (Ref: Modul Template)

1. **Resolusi Tenant & Fail-Closed RBAC**:
   * Pada `FindAll`:
     ```go
     _, filterTenantID, err := auth.ResolveFilterOwnership()
     req.Page, req.PageSize = sharedResponse.NormalizePagination(req.Page, req.PageSize)
     offset, limit := sharedResponse.CalculatePagination(req.Page, req.PageSize)
     reminders, total, err := u.repo.FindAll(ctx, filterTenantID, req, limit, offset)
     ```
   * Pada `Get`, `Update`, `Delete`:
     ```go
     tenantID := auth.TenantID
     if auth.IsAdmin() {
         tenantID = "" // Admin platform-wide
     }
     rem, err := u.repo.GetByID(ctx, tenantID, id)
     if err != nil { return nil, err }
     if err := auth.CheckOwnership("", rem.TenantID); err != nil {
         return nil, sharedErrors.ErrForbidden
     }
     ```
     Saat mutasi `Update` & `Delete`, tenant asli `rem.TenantID` tetap dikunci dan tidak pernah di-override oleh Admin.

2. **Aturan Logging Bersih (Zero Info Logs on Success Path)**:
   * Menghilangkan seluruh `u.Log(ctx, ...).Infof(...)` pada jalur sukses.
   * Hanya `Warn` untuk 4xx dan `Error` untuk 5xx.

3. **Logika Dispatcher Cron (`ReminderDispatchUseCase`)**:
   * Menghitung offset: `daysOffset = int(targetDate.Sub(today).Hours() / 24)`.
   * Evaluasi aturan rule tenant yang cocok dengan `daysOffset` dan `is_enabled == true`.
   * Cek duplikasi di `reminder_log_repository.Exists(ctx, rem.ID, daysOffset)`. Jika ada, *skip*.
   * Mengganti variabel pesan secara aman: `{{nama}}`, `{{tanggal}}`, `{{catatan}}`, `{{nomor}}`.
   * Dispatch via `u.whatsappPort.SendMessage(...)`.
   * Catat log pengiriman di `reminder_logs`.

---

### E. Standar Repository Layer
* Lean repository meng-embed `*database.Repository[entity.Reminder]`.
* Method `Update` menggunakan explicit GORM query:
  ```go
  db := r.GetDB(ctx).Model(&entity.Reminder{})
  if rem.TenantID != "" {
      db = db.Where("tenant_id = ?", rem.TenantID)
  }
  res := db.Where("id = ?", rem.ID).
      Select("RecipientName", "Phone", "TargetDate", "Notes", "Status", "UpdatedAt").
      Updates(rem)
  if res.Error != nil { return res.Error }
  if res.RowsAffected == 0 { return domain.ErrReminderNotFound }
  return nil
  ```
* Method `Create` menggunakan `r.GetDB(ctx).Create(rem).Error`.

---

## 5. Rencana Teknis Frontend Next.js 16 (`fontwahide`)

### A. Struktur Direktori Frontend
```
fontwahide/src/
├── app/(dashboard)/reminders/
│   └── page.tsx                     # Protected Route via SellerRouteGuard & Edge Middleware
└── modules/reminder/
    ├── api/
    │   └── reminder.api.ts          # Type-safe client via httpClient
    ├── types/
    │   └── reminder.types.ts        # TypeScript interfaces (Reminder, Rule, Log, DTOs)
    ├── hooks/
    │   ├── useReminders.ts          # State & CRUD hooks untuk antrean pengingat
    │   ├── useReminderRules.ts      # State & mutation hook untuk aturan drip
    │   └── useReminderLogs.ts       # Hook untuk tabel riwayat log
    ├── components/
    │   ├── QuickScheduleCard.tsx    # Card input cepat pengingat (Nama, No WA, DatePicker, Catatan)
    │   ├── DeliveryRulesCard.tsx    # Card pengaturan jam kirim & form template H-1/H-0/H+3
    │   ├── ReminderTable.tsx        # Tabel antrean jadwal aktif dengan pagination & filter
    │   ├── ReminderLogsTable.tsx    # Tabel riwayat log pengiriman idempoten
    │   ├── DeleteReminderModal.tsx  # Modal dialog konfirmasi pembatalan/hapus jadwal
    │   └── VariableInsertChips.tsx  # Chips penyisip variabel cepat ({{nama}}, {{tanggal}}, {{catatan}})
    └── views/
        └── RemindersView.tsx        # View utama dashboard pengingat (Tabs: Jadwal & Aturan)
```

### B. Integrasi Komponen & Navigasi
1. **Navigasi Sidebar (`DashboardSidebar.tsx`)**:
   - Menambahkan menu `Pengingat` (`/reminders`) di bawah kelompok WhatsApp Menu dengan ikon `BellRing` atau `CalendarClock`.
2. **Breadcrumb (`DashboardBreadcrumb.tsx`)**:
   - Menambahkan terjemahan rute `/reminders`.
3. **Edge Middleware (`src/proxy.ts`)**:
   - Menambahkan `/reminders` ke dalam daftar rute terproteksi auth cookie (0ms redirect).
4. **Kamus Bahasa (*i18n*)**:
   - `src/locales/id/reminder.json` & `src/locales/en/reminder.json`.

---

## 6. Rencana Pengujian & Verifikasi

1. **Pengujian Unit & Keamanan Backend (`go test`)**:
   - `TestReminderCrudUseCase_Lifecycle`: Create, Get, FindAll pagination, Update, Delete.
   - `TestReminderCrudUseCase_AdminAccess`: Akses platform-wide admin tanpa mutasi tenant_id.
   - `TestReminderDispatchUseCase_OffsetAndIdempotency`: Verifikasi kalkulasi offset $H-1, H-0, H+3$ dan idempotensi pengiriman ganda.
   - `TestReminderSecurity_XSS`: Sanitasi tag XSS pada input nama, nomor, dan catatan.
   - `TestReminderHandler_Endpoints`: Verifikasi status HTTP 200, 201, 404, 422.
2. **Kompilasi Biner Go**:
   - `go build ./cmd/web/main.go` harus sukses `EXIT 0`.
3. **Frontend Type Check**:
   - `bun x tsc --noEmit` harus sukses `EXIT 0` tanpa ada kompilasi error.
