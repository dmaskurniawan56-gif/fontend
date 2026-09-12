# Panduan Arsitektur Frontend & Aturan Coding AI (Wahide Frontend)

Dokumen ini adalah **pedoman resmi dan acuan tunggal (*single source of truth*)** arsitektur, struktur folder, konvensi penamaan, standar desain, dan aturan pemrograman untuk seluruh AI Agent (Antigravity, Gemini, Claude) maupun developer manusia yang berkontribusi pada repository `fontwahide`.

---

## 1. Ringkasan & Filosofi Proyek

Aplikasi frontend `fontwahide` adalah antarmuka web SaaS B2B (*Business-to-Business*) modern untuk platform **Wahide Enterprise WhatsApp Gateway, Marketing & Business Automation**.

### Prinsip Utama:
1. **Modular Monolith (Domain-Driven):** Setiap fitur bisnis berdiri mandiri di dalam folder modulnya masing-masing dengan antarmuka yang jelas.
2. **Thin App Router:** Folder `src/app/` hanya berfungsi sebagai router tipis, penanggung jawab rute, metadata SEO, dan penjaga izin akses (*route guards*). Seluruh logika bisnis berada di `src/modules/`.
3. **Desain Aksesibel & Resik (Clean UX):** Menggunakan desain semantik modern, dukungan penuh mode Gelap (*Dark*) & Terang (*Light*), responsif dari layar smartphone hingga monitor ultrawide.
4. **Keamanan & Performa Tinggi:** Validasi input ketat (Zod), penanganan error elegan (*graceful failure*), dan pencegahan masalah tata letak (*layout shifts* / *overflow clipping*).

---

## 2. Tech Stack & Ekosistem

| Lapisan / Kebutuhan | Teknologi & Versi | Catatan Penggunaan |
| :--- | :--- | :--- |
| **Runtime & Package Manager** | **Bun** (`bun@1.4.0`) | Eksekutor perintah dan manajemen paket super cepat. |
| **Framework Web** | **Next.js 16** (`next@16.3.3`) | App Router, Turbopack bundler, Streaming SSR. |
| **UI Library Dasar** | **React 19** (`react@19.2.8`) | React Server Components (RSC) + Client Components. |
| **Styling & CSS** | **Tailwind CSS v4** (`@tailwindcss/postcss@^4`) | CSS Variables, design tokens, utility classes. |
| **Theme Management** | **next-themes** (`^0.4.6`) | Toggle otomatis tema gelap/terang berbasis class `.dark`. |
| **UI Primitives & Headless** | **Base UI** (`@base-ui/react`) & **shadcn/ui** | Dropdown, Dialog, Tabs, Popover, Card. |
| **Ikonografi** | **lucide-react** (`^1.37.0`) | Ikon SVG konsisten dengan ukuran standar (`size-3.5`, `size-4`, `size-5`). |
| **State Management** | **Zustand 5** (`zustand@^5.0.15`) | Global auth store (`useAuth`), tenant session, dan cache UI. |
| **Skema & Validasi** | **Zod 4** (`zod@^4.5.4`) | Validasi form request dan kontrak respons API. |
| **Notifikasi / Toast** | **Sonner** (`sonner@^2.0.8`) | Micro-feedback interaktif (`toast.success`, `toast.error`, `toast.info`). |
| **Internasionalisasi (i18n)** | **Custom Context Engine** (`@/lib/i18n`) | Multi-bahasa dinamis (Bahasa Indonesia `id` & English `en`). |
| **Tabel & Virtualisasi** | **@tanstack/react-virtual** (`^3.14.10`) | Render antrean data besar (kontak, pesan, log) tanpa lag. |

---

## 3. Struktur Folder & Anatomi Berkas

Struktur direktori diatur secara hierarkis dan terstruktur rapi di dalam `src/`:

```
fontwahide/
├── doc/                            # Dokumentasi arsitektur & rencana teknis
│   ├── plan/                       # Dokumen perencanaan fitur (implementation plans)
│   └── frontend-architecture-guidelines.md # File panduan ini
├── public/                         # Asset statis publik (logo, gambar ilustrasi)
└── src/
    ├── app/                        # Next.js 16 App Router (Rute & Halaman Tipis)
    │   ├── (auth)/                 # Rute autentikasi (login, register, forgot-password)
    │   ├── (dashboard)/            # Rute dasbor bisnis (reminders, reservations, campaigns, dll.)
    │   ├── (public)/               # Halaman publik (landing page, pricing, solutions)
    │   ├── admin/                  # Rute super-admin sistem
    │   ├── docs/                   # Portal dokumentasi panduan pengguna
    │   ├── globals.css             # Konfigurasi Tailwind v4 & Design Tokens CSS
    │   ├── layout.tsx              # Root HTML Layout & Providers
    │   └── providers.tsx           # ThemeProvider, I18nProvider, Toaster
    ├── components/                 # Komponen Bersama Lintas Modul
    │   ├── ui/                     # Komponen primitif shadcn/ui (Button, Card, Input, Dialog, dll.)
    │   ├── shared/                 # Widget fungsional bersama (CountryCodeSelector, PhoneWarning, dll.)
    │   └── layout/                 # Layout shell (DashboardSidebar, Header, MobileNav, Guards)
    ├── hooks/                      # Custom hooks utilitas global
    ├── lib/                        # Pustaka utilitas & helper murni
    │   ├── api/                    # Client HTTP fetch terpusat, base URL, auth interceptor
    │   ├── config/                 # Konfigurasi runtime & environment variables
    │   ├── countryCodes.ts         # Dataset 200+ negara, bendera, kode panggilan, auto-detect
    │   ├── phone.ts                # Validasi format E.164 & display formatting
    │   ├── storage/                # Cookie & LocalStorage abstractions (token JWT)
    │   └── utils.ts                # Helper `cn()` menggabungkan clsx dan tailwind-merge
    ├── locales/                    # Kamus terjemahan bahasa JSON
    │   ├── id/                     # Bahasa Indonesia (common.json, whatsapp.json, reminder.json, dll.)
    │   └── en/                     # Bahasa Inggris (struktur simetris dengan id/)
    └── modules/                    # Domain Bisnis Modular Monolith
        ├── admin/                  # Modul manajemen pengguna & sistem admin
        ├── campaign/               # Modul WhatsApp blast & kampanye massal
        ├── contact/                # Modul buku kontak & tag audiens
        ├── content/                # Modul broadcast & konten multimedia
        ├── finance/                # Modul saldo, faktur, dan top-up transaksi
        ├── form/                   # Modul formulir pendaftaran dinamis
        ├── iam/                    # Identity & Access Management (autentikasi & RBAC)
        ├── overview/               # Modul statistik & analitik dasbor utama
        ├── reminder/               # Modul pengingat otomatis & aturan drip follow-up
        ├── reservation/            # Modul jadwal reservasi & kalender janji temu
        ├── subscription/           # Modul paket langganan & kuota
        ├── support/                # Modul tiket bantuan CS
        ├── team/                   # Modul manajemen anggota tim & staf operator
        ├── template/               # Modul template pesan WhatsApp & spintax
        └── whatsapp/               # Modul WhatsApp gateway (QR connect, device manager, live chat)
```

---

## 4. Pola 5 Lapisan dalam Modul (`src/modules/<feature>/`)

Setiap fitur bisnis di `src/modules/<feature-name>/` **WAJIB** mengikuti arsitektur 5 lapisan berikut:

```
src/modules/<feature-name>/
├── api/          # 1. API Client Layer
├── components/   # 2. UI Component Layer
├── hooks/        # 3. State & Business Logic Layer
├── types/        # 4. Domain & DTO Types Layer
└── views/        # 5. Composite View Layer
```

### Rincian Tugas Tiap Lapisan:
1. **`types/<feature>.types.ts`:**
   - Mendefinisikan interface entitas data, enum status, request DTO, dan response DTO.
   - Contoh: `Reservation`, `ReservationStatus`, `CreateReservationInput`, `UpdateStatusInput`.
2. **`api/<feature>.api.ts`:**
   - Berisi fungsi-fungsi asynchronous murni untuk memanggil REST API backend menggunakan client terpusat `@/lib/api`.
   - Contoh: `fetchReservations()`, `createReservationApi()`, `deleteReservationApi()`.
3. **`hooks/use<Feature>.ts`:**
   - Mengelola state lokal/komponen (`useState`, `useEffect`, `useCallback`).
   - Mengatur pagination, filter pencarian, status loading, dan trigger toast notifikasi.
   - Menyediakan antarmuka bersih yang siap dikonsumsi oleh view.
4. **`components/`:**
   - Berisi komponen-komponen UI yang spesifik untuk fitur tersebut (misal: `<AddReservationForm>`, `<MonthlyCalendar>`, `<DailyAgendaList>`, `<DeleteReservationModal>`).
   - Komponen ini tidak melakukan direct fetch API sendiri, melainkan menerima props atau memanggil hook.
5. **`views/<Feature>View.tsx`:**
   - Menggabungkan hook dan seluruh komponen fitur menjadi satu halaman lengkap.
   - Ini adalah komponen utama yang akan diekspor dan dipasang pada rute App Router.

---

## 5. Pola Halaman Tipis (*Thin Page Pattern*)

Berkas rute di `src/app/(dashboard)/<route>/page.tsx` **TIDAK BOLEH** berisi logika bisnis yang panjang. File ini hanya bertugas:
1. Menentukan metadata SEO (`title`, `description`).
2. Menerapkan Route Guard (`<SellerRouteGuard>` atau `<AdminRouteGuard>`).
3. Me-render View dari modul terkait.

**Contoh Standar `src/app/(dashboard)/reservations/page.tsx`:**
```tsx
import type { Metadata } from "next";
import { ReservationsView } from "@/modules/reservation/views/ReservationsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Jadwal Reservasi WhatsApp",
  description: "Kelola reservasi janji temu dan jadwal pelanggan otomatis.",
};

export default function ReservationsPage() {
  return (
    <SellerRouteGuard>
      <ReservationsView />
    </SellerRouteGuard>
  );
}
```

---

## 6. Aturan Wajib & Larangan Keras untuk AI (*AI Hard Rules*)

Setiap AI coding assistant yang bekerja pada repositori ini **WAJIB MEMATUHI** aturan di bawah ini tanpa pengecualian:

### ⚠️ 1. LARANGAN KERAS: JANGAN JALANKAN `bun run build`
> [!CAUTION]
> **Dilarang keras mengeksekusi `bun run build` atau `next build`** di terminal saat sedang membantu user menyelesaikan tugas atau coding harian!
> - Proses build Next.js 16 memakan alokasi RAM dan CPU sangat tinggi, memicu hanging/interupsi proses, serta mematikan server dev aktif.
> - Verifikasi kode cukup dilakukan dengan membaca kode, static check, atau menjalankan file scratch audit jika diperlukan.

### 2. Arahan `"use client";`
Setiap file komponen atau hook yang menggunakan state (`useState`), effect (`useEffect`), ref (`useRef`), context (`useI18n`), event listener (`onClick`, `onChange`), atau akses window/document **WAJIB** menempatkan `"use client";` pada baris pertama file.

### 3. Pencegahan Jebakan CSS `overflow-hidden` (Popover & Dropdown Clipping)
> [!IMPORTANT]
> **Aturan Popover & Dropdown:**
> 1. **Dilarang memakai `overflow-hidden` pada wrapper input nomor WhatsApp:** Komponen pemilih negara ([`CountryCodeSelector`](file:///g:/WEB2026/fontwahide/src/components/shared/CountryCodeSelector.tsx)) memiliki menu dropdown melayang (`position: absolute; top: 100%`). Jika wrapper luar memiliki `h-9` atau `h-10` dengan `overflow-hidden`, menu dropdown akan terpotong paksa menjadi 36px/40px dan daftar negara tidak bisa di-scroll!
> 2. **Komponen `<Card>` shadcn/ui:** Komponen dasar `src/components/ui/card.tsx` memiliki class default `overflow-hidden`. Jika sebuah Card menampung input form dengan dropdown atau popover, **WAJIB menambahkan class `overflow-visible relative z-20`** pada `<Card className="... overflow-visible relative z-20">`. Class `overflow-visible` akan meng-override `overflow-hidden` melalui `tailwind-merge`.
> 3. **Sudut Melengkung (*Border Radius*) Input Komposit:**
>    - Prefiks / Selector kiri: `rounded-l-xl rounded-r-none`
>    - Input field kanan: `rounded-r-xl rounded-l-none`

### 4. Standar Input Nomor WhatsApp & Kode Negara
1. Selalu gunakan komponen terpadu:
   ```tsx
   import { CountryCodeSelector } from "@/components/shared/CountryCodeSelector";
   ```
   - Gunakan `variant="rounded"` untuk form dasbor/kartu standar.
   - Gunakan `variant="pill"` untuk form autentikasi berdesain kapsul.
2. Selalu sanitasi angka masukan pengguna dengan helper resmi:
   ```tsx
   import { sanitizeSubscriberInput } from "@/lib/countryCodes";
   // Otomatis membuang awalan 0, +, atau dialCode ganda
   const cleanSubscriber = sanitizeSubscriberInput(inputPhone, selectedCountry.dialCode);
   ```
3. Selalu validasi dan tampilkan micro-feedback format E.164:
   ```tsx
   import { isValidE164, formatDisplayPhone } from "@/lib/phone";
   ```

### 5. Aturan Multi-Bahasa (i18n)
1. **Dilarang meng-hardcode teks UI secara langsung di JSX**, baik dalam Bahasa Indonesia maupun Inggris.
2. Gunakan hook terjemahan:
   ```tsx
   import { useI18n } from "@/lib/i18n/context";
   const { t, locale } = useI18n();
   ```
3. Setiap kali menambahkan teks baru, **WAJIB** mendaftarkan kuncinya secara simetris di kedua berkas:
   - `src/locales/id/<namespace>.json`
   - `src/locales/en/<namespace>.json`

### 6. Standar Design Tokens (Tailwind v4)
Hindari menuliskan arbitrary hex code (seperti `#0f172a` atau `#10b981`) di class Tailwind. Selalu gunakan token semantik yang telah dikonfigurasi:
- **Latar Belakang:** `bg-background`, `bg-surface`, `bg-muted`, `bg-popover`.
- **Border:** `border-border`, `border-border/70`, `hover:border-foreground-muted`.
- **Tipografi:** `text-foreground` (utama), `text-foreground-secondary` (subjudul), `text-foreground-muted` (placeholder/keterangan).
- **Aksen Merek Wahide:** `bg-wise-green` (hijau neon khas), `text-dark-green` (kontras hijau tua), `border-wise-green`.
- **Status Warna:** `text-emerald-600` (sukses), `text-rose-600` / `border-rose-500` (error/bahaya), `text-amber-600` (peringatan), `text-blue-600` (info).

### 7. Feedback Interaktif & Error Handling
1. Gunakan **Sonner** untuk feedback aksi pengguna:
   ```tsx
   import { toast } from "sonner";
   toast.success(t("common.savedSuccessfully"));
   toast.error(t("common.errorOccurred"));
   ```
2. Sediakan indikator visual loading pada tombol submit (`disabled={isSubmitting}` dan ikon `<Loader2 className="size-3.5 animate-spin" />`).

---

## 7. Konvensi Penamaan Berkas & Simbol

| Kategori | Konvensi | Contoh |
| :--- | :--- | :--- |
| **Komponen React** | `PascalCase.tsx` | `QuickScheduleCard.tsx`, `MonthlyCalendar.tsx` |
| **Custom Hooks** | `camelCase.ts` (awalan `use`) | `useReservations.ts`, `useReminders.ts` |
| **API Client** | `<feature>.api.ts` | `reservation.api.ts`, `whatsapp.api.ts` |
| **Types / Kontrak** | `<feature>.types.ts` | `reservation.types.ts`, `auth.types.ts` |
| **Helper & Utilitas** | `camelCase.ts` | `countryCodes.ts`, `phone.ts`, `utils.ts` |
| **Halaman Rute** | `page.tsx`, `layout.tsx` | `src/app/(dashboard)/reminders/page.tsx` |
| **Dokumentasi** | `kebab-case.md` | `frontend-architecture-guidelines.md` |

---

## 8. Contoh Blueprint Implementasi Modul Baru

Jika AI diminta menambahkan modul baru (misal: modul `voucher`), ikuti urutan berikut:

### Langkah 1: Buat Tipe (`src/modules/voucher/types/voucher.types.ts`)
```typescript
export interface Voucher {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateVoucherInput {
  code: string;
  discountPercent: number;
}
```

### Langkah 2: Buat API Client (`src/modules/voucher/api/voucher.api.ts`)
```typescript
import { apiGet, apiPost } from "@/lib/api";
import { Voucher, CreateVoucherInput } from "../types/voucher.types";

export async function fetchVouchers(): Promise<Voucher[]> {
  const res = await apiGet<{ data: Voucher[] }>("/api/v1/vouchers");
  return res.data;
}

export async function createVoucher(input: CreateVoucherInput): Promise<Voucher> {
  const res = await apiPost<{ data: Voucher }>("/api/v1/vouchers", input);
  return res.data;
}
```

### Langkah 3: Buat Hook (`src/modules/voucher/hooks/useVouchers.ts`)
```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { Voucher, CreateVoucherInput } from "../types/voucher.types";
import { fetchVouchers, createVoucher } from "../api/voucher.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useVouchers() {
  const { t } = useI18n();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadVouchers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchVouchers();
      setVouchers(data);
    } catch {
      toast.error(t("voucher.fetchError") || "Gagal memuat voucher");
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  return { vouchers, isLoading, reload: loadVouchers };
}
```

### Langkah 4: Buat View (`src/modules/voucher/views/VouchersView.tsx`)
```typescript
"use client";

import React from "react";
import { useVouchers } from "../hooks/useVouchers";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";

export function VouchersView() {
  const { t } = useI18n();
  const { vouchers, isLoading } = useVouchers();

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold">{t("voucher.title")}</h1>
      {/* Render komponen-komponen voucher */}
    </div>
  );
}
```

### Langkah 5: Buat Rute App Router (`src/app/(dashboard)/vouchers/page.tsx`)
```typescript
import { VouchersView } from "@/modules/voucher/views/VouchersView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export default function VouchersPage() {
  return (
    <SellerRouteGuard>
      <VouchersView />
    </SellerRouteGuard>
  );
}
```

---

## 9. Checklist Verifikasi Mandiri Sebelum Menyelesaikan Tugas

Sebelum AI menyatakan suatu tugas frontend selesai:
- [ ] Apakah `"use client";` sudah terpasang jika file memakai hooks?
- [ ] Apakah tidak ada perintah `bun run build` yang dijalankan?
- [ ] Apakah seluruh dropdown / popover bebas dari ancaman `overflow-hidden`?
- [ ] Apakah semua Card yang menampung popover sudah diberi class `overflow-visible relative z-20`?
- [ ] Apakah input nomor telepon sudah menggunakan `CountryCodeSelector` dan sanitasi resmi?
- [ ] Apakah string bahasa sudah terdaftar di `src/locales/id/*.json` dan `src/locales/en/*.json`?
- [ ] Apakah desain responsif sudah dicek untuk mobile (`sm:`) dan desktop (`lg:`)?
