# 📐 Blueprint Perencanaan: Integrasi Showcase 4 Modul Bisnis Inti ke Landing Page Wahide

> **Status Dokumen:** Proposed / Architecture Plan  
> **Level:** Product System Design & High-Conversion UX Architecture  
> **Target Aplikasi:** `fontwahide` (`G:\WEB2026\fontwahide`)  
> **Komponen Kunci:** `BusinessSolutionsSection`, `HomeView`, `page.tsx`, `i18n`  
> **Tanggal:** 2026-09-06  

---

## 1. Executive Summary & Nilai Strategis

Aplikasi **Wahide** telah memiliki 4 modul operasional bisnis yang matang dan teruji:
1. **Modul Template Pesan (`template`)**
2. **Modul Pengingat Otomatis (`reminder`)**
3. **Modul Reservasi Jadwal (`reservation`)**
4. **Modul Formulir Dinamis Publik (`form`)**

Namun, pada halaman depan publik (`page.tsx` / `HomeView.tsx`), seluruh presentasi produk masih berfokus 100% pada aspek teknis *low-level socket & gateway*:
- Native Core, Session Hibernation, 5-Lapis Anti-Ban, Spintax acak, Webhook HMAC, dan REST API.

### Masalah yang Ditemukan (Pain Point):
Pengunjung dari kalangan **pemilik bisnis, UMKM, klinik, salon, event organizer, dan sales manager** yang masuk ke website Wahide sering kali tidak menyadari bahwa Wahide sudah menyediakan **aplikasi bisnis siap pakai** tanpa perlu coding. Mereka mengira Wahide hanyalah alat untuk programmer.

### Solusi:
Menambahkan sebuah seksi khusus **"Solusi Bisnis Siap Pakai (Ready-to-Use Business Solutions)"** yang memamerkan ke-4 modul ini secara interaktif dan visual, memperluas jangkauan audiens dari sekadar developer menjadi ekosistem pemilik bisnis.

---

## 2. Struktur Visual & Tata Letak (Bento Grid 4 Card)

Section baru ini dirancang dengan gaya **Bento Grid** modern menggunakan token desain **Wise Theme**:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                [BADGE: SOLUSI BISNIS SIAP PAKAI]                 │
│                Bukan Sekadar Gateway — Wahide Adalah Solusi Bisnis Lengkap       │
│    Tingkatkan penjualan, percepat layanan pelanggan, dan otomatisasi operasional │
├────────────────────────────────────────┬─────────────────────────────────────────┤
│ 📅 SISTEM RESERVASI & JADWAL           │ ⏰ PENGINGAT OTOMATIS (REMINDER)        │
│ • Kalender Agenda & Slot Booking       │ • Notifikasi Jatuh Tempo & Jadwal H-1   │
│ • Tiket Reservasi Instan via WhatsApp  │ • Variabel Personalisasi {{nama}}       │
│ • Booking mandiri 24/7 tanpa chat manual│ • Cegah No-Show & Keterlambatan s/d 80% │
│ [Tag: Klinik, Salon, Barbershop, CS]   │ [Tag: Tagihan, Servis, Webinar, Bimbel] │
├────────────────────────────────────────┼─────────────────────────────────────────┤
│ 📋 FORMULIR DINAMIS PUBLIK             │ 📝 BANK TEMPLATE PESAN BISNIS           │
│ • Drag-and-Drop Form Builder           │ • Standarisasi Percakapan CS & Sales    │
│ • Shortlink Publik Keren (/f/nama-form)│ • Pustaka Pesan Instan Satu Klik        │
│ • Respon Formulir Memicu Balasan WA    │ • Format Rapi, Cepat, dan Terukur       │
│ [Tag: Pendaftaran Event, Kuesioner]    │ [Tag: Customer Support, Sales Outbound] │
└────────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 3. Rencana Eksekusi & Pemetaan File

### A. Komponen Baru
- **`src/components/home/BusinessSolutionsSection.tsx`**:
  - Dibangun murni menggunakan primitif Shadcn/UI (`Card`, `Badge`, `Button`, `Separator`).
  - Menampilkan 4 kartu solusi bisnis dengan ikon representatif (`Calendar`, `Clock`, `FileText`, `MessageSquare`).
  - Dilengkapi pill badge use case industri untuk memberikan konteks nyata kepada calon pelanggan.
  - Sepenuhnya adaptif Light & Dark mode.

### B. Integrasi Landing Page
- **`src/components/home/HomeView.tsx`**:
  - Menyisipkan `<BusinessSolutionsSection />` tepat di bawah `MessageSimulator` dan sebelum `SpintaxSandbox`.
  - Urutan narasi landing page:
    1. Hero Section (Headline & Quick Metric Bento)
    2. Interactive WhatsApp Simulator (Demo Pesan Interaktif)
    3. **👉 Solusi Bisnis Siap Pakai (4 Modul: Reservasi, Reminder, Form, Template)**
    4. Spintax Sandbox (Teknologi Anti-Ban)
    5. Developer REST API Sandbox (Untuk Pengembang/Integrasi)
    6. 9 Pilar Fitur Enterprise
    7. Paket Harga & Kuota
    8. Perbandingan Arsitektur
    9. FAQ Accordion & CTA Banner

### C. Pengayaan SEO & Metadata
- **`src/app/(public)/page.tsx`**:
  - Memperkaya `metadata.description` dan `openGraph` dengan keyword solusi bisnis.
  - Menambahkan 1 item FAQ terstruktur pada JSON-LD Schema.org mengenai modul bisnis bawaan.

### D. Internasionalisasi (i18n)
- **`src/locales/id/common.json`** & **`src/locales/en/common.json`**:
  - Menambahkan key dictionary `common.landing.solutions` lengkap dwibahasa (ID & EN).

---

## 4. Quality Gate & Kepatuhan Proyek

1. **JANGAN PERNAH menjalankan `bun run build`** (mematuhi aturan mutlak frontend).
2. **Validasi Tipe TypeScript**:
   ```bash
   bun x tsc --noEmit
   ```
   *Wajib lulus 100% dengan exit code 0.*
3. **Validasi ESLint**:
   ```bash
   bun run lint
   ```
   *Wajib 0 errors dan 0 warnings.*
4. **Zero Layout Shift (CLS)** & Responsivitas 100% pada layar Mobile, Tablet, dan Desktop.
