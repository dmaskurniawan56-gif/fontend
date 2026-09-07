# Walkthrough: Pembaruan robots.txt, Dynamic Base URL, dan Kode Contoh Lengkap 5 Bahasa

Pembaruan teknis untuk dokumentasi API Wahide telah selesai diimplementasikan secara menyeluruh dengan pengujian tipe data 100% lulus (`bun x tsc --noEmit` exit code 0) dan kepatuhan penuh terhadap instruksi (**perintah `bun run build` tidak pernah dijalankan**).

---

## 1. Ringkasan Perubahan Utama

### A. Update `robots.txt` (Pengindeksan Googlebot Terbuka untuk Docs & Blog)
- **Berkas**: [`src/app/robots.ts`](file:///G:/WEB2026/fontwahide/src/app/robots.ts)
- **Status**: Berhasil ditambahkan arahan izin crawling Googlebot dengan `userAgent: "*"`:
  - `Allow: /docs`
  - `Allow: /docs/*`
  - `Allow: /blog`
  - `Allow: /blog/*`
- **Verifikasi HTTP Live**:
  ```http
  GET http://localhost:3000/robots.txt -> 200 OK
  User-Agent: *
  Allow: /
  Allow: /about
  Allow: /contact
  Allow: /blog
  Allow: /blog/*
  Allow: /docs
  Allow: /docs/*
  Allow: /privacy
  Allow: /terms
  ```

---

### B. Dynamic API Base URL dari `NEXT_PUBLIC_API_BASE_URL`
- **Berkas Dibuat**: [`src/components/doc/data/env.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/env.ts)
- **Fungsi**:
  - `getApiBaseUrl()`: Membaca `process.env.NEXT_PUBLIC_API_BASE_URL` (pada `.env.local`: `http://localhost:3030/api/v1`) dengan fallback aman ke `http://localhost:3030/api/v1`.
  - `getApiHost()`: Mengekstrak origin host (`http://localhost:3030` di dev, atau `https://api.wahide.com` di prod).
- **Integrasi Komponen UI**:
  - [`DocsEndpointView.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsEndpointView.tsx): Menampilkan dan menyalin URL endpoint HTTP secara dinamis menggunakan `{apiHost}` dan `fullUrl = ${apiHost}${doc.path}`.
  - [`DocsCodeTabs.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsCodeTabs.tsx): Menginterpolasi `https://api.wahide.com` pada setiap tab bahasa secara reaktif menjadi URL host aktif saat tombol copy atau tampilan kode dirender.
  - [`DocsGuideView.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsGuideView.tsx): Menginterpolasi base URL dan host aktif pada callout panduan dan code box cuplikan quickstart cURL.
  - [`intro.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/intro.ts): Memperjelas informasi base URL dinamis dari `NEXT_PUBLIC_API_BASE_URL`.

---

### C. Pembuatan Kode Contoh Lengkap 5 Bahasa (Zero Placeholder)
Seluruh komentar placeholder (seperti `// Pair device in Python`, `// List devices in Go`, dll.) telah diganti dengan kode nyata, fungsional, dan idiomatik untuk **5 bahasa**:
1. **cURL**: Lengkap dengan flag `-X`, header `Authorization: Bearer YOUR_API_KEY`, `Content-Type: application/json`, dan flag `-d` payload JSON.
2. **Node.js**: Menggunakan modern ES Modules `axios` dengan `async/await`, config headers, dan query params.
3. **PHP**: Menggunakan native `curl_init()`, `curl_setopt_array()`, `json_encode()`, `curl_exec()`, dan `curl_close()` tanpa dependensi eksternal.
4. **Python**: Menggunakan pustaka standar `requests` dengan header dict, `json=payload`, dan `print(response.json())`.
5. **Go**: Menggunakan pustaka standar `net/http`, `bytes.NewBuffer(jsonData)`, `encoding/json`, `http.NewRequest()`, dan `client.Do(req)`.

#### Rincian Modul yang Diperbarui:
- **`src/components/doc/data/devices.ts`**:
  - `devices-list` (`GET /api/v1/wa/devices`): 5 bahasa lengkap dengan pagination query (`page`, `size`).
  - `devices-create` (`POST /api/v1/wa/devices`): 5 bahasa lengkap dengan payload `push_name`.
  - `devices-pair` (`POST /api/v1/wa/devices/{deviceId}/pair`): 5 bahasa lengkap dengan penanganan URL parameter `deviceId`.
  - `devices-disconnect` (`POST /api/v1/wa/devices/{deviceId}/disconnect`): 5 bahasa lengkap.
  - `devices-delete` (`DELETE /api/v1/wa/devices/{deviceId}`): 5 bahasa lengkap menggunakan HTTP method `DELETE`.
- **`src/components/doc/data/contacts.ts`**:
  - `contacts-list` (`GET /api/v1/contacts`): 5 bahasa lengkap dengan filtering `search` dan `size`.
  - `contacts-create` (`POST /api/v1/contacts`): 5 bahasa lengkap dengan atribut kontak (`name`, `phone`, `tags`).
  - `contacts-bulk-import` (`POST /api/v1/contacts/bulk`): 5 bahasa lengkap dengan batch array 5.000 kontak.
  - `contacts-bulk-delete` (`POST /api/v1/contacts/bulk-delete`): 5 bahasa lengkap dengan array ID ULID.
  - `contacts-tags` (`GET /api/v1/contacts/tags`): 5 bahasa lengkap.
- **`src/components/doc/data/campaigns.ts`**:
  - `campaigns-list` (`GET /api/v1/campaigns`): 5 bahasa lengkap dengan filter status broadcast.
  - `campaigns-create` (`POST /api/v1/campaigns`): 5 bahasa lengkap dengan parameter Spintax, tag targeting, dan jitter delay anti-ban (`min_delay_seconds`, `max_delay_seconds`).
  - `campaigns-start` (`POST /api/v1/campaigns/{campaignId}/start`): 5 bahasa lengkap pemicu antrean Redis Streams.
  - `campaigns-pause` (`POST /api/v1/campaigns/{campaignId}/pause`): 5 bahasa lengkap.
  - `campaigns-logs` (`GET /api/v1/campaigns/logs`): 5 bahasa lengkap untuk audit pengiriman pesan.
- **`src/components/doc/data/messaging.ts`**:
  - `messaging-send-text` (`POST /api/v1/wa/messages/send`): 5 bahasa lengkap dengan simulasi typing.
  - `messaging-round-robin` (`POST /api/v1/wa/messages/send`): 5 bahasa lengkap dengan `device_id: "auto"`.
  - `messaging-spintax` (`POST /api/v1/wa/messages/send`): 5 bahasa lengkap dengan sintaks spintax `{Hello|Hi|Greetings}`.
  - `messaging-media` (`POST /api/v1/wa/messages/send`): 5 bahasa lengkap dengan pengiriman file PDF/dokumen (`media_url`, `filename`, `caption`).
  - `messaging-meta-cloud` (`POST /api/v1/v18.0/{deviceId}/messages`): 5 bahasa lengkap dengan format kompatibel Meta Cloud API v18.0.

---

### D. Redireksi Bagian "Developer First & REST API" Landing Page ke Docs API
- **Berkas**: [`src/components/home/ApiCodeSandbox.tsx`](file:///G:/WEB2026/fontwahide/src/components/home/ApiCodeSandbox.tsx)
- **Status**: Tautan eksternal lama ke Postman telah diganti dengan navigasi internal Next.js `<Link href="/docs/intro">`:
  - **Badge `</> Developer First & REST API`**: Kini berupa `<Link href="/docs/intro">` interaktif dengan efek hover.
  - **Tombol `Buka Dokumentasi REST API`**: Menggunakan `<Link href="/docs/intro">` yang langsung membuka panduan resmi WhatsApp REST API internal.
- **Berkas Terkait**: [`src/components/layout/public/PublicFooter.tsx`](file:///G:/WEB2026/fontwahide/src/components/layout/public/PublicFooter.tsx)
  - Menggantikan tautan lama Postman dengan tautan resmi "Buka Dokumentasi REST API" (`/docs/intro`). Seluruh tautan eksternal ke Postman telah dihapus total dari kode sumber dan kamus i18n (`common.json`).

---

## 2. Hasil Verifikasi & Uji Sistem

1. **Type Checking TypeScript**:
   ```bash
   bun x tsc --noEmit
   # Exit code: 0 (0 error across entire project)
   ```
2. **Kepatuhan Larangan Build**:
   - `bun run build` **TIDAK PERNAH dijalankan**.
3. **Uji Live Server Dev**:
   - `GET /robots.txt` -> **200 OK** (memuat `Allow: /docs` & `Allow: /docs/*`).
   - `GET /docs/devices/pair` -> **200 OK** (kode contoh cURL, Node.js, PHP, Python, Go tampil utuh tanpa placeholder).
   - `GET /` -> Tombol & badge "Developer First & REST API" berhasil terhubung ke `/docs/intro`.

