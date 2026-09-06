# Rencana Implementasi: Modul Katalog & Pesanan WhatsApp (WhatsApp Conversational Catalog & Cart)

Dokumen ini merupakan cetak biru (*blueprint*) dan rencana teknis mendalam untuk mengimplementasikan **Modul Katalog & Pesanan WhatsApp** pada platform SaaS WhatsApp Wahide, mencakup backend Go (`wahide`) dan frontend Next.js 16 (`fontwahide`).

---

## 1. Latar Belakang & Nilai Produk

Berdasarkan referensi fitur Katalog pada sistem CRM WhatsApp (seperti WACO `waco.id/katalog`), pemilik toko dan pelaku UMKM membutuhkan fitur **Toko Otomatis di WhatsApp (*Conversational Commerce*)** yang memungkinkan pelanggan:
1. Mengetik kata kunci pemicu (contoh: `katalog`, `beli`, `menu`, `order`) ke nomor WhatsApp toko.
2. Menerima daftar produk interaktif secara instan (maksimal 10 produk pilihan).
3. Melakukan pemesanan langsung di ruang obrolan (pilih produk $\to$ masukkan jumlah $\to$ keranjang belanja $\to$ checkout).
4. Menerima ringkasan pesanan bernomor (contoh: `P-000123`), rincian total belanja, dan daftar rekening transfer bank penjual secara otomatis.
5. Melakukan konfirmasi pembayaran dengan mengetik `"sudah bayar"` dan mengunggah bukti transfer.

### Keunggulan Wahide vs Meta Cloud API (WACO):
- **100% Bebas Biaya Percakapan**: Tidak ada potongan biaya per percakapan (Meta conversation fee) per pesan katalog.
- **Bebas Pembatasan Format Meta**: Penjual bebas mengatur format teks, variabel `{nama}`, `{nomor}`, `{ringkasan}`, `{total}`, `{rekening}`.
- **Opsi Pembayaran Otomatis**: Selain transfer rekening manual, pesanan dapat diintegrasikan dengan Payment Gateway Wahide (QRIS / Virtual Account Midtrans, Tripay, Xendit).

---

## 2. Diagram Alur Percakapan (*Conversational State Machine*)

```
[ Pelanggan Chat ke WhatsApp Toko ]
                 │
                 ▼
1. Pelanggan mengetik: "katalog", "beli", atau "order"
                 │
                 ▼
2. Bot Wahide merespons daftar produk aktif:
   "Silakan pilih produk yang ingin dipesan:
    1. Produk A - Rp 50.000
    2. Produk B - Rp 75.000
    Ketik nomor produk yang dipilih."
   (Session State di Redis: WAITING_PRODUCT_SELECT, TTL 30m)
                 │
                 ▼
3. Pelanggan membalas angka: "1"
   Bot: "Berapa jumlah yang ingin dipesan untuk Produk A?"
   (Session State: WAITING_QUANTITY, ProductID: 1)
                 │
                 ▼
4. Pelanggan membalas angka: "2"
   Bot: "✅ Produk A (2 pcs) ditambahkan ke keranjang.
         Ketik 'TAMBAH' untuk pesan produk lain, atau ketik 'SELESAI' untuk lanjut pembayaran."
   (Session State: CART_ACTIVE)
                 │
                 ▼
5. Pelanggan mengetik: "SELESAI"
   Bot Wahide membuat record di tabel `orders` (No: P-000123) dan merespons template ringkasan:
   "Terima kasih {nama}! Pesanan {nomor} kami catat.
    {ringkasan}
    Total: {total}

    Silakan transfer ke:
    {rekening}

    Setelah transfer, ketik 'sudah bayar' dan sebutkan nomor pesanan {nomor}."
                 │
                 ▼
6. Notifikasi Masuk ke Dasbor Penjual:
   Pesanan baru berstatus PENDING_PAYMENT muncul di tab Orders dasbor penjual.
```

---

## 3. Rencana Teknis Backend (`wahide`)

### A. Skema Basis Data

1. **Tabel `catalogs`** (Pengaturan katalog per tenant):
   ```sql
   CREATE TABLE catalogs (
       id VARCHAR(26) PRIMARY KEY,                  -- ULID
       tenant_id VARCHAR(26) NOT NULL UNIQUE,       -- 1 Katalog per Tenant
       is_active BOOLEAN NOT NULL DEFAULT true,     -- Status aktif/nonaktif
       title VARCHAR(60) NOT NULL DEFAULT 'Katalog produk',
       welcome_message TEXT NOT NULL DEFAULT 'Silakan pilih produk yang ingin dipesan.',
       bank_accounts TEXT NOT NULL,                 -- Rekening tujuan, 1 per baris
       order_summary_template TEXT NOT NULL,        -- Template ringkasan {nama} {nomor} {ringkasan} {total} {rekening}
       trigger_keywords TEXT NOT NULL DEFAULT 'katalog, beli, order, menu, produk',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX idx_catalogs_tenant ON catalogs(tenant_id);
   ```

2. **Tabel `catalog_products`** (Daftar produk, maks 10 per tenant):
   ```sql
   CREATE TABLE catalog_products (
       id VARCHAR(26) PRIMARY KEY,                  -- ULID
       tenant_id VARCHAR(26) NOT NULL,
       catalog_id VARCHAR(26) NOT NULL,
       position INT NOT NULL DEFAULT 1,             -- Urutan nomor 1 s/d 10
       name VARCHAR(150) NOT NULL,                  -- Nama produk
       price BIGINT NOT NULL DEFAULT 0,             -- Harga dalam rupiah bulat
       description VARCHAR(255),                    -- Keterangan singkat
       image_url VARCHAR(500),                      -- URL gambar https publik
       is_active BOOLEAN NOT NULL DEFAULT true,     -- Status produk aktif
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX idx_catalog_products_tenant ON catalog_products(tenant_id, position);
   ```

3. **Tabel `orders`** (Data pesanan yang masuk dari chat):
   ```sql
   CREATE TABLE orders (
       id VARCHAR(26) PRIMARY KEY,                  -- ULID
       tenant_id VARCHAR(26) NOT NULL,
       order_number VARCHAR(30) NOT NULL,           -- Contoh: P-260906-001
       customer_phone VARCHAR(30) NOT NULL,
       customer_name VARCHAR(150),
       items JSONB NOT NULL,                        -- Array [{product_id, name, price, qty, subtotal}]
       total_amount BIGINT NOT NULL,
       bank_info TEXT,                              -- Salinan rekening transfer saat order dibuat
       status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT', -- 'PENDING_PAYMENT', 'CONFIRMED', 'PAID', 'CANCELLED'
       proof_image_url VARCHAR(500),                -- Bukti transfer pelanggan
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status);
   CREATE INDEX idx_orders_customer ON orders(tenant_id, customer_phone);
   ```

### B. Struktur Direktori Backend
```
wahide/internal/modules/catalog/
├── catalog.go                      # Module entrypoint & DI
├── delivery/
│   └── http/
│       ├── handler.go              # HTTP REST API Controller
│       └── error_mapper.go
├── domain/
│   ├── entity/
│   │   ├── catalog.go
│   │   ├── catalog_product.go
│   │   └── order.go
│   ├── dto/
│   │   └── catalog_dto.go
│   └── ports.go                    # Inter-module contract (WhatsAppPort, Cache/RedisPort)
├── repository/
│   ├── catalog_repository.go
│   ├── product_repository.go
│   └── order_repository.go
├── usecase/
│   ├── catalog_usecase.go          # Pengaturan katalog & produk dasbor
│   ├── order_usecase.go            # Manajemen pesanan masuk
│   └── bot_session_usecase.go      # State machine keranjang belanja WhatsApp via Redis
└── test/
    └── catalog_test.go
```

### C. Daftar Endpoint REST API
- `GET /api/v1/catalogs`: Mengambil konfigurasi katalog & daftar 10 produk tenant.
- `PUT /api/v1/catalogs`: Menyimpan konfigurasi katalog (judul, rekening, template pesan, keywords, status aktif).
- `PUT /api/v1/catalogs/products`: Menyimpan & mengupdate daftar 10 produk secara batch.
- `GET /api/v1/catalogs/orders`: Mengambil daftar pesanan masuk pelanggan (filter status, search nomor/nama).
- `PATCH /api/v1/catalogs/orders/:id/status`: Mengubah status pesanan (`PAID`, `CANCELLED`, `CONFIRMED`).

---

## 4. Rencana Teknis Frontend (`fontwahide`)

### A. Struktur Direktori Frontend
```
fontwahide/src/
├── app/(dashboard)/
│   └── catalog/
│       └── page.tsx                # Route Next.js Page
└── modules/
    └── catalog/
        ├── api/
        │   └── catalog.api.ts      # Service axios/fetch
        ├── hooks/
        │   └── useCatalog.ts       # Hook state manajemen katalog & produk
        │   └── useOrders.ts        # Hook manajemen pesanan masuk
        ├── types/
        │   └── catalog.types.ts    # TypeScript definitions
        ├── components/
        │   ├── HowItWorksCard.tsx  # Panduan alur "Cara Kerjanya"
        │   ├── ProductTableCard.tsx # Form tabel 10 produk
        │   ├── PaymentMessageCard.tsx # Form rekening tujuan & template ringkasan
        │   ├── TriggerKeywordsCard.tsx # Form kata kunci aktivasi
        │   └── OrdersTable.tsx     # Tab tabel pesanan pelanggan
        └── views/
            └── CatalogView.tsx     # Main View Layout
```

### B. Komponen Antarmuka Pengguna (UI)
Sesuai dengan 3 gambar referensi:

1. **Card "Cara Kerjanya" & Switcher**:
   - Panduan alur 4 langkah interaktif:
     1. Pelanggan mengetik kata kunci $\to$ daftar produk.
     2. Pilih produk $\to$ ditanya jumlah $\to$ keranjang belanja.
     3. Selesai $\to$ pesanan bernomor (`P-000123`), ringkasan total, dan rekening tujuan.
     4. Pelanggan mengetik "sudah bayar" $\to$ konfirmasi pembayaran.
   - Switcher checkbox: *"Aktifkan katalog"*.

2. **Card "1. Produk"**:
   - Subjudul: *"Maksimal 10 produk (batas daftar pilihan WhatsApp). Harga dalam rupiah bulat. Gambar opsional."*
   - Tabel 10 baris:
     - Nomor (1 s/d 10)
     - Input *Nama Produk*
     - Input *Harga (Rp)*
     - Input *Keterangan Singkat*
     - Input *URL Gambar (opsional)*
     - Checkbox *Aktif*

3. **Card "2. Rekening Tujuan & Pesan"**:
   - Textarea *Rekening tujuan (satu per baris)* (contoh: `BCA 1234567890 a.n. PT Wahide`).
   - Input *Judul katalog (maks 60)* (contoh: `Katalog produk`).
   - Textarea *Pesan pembuka daftar produk* (contoh: `Silakan pilih produk yang ingin dipesan.`).
   - Textarea *Ringkasan pesanan*: Mendukung placeholder variabel `{nama}`, `{nomor}`, `{ringkasan}`, `{total}`, `{rekening}`.

4. **Card "3. Kapan Katalog Dikirim"**:
   - Input *Kata kunci (pisahkan koma)* (contoh: `katalog, beli, order, menu, produk`).
   - Tombol Hijau: **Simpan**.

5. **Tab / Card "Daftar Pesanan Masuk (Orders)"**:
   - Tabel pemantauan pesanan pelanggan yang masuk dari WhatsApp: Nomor Order, Nama/Nomor WA, Rincian Barang, Total (Rp), Status (*Pending, Paid, Cancelled*), Aksi konfirmasi.

### C. Integrasi Navigasi Sidebar
- File: `fontwahide/src/components/layout/dashboard/DashboardSidebar.tsx`
- Penempatan: Di dalam grup `dashboardMenu.groupWhatsapp` (sejajar dengan *Devices*, *Campaigns*, *Reminders*, *Reservations*, *Contacts*).
- Icon: `ShoppingBag` atau `Store` dari `lucide-react`.
- Terjemahan i18n:
  - `id.json`: `"catalog": "Katalog & Pesanan"`
  - `en.json`: `"catalog": "Catalog & Orders"`

---

## 5. Rencana Pengujian & Validasi

1. **Backend Unit Tests**:
   - Test CRUD konfigurasi katalog dan 10 produk.
   - Test state machine keranjang belanja di Redis (pilih produk $\to$ kuantiti $\to$ kalkulasi total).
   - Test penggantian variabel `{nama}`, `{nomor}`, `{ringkasan}`, `{total}`, `{rekening}`.
2. **Kualitas Kode**:
   - `make lint` backend (0 issues).
   - `go build ./cmd/web/main.go`.
   - Next.js type check di frontend.
3. **Uji Percakapan WhatsApp Nyata**:
   - Simpan produk di dasbor (misal Kopi Susu Rp 20.000).
   - Kirim chat "katalog" dari HP penguji ke nomor bot WhatsApp.
   - Pastikan bot membalas daftar produk secara otomatis.
   - Balas dengan nomor produk dan selesaikan pesanan $\to$ pastikan ringkasan transfer terkirim dan data tersimpan di tabel `orders` dasbor.
