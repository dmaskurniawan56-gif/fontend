# Rencana Lengkap: Optimasi Technical SEO Google Page 1 & Metadata Standar Industri untuk Dokumentasi Wahide

Sebagai **Senior Technical SEO Specialist & Frontend Architect**, dokumen ini merancang arsitektur optimasi Search Engine Optimization (SEO) menyeluruh untuk portal dokumentasi REST API Wahide agar berpeluang maksimal menembus **Halaman 1 Google (Page 1 SERP)** untuk kata kunci target seperti:
* *"WhatsApp API Indonesia"*
* *"Send WhatsApp message API"*
* *"WhatsApp multi device REST API"*
* *"WhatsApp API QR code pair"*
* *"WhatsApp broadcast API"*

---

## 1. Audit Masalah SEO Saat Ini & Bottleneck di Google SERP

| Komponen SEO | Kondisi Saat Ini (Bermasalah) | Dampak pada Google SERP | Standar Google Page 1 Baru |
|:---|:---|:---|:---|
| **Title Tag Length** | Duplikasi ganda antara `layout.tsx` (`%s \| Wahide WhatsApp API Docs`) dan `page.tsx` (`${doc.title} - Wahide WhatsApp API Documentation`). | Judul menjadi **82+ karakter**: `Send Text Messages - Wahide WhatsApp API Documentation \| Wahide WhatsApp API Docs`. Terpotong tanda titik-titik (`...`) di hasil pencarian Google. | Batasi ketat **45–55 karakter**: `Send WhatsApp Text Message API \| Wahide API`. Ringkas, tajam, memuat keyword utama tanpa terpotong. |
| **Meta Description** | Teks deskripsi bawaan terlalu pendek (< 60 karakter) atau tidak memuat *search intent* & *call to action*. | Google menggantinya dengan cuplikan acak halaman yang menurunkan Click-Through Rate (CTR). | Diformulasikan tepat **140–155 karakter** dengan keyword komparasi: cURL, Node.js, PHP, Python, Go, anti-ban, dan format nomor E.164. |
| **Canonical URL** | Belum ada tag `alternates: { canonical: ... }`. | Risiko penalti konten duplikat (*duplicate content penalty*) antara HTTP/HTTPS, www/non-www, dan staging. | Mengunci canonical URL absolut untuk setiap endpoint (`https://wahide.id/docs/...`). |
| **Structured Data (JSON-LD)** | Belum ada Schema.org markup. | Tampilan hasil pencarian Google hanya berupa link biru polos biasa tanpa Rich Snippets. | Injeksi **JSON-LD Schema**: `TechArticle` / `APIReference` dan `BreadcrumbList` (menghasilkan navigasi remah roti langsung di Google SERP). |
| **Sitemap XML (`sitemap.ts`)** | Rute `/docs/*` **belum terdaftar** di `src/app/sitemap.ts`. | Bot perayap Google (Googlebot) lambat menemukan dan mengindeks 23+ halaman endpoint baru. | Mengintegrasikan seluruh endpoint secara dinamis ke `sitemap.ts` dengan `changeFrequency: "weekly"` dan `priority: 0.9`. |
| **Robots Directives** | Pengaturan default tanpa arahan cuplikan. | Cuplikan kode atau gambar mungkin dibatasi oleh Googlebot. | Memberikan arahan spesifik: `max-snippet: -1`, `max-image-preview: "large"`, `max-video-preview: -1`. |

---

## 2. Strategi Formula Title Tag & Keyword Mapping (Presisi < 55 Karakter)

Di `src/app/docs/layout.tsx`, template title diatur menjadi:
```text
template: "%s | Wahide API"   (panjang suffix: 13 karakter)
```
Tiap halaman mengisi `%s` dengan panjang **30–42 karakter**, sehingga total panjang title di browser/SERP **tepat 43–55 karakter** (bebas dari pemotongan Google):

| Slug Endpoint | UI Title (Tampilan Halaman) | SEO Title (%s) | Total SERP Title (Termasuk Brand) | Karakter |
|:---|:---|:---|:---|:---:|
| `/docs/intro` | Introduction | WhatsApp API Documentation | `WhatsApp API Documentation \| Wahide API` | **39** |
| `/docs/authentication` | Authentication | API Authentication & Bearer Tokens | `API Authentication & Bearer Tokens \| Wahide API` | **47** |
| `/docs/errors` | Errors & Rate Limits | API Status Codes & Rate Limits | `API Status Codes & Rate Limits \| Wahide API` | **43** |
| `/docs/messaging/send-text` | Send Text Messages | Send WhatsApp Text Message API | `Send WhatsApp Text Message API \| Wahide API` | **43** |
| `/docs/messaging/send-round-robin` | Round-Robin Multi-Device | Multi-Device WhatsApp Rotation API | `Multi-Device WhatsApp Rotation API \| Wahide API` | **48** |
| `/docs/messaging/send-spintax` | Spintax Dynamic Text | Send Dynamic Spintax WhatsApp API | `Send Dynamic Spintax WhatsApp API \| Wahide API` | **47** |
| `/docs/messaging/send-media` | Send Media / Document | Send WhatsApp Media & PDF API | `Send WhatsApp Media & PDF API \| Wahide API` | **42** |
| `/docs/messaging/meta-cloud-api` | Meta Cloud API Compatible | Meta WhatsApp Cloud API Endpoint | `Meta WhatsApp Cloud API Endpoint \| Wahide API` | **46** |
| `/docs/devices/list` | List Devices | List Connected WhatsApp Devices | `List Connected WhatsApp Devices \| Wahide API` | **45** |
| `/docs/devices/pair` | Pair Device (QR) | Pair WhatsApp Device via QR API | `Pair WhatsApp Device via QR API \| Wahide API` | **45** |
| `/docs/contacts/bulk-import` | Bulk Import Contacts | Bulk Import WhatsApp Contacts API | `Bulk Import WhatsApp Contacts API \| Wahide API` | **47** |
| `/docs/campaigns/create` | Create Campaign | Create WhatsApp Broadcast Campaign | `Create WhatsApp Broadcast Campaign \| Wahide API` | **48** |

---

## 3. Arsitektur Komponen SEO Baru

### A. Modul Helper SEO Metadata ([`src/components/doc/data/seo.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/seo.ts))
Membuat berkas helper khusus yang memetakan metadata SEO berkualitas tinggi untuk setiap slug:
- Menghasilkan `seoTitle` (ringkas, berbobot keyword).
- Menghasilkan `seoDescription` (140–155 karakter dengan ajakan bertindak).
- Menghasilkan data schema `BreadcrumbList` dan `TechArticle` / `APIReference` JSON-LD.

### B. Komponen Injeksi Schema JSON-LD ([`src/components/doc/DocsJsonLd.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsJsonLd.tsx))
Merender script `<script type="application/ld+json">` yang valid W3C/Google untuk:
- Menampilkan jejak remah roti (`wahide.id > docs > messaging > send-text`) di halaman pencarian Google.
- Memberitahu Googlebot bahwa konten adalah dokumentasi API resmi (*API Reference*).

### C. Refaktor `src/app/docs/layout.tsx`
- Memperbarui title template menjadi `%s | Wahide API`.
- Menambahkan metadata robots komprehensif (`index: true`, `follow: true`, `googleBot: { "max-snippet": -1, ... }`).
- Menetapkan OpenGraph default dan Twitter Card metadata.

### D. Refaktor `src/app/docs/[...slug]/page.tsx`
- Menggunakan `getDocSeoMetadata()` pada `generateMetadata()`.
- Menambahkan `alternates: { canonical: ... }`.
- Memasang `<DocsJsonLd />` di dalam page body.

### E. Integrasi Sitemap XML ([`src/app/sitemap.ts`](file:///G:/WEB2026/fontwahide/src/app/sitemap.ts))
- Mengimpor `allDocs` dari `@/components/doc/data`.
- Menambahkan seluruh URL `/docs/*` ke dalam daftar sitemap resmi dengan prioritas tinggi (`priority: 0.9`, `changeFrequency: "weekly"`).

---

## 4. Rencana Verifikasi

1. **Type Safety**:
   - Menjalankan `bun x tsc --noEmit` untuk memastikan 100% bebas dari error TypeScript.
   - *(Aturan ditaati penuh: `bun run build` TIDAK PERNAH dijalankan)*.
2. **Validasi Karakter & Schema**:
   - Memastikan seluruh Title tag berada dalam rentang **40–55 karakter**.
   - Memastikan Meta Description berada dalam rentang **140–155 karakter**.
   - Memastikan struktur JSON-LD lolos standar validator Schema.org / Google Rich Results.
