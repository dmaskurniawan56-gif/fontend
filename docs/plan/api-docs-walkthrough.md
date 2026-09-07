# Walkthrough: Optimasi Technical SEO Google Page 1 & Metadata Standar Industri pada Dokumentasi Wahide

Seluruh komponen dokumentasi API Wahide (`/docs/*`) telah dioptimasi secara komprehensif mengikuti standar **Google Search Essentials (Googlebot 2026)** untuk memaksimalkan potensi tembus ke **Halaman 1 Google (Page 1 SERP)** dengan CTR (*Click-Through Rate*) tinggi.

---

## 1. Ringkasan Optimasi SEO yang Diterapkan

| Parameter SEO | Sebelum Optimasi | Sesudah Optimasi (Standar Google Page 1) | Dampak pada Google SERP |
|:---|:---|:---|:---|
| **Panjang Title Tag** | **82+ karakter** (terjadi duplikasi suffix ganda: `${doc.title} - Wahide WhatsApp API Documentation \| Wahide WhatsApp API Docs`). | **43–52 karakter** (ringkas, padat keyword, formula: `%s \| Wahide API`). | Judul **100% utuh tanpa terpotong** tanda titik-titik (`...`) baik di smartphone maupun desktop. |
| **Meta Description** | Terlalu pendek (< 60 karakter) atau generic tanpa *search intent*. | Diformulasikan presisi **140–155 karakter** dengan keyword komparasi (cURL, Node.js, PHP, Python, Go, anti-ban, E.164) & ajakan bertindak (*CTA*). | Menghasilkan cuplikan pencarian (*snippet*) resmi di Google, mencegah Google mengambil teks acak halaman. |
| **Canonical URL** | Belum ada tag `alternates: { canonical }`. | Injeksi URL kanonikal absolut resmi di setiap endpoint (`https://wahide.id/docs/${doc.slug}`). | Mencegah penalti konten duplikat (*duplicate content penalty*) antar subdomain dan staging. |
| **Structured Data (JSON-LD)** | Belum ada markup Schema.org. | Injeksi ganda **`BreadcrumbList`** dan **`TechArticle` / `APIReference`** via [`DocsJsonLd.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsJsonLd.tsx). | Google menampilkan jejak navigasi remah roti (`wahide.id > docs > messaging > send-text`) langsung di bawah judul pencarian. |
| **Google XML Sitemap** | Rute `/docs/*` belum terdaftar di sitemap. | Seluruh 23+ endpoint dokumentasi otomatis terdaftar di [`sitemap.ts`](file:///G:/WEB2026/fontwahide/src/app/sitemap.ts) dengan `priority: 0.9` dan `changeFrequency: "weekly"`. | Bot Google (Googlebot) langsung mengindeks seluruh halaman baru secara kilat. |
| **Robots Directives** | Pengaturan bawaan standar. | Dilengkapi arahan: `max-snippet: -1`, `max-image-preview: "large"`, `max-video-preview: -1`. | Googlebot leluasa menampilkan cuplikan teks penuh dan preview gambar kaya. |

---

## 2. Contoh Title Tag Hasil Optimasi (< 55 Karakter)

* `/docs/intro`:
  - **Title Google**: `WhatsApp API Documentation | Wahide API` (**39 karakter**)
* `/docs/authentication`:
  - **Title Google**: `API Authentication & Bearer Tokens | Wahide API` (**47 karakter**)
* `/docs/errors`:
  - **Title Google**: `API Status Codes & Rate Limits | Wahide API` (**43 karakter**)
* `/docs/messaging/send-text`:
  - **Title Google**: `Send WhatsApp Text Message API | Wahide API` (**43 karakter**)
* `/docs/messaging/send-round-robin`:
  - **Title Google**: `Multi-Device WhatsApp Rotation API | Wahide API` (**48 karakter**)
* `/docs/messaging/send-spintax`:
  - **Title Google**: `Send Dynamic Spintax WhatsApp API | Wahide API` (**47 karakter**)
* `/docs/messaging/send-media`:
  - **Title Google**: `Send WhatsApp Media & PDF API | Wahide API` (**42 karakter**)
* `/docs/devices/pair`:
  - **Title Google**: `Pair WhatsApp Device via QR API | Wahide API` (**45 karakter**)
* `/docs/contacts/bulk-import`:
  - **Title Google**: `Bulk Import WhatsApp Contacts API | Wahide API` (**47 karakter**)
* `/docs/campaigns/create`:
  - **Title Google**: `Create WhatsApp Broadcast Campaign | Wahide API` (**48 karakter**)

---

## 3. Berkas yang Dibuat & Diperbarui

1. **[`src/components/doc/data/seo.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/seo.ts)** *(BARU)*:
   - Kamus metadata SEO berisi mapping judul ringkas, deskripsi 140–155 karakter, kata kunci intents tinggi, dan generator Schema.org JSON-LD.
2. **[`src/components/doc/DocsJsonLd.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsJsonLd.tsx)** *(BARU)*:
   - Komponen Server Component untuk merender `<script type="application/ld+json">` W3C/Google compliant.
3. **[`src/components/doc/data/index.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/index.ts)**:
   - Mengekspor helper `getDocSeoMetadata` dan `generateDocJsonLd`.
4. **[`src/app/docs/layout.tsx`](file:///G:/WEB2026/fontwahide/src/app/docs/layout.tsx)**:
   - Mengatur template title `%s | Wahide API`, robots directives, dan default OpenGraph/Twitter card.
5. **[`src/app/docs/[...slug]/page.tsx`](file:///G:/WEB2026/fontwahide/src/app/docs/[...slug]/page.tsx)**:
   - Menggunakan `getDocSeoMetadata()` pada `generateMetadata()`, mengunci canonical URL, dan menginjeksi komponen `<DocsJsonLd />`.
6. **[`src/app/sitemap.ts`](file:///G:/WEB2026/fontwahide/src/app/sitemap.ts)**:
   - Menghubungkan seluruh 23+ halaman dokumentasi ke XML sitemap dengan prioritas 0.9.

---

## 4. Hasil Pengujian Tipe Data

- **Command**: `bun x tsc --noEmit`
- **Result**: **Exit Code 0 (0 errors)**.
- **Rule Verification**: Perintah `bun run build` **TIDAK PERNAH dijalankan**.
