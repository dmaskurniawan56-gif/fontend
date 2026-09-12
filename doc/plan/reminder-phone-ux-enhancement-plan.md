# Rencana Peningkatan UX/UI Input Nomor WhatsApp Halaman Pengingat (`QuickScheduleCard.tsx`)

Dokumentasi rencana implementasi antarmuka input nomor WhatsApp pada formulir **Jadwalkan Pengingat Cepat** di halaman `/reminders` dengan menyertakan **Region / Country Code Selector** persis seperti pada halaman registrasi (`RegisterForm.tsx`).

---

## 1. Konsep & Keputusan Desain (Region Selector Terintegrasi)

Sesuai kebutuhan, input nomor WhatsApp pada `QuickScheduleCard.tsx` akan dilengkapi dengan **Region / Country Code Selector (`CountryCodeSelector`)** dengan spesifikasi:

1. **Pemilih Region Berbendera (`CountryCodeSelector`):**
   - Menggunakan komponen bersama `@/components/shared/CountryCodeSelector` dengan `variant="rounded"`.
   - Default negara: **Indonesia (`🇮🇩 +62`)**.
   - Dilengkapi popover pencarian negara lengkap (Malaysia `🇲🇾 +60`, Singapura `🇸🇬 +65`, dll.) seperti di halaman registrasi.
2. **Auto-Detect Region Saat Paste:**
   - Jika pengguna menempel (*paste*) nomor internasional (misal: `+60123456789`), sistem secara otomatis mendeteksi kode negara Malaysia (`🇲🇾 +60`) dan mengganti pilihan bendera secara otomatis via `detectCountryFromPhone()`.
3. **Smart Input & Sanitasi Otomatis:**
   - Menghapus otomatis awalan `0` berlebih atau duplikasi kode negara (`sanitizeSubscriberInput`).
   - Mencegah karakter non-angka (`type="tel"` dan `inputMode="tel"`).
4. **Live E.164 Preview & Status Visual:**
   - Saat valid, menampilkan badge konfirmasi hijau: `✓ Siap kirim: +62 8xx-xxxx-xxxx`.
   - Border input bereaksi secara dinamis (`border-emerald-500` saat valid, `border-rose-400` jika ada kesalahan).

---

## 2. Spesifikasi Visual & Layout

```
1. State Default (Indonesia ID):
   ┌────────────────────────────────────────────────────────┐
   │ No. WhatsApp *                                         │
   │ ┌──────────────┬─────────────────────────────────────┐ │
   │ │ 🇮🇩 +62 ▾     │ 812 3456 7890                       │ │
   │ └──────────────┴─────────────────────────────────────┘ │
   │ Contoh: 81234567890 (otomatis tersambung ke +62)       │
   └────────────────────────────────────────────────────────┘

2. State Valid (Success - Green Focus Ring):
   ┌────────────────────────────────────────────────────────┐
   │ No. WhatsApp *                                         │
   │ ┌──────────────┬─────────────────────────────────────┐ │
   │ │ 🇮🇩 +62 ▾     │ 87711301818                         │ │
   │ └──────────────┴─────────────────────────────────────┘ │
   │ ✓ Format siap kirim: +62 877-1130-1818                 │
   └────────────────────────────────────────────────────────┘

3. State Multi-Region (Misal: Malaysia):
   ┌────────────────────────────────────────────────────────┐
   │ No. WhatsApp *                                         │
   │ ┌──────────────┬─────────────────────────────────────┐ │
   │ │ 🇲🇾 +60 ▾     │ 123456789                           │ │
   │ └──────────────┴─────────────────────────────────────┘ │
   │ ✓ Format siap kirim: +60 12-345-6789                   │
   └────────────────────────────────────────────────────────┘
```

---

## 3. Rincian Perubahan Teknis (Proposed Changes)

Semua perubahan berada di direktori **`G:\WEB2026\fontwahide`** (100% sisi Frontend).

### A. Modul Pengingat (`src/modules/reminder`)

#### 1. `src/modules/reminder/components/QuickScheduleCard.tsx`
1. **Import Region Utilities & Component:**
   - Import `CountryCodeSelector` dari `@/components/shared/CountryCodeSelector`.
   - Import `DEFAULT_COUNTRY, CountryCodeItem, detectCountryFromPhone, sanitizeSubscriberInput` dari `@/lib/countryCodes`.
   - Import `formatDisplayPhone` dari `@/lib/phone`.
2. **State Region:**
   - `const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(DEFAULT_COUNTRY);`
3. **Smart Change Handler (`handlePhoneChange`):**
   - Mendeteksi awalan `+` untuk beralih negara otomatis.
   - Sanitasi angka subscriber tanpa duplikasi dial code.
4. **Render Input:**
   - Pasang kontainer `flex h-10 w-full items-center rounded-xl border bg-surface ...` yang memadukan `CountryCodeSelector` di sisi kiri dan input teks di sisi kanan.
   - Tambahkan mikro-feedback di bawah kolom input untuk konfirmasi format E.164.
5. **Submit Processing:**
   - Menggabungkan `${selectedCountry.dialCode}${cleanDigits}` menjadi nomor lengkap E.164 sebelum dikirim ke `onSchedule`.

---

### B. File Terjemahan / Lokalisasi (`src/locales`)

#### 2. `src/locales/id/reminder.json` & `src/locales/en/reminder.json`
- Tambahkan string baru:
  - `phonePlaceholderWithCountry`: "812 3456 7890"
  - `phoneReadyPreview`: "Format siap kirim: {formatted}"
  - `phoneMinDigits`: "{count} digit (minimal 8)"

---

## 4. Rencana Pengujian & Verifikasi

### A. Pengujian Otomatis (Static Analysis & Type Checking)
1. **TypeScript Typecheck**:
   ```powershell
   cd g:\WEB2026\fontwahide
   bun run typescript
   ```
   *Target: 0 error tipe TypeScript.*
2. **ESLint Verification**:
   ```powershell
   cd g:\WEB2026\fontwahide
   bun run lint
   ```
   *Target: 0 error linter.*

### B. Pengujian Fungsional Manual
1. Verifikasi klik pada tombol bendera `🇮🇩 +62` membuka popover pencarian negara.
2. Pilih negara lain (contoh `🇲🇾 Malaysia +60`), pastikan dial code berubah.
3. Paste nomor `+6281234567890` atau `081234567890`, pastikan nomor otomatis dibersihkan dan dial code tetap akurat.
4. Simpan pengingat dan verifikasi jadwal tersimpan dengan nomor lengkap `6281234567890`.
