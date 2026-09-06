# Rencana Implementasi: Modul Formulir WhatsApp (WhatsApp Dynamic Forms & Self-Registration Engine)

Dokumen ini merupakan cetak biru (*blueprint*) dan rencana teknis mendalam untuk mengimplementasikan **Modul Formulir Dinamis WhatsApp** pada platform SaaS WhatsApp Wahide, mencakup backend Go (`wahide`) dan frontend Next.js 16 (`fontwahide`).

---

## 1. Latar Belakang & Nilai Produk

Berdasarkan analisis fitur Formulir pada sistem CRM WhatsApp (seperti WACO `waco.id/formulir`), pelaku usaha (klinik kesehatan, salon, dokter gigi, bengkel, sekolah/kursus, dan event organizer) membutuhkan **media pendaftaran mandiri pelanggan (*Self-Registration Form*)** yang:
1. Memungkinkan pelanggan mengisi formulir langsung dari smartphone mereka tanpa perlu aplikasi tambahan.
2. Dapat dipicu secara otomatis saat pelanggan mengirimkan kata kunci tertentu ke WhatsApp toko (contoh: `"daftar"`, `"registrasi"`, `"booking"`).
3. **Memiliki Pemetaan Otomatis (*Field Mapping*)**: Isian formulir (seperti Nama, Tanggal, dan Catatan) **langsung otomatis terbit menjadi Janji Temu di Modul Reservasi dan masuk antrean Modul Pengingat (Reminder)** tanpa staf perlu entri manual.
4. Mengirimkan pesan ucapan terima kasih instan ke WhatsApp pelanggan setelah berhasil mengisi formulir.

### Keunggulan Wahide vs WhatsApp Flows (Meta Cloud API):
- **Bebas Galat Koneksi Meta**: Meta Flows memerlukan persetujuan Meta Business Manager yang rumit dan sering mengalami galat seperti pada tangkapan layar WACO (*"Gagal menerbitkan: Nomor WhatsApp belum tersambung"*).
- **Pendekatan Hybrid Fleksibel**: Wahide menyediakan **Instant Mobile Web Form** berkecepatan tinggi (`/f/:slug`) yang responsif di browser HP pelanggan, sekaligus mendukung **Chatbot Q&A Interaktif** di dalam obrolan WhatsApp.
- **Dukungan Multi-Step & Upload**: Bebas membagi formulir menjadi beberapa halaman langkah demi langkah (*Multi-Step*) dengan progress bar seperti aplikasi rumah sakit.

---

## 2. Diagram Alur & Integrasi Ekosistem

```
[ Pelanggan Kirim Chat "daftar" ke WhatsApp ]
                     │
                     ▼
1. Bot Wahide Merespons Pesan Pengantar + Link Formulir:
   "Silakan isi formulir singkat ini supaya kami bisa menjadwalkan kedatangan Anda:
    👉 https://wahide.id/f/klinik-sehat?phone=628123456789"
                     │
                     ▼
2. Pelanggan Membuka Form di Smartphone (Next.js Public Page):
   - Halaman 1: Nama Lengkap & No WhatsApp (terisi otomatis)
   - Halaman 2: Pilihan Tanggal Janji Temu (DatePicker) & Pilihan Layanan
   - Halaman 3: Catatan Keluhan & Konfirmasi Ringkasan Isian
                     │
                     ▼
3. Pelanggan Menekan Tombol "Kirim Formulir"
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  OTOMASI SISTEM WAHIDE (Backend Orchestration)              │
│                                                             │
│  1. Simpan isian lengkap ke tabel `form_submissions`.        │
│                                                             │
│  2. Otomatis Terbitkan ke MODUL RESERVASI:                  │
│     - Membuat janji temu di kalender bulanan.               │
│     - Customer: Nama, Tanggal: Booking Date, Status: CONFIRMED│
│                                                             │
│  3. Otomatis Hubungkan ke MODUL PENGINGAT (Reminder):       │
│     - Menjadwalkan pengingat H-1 dan Hari H kedatangan.     │
│                                                             │
│  4. Kirim Balasan Instan ke WhatsApp Pelanggan:             │
│     "Terima kasih {nama}, kedatangan Anda pada {tanggal}    │
│      sudah kami jadwalkan. Pengingat kami kirim H-1."       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Rencana Teknis Backend (`wahide`)

### A. Skema Basis Data

1. **Tabel `forms`** (Konfigurasi formulir per tenant):
   ```sql
   CREATE TABLE forms (
       id VARCHAR(26) PRIMARY KEY,                  -- ULID
       tenant_id VARCHAR(26) NOT NULL,              -- Multi-Tenant
       slug VARCHAR(100) NOT NULL,                  -- URL slug unik, contoh: "pendaftaran-klinik"
       title VARCHAR(150) NOT NULL DEFAULT 'Formulir pendaftaran',
       intro_message TEXT NOT NULL,                 -- Pesan pengantar WhatsApp
       button_text VARCHAR(50) NOT NULL DEFAULT 'Isi formulir',
       success_message TEXT NOT NULL,               -- Template balasan sukses {nama} {tanggal} {jam} {cabang}
       trigger_keywords TEXT NOT NULL DEFAULT 'daftar, registrasi, booking',
       is_active BOOLEAN NOT NULL DEFAULT true,
       page_titles JSONB,                           -- Array judul halaman: ["Data Diri", "Jadwal Kedatangan", "Keluhan"]
       show_summary_screen BOOLEAN NOT NULL DEFAULT true, -- Layar periksa isian sebelum submit
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE UNIQUE INDEX idx_forms_tenant_slug ON forms(tenant_id, slug);
   ```

2. **Tabel `form_fields`** (Kolom formulir dinamis, maks 10 kolom):
   ```sql
   CREATE TABLE form_fields (
       id VARCHAR(26) PRIMARY KEY,                  -- ULID
       form_id VARCHAR(26) NOT NULL,                -- Foreign key ke forms
       tenant_id VARCHAR(26) NOT NULL,
       position INT NOT NULL DEFAULT 1,             -- Urutan baris (1 s/d 10)
       label VARCHAR(150) NOT NULL,                 -- Contoh: "Nama", "Rencana tanggal"
       field_type VARCHAR(30) NOT NULL,             -- 'TEXT_SHORT', 'DATE_PICKER', 'TEXT_LONG', 'SELECT_SINGLE', 'NUMBER'
       system_mapping VARCHAR(50) NOT NULL DEFAULT 'CUSTOM', -- 'NAME', 'RESERVATION_DATE', 'NOTES', 'BRANCH', 'CUSTOM'
       is_required BOOLEAN NOT NULL DEFAULT false,  -- Wajib diisi
       page_number INT NOT NULL DEFAULT 1,          -- Halaman 1, 2, 3
       options TEXT,                                -- Pilihan dropdown dipisahkan koma
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX idx_form_fields_form ON form_fields(form_id, position);
   ```

3. **Tabel `form_submissions`** (Data jawaban yang diisi pelanggan):
   ```sql
   CREATE TABLE form_submissions (
       id VARCHAR(26) PRIMARY KEY,                  -- ULID
       tenant_id VARCHAR(26) NOT NULL,
       form_id VARCHAR(26) NOT NULL,
       customer_phone VARCHAR(30) NOT NULL,
       customer_name VARCHAR(150),
       answers JSONB NOT NULL,                      -- Payload jawaban lengkap per kolom
       reservation_id VARCHAR(26),                  -- ID Reservasi yang otomatis dibuat
       status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED', -- 'SUBMITTED', 'PROCESSED', 'CANCELLED'
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX idx_form_submissions_form ON form_submissions(form_id, created_at DESC);
   CREATE INDEX idx_form_submissions_phone ON form_submissions(tenant_id, customer_phone);
   ```

### B. Struktur Direktori Backend
```
wahide/internal/modules/form/
├── form.go                         # Module registration & route mounting
├── delivery/
│   └── http/
│       ├── handler.go              # Private REST API (Seller Dashboard)
│       ├── public_handler.go       # Public REST API (Mobile Form Submission)
│       └── error_mapper.go
├── domain/
│   ├── entity/
│   │   ├── form.go
│   │   ├── form_field.go
│   │   └── form_submission.go
│   ├── dto/
│   │   └── form_dto.go
│   └── ports.go                    # Contract ke WhatsAppPort, ReservationPort, ReminderPort
├── repository/
│   ├── form_repository.go
│   ├── field_repository.go
│   └── submission_repository.go
├── usecase/
│   ├── form_builder_usecase.go     # CRUD schema form & template
│   ├── form_submission_usecase.go  # Proses submit, mapping reservasi, trigger reminder
│   └── form_trigger_usecase.go     # Deteksi keyword 'daftar' dari pesan masuk WhatsApp
└── test/
    └── form_test.go
```

### C. Daftar Endpoint REST API
- **Dasbor Penjual (Protected)**:
  - `GET /api/v1/forms`: Mengambil konfigurasi formulir & kolom tenant.
  - `PUT /api/v1/forms`: Memperbarui pengaturan form, pesan pengantar, template balasan sukses, dan kata kunci.
  - `PUT /api/v1/forms/fields`: Menyimpan daftar kolom form secara batch (maks 10 kolom).
  - `GET /api/v1/forms/submissions`: Mengambil daftar riwayat jawaban pelanggan masuk.
  - `DELETE /api/v1/forms/submissions/:id`: Menghapus data submission.
- **Publik Pelanggan (Public)**:
  - `GET /api/v1/public/forms/:slug`: Mengambil struktur kolom form untuk dirender di browser smartphone pelanggan.
  - `POST /api/v1/public/forms/:slug/submit`: Mengirimkan jawaban form pelanggan.

---

## 4. Rencana Teknis Frontend (`fontwahide`)

### A. Struktur Direktori Frontend
```
fontwahide/src/
├── app/
│   ├── (dashboard)/
│   │   └── forms/
│   │       └── page.tsx            # Halaman Pengaturan Formulir Penjual
│   └── (public)/
│       └── f/
│           └── [slug]/
│               └── page.tsx        # Halaman Publik Mobile Form Pelanggan
└── modules/
    └── form/
        ├── api/
        │   └── form.api.ts         # Axios service private & public
        ├── hooks/
        │   ├── useFormBuilder.ts   # State management form builder
        │   └── usePublicForm.ts    # State management isian multi-step pelanggan
        ├── types/
        │   └── form.types.ts       # TypeScript definitions
        ├── components/
        │   ├── FormFieldsTable.tsx # Tabel kolom formulir (Label, Tipe, Mapping, dll.)
        │   ├── TemplatePresetSelector.tsx # Tombol preset template (Reservasi, Pendaftaran, dll.)
        │   ├── MultiStepCard.tsx   # Pengaturan judul halaman 1, 2, 3
        │   ├── IntroMessageCard.tsx # Pesan pengantar & tombol form
        │   ├── TriggerKeywordCard.tsx # Kata kunci aktivasi & balasan sukses
        │   ├── SubmissionsTable.tsx # Tabel riwayat isian pelanggan
        │   └── public/
        │       ├── PublicFormHeader.tsx
        │       ├── PublicMultiStepForm.tsx
        │       └── PublicSuccessView.tsx
        └── views/
            ├── FormBuilderView.tsx # Tampilan Dasbor Penjual
            └── PublicFormView.tsx  # Tampilan Pengunjung Smartphone
```

### B. Komponen Antarmuka Pengguna (UI)

#### 1. Tampilan Dasbor Penjual (`/forms`):
Sesuai persis dengan 3 gambar referensi:
- **Header**: Judul *"Formulir WhatsApp"* + Subjudul petunjuk koneksi ke Reservasi & Pengingat.
- **Bagian 1: Kolom Formulir**:
  - Tombol Preset Cepat: `Reservasi`, `Pendaftaran`, `Pemesanan`, `Keluhan`, `Survei`.
  - Tabel 10 Baris Kolom:
    - *Label*: Nama pertanyaan (contoh: "Nama", "Rencana tanggal", "Catatan").
    - *Tipe*: Dropdown (*Teks singkat, Pemilih tanggal, Teks panjang, Pilihan tunggal, Angka*).
    - *Artinya bagi sistem*: Dropdown pemetaan (*Nama, Tanggal reservasi, Catatan, Catatan tambahan, Cabang*).
    - *Wajib*: Checkbox required.
    - *Halaman*: Pilihan Halaman (1, 2, 3).
    - *Pilihan*: Input opsi dipisahkan koma untuk dropdown.
- **Bagian 2: Formulir Bertahap (Multi-Step)**:
  - Input Judul Halaman 1, 2, 3.
  - Checkbox *"Tampilkan layar ringkasan 'Periksa isian Anda' sebelum tombol kirim"*.
- **Bagian 3: Pesan Pengantar**:
  - Input *Judul (maks 60)*.
  - Input *Teks tombol (maks 20)*.
  - Textarea *Isi pesan*.
- **Bagian 4: Kapan Formulir Dikirim**:
  - Input *Kata kunci (pisahkan koma)* (contoh: `daftar`).
  - Textarea *Balasan setelah isian diterima* dengan placeholder `{nama}`, `{tanggal}`, `{jam}`, `{cabang}`.
  - Tombol Hijau: **Simpan Formulir**.
- **Bagian 5: Tabel Jawaban Masuk (*Submissions*)**:
  - Tabel memantau data pelanggan yang telah mengisi form, lengkap dengan status reservasi yang otomatis terbit.

#### 2. Tampilan Publik Pelanggan (`/f/[slug]`):
- Tampilan web form mobile yang sangat bersih, cepat, tanpa iklan, dan responsif.
- Bilah kemajuan (*Progress Bar*) halaman 1 dari 3.
- DatePicker kalender interaktif untuk memilih tanggal.
- Setelah disubmit, muncul layar sukses dan pesan otomatis masuk ke WhatsApp pelanggan.

### C. Integrasi Navigasi Sidebar
- File: `fontwahide/src/components/layout/dashboard/DashboardSidebar.tsx`
- Penempatan: Di dalam grup `dashboardMenu.groupWhatsapp` (sejajar dengan *Devices*, *Campaigns*, *Reminders*, *Reservations*, *Forms*, *Catalog*, *Contacts*).
- Icon: `ClipboardList` atau `FileText` dari `lucide-react`.
- Terjemahan i18n:
  - `id.json`: `"forms": "Formulir"`
  - `en.json`: `"forms": "Forms"`

---

## 5. Rencana Pengujian & Validasi

1. **Backend Unit Tests**:
   - Uji pembuatan dan penyimpanan schema 10 kolom formulir.
   - Uji submission publik dan keakuratan pemetaan otomatis (*Field Mapping* $\to$ Nama & Tanggal Reservasi).
   - Uji integrasi otomatis pemanggilan usecase `reservation` dan `reminder`.
   - Uji format template balasan sukses WhatsApp.
2. **Kualitas Kode**:
   - `make lint` backend (0 issues).
   - `go build ./cmd/web/main.go`.
   - Validasi type-safety TypeScript di frontend.
3. **Uji Fungsional Terintegrasi**:
   - Atur form pendaftaran klinik di dasbor penjual.
   - Kirim chat `"daftar"` ke bot WhatsApp toko.
   - Buka link formulir yang diberikan bot di smartphone penguji.
   - Isi nama, pilih tanggal esok hari, dan klik kirim.
   - Pastikan:
     1. Data muncul di tabel *Submissions*.
     2. Jadwal otomatis muncul di kalender *Reservasi*.
     3. Pesan pengingat H-1 otomatis aktif di antrean *Pengingat*.
     4. Bot WhatsApp mengirimkan pesan ucapan terima kasih ke nomor penguji.
