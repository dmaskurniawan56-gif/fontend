# Rencana UX/UI: Pembersihan AI Slop & Redesain Developer-First untuk Dokumentasi Wahide

Sebagai **UX/UI Design Expert & Technical Writer**, dokumen ini merinci audit kritis dan rencana refaktor untuk menghapus seluruh elemen **"AI Slop"** (gimmick visual murahan, taburan emoji berlebihan, copywriting marketing generatif) pada halaman **[`/docs/intro`](file:///G:/WEB2026/fontwahide/src/components/doc/data/intro.ts)** dan seluruh komponen dokumentasi pendukungnya.

Tujuan redesain ini adalah mengangkat derajat dokumentasi Wahide menjadi portal developer berkelas enterprise yang setara dengan **Stripe**, **Meta WhatsApp Cloud API**, dan **Docusaurus / Whatspie resmi** — bersih, berwibawa, fungsional, dan ramah pengembang (*developer-first*).

---

## 1. Identifikasi & Audit "AI Slop" Saat Ini

Berikut adalah temuan elemen AI Slop yang terdeteksi dan akan dieliminasi total:

| Kategori | AI Slop Saat Ini | Dampak UX/UI Buruk | Solusi Standar Developer (Stripe/Whatspie) |
|:---|:---|:---|:---|
| **Emoji Clutter** | `🌐`, `🔐`, `📋`, `💻`, `📤`, `⚠️`, `🔍`, `📑`, `⚡`, `🛡️`, `🎲`, `🧩`, `✅`, `❌` tersebar di setiap judul & tabel. | Mengurangi kredibilitas teknis; terlihat seperti template prompt ChatGPT murahan. | Hapus semua emoji dari heading teknis. Gunakan SVG icon semantik monokrom / badge teks bersih (`Required`, `Optional`). |
| **Gimmick Visual "Sparkles"** | Banner gradasi pelangi hijau-teal dengan ikon `<Sparkles />` di atas halaman teknis. | Mengaburkan konten inti dengan dekorasi marketing yang tidak relevan bagi developer. | Hapus banner sparkle. Ganti dengan callout monokrom bergaris tipis atau blok spesifikasi arsitektur murni. |
| **Marketing Copywriting** | *"Enterprise-grade, 99.9% delivery rates, seamless developer experience, defensive mechanisms..."* | Teks menggelembung (*fluff*) tanpa informasi teknis riil yang dicari programmer. | Tulis ulang menjadi fakta teknis konkret: format protokol (HTTPS JSON), konvensi nomor E.164, status kode, dan autentikasi. |
| **TOC Sidebar Kanan** | `<span>📑</span> On this page` | Tidak profesional. | `On this page` dengan tipografi monospaced/uppercase bersih `text-xs font-semibold text-muted-foreground`. |
| **Badge Parameter** | `<span>✅</span> Yes` / `<span>❌</span> Optional` | Terlalu mencolok dan kekanak-kanakan. | Badge mikro berstandar: `Required` (badge hijau lembut) dan `Optional` (badge abu-abu netral). |

---

## 2. Rencana Redesain Halaman `/docs/intro`

Halaman `http://localhost:3000/docs/intro` akan ditulis ulang secara total dengan struktur dokumentasi teknis modern:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Home / Docs / Getting Started / Introduction                                          │
│                                                                                        │
│  Introduction                                                                          │
│  The Wahide REST API provides programmatic access to WhatsApp Multi-Device features,  │
│  allowing developers to send messages, manage contacts, and orchestrate campaigns.    │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Base URL: https://api.wahide.com/api/v1                           [Copy URL]     │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  Core Architectural Principles                                                         │
│  • Protocol: HTTPS / REST over TLS 1.3                                                 │
│  • Data Format: UTF-8 encoded application/json                                         │
│  • Phone Format: International E.164 without '+' (e.g. 628123456789)                   │
│  • Authentication: Bearer Token / API Key                                              │
│                                                                                        │
│  Quickstart: Sending Your First Message                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ cURL | request.sh                                                    [Copy]      │  │
│  │ curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \                  │  │
│  │   -H "Authorization: Bearer YOUR_API_KEY" \                                      │  │
│  │   -H "Content-Type: application/json" \                                          │  │
│  │   -d '{"phone": "628123456789", "message": "Hello from Wahide!"}'                │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  Explore Core Capabilities                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │ 🔑 Authentication       │  │ 💬 Messaging Engine     │  │ 📱 Device Management   │ │
│  │ Secure your API calls   │  │ Single, bulk & round-   │  │ Session lifecycle and   │ │
│  │ with tenant keys.       │  │ robin rotation.         │  │ QR pairing code.       │ │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Berkas yang Akan Direfaktorisasi

### A. Data & Copywriting
1. **[`src/components/doc/data/intro.ts`](file:///G:/WEB2026/fontwahide/src/components/doc/data/intro.ts)**:
   - Hapus teks marketing AI slop (`99.9% delivery rate`, `Enterprise ready`, emoji roket & petir).
   - Tulis ulang konten berbasis fakta teknis pengembang (Base URL, Protocol, Phone standard E.164, Quickstart bersih).
   - Hapus properti `bannerNotice` yang bergaya sparkle marketing.

2. **Data Endpoint & Guides Lainnya** (`authentication.ts`, `errors.ts`, `messaging.ts`):
   - Bersihkan dari judul beraura AI slop.
   - Ganti teks contoh pesan `"Hello from Wahide WhatsApp API! 🚀"` menjadi `"Order #INV-2026 has been processed."`.

### B. Komponen Presentation Layer
1. **[`DocsGuideView.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsGuideView.tsx)**:
   - Hapus banner gradasi sparkle AI slop (`bg-gradient-to-r`, `<Sparkles />`).
   - Sederhanakan callout menjadi kotak notifikasi teknis bersudut rapi dengan ikon monokrom `Info`, `AlertCircle`, atau `CheckCircle`.
   - Tambahkan kartu tautan "Next Steps" di bagian bawah.

2. **[`DocsEndpointView.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsEndpointView.tsx)**:
   - Hapus emoji di semua heading:
     - `🌐 HTTP Endpoint` → `Endpoint`
     - `🔐 Authentication` → `Authentication`
     - `📋 Request Parameters` → `Request Parameters`
     - `💻 Code Examples` → `Code Examples`
     - `📤 Response Formats` → `Responses`
     - `⚠️ Error Handling Matrix` → `Error Codes`
   - Hapus banner gradasi sparkle jika ada, ganti dengan badge informasi ringkas jika relevan.

3. **[`DocsParametersTable.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsParametersTable.tsx)**:
   - Hapus `<span>✅</span> Yes` → Ganti dengan badge teks elegan: `<span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px]">Required</span>`.
   - Hapus `<span>❌</span> Optional` → Ganti dengan: `<span className="font-normal text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded text-[11px]">Optional</span>`.
   - Hapus icon emoji `📋` pada judul tabel.

4. **[`DocsResponseView.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsResponseView.tsx)**:
   - Hapus emoji `📤` pada judul Responses.
   - Hapus emoji `🔍` pada judul Response Attributes Breakdown.

5. **[`DocsTableOfContents.tsx`](file:///G:/WEB2026/fontwahide/src/components/doc/DocsTableOfContents.tsx)**:
   - Hapus emoji `📑` dari `On this page`.
   - Desain tipografi minimalis: `text-[11px] font-bold uppercase tracking-wider text-muted-foreground`.

---

## 4. Rencana Verifikasi

1. **TypeScript Typecheck**:
   - Jalankan `bun x tsc --noEmit` untuk memastikan 100% type-safe (tanpa pernah menjalankan `bun run build`).
2. **Inspeksi Visual UI/UX di Browser**:
   - Buka `http://localhost:3000/docs/intro`.
   - Pastikan halaman terlihat tenang (*calm*), bersih (*clean*), berwibawa (*authoritative*), dan terbebas dari seluruh taburan emoji atau kartu sparkle murahan.
   - Pastikan keterbacaan tipografi dan kontras Dark/Light mode tetap tajam dan nyaman di mata developer.
