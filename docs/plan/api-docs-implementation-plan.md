# Rencana Implementasi: Update robots.txt, Dinamisasi Base URL dari `NEXT_PUBLIC_API_BASE_URL`, dan Pengisian Penuh Seluruh Contoh Kode (cURL, Node.js, PHP, Python, Go)

Dokumen ini merancang perbaikan menyeluruh terhadap 3 kebutuhan teknis yang diminta oleh pengguna:
1. **Pembaruan `robots.txt`**: Memberikan izin perayapan (*allow*) bagi Googlebot dan web crawler ke rute `/docs` dan `/docs/*`.
2. **Dinamisasi Base URL**: Mengambil Base URL endpoint dan contoh kode langsung dari variabel lingkungan `NEXT_PUBLIC_API_BASE_URL` (bukan hardcode `api.wahide.com`), sehingga otomatis menyesuaikan antara lokal (`http://localhost:3030/api/v1`) dan produksi.
3. **Pengisian Penuh Contoh Kode 5 Bahasa**: Mengeliminasi seluruh komentar kosong (`// Pair device in Python`, dll.) dan menggantinya dengan kode program lengkap, idiomatik, dan siap jalan (*copy-paste ready*) untuk **cURL**, **Node.js**, **PHP**, **Python**, dan **Go** di seluruh 19+ endpoint API.

---

## 1. Rencana Pembaruan `robots.txt` ([`src/app/robots.ts`](file:///G:/WEB2026/fontwahide/src/app/robots.ts))

### Kondisi Saat Ini
```typescript
allow: ["/", "/about", "/contact", "/blog", "/privacy", "/terms"],
```
Rute `/docs` dan `/docs/*` belum terdaftar di dalam daftar `allow`, sehingga ada risiko bot mengabaikan dokumentasi atau menganggapnya sebagai rute private.

### Solusi Perbaikan
Menambahkan `/docs` dan `/docs/*` secara eksplisit ke dalam aturan `allow`:
```typescript
allow: [
  "/",
  "/about",
  "/contact",
  "/blog",
  "/blog/*",
  "/docs",
  "/docs/*",
  "/privacy",
  "/terms"
],
```

---

## 2. Dinamisasi Base URL dari `NEXT_PUBLIC_API_BASE_URL`

### Kondisi Saat Ini
Komponen `DocsEndpointView.tsx` dan cuplikan kode masih memuat domain hardcode `https://api.wahide.com`. Padahal di `.env.local` dan `env.ts`:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:3030/api/v1"
```

### Solusi Perbaikan
1. **Helper Utility**: Mengambil host/origin dari `env.NEXT_PUBLIC_API_BASE_URL` (contoh: `http://localhost:3030` saat di lokal, atau `https://api.wahide.com` saat di server produksi).
2. **Endpoint Box ([`DocsEndpointView.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsEndpointView.tsx))**:
   - Menampilkan host dinamis yang bersumber dari `NEXT_PUBLIC_API_BASE_URL`.
   - Tombol "Copy URL" menyalin URL dinamis lengkap yang sesuai dengan environment aktif.
3. **Dinamisasi Cuplikan Kode ([`DocsCodeTabs.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsCodeTabs.tsx))**:
   - Menyisipkan base URL aktif ke dalam seluruh template kode cURL, Node.js, PHP, Python, dan Go secara otomatis.

---

## 3. Penulisan Ulang Seluruh Contoh Kode yang Kosong / Placeholder

Berdasarkan audit, terdapat placeholder komentar kosong seperti `// Pair device in Python`, `// Create contact in Node.js`, dll. di beberapa file data endpoint. Seluruhnya akan diganti dengan **kode program nyata yang dapat langsung dieksekusi**:

### Standar Kualitas Kode Per Bahasa:

| Bahasa | Library / Runtime Standar | Fitur Kode yang Disajikan |
|:---|:---|:---|
| **cURL** | Bash / Terminal | Flag `-X`, `-H "Authorization: Bearer YOUR_API_KEY"`, `-H "Content-Type: application/json"`, `-d '{...}'`. |
| **Node.js** | Modern ES Module / `axios` & `fetch` | Async/await, headers bearer token, payload JSON parsing, dan `console.log(response.data)`. |
| **PHP** | Native `curl_init` / Guzzle | Inisialisasi cURL lengkap dengan `CURLOPT_POSTFIELDS`, `CURLOPT_HTTPHEADER`, error check, dan `curl_close`. |
| **Python** | Library `requests` | Sintaks Python murni menggunakan `import requests`, `headers={"Authorization": "Bearer ..."}`, `json={...}`, dan `print(response.json())`. |
| **Go** | Package `net/http` murni | `package main`, `http.NewRequest`, buffer JSON `bytes.NewBuffer`, `req.Header.Set`, client execution, dan `io.ReadAll`. |

### Daftar Berkas Endpoint yang Akan Dilengkapi 100%:
1. **[`devices.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/devices.ts)**:
   - `devices-list`: Kode cURL, Node.js, PHP, Python, Go lengkap dengan parameter query `page` & `size`.
   - `devices-create`: Kode lengkap untuk mendaftarkan slot device baru dengan `push_name`.
   - `devices-pair`: Kode lengkap untuk meminta QR Code pairing (memperbaiki screenshot pengguna!).
   - `devices-disconnect`: Kode lengkap untuk memutus sesi WhatsApp session.
   - `devices-delete`: Kode lengkap `DELETE` request untuk menghapus slot device.
2. **[`contacts.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/contacts.ts)**:
   - `contacts-list`: Kode lengkap filter kontak dan pagination.
   - `contacts-create`: Kode lengkap pembuatan kontak dengan nama, nomor, dan tag.
   - `contacts-bulk-import`: Kode lengkap batch import array kontak.
   - `contacts-bulk-delete`: Kode lengkap batch delete array ID kontak.
   - `contacts-tags`: Kode lengkap pengambilan daftar tag.
3. **[`campaigns.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/campaigns.ts)**:
   - `campaigns-list`: Kode lengkap daftar broadcast campaign.
   - `campaigns-create`: Kode lengkap pembuatan broadcast queue.
   - `campaigns-start`: Kode lengkap memicu start campaign.
   - `campaigns-pause`: Kode lengkap pause campaign.
   - `campaigns-logs`: Kode lengkap pengambilan log delivery broadcast.
4. **[`messaging.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/messaging.ts)**:
   - `messaging-round-robin`, `messaging-spintax`, `messaging-media`, `messaging-meta-cloud`: Lengkapi seluruh 5 bahasa tanpa ada satu pun yang hanya berupa baris komentar.

---

## 4. Rencana Verifikasi

1. **Type Safety**:
   - Menjalankan `bun x tsc --noEmit` untuk menjamin tidak ada kesalahan sintaks TypeScript maupun escaping tanda kutip (*backticks*).
   - *(Aturan mutlak: `bun run build` TIDAK AKAN PERNAH dijalankan)*.
2. **Verifikasi Tampilan UI**:
   - Membuka halaman `http://localhost:3000/docs/devices/pair`.
   - Memeriksa tab **Python**: memastikan yang muncul adalah script Python `import requests` asli, bukan lagi teks komentar `// Pair device in Python`.
   - Memeriksa tab **PHP**, **Node.js**, dan **Go**: memastikan semua terisi kode lengkap.
   - Memeriksa Base URL pada endpoint bar dan kode: memastikan mengambil nilai dari `NEXT_PUBLIC_API_BASE_URL` (`http://localhost:3030`).
3. **Verifikasi `robots.txt`**:
   - Membuka `http://localhost:3000/robots.txt` dan memastikan direktori `/docs` dan `/docs/*` terdaftar di bagian `Allow`.
