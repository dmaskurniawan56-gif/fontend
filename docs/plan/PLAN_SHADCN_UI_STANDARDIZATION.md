# Blueprint Perencanaan: Audit & Standarisasi Komponen shadcn/ui pada 4 Modul Bisnis (`fontwahide`)

**Dokumen**: `fontwahide/docs/plan/PLAN_SHADCN_UI_STANDARDIZATION.md`  
**Role**: Senior React Next.js Developer & Frontend System Design Architect  
**Lingkup**: Modul Template (`template`), Modul Pengingat (`reminder`), Modul Reservasi (`reservation`), Modul Formulir Dinamis (`form`)  
**Target Desain**: shadcn/ui (`base-nova` style) + `@base-ui/react` + Tailwind CSS v4 + Next.js 16 App Router  

---

## 1. Eksekutif Ringkasan & Latar Belakang

Aplikasi frontend `fontwahide` dibangun dengan stack mutakhir:
- **Next.js 16** (App Router & Turbopack)
- **React 19**
- **Bun 1.4.0**
- **Tailwind CSS v4** (`@tailwindcss/postcss`, `tw-animate-css`)
- **shadcn/ui** dengan arsitektur `@base-ui/react` (`components.json: style "base-nova"`)

Meskipun 4 modul bisnis utama telah berfungsi penuh, audit visual dan arsitektural menunjukkan adanya **fragmentasi komponen presentasi**:
1. Sebagian modal masih menggunakan kode lama berbasis **raw HTML fixed backdrop** (`<div className="fixed inset-0 ...">`) tanpa penanganan ARIA accessibility, focus trapping, dan animasi masuk/keluar terpadu.
2. Sebagian tabel data masih menggunakan **raw HTML `<table>`** alih-alih komponen `@/components/ui/table.tsx`.
3. Dropdown menu pada kartu template masih diimplementasikan dengan **div absolute + backdrop klik global buatan sendiri**, bukan menggunakan `@/components/ui/dropdown-menu.tsx`.
4. Komponen dasar seperti **Card**, **Label**, **Separator**, dan **Tooltip** belum tersedia di direktori `@/components/ui/`, sehingga masing-masing komponen modul menuliskan style kartu dan label secara berulang dan terfragmentasi.

Standarisasi ini bertujuan menyatukan seluruh komponen ke dalam satu bahasa desain yang konsisten, aksesibel (WCAG 2.1 AA), bebas bug z-index, dan berkinerja tinggi.

---

## 2. Matriks Audit Komponen Saat Ini

| Modul | Komponen File | Komponen UI Saat Ini | Masalah / Temuan Audit | Rekomendasi Solusi shadcn/ui |
|---|---|---|---|---|
| **Template** | `DeleteTemplateModal.tsx` | Raw `<div className="fixed inset-0...">` | Tidak ada ARIA `alertdialog`, tidak ada trap fokus keyboard | Ganti dengan `@/components/ui/alert-dialog.tsx` |
| **Template** | `TemplateCard.tsx` | Raw `div` container, raw `<button>`, manual dropdown div | Dropdown rentan z-index bug; tidak ada keyboard navigation; container tidak standar | Ganti container ke `Card`, dropdown ke `DropdownMenu`, badge ke `Badge`, divider ke `Separator` |
| **Template** | `TemplateEditorModal.tsx` | Raw backdrop fixed div, raw `<input>`, `<select>`, `<textarea>` | Aksesibilitas rendah; style form control terpisah dari tema global | Ganti ke `Dialog`, `Input`, `NativeSelect`, `Textarea`, `Label` |
| **Template** | `TemplateFilterBar.tsx` | Raw `<input>` + Search SVG absolute manual, button pills | Duplikasi input pencarian; button filter manual | Ganti ke `@/components/ui/search-input.tsx` & `Tabs` |
| **Reminder** | `DeleteReminderModal.tsx` | Raw `<div className="fixed inset-0...">` | Sama dengan DeleteTemplateModal: custom overlay tanpa ARIA role | Ganti dengan `@/components/ui/alert-dialog.tsx` |
| **Reminder** | `QuickScheduleCard.tsx` | Raw `<div className="rounded-2xl...">`, raw `<label>` | Tidak menggunakan komponen Card standar; label manual | Gunakan `Card`, `CardHeader`, `CardTitle`, `CardContent`, dan `Label` |
| **Reminder** | `DeliveryRulesCard.tsx` | Raw `<select>`, raw buttons untuk Drip Tabs, raw `<label>` | Dropdown device tidak bersatu dengan tema form; tab offset manual | Gunakan `Card`, `NativeSelect`, `Tabs`, `Label` |
| **Reminder** | `ReminderTable.tsx` | Raw `<table>`, raw `<span>` status badge, pagination manual | Tidak memakai Table tokens shadcn; badge tidak memakai varian | Gunakan `Table`, `Badge` (variant success/warning/etc), `Pagination` |
| **Reminder** | `ReminderLogsTable.tsx` | Raw `<table>`, raw `<span>` status badge | Inkonsistensi tampilan log riwayat pengiriman | Gunakan `Table`, `Badge`, `Pagination` |
| **Reservation** | `DeleteReservationModal.tsx` | `@/components/ui/dialog.tsx` | `Dialog` kurang semantik untuk aksi destruktif permanen | Upgrade ke `@/components/ui/alert-dialog.tsx` |
| **Reservation** | `AddReservationForm.tsx` | `Dialog`, `Input`, `Textarea`, raw `<label>` | Sudah baik, namun label form masih ad-hoc | Standarisasi dengan `Label` |
| **Reservation** | `DailyAgendaList.tsx` | Raw `<div ...>`, raw `<div className="h-px bg-border/50" />` | Container agenda dan garis pembatas manual | Gunakan `Card` dan `Separator` |
| **Reservation** | `MonthlyCalendar.tsx` | Raw `<div ...>` container | Container kalender manual | Gunakan `Card`, tambahkan `Tooltip` pada hari yang memiliki jadwal |
| **Form** | `DeleteFormModal.tsx` | `@/components/ui/dialog.tsx` | Seharusnya memakai `AlertDialog` untuk konfirmasi hapus permanen | Upgrade ke `@/components/ui/alert-dialog.tsx` |
| **Form** | `FormCard.tsx` | Raw `div` container, raw badge helper classes | Container manual; badge helper menggunakan custom class | Gunakan `Card`, `Badge` |
| **Form** | `FormBuilderModal.tsx` | `Dialog`, `Input`, `Textarea`, `Switch`, raw `<label>` | Sangat baik, hanya butuh standardisasi `Label` dan `Separator` | Gunakan `Label` dan `Separator` |
| **Form** | `SubmissionsDrawer.tsx` | `DialogContent max-w-4xl`, raw table | Drawer respons formulir saat ini berupa dialog tengah | Standarisasi dengan `Table`, `Badge`, dan `Accordion` |

---

## 3. Komponen shadcn/ui Baru yang Akan Dipasang

Komponen-komponen berikut akan ditambahkan ke `src/components/ui/` dengan mematuhi format `base-nova` (`data-slot`, `cn`, dan integrasi `@base-ui/react`):

### 3.1 `src/components/ui/card.tsx`
Menyediakan container berstandar untuk seluruh kartu bisnis, dashboard, dan form:
- `Card`: Menggunakan token CSS `--color-card`, `--color-card-foreground`, border `border-border/70`, sudut `rounded-2xl`, dan shadow halus.
- `CardHeader`: Flex container untuk judul dan aksi.
- `CardTitle`: Tipografi judul tebal dengan tracking rapat.
- `CardDescription`: Teks deskripsi dengan warna `--color-foreground-muted`.
- `CardContent`: Area isi fleksibel.
- `CardFooter`: Area aksi bawah dengan padding konsisten.

### 3.2 `src/components/ui/label.tsx`
Menyediakan label form aksesibel:
- Menghubungkan secara semantik dengan atribut `htmlFor`.
- Memiliki style bawaan `text-xs font-semibold text-foreground-muted`.
- Mendukung state `peer-disabled` dan `group-data-[disabled=true]` otomatis.

### 3.3 `src/components/ui/separator.tsx`
Pemisah visual semantik:
- Menggantikan seluruh `<div className="my-1 border-t border-border" />` dan `<div className="h-px bg-border/50" />`.
- Mendukung orientasi `horizontal` (default) dan `vertical`.
- Dilengkapi atribut ARIA `role="separator"` atau `role="none"` jika dekoratif.

### 3.4 `src/components/ui/tooltip.tsx`
Tooltip micro-interaction cepat dan aksesibel:
- Dibangun di atas `@base-ui/react/tooltip` (telah tersedia dalam package `@base-ui/react` yang terpasang).
- Komponen: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`.
- Menghilangkan delay bawaan browser dari atribut HTML mentah `title="..."`.

---

## 4. Rencana Kerja Bertahap (Step-by-Step Implementation)

### Tahap 1: Pemasangan Komponen Dasar Baru di `src/components/ui/`
1. Pasang `src/components/ui/card.tsx`.
2. Pasang `src/components/ui/label.tsx`.
3. Pasang `src/components/ui/separator.tsx`.
4. Pasang `src/components/ui/tooltip.tsx`.

### Tahap 2: Standardisasi Modul Template (`src/modules/template`)
1. **`DeleteTemplateModal.tsx`**:
   - Refactor menggunakan `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel`.
2. **`TemplateCard.tsx`**:
   - Ganti container pembungkus dengan `Card`, `CardHeader`, `CardContent`, `CardFooter`.
   - Ganti hand-rolled dropdown menu dengan `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`.
   - Ganti badge kategori manual dengan `Badge` varian semantik (`warning` untuk marketing, `secondary` untuk reminder, `info` untuk reservasi, `success` untuk utility).
   - Pasang `Tooltip` pada tombol Favorite (Star) dan Copy.
3. **`TemplateEditorModal.tsx`**:
   - Ganti modal manual dengan `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`.
   - Ganti elemen form mentah dengan `Input`, `NativeSelect`, `Textarea`, dan `Label`.
   - Ganti mobile tab toggle dengan `Tabs`, `TabsList`, `TabsTrigger`.
4. **`TemplateFilterBar.tsx`**:
   - Ganti input pencarian manual dengan `SearchInput`.

### Tahap 3: Standardisasi Modul Pengingat (`src/modules/reminder`)
1. **`DeleteReminderModal.tsx`**:
   - Refactor menggunakan `AlertDialog`.
2. **`QuickScheduleCard.tsx`**:
   - Ganti pembungkus luar dengan `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`.
   - Ganti raw `<label>` dengan `Label`.
3. **`DeliveryRulesCard.tsx`**:
   - Ganti pembungkus luar dengan `Card`.
   - Ganti raw `<select>` perangkat WhatsApp pengirim dengan `NativeSelect` dan `NativeSelectOption`.
   - Ganti navigasi tab offset dengan `Tabs`, `TabsList`, `TabsTrigger`.
   - Ganti raw `<label>` dengan `Label`.
4. **`ReminderTable.tsx`**:
   - Refactor tabel dari raw `<table>` ke `@/components/ui/table.tsx` (`Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`).
   - Ganti status badge span manual ke `Badge` dengan varian semantik (`success` untuk ACTIVE, `warning` untuk PAUSED, `secondary` untuk COMPLETED, `danger` untuk CANCELLED).
5. **`ReminderLogsTable.tsx`**:
   - Refactor tabel dari raw `<table>` ke `@/components/ui/table.tsx`.
   - Ganti status badge manual ke `Badge`.

### Tahap 4: Standardisasi Modul Reservasi (`src/modules/reservation`)
1. **`DeleteReservationModal.tsx`**:
   - Upgrade dari `Dialog` ke `AlertDialog`.
2. **`AddReservationForm.tsx`**:
   - Ganti raw `<label>` dengan `Label`.
3. **`DailyAgendaList.tsx`**:
   - Bungkus container agenda dengan `Card`.
   - Ganti garis horizontal manual dengan `Separator`.
4. **`MonthlyCalendar.tsx`**:
   - Bungkus kalender bulanan dengan `Card`.

### Tahap 5: Standardisasi Modul Formulir Dinamis (`src/modules/form`)
1. **`DeleteFormModal.tsx`**:
   - Upgrade dari `Dialog` ke `AlertDialog`.
2. **`FormCard.tsx`**:
   - Bungkus kartu formulir dengan `Card`.
   - Standardisasi badge tipe formulir (`Badge variant="success"` untuk reservasi, `Badge variant="warning"` untuk lead, `Badge variant="info"` untuk standar).
3. **`FormBuilderModal.tsx`**:
   - Ganti raw `<label>` dengan `Label`.
   - Ganti pembatas manual dengan `Separator`.
4. **`SubmissionsDrawer.tsx`**:
   - Standardisasi tabel jawaban submission dengan `Table` dan `Badge`.

---

## 5. Verifikasi Kualitas & Quality Gates

1. **Type Safety Verification**:
   ```powershell
   cd G:\WEB2026\fontwahide
   bun x tsc --noEmit
   ```
   *Wajib menghasilkan 0 error TypeScript.*

2. **Linter & Code Style**:
   ```powershell
   bun run lint
   ```
   *Memastikan tidak ada unused imports, warning aksibilitas, atau pelanggaran aturan Next.js 16.*

3. **Batasan & Komitmen Operasional**:
   - **TIDAK menjalankan `bun run build`** (mematuhi aturan absolut proyek).
   - Menjaga seluruh API client, hook data fetching, dan DTO contract tetap utuh dan sinkron 100%.

---

## 6. Jadwal & Checklist Eksekusi

- [ ] Persetujuan Plan oleh User
- [ ] Buat `src/components/ui/card.tsx`
- [ ] Buat `src/components/ui/label.tsx`
- [ ] Buat `src/components/ui/separator.tsx`
- [ ] Buat `src/components/ui/tooltip.tsx`
- [ ] Refactor Modul Template (`DeleteTemplateModal`, `TemplateCard`, `TemplateEditorModal`, `TemplateFilterBar`)
- [ ] Refactor Modul Reminder (`DeleteReminderModal`, `QuickScheduleCard`, `DeliveryRulesCard`, `ReminderTable`, `ReminderLogsTable`)
- [ ] Refactor Modul Reservation (`DeleteReservationModal`, `AddReservationForm`, `DailyAgendaList`, `MonthlyCalendar`)
- [ ] Refactor Modul Form (`DeleteFormModal`, `FormCard`, `FormBuilderModal`, `SubmissionsDrawer`)
- [ ] Jalankan `bun x tsc --noEmit`
- [ ] Jalankan `bun run lint`
- [ ] Buat laporan akhir di `walkthrough.md`
