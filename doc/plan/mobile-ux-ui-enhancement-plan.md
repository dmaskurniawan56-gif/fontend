# Rencana Perbaikan Lanjutan UX/UI Versi Mobile

Dokumentasi audit komprehensif lanjutan untuk pengalaman pengguna (UX) dan antarmuka (UI) pada seluruh modul dashboard Wahide di perangkat mobile (viewport 320px–375px).

---

## Ringkasan Eksekutif

Setelah perbaikan pada header, drawer navigasi, serta toolbar filter & pencarian tabel selesai dilakukan, audit sistematis ini mengidentifikasi **5 area kunci tambahan** yang perlu disempurnakan agar pengalaman pengguna di smartphone setara dengan aplikasi _native_:

1. **Transformasi Tabel Pengingat ke Kartu Mobile (`ReminderTable.tsx` & `ReminderLogsTable.tsx`)**
2. **Optimalisasi Chip Kategori Template Menjadi 1 Baris Horizontal Swipeable (`TemplateFilterBar.tsx`)**
3. **Segmented Control Tab Pesan Full-Width 50:50 (`MessagesView.tsx`)**
4. **Perlindungan Virtual Keyboard pada Modal & Dialog Global (`dialog.tsx`)**
5. **Safe Area & Bottom Padding Dashboard Shell (`layout.tsx`)**

---

## 1. Matriks Audit & Temuan Masalah Mobile

| Modul / Komponen                | Kondisi Saat Ini di Layar Mobile                                                                                         | Dampak Terhadap Pengguna (UX)                                                                                                               | Solusi yang Direncanakan                                                                                                                                                              |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`ReminderTable.tsx`**         | Tabel desktop 6 kolom (Penerima, Nomor WA, Tanggal, Catatan, Status, Aksi) dibungkus `overflow-x-auto`.                  | Pengguna ponsel harus melakukan gesture swipe horizontal berulang-ulang hanya untuk melihat status atau menekan tombol Aksi (Edit/Hapus).   | Tambahkan **Card View Mobile** (`divide-border/50 divide-y lg:hidden`) yang memadatkan data dalam kartu sentuh rapi, dan sembunyikan tabel desktop pada viewport `< 1024px`.          |
| **`TemplateFilterBar.tsx`**     | 7 tombol filter kategori menggunakan pembungkus `flex flex-wrap`.                                                        | Tombol terpecah menjadi 3–4 baris ke bawah, menyita lebih dari 120px tinggi vertikal layar ponsel sebelum pengguna melihat daftar template. | Ubah menjadi **1 baris horizontal scrollable chip bar** (`no-scrollbar -mx-3 overflow-x-auto scroll-smooth px-3 py-1`) dengan edge-bleeding touch padding seperti YouTube/Play Store. |
| **`MessagesView.tsx`**          | `TabsList` rata kiri kecil (`self-start`); tombol utama "Kirim Pesan Baru" di tabel tertumpuk di belakang filter status. | Tab sulit dijangkau oleh jempol kanan/kiri; aksi primer pengiriman pesan kurang menonjol.                                                   | Jadikan `TabsList` **full-width 50:50** (`w-full grid grid-cols-2 sm:w-auto sm:flex`) menyerupai _iOS segmented control_.                                                             |
| **`UserDashboardOverview.tsx`** | Tombol header `[ 📱 Perangkat ]` dan `[ ➕ Broadcast Baru ]` menggunakan `flex flex-wrap`.                               | Lebar tombol tidak proporsional saat teks panjang berbeda, menciptakan kesan asimetris.                                                     | Ubah kontainer tombol menjadi `grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center` agar seimbang 50:50 di mobile.                                                        |
| **`dialog.tsx` (Global)**       | `DialogContent` memiliki batas tinggi `max-h-[calc(100dvh-2rem)]` tanpa `overflow-y-auto` bawaan.                        | Ketika virtual keyboard smartphone muncul, area form terpotong dan tombol Simpan/Batal tidak dapat dijangkau.                               | Tambahkan `overflow-y-auto` bawaan pada kelas dasar `DialogContent`.                                                                                                                  |
| **`DashboardLayout`**           | Elemen `<main>` tidak memiliki padding bawah default untuk safe area.                                                    | Komponen pagination dan footer tabel menempel ketat pada _gesture home indicator_ (iOS / Android).                                          | Tambahkan `pb-8 sm:pb-12` pada tag `<main>`.                                                                                                                                          |

---

## 2. Rincian Teknis Implementasi (Proposed Changes)

### A. Dashboard Layout & Dialog Core

1. **`src/app/(dashboard)/layout.tsx`**
   - Tambahkan safe-area bottom padding pada pembungkus `<main>`:
     ```tsx
     <main className="min-w-0 flex-1 pb-8 sm:pb-12">
       <ErrorBoundary>{children}</ErrorBoundary>
     </main>
     ```

2. **`src/components/ui/dialog.tsx`**
   - Perbarui kelas default `DialogContent`:
     ```tsx
     className={cn(
       "bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in ... fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm",
       className,
     )}
     ```

---

### B. Modul Pengingat (Reminders)

1. **`src/modules/reminder/components/ReminderTable.tsx`**
   - Tambahkan tampilan kartu untuk mobile (`lg:hidden`):
     - **Baris Atas**: Nama penerima (`text-sm font-bold`) + Status badge (`Badge`).
     - **Baris Tengah**: Nomor WhatsApp + Tanggal & Waktu terjadwal (`Calendar` & `Clock` icon).
     - **Baris Catatan**: Menampilkan pesan/catatan pengingat dalam container `text-xs text-foreground-secondary bg-muted/40 p-2 rounded-lg`.
     - **Baris Bawah**: Tombol aksi Edit dan Hapus yang lapang untuk sentuhan jari.
   - Bungkus tabel desktop dalam `<div className="hidden lg:block">`.

---

### C. Modul Template & Pesan

1. **`src/modules/template/components/TemplateFilterBar.tsx`**
   - Ubah kontainer kategori dari `flex flex-wrap` menjadi:
     ```tsx
     <div className="no-scrollbar -mx-3 flex items-center gap-1.5 overflow-x-auto scroll-smooth px-3 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
     ```
   - Memberikan pengalaman geser horizontal yang alami tanpa menghabiskan tinggi layar ponsel.

2. **`src/modules/whatsapp/views/MessagesView.tsx`**
   - Ubah `TabsList` menjadi responsif:
     ```tsx
     <TabsList className="bg-muted border-border h-auto w-full grid grid-cols-2 rounded-full border p-1 sm:w-auto sm:flex">
       <TabsTrigger value="chats" className="...">
         <MessageSquare className="size-3.5" />
         <span>{t("whatsapp.messagesTabChats")}</span>
       </TabsTrigger>
       <TabsTrigger value="compose" className="...">
         <Send className="size-3.5" />
         <span>{t("whatsapp.messagesTabCompose")}</span>
       </TabsTrigger>
     </TabsList>
     ```

---

### D. Modul Overview (Dashboard Utama)

1. **`src/modules/overview/components/UserDashboardOverview.tsx`**
   - Tata letak tombol aksi header:
     ```tsx
     <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-2.5">
       <Link href="/devices" className="w-full sm:w-auto">
         <Button
           variant="outline"
           size="sm"
           className="w-full sm:w-auto justify-center ..."
         >
           ...
         </Button>
       </Link>
       <Link href="/campaigns" className="w-full sm:w-auto">
         <Button
           variant="primaryPill"
           size="sm"
           className="w-full sm:w-auto justify-center ..."
         >
           ...
         </Button>
       </Link>
     </div>
     ```

---

## 3. Rencana Pengujian & Verifikasi (Verification Plan)

### A. Uji Otomatis (Strict Quality Gate)

Pastikan kode memenuhi standar proyek tanpa menjalankan `bun run build`:

```bash
# 1. Format kode
bun run format

# 2. Pemeriksaan ESLint (Wajib 0 error, 0 warning)
bun run lint

# 3. Pemeriksaan tipe TypeScript (Wajib 0 error)
bun x tsc --noEmit
```

### B. Checklist Verifikasi Manual di Smartphone (320px–375px)

- [ ] **`/reminders`**: Buka halaman daftar pengingat di layar HP, pastikan data tampil dalam format kartu vertikal tanpa horizontal scrollbar.
- [ ] **`/templates`**: Periksa filter kategori template, pastikan berupa 1 baris geser horizontal dan tidak bertumpuk 3-4 baris ke bawah.
- [ ] **`/messages`**: Pastikan tab pemilih "Riwayat Pesan" dan "Kirim Pesan" tampil seimbang 50:50 di bagian atas layar ponsel.
- [ ] **`/dashboard`**: Pastikan tombol "Perangkat" dan "Broadcast Baru" berukuran simetris 50:50.
- [ ] **Modal Form**: Buka modal penambahan data (misal: Tambah Kontak / Edit Reminder), fokuskan ke input teks hingga virtual keyboard muncul, pastikan form tetap dapat di-scroll vertikal untuk menjangkau tombol Simpan/Batal.
- [ ] **Bottom Safe Area**: Scroll ke bagian paling bawah tabel/halaman di browser ponsel, pastikan pagination tidak tertutup bar navigasi sistem.
