# Rencana Implementasi: Modul Template Pesan WhatsApp (Message Templates & Snippet Library)

Dokumen ini merupakan cetak biru (*blueprint*) dan rencana teknis mendalam untuk mengimplementasikan **Modul Template Pesan** pada ekosistem Wahide (Backend Go `wahide` dan Frontend Next.js 16 `fontwahide`).

Perencanaan teknis backend pada dokumen ini telah diselaraskan **100% dengan Standar Arsitektur Resmi Wahide** sebagaimana diatur dalam:
- [`G:\WEB2026\wahide\docs\module-anatomy.md`](file:///G:/WEB2026/wahide/docs/module-anatomy.md)
- [`G:\WEB2026\wahide\docs\new-module-guide.md`](file:///G:/WEB2026/wahide/docs/new-module-guide.md)
- [`G:\WEB2026\wahide\docs\clean-architecture.md`](file:///G:/WEB2026/wahide/docs/clean-architecture.md)
- [`G:\WEB2026\wahide\docs\performance-and-security-standards.md`](file:///G:/WEB2026/wahide/docs/performance-and-security-standards.md)

---

## 1. Latar Belakang & Nilai Produk

### Apakah Halaman Template Perlu Dibuat di Wahide?
> [!IMPORTANT]
> **JAWABAN: YA, SANGAT PERLU DAN FUNDAMENTAL.**

Di semua platform WhatsApp CRM & Gateway (seperti WACO pada menu `Template`), halaman Template memegang peran sentral sebagai **Pustaka Pesan Terpusat (*Central Message Library*)**.

### Mengapa Sangat Dibutuhkan di Wahide?
1. **Pusat Pustaka untuk Semua Modul Lain**:
   - Modul **Campaign (Broadcast)**: Memilih template promosi tanpa mengetik ulang dari awal.
   - Modul **Pengingat (Reminder)**: Menyediakan template pesan $H-1$, Hari H, dan $H+3$.
   - Modul **Reservasi**: Menyediakan template pesan bukti janji temu.
   - Modul **Live Chat (Inbox / Customer Service)**: Berfungsi sebagai *Quick Replies* (balasan cepat CS hanya dengan 1 klik).
2. **Keunggulan Telak Wahide vs Meta Cloud API (WACO)**:
   - Di WACO (Meta Cloud API), template **wajib diajukan ke Facebook/Meta** untuk direview 1x24 jam, berstatus *Pending/Approved/Rejected*, serta dikenakan biaya per percakapan berbayar.
   - Di Wahide (Multi-Device Engine):
     - **Instan Aktif**: Buat sekarang, detik ini juga langsung bisa dikirim ke pelanggan.
     - **100% Gratis**: Tanpa biaya percakapan Meta.
     - **Bebas Diubah (*Editable*)**: Template bisa diedit kapan saja tanpa takut di-reject atau dikunci oleh Meta.
     - **Mendukung Spintax Anti-Ban**: Penjual bisa menyisipkan format variasi kata acak seperti `{Halo|Hai|Selamat Pagi}` langsung di dalam template.

---

## 2. Diagram Interaksi Pustaka Template ke Seluruh Modul

```
                    ┌────────────────────────────┐
                    │    MODUL TEMPLATE PESAN    │
                    │   (Pustaka Pesan / Snippet)│
                    └─────────────┬──────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Modul Campaign  │    │  Modul Pengingat │    │ Modul Reservasi  │
│   (Broadcast)    │    │ (H-1, H-0, H+3)  │    │ (Bukti Booking)  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │  WhatsApp Engine Wahide    │
                    │ (SimulateTypingAndSend)    │
                    └────────────────────────────┘
```

---

## 3. Rencana Teknis Backend (`wahide`) Sesuai Standar `wahide/docs`

### A. Struktur Direktori Backend (Sesuai `module-anatomy.md`)

```
wahide/internal/modules/template/
├── template.go                         # Module Bootstrapper & Dependency Injection Wiring
├── delivery/
│   └── http/
│       ├── error_mapper.go             # HTTP Error Mapper (Domain Error ➔ HTTP Status Code)
│       ├── router.go                   # Pendaftaran Route HTTP (RegisterRoutes)
│       └── template_handler.go         # HTTP Handler (Embed logger.BaseHandler, xval.Sanitize, c.Validate)
├── domain/
│   ├── entity/
│   │   └── template.go                 # GORM Entity, BeforeCreate ULID, TableName, Check Constraints
│   ├── dto/
│   │   └── template_dto.go             # DTO terpisah per entitas, validate:"required,noxss", DILARANG import entity
│   ├── repository.go                   # Outbound Port: TemplateRepository interface
│   ├── usecase.go                      # Inbound Port: TemplateCrudUseCase interface (ctx & auth *sharedCtx.Auth)
│   ├── errors.go                       # Domain Sentinel Errors
│   ├── ports.go                        # Cross-Module Dependency Ports (jika ada)
│   └── contract.go                     # Public Contract Interface (TemplateContract untuk Campaign & Reminder)
├── repository/
│   └── template_repository.go          # Outbound Adapter (GORM, generic database.Repository, lean constructor)
├── usecase/
│   ├── template_crud_usecase.go        # Pure Business Logic (Embed logger.BaseUseCase, contextual logging, ownership)
│   └── contract_adapter.go             # Implementasi TemplateContract untuk dipanggil modul lain
└── test/
    ├── mocks_test.go                   # Mock Repository, Auth helper, Logger mock
    ├── template_usecase_test.go        # Unit test logika bisnis & authorization
    ├── template_security_xss_test.go   # Test penolakan XSS payload pada DTO & sanitasi
    └── template_handler_test.go        # Unit test Echo HTTP handler & status codes
```

---

### B. Aturan Emas Arsitektur & Coding Style Wahide

1. **Layer Domain (`domain/`)**:
   - **Entity (`domain/entity/template.go`)**:
     - Menggunakan hook `BeforeCreate` untuk pembuatan ID ULID (`ulid.Make().String()`).
     - Mengimplementasikan `TableName() string { return "templates" }`.
     - Check constraint pada kolom:
       - `category`: `CHECK (category IN ('MARKETING','UTILITY','REMINDER','RESERVATION','QUICK_REPLY'))`
       - `media_type`: `CHECK (media_type IN ('NONE','IMAGE','DOCUMENT'))`
     - Composite index: `idx_templates_tenant_cat` dan `idx_templates_tenant_name`.
   - **DTO (`domain/dto/template_dto.go`)**:
     - **DILARANG meng-import `domain/entity`**.
     - Wajib menyertakan tag validasi sanitasi XSS `validate:"required,noxss"` pada semua field string.
   - **Interfaces (`domain/repository.go` & `domain/usecase.go`)**:
     - Didefinisikan terpusat di package `domain`.
     - Seluruh method UseCase **WAJIB menerima `ctx context.Context` dan `auth *sharedCtx.Auth`**.
   - **Sentinel Errors (`domain/errors.go`)**:
     - Mendefinisikan error domain standar:
       ```go
       var (
           ErrTemplateNotFound      = errors.New("template not found")
           ErrTemplateNameExists    = errors.New("template name already exists")
           ErrInvalidCategory      = errors.New("invalid template category")
           ErrTemplateContentEmpty  = errors.New("template content cannot be empty")
       )
       ```

2. **Layer Repository (`repository/template_repository.go`)**:
   - **Lean Constructor**: `NewTemplateRepository(db *gorm.DB) domain.TemplateRepository` (tanpa `*logger.Logger` karena tracing database sudah ditangani plugin OpenTelemetry GORM secara global).
   - Memanfaatkan generic struct: `*database.Repository[entity.Template]`.
   - Menggunakan `r.GetDB(ctx).Model(&entity.Template{})` (bukan string hardcode `.Table("templates")`).

3. **Layer UseCase (`usecase/template_crud_usecase.go`)**:
   - **Embed `logger.BaseUseCase`**: Inisialisasi dengan `logger.NewBaseUseCase(log)`.
   - **Validasi Auth & Ownership**:
     ```go
     if auth == nil {
         u.Log(ctx, "template.Create").Warn("Unauthorized: missing auth context")
         return nil, sharedErrors.ErrUnauthorized
     }
     if err := auth.CheckOwnership("", template.TenantID); err != nil {
         u.Log(ctx, "template.Get").WithError(err).Warn("Forbidden: tenant ownership mismatch")
         return nil, sharedErrors.ErrForbidden
     }
     ```
   - **Contextual Logging & Standard Level**:
     - Gunakan `u.Log(ctx, "template.<Operation>")`.
     - Log level `WARN` untuk Client / Domain Errors (4xx) seperti Record Not Found (`ErrTemplateNotFound`), Duplicate Name (`ErrTemplateNameExists`), atau Ownership Violation (`ErrForbidden`).
     - Log level `ERROR` murni untuk System / Database Failures (5xx).
   - **Penanganan Error**: Wajib eksplisit `if err != nil` dan menggunakan `errors.Is(err, target)`.
   - **Zero Helper Files**: Fungsi ekstraksi variabel regex (`{{([^{}]+)}}`) dan validasi Spintax dibuat sebagai private method di dalam struct UseCase.

4. **Layer Delivery HTTP (`delivery/http/`)**:
   - **Handler (`template_handler.go`)**:
     - Embed `logger.BaseHandler` dengan `logger.NewBaseHandler(log)`.
     - Contextual logging: `h.LogEntry(ctx, "TemplateHandler.<Method>").WithError(err)`.
     - Sanitasi DTO dengan `xval.SanitizeFields(req)` sebelum pemanggilan `h.val.Struct(req)`.
     - **Zero-Reallocation**: Wajib pre-alokasi slice response (`make([]dto.TemplateResponse, 0, len(items))`).
     - Mengembalikan envelope standar `response.Success(c, http.StatusOK, "...", data)` atau `response.Paginated(c, ...)`.
   - **Error Mapper (`error_mapper.go`)**:
     - Mengimplementasikan `sharedResponse.ErrorMapper` untuk memetakan `ErrTemplateNotFound` $\to$ `http.StatusNotFound`, `ErrTemplateNameExists` $\to$ `http.StatusConflict`, dll.
   - **Router (`router.go`)**:
     - Mendaftarkan endpoint ke grup `protected` (auth) dan `seller` / `admin`.

5. **Module Bootstrapper (`template.go`)**:
   - Menyediakan `func Initialize(db *gorm.DB, log *logger.Logger, val *govalidator.Validate) *Module`.
   - Mendaftarkan error mapper secara otomatis ke registry global:
     `response.RegisterErrorMapper(templateHttp.NewTemplateErrorMapper())`.

6. **Layer Pengujian (`test/`)**:
   - `mocks_test.go`: Mock repository dan test logger.
   - `template_usecase_test.go`: Uji skenario sukses, duplikasi, tenant ownership mismatch, dan filter kategori.
   - `template_security_xss_test.go`: Uji penolakan payload serangan XSS (`<script>`, `<iframe>`, `javascript:`) pada DTO.
   - `template_handler_test.go`: Uji HTTP request & status code dengan Echo mock recorder.

---

### C. Skema Basis Data Lengkap (`templates`)

```sql
CREATE TABLE templates (
    id VARCHAR(26) PRIMARY KEY,                         -- ULID
    tenant_id VARCHAR(26) NOT NULL,                     -- Multi-Tenant Isolation
    name VARCHAR(150) NOT NULL,                         -- Nama Template (contoh: "Promo Weekend Diskon 20%")
    category VARCHAR(50) NOT NULL DEFAULT 'MARKETING',  -- 'MARKETING', 'UTILITY', 'REMINDER', 'RESERVATION', 'QUICK_REPLY'
    content TEXT NOT NULL,                              -- Isi pesan (mendukung Spintax & {{variabel}})
    media_url VARCHAR(500),                             -- URL Gambar / Brosur https publik (opsional)
    media_type VARCHAR(20) NOT NULL DEFAULT 'NONE',     -- 'NONE', 'IMAGE', 'DOCUMENT'
    variables JSONB,                                    -- Array variabel terdeteksi: ["nama", "tanggal", "jam"]
    is_favorite BOOLEAN NOT NULL DEFAULT false,         -- Pin untuk Quick Reply CS
    usage_count INT NOT NULL DEFAULT 0,                 -- Jumlah kali template digunakan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_template_category CHECK (category IN ('MARKETING','UTILITY','REMINDER','RESERVATION','QUICK_REPLY')),
    CONSTRAINT chk_template_media_type CHECK (media_type IN ('NONE','IMAGE','DOCUMENT'))
);

-- Composite Indexes untuk performa tinggi
CREATE INDEX idx_templates_tenant_cat ON templates(tenant_id, category);
CREATE INDEX idx_templates_tenant_name ON templates(tenant_id, name);
CREATE INDEX idx_templates_tenant_favorite ON templates(tenant_id, is_favorite) WHERE is_favorite = true;
```

---

### D. Daftar Endpoint REST API
- `GET /api/v1/templates`: Mengambil daftar template tenant (filter kategori, search keyword, pagination).
- `GET /api/v1/templates/:id`: Mengambil detail satu template.
- `POST /api/v1/templates`: Membuat template pesan baru.
- `PUT /api/v1/templates/:id`: Memperbarui template pesan.
- `POST /api/v1/templates/:id/duplicate`: Menggandakan (*clone*) template yang sudah ada.
- `PATCH /api/v1/templates/:id/favorite`: Toggle status favorit/pin untuk balasan cepat CS.
- `DELETE /api/v1/templates/:id`: Menghapus template.

---

## 4. Rencana Teknis Frontend (`fontwahide`)

### A. Struktur Direktori Frontend
```
fontwahide/src/
├── app/(dashboard)/
│   └── templates/
│       └── page.tsx                # Next.js Route Page
└── modules/
    └── template/
        ├── api/
        │   └── template.api.ts     # Axios service calls
        ├── hooks/
        │   └── useTemplates.ts     # State management & React Query
        ├── types/
        │   └── template.types.ts   # TypeScript interfaces
        ├── components/
        │   ├── TemplateFilterBar.tsx # Tab kategori & search bar
        │   ├── TemplateCard.tsx    # Card item template & badge kategori
        │   ├── TemplateEditorModal.tsx # Dialog editor pembuat template (Split Layout)
        │   ├── VariableQuickInsert.tsx # Tombol sisip cepat {{nama}}, {{tanggal}}, Spintax
        │   └── WhatsAppPhoneMockup.tsx # Live preview chat WhatsApp interaktif
        └── views/
            └── TemplatesView.tsx   # Main Page Layout
```

### B. Komponen Antarmuka Pengguna (UI)

1. **Header & Bar Filter Kategori**:
   - Judul: **Template Pesan**
   - Subjudul: *"Pustaka pesan siap pakai untuk broadcast, pengingat otomatis, reservasi, dan balasan cepat tim CS."*
   - Filter Tab:
     - **Semua**
     - **Pemasaran (Marketing)**
     - **Pengingat (Reminder)**
     - **Reservasi**
     - **Notifikasi Transaksi**
     - **Balasan Cepat (Quick Reply)**
   - Tombol Aksi: **+ Buat Template Baru** dan kotak pencarian (*search bar*).

2. **Grid / Daftar Template Card**:
   - Judul Template & Badge Kategori dengan warna kontras (Marketing: Ungu, Reminder: Biru, Reservation: Hijau, Quick Reply: Abu-abu).
   - Cuplikan isi pesan dengan rendering format WhatsApp (*bold*, _italic_, ~strike~).
   - Badge Pills Variabel yang digunakan: `{{nama}}`, `{{tanggal}}`, `{{jam}}`.
   - Indikator Gambar jika menyertakan banner media.
   - Tombol Aksi Cepat:
     - **Salin Teks** (copy to clipboard).
     - **Gunakan di Campaign** (redirect langsung ke form broadcast dengan teks terisi).
     - **Edit** & **Hapus**.

3. **Editor Template Modern (Split View Layout)**:
   Saat menekan tombol *"Buat Template Baru"*, terbuka modal interaktif dua kolom:
   - **Kolom Kiri (Editor Form)**:
     - Input Nama Template (contoh: "Promo Kemerdekaan").
     - Dropdown Kategori.
     - Input URL Gambar/Brosur (opsional).
     - Textarea Isi Pesan WhatsApp.
     - **Baris Tombol Sisip Pintas (*Variable Pills Toolbar*)**:
       - `+ {{nama}}`
       - `+ {{tanggal}}`
       - `+ {{jam}}`
       - `+ {{catatan}}`
       - `+ Spintax {Halo|Hai}`
   - **Kolom Kanan (WhatsApp Phone Live Mockup)**:
     - Menampilkan simulasi layar smartphone WhatsApp asli secara *real-time*.
     - Apa yang diketik di kolom kiri langsung muncul di dalam balon percakapan WhatsApp hijau di sebelah kanan secara instan.

### C. Integrasi Navigasi Sidebar
- File: `fontwahide/src/components/layout/dashboard/DashboardSidebar.tsx`
- Penempatan: Di dalam grup `dashboardMenu.groupWhatsapp` (sejajar dengan *Devices*, *Campaigns*, *Templates*, *Reminders*, *Reservations*, *Forms*, *Catalog*, *Contacts*).
- Icon: `FileCode2` atau `LayoutTemplate` dari `lucide-react`.
- Terjemahan i18n:
  - `id.json`: `"templates": "Template Pesan"`
  - `en.json`: `"templates": "Message Templates"`

---

## 5. Rencana Pengujian & Validasi Kualitas

Sesuai standar `G:\WEB2026\wahide\docs\new-module-guide.md`, pengujian dilakukan secara ketat dan terisolasi:

1. **Unit Test Terisolasi (Scoped Test)**:
   ```bash
   go test -v ./internal/modules/template/test/...
   ```
2. **Linting Static Analysis**:
   ```bash
   golangci-lint run ./internal/modules/template/...
   ```
3. **Kompilasi Seluruh Proyek**:
   ```bash
   go build ./cmd/... ./internal/...
   ```
4. **Validasi Frontend**:
   - TypeScript compile check di `fontwahide`.
   - Uji antarmuka: Form input template, filter kategori, live preview phone mockup, dan salin teks.
