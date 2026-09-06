# Rencana Implementasi: Modul Reservasi (Appointment & Booking Management)

Dokumen ini merupakan cetak biru (*blueprint*) dan rencana teknis mendalam untuk mengimplementasikan **Modul Reservasi** pada ekosistem Wahide (Backend Go `wahide` dan Frontend Next.js 16 `fontwahide`), yang terintegrasi secara otomatis dengan **Modul Pengingat (Reminder)** dan **WhatsApp Multi-Device Engine**.

---

## 1. Latar Belakang & Nilai Bisnis

Berdasarkan analisis fitur Reservasi pada sistem CRM WhatsApp (seperti referensi WACO `waco.id/reservasi`), pemilik bisnis seperti klinik kesehatan, dokter gigi, salon kecantikan, barbershop, bengkel servis mobil/motor, konsultan, dan restoran membutuhkan sistem **buku janji temu digital** yang:
1. Menampilkan agenda janji temu per tanggal dalam bentuk **Kalender Bulanan** dan **Agenda Harian**.
2. **Dicatat sekali saja**, lalu sistem secara otomatis:
   - Mengirimkan pesan konfirmasi instan ke WhatsApp pelanggan.
   - Mendaftarkan tanggal acuan ke **Modul Pengingat (Reminder)** agar pesan pengingat $H-1$, Hari H, dan follow-up $H+3$ terkirim otomatis tanpa entri ganda.
3. Memberikan status yang jelas: *Pending, Confirmed, Completed, Cancelled*.

---

## 2. Diagram Integrasi: Reservasi ➔ Pengingat ➔ WhatsApp Engine

```
[ FRONTEND: /reservations ]
       │
       ├─► 1. Kalender Bulanan (Grid kalender & indikator jumlah booking)
       ├─► 2. Agenda Harian (Timeline jam & status kehadiran pasien)
       └─► 3. Form Catat Reservasi (Nama, No WA, Tanggal, Jam, Catatan)
       │
       ▼ (REST API /api/v1/reservations)
[ BACKEND: Modul Reservation (wahide) ]
       │
       ├─► 1. Simpan ke Database `reservations`
       │
       ├─► 2. Kirim WhatsApp Konfirmasi Instan ke Pelanggan:
       │      "Halo Kak {{nama}}, janji temu Anda pada {{tanggal}} pukul {{jam}} WIB telah kami konfirmasi."
       │
       └─► 3. Panggil Modul Reminder (Bridge Contract):
              - Mendaftarkan target_date = booking_date
              - Source: "RESERVATION", ID: reservation_id
              │
              ▼
       [ Modul Reminder (internal/modules/reminder) ]
              - Otomatis kirim pesan H-1 (Pengingat besok jadwal kontrol)
              - Otomatis kirim pesan Hari H (Petunjuk kedatangan)
              - Otomatis kirim pesan H+3 (Follow-up kepuasan / keluhan)
```

---

## 3. Rencana Teknis Backend (`wahide`)

### A. Skema Basis Data (`reservations`)

Tabel `reservations` dirancang dengan dukungan Multi-Tenant dan relasi ke modul Reminder:

```sql
CREATE TABLE reservations (
    id VARCHAR(26) PRIMARY KEY,                  -- ULID
    tenant_id VARCHAR(26) NOT NULL,              -- Multi-Tenant Isolation
    customer_name VARCHAR(150) NOT NULL,         -- Nama pelanggan / pasien
    phone VARCHAR(30) NOT NULL,                  -- Nomor WhatsApp
    booking_date DATE NOT NULL,                  -- Tanggal janji temu (YYYY-MM-DD)
    booking_time VARCHAR(5),                     -- Jam (contoh: "09:30", opsional)
    service_name VARCHAR(150),                   -- Layanan / Paket (contoh: "Paket Sealer")
    notes VARCHAR(255),                          -- Catatan tambahan
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED', -- 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'
    reminder_id VARCHAR(26),                     -- Foreign reference ke tabel reminders
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing untuk kecepatan render kalender bulanan dan filter tanggal
CREATE INDEX idx_reservations_tenant_date ON reservations(tenant_id, booking_date);
CREATE INDEX idx_reservations_tenant_status ON reservations(tenant_id, status);
```

### B. Struktur Direktori Backend
```
wahide/internal/modules/reservation/
├── reservation.go                  # Module entrypoint & dependency injection
├── delivery/
│   └── http/
│       ├── handler.go              # HTTP REST API Controller
│       └── error_mapper.go         # Domain error mapper
├── domain/
│   ├── entity/
│   │   └── reservation.go          # GORM Entity & Status Constants
│   ├── dto/
│   │   └── reservation_dto.go      # Request/Response payloads
│   └── ports.go                    # Inter-module contract (ReminderPort, WhatsAppPort)
├── repository/
│   └── reservation_repository.go   # Query calendar aggregate & daily agenda
├── usecase/
│   └── reservation_usecase.go      # Booking logic, status lifecycle, reminder sync
└── test/
    └── reservation_test.go         # Unit tests
```

### C. Daftar Endpoint REST API
- `GET /api/v1/reservations/calendar?month=2026-09`:
  Mengembalikan ringkasan jumlah reservasi per tanggal dalam 1 bulan penuh (untuk mewarnai kalender):
  ```json
  {
    "month": "2026-09",
    "summary": {
      "2026-09-01": 2,
      "2026-09-06": 4,
      "2026-09-10": 1
    }
  }
  ```
- `GET /api/v1/reservations?date=2026-09-06`:
  Mengambil seluruh janji temu pada tanggal terpilih (dengan status dan jam kedatangan).
- `POST /api/v1/reservations`:
  Mencatat reservasi baru:
  - Validasi format nomor telepon internasional / lokal.
  - Simpan ke `reservations`.
  - Kirim pesan instan konfirmasi via WhatsApp engine.
  - Otomatis panggil `reminderPort.CreateOrSync(...)`.
- `PATCH /api/v1/reservations/:id/status`:
  Memperbarui status janji temu (`CONFIRMED`, `COMPLETED`, `CANCELLED`).
  *Catatan: Jika status diubah menjadi `CANCELLED`, pengingat terkait di modul Reminder otomatis dinonaktifkan.*
- `DELETE /api/v1/reservations/:id`:
  Menghapus data reservasi beserta pengingat terkait.

---

## 4. Rencana Teknis Frontend (`fontwahide`)

### A. Struktur Direktori Frontend
```
fontwahide/src/
├── app/(dashboard)/
│   └── reservations/
│       └── page.tsx                # Next.js Route Page
└── modules/
    └── reservation/
        ├── api/
        │   └── reservation.api.ts  # Axios service calls
        ├── hooks/
        │   └── useReservations.ts  # Calendar navigation & booking mutations
        ├── types/
        │   └── reservation.types.ts # TypeScript interfaces
        ├── components/
        │   ├── MonthlyCalendar.tsx # Grid kalender bulanan interaktif
        │   ├── DailyAgendaList.tsx # List janji temu harian & status badge
        │   └── AddReservationForm.tsx # Form catat reservasi cepat
        └── views/
            └── ReservationsView.tsx # Main View Layout
```

### B. Komponen Antarmuka Pengguna (UI)
Sesuai referensi visual pada tangkapan layar:

1. **Header**:
   - Judul: **Reservasi**
   - Subjudul: *"Agenda janji temu per tanggal — dicatat sekali, konfirmasi & pengingat jalan sendiri."*

2. **Komponen 1: Kalender Bulanan (`MonthlyCalendar.tsx`)**:
   - Tombol Navigasi: `< Bulan lalu`, `[Bulan Tahun]`, `Bulan depan >`.
   - Grid 7 Kolom (Min, Sen, Sel, Rab, Kam, Jum, Sab).
   - Indikator Titik Hijau / Angka di setiap tanggal yang memiliki reservasi aktif.
   - Tanggal yang sedang aktif/dipilih memiliki highlight hijau border tebal.

3. **Komponen 2: Agenda Janji Temu Harian (`DailyAgendaList.tsx`)**:
   - Header tanggal: `< Sebelumnya`, `[Hari, DD MMMM YYYY]`, `Berikutnya >` + DatePicker pintas.
   - Counter: `X reservasi · Y selesai · Z batal`.
   - Kartu Janji Temu:
     - Waktu kedatangan (misal `09:30 WIB`).
     - Nama pelanggan & nomor WhatsApp.
     - Layanan / Catatan tindakan.
     - Status Badge: `Confirmed` (Hijau), `Completed` (Biru), `Cancelled` (Merah).
     - Tombol Aksi Cepat: **Chat WhatsApp**, **Selesai**, **Batal**.

4. **Komponen 3: Form "Catat Reservasi" (`AddReservationForm.tsx`)**:
   - Input Nomor WhatsApp (validasi otomatis).
   - Input Nama Pelanggan.
   - Input Tanggal Acuan (otomatis terisi tanggal yang sedang aktif di kalender).
   - Dropdown Jam Kedatangan (opsional: *Tanpa Jam*, *08.00*, *09.00*, *10.00*, dll.).
   - Input Catatan (opsional, contoh: *"Paket Sealer, anak kedua"*).
   - Tombol Hijau: **Catat Reservasi**.
   - Keterangan Bantuan:
     > *"Reservasi baru otomatis masuk ke Pengingat — aturan H-1 / H+N yang Anda buat di sana berlaku tanpa entri ganda."*

### C. Integrasi Navigasi Sidebar
- File: `fontwahide/src/components/layout/dashboard/DashboardSidebar.tsx`
- Penempatan: Di dalam grup WhatsApp Engine, tepat di bawah menu **Pengingat**:
  ```typescript
  {
    key: "dashboardMenu.reservations",
    href: "/reservations",
    icon: CalendarCheck2,
    roles: SELLER_ROLES,
  }
  ```
- Terjemahan i18n:
  - `id.json`: `"reservations": "Reservasi"`
  - `en.json`: `"reservations": "Reservations"`

---

## 5. Hubungan Antar Modul: Mengapa Tetap Dipisah?

| Modul | Tugas Utama | Penanggung Jawab Pengguna |
| :--- | :--- | :--- |
| **`reservation`** | Mengelola kalender, jam kedatangan, kapasitas harian, dan kehadiran pasien. | Resepsionis, Kasir, atau Dokter/Operator Lapangan. |
| **`reminder`** | Mengelola mesin pengiriman pesan otomatis ($H-1, H-0, H+3$), jam pengiriman cron harian, dan template teks. | Manajer Marketing, Admin Sistem, atau Pemilik Bisnis. |

Dengan memisahkan kedua modul ini:
1. Modul **Reminder** dapat digunakan secara bebas untuk kasus lain yang tidak ada jam reservasi (contoh: ucapan selamat ulang tahun, pengingat tagihan bulanan).
2. Modul **Reservation** tetap fokus dan ringan untuk urusan operasional harian.
3. Keduanya terhubung otomatis (*seamless*): saat booking dicatat di modul Reservasi, pesan pengingat langsung siap dikirim oleh modul Reminder.

---

## 6. Rencana Tahapan Eksekusi

1. **Fase 1 (Modul Pengingat - Reminder Engine)**:
   - Bangun modul `reminder` di backend dan frontend sesuai [`PLAN_PENGINGAT_OTOMATIS_REMINDERS.md`](./PLAN_PENGINGAT_OTOMATIS_REMINDERS.md).
2. **Fase 2 (Modul Reservasi - Calendar & Booking)**:
   - Bangun modul `reservation` di backend (entity, repository, usecase, API).
   - Sambungkan jembatan (*bridge*) dari `reservation` ke `reminder`.
   - Bangun antarmuka Kalender Bulanan dan Agenda Harian di frontend `/reservations`.
3. **Fase 3 (Verifikasi & Pengujian)**:
   - Uji input reservasi di kalender ➔ pastikan WhatsApp konfirmasi terkirim ➔ pastikan data otomatis muncul di antrean pengingat H-1.
