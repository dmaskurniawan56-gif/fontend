# Rencana Peningkatan UX/UI Input Nomor WhatsApp Halaman Reservasi (`AddReservationForm.tsx`)

Dokumentasi implementasi peningkatan antarmuka (UX/UI) pada formulir modal **Jadwalkan Reservasi Baru** di halaman `/reservations` dengan menyertakan **Region / Country Code Selector** persis seperti pada modul Pengingat (`QuickScheduleCard.tsx`) dan Registrasi (`RegisterForm.tsx`).

---

## 1. Konsep & Desain Solusi (Zero-Friction Smart Approach)

Input nomor WhatsApp pada modal `AddReservationForm.tsx` dilengkapi dengan **Region / Country Code Selector (`CountryCodeSelector`)** dengan spesifikasi:

1. **Pemilih Region Berbendera (`CountryCodeSelector`):**
   - Menggunakan komponen bersama `@/components/shared/CountryCodeSelector` dengan `variant="rounded"`.
   - Default negara: **Indonesia (`🇮🇩 +62`)**.
   - Popover pencarian negara lengkap dan berbendera (Malaysia `🇲🇾 +60`, Singapura `🇸🇬 +65`, dll.).
2. **Auto-Detect Region Saat Paste:**
   - Menempelkan (*paste*) nomor internasional berawalan `+` otomatis beralih bendera via `detectCountryFromPhone`.
3. **Smart Input & Sanitasi Otomatis:**
   - Menghapus otomatis awalan `0` berlebih via `sanitizeSubscriberInput`.
   - Mencegah input non-angka dengan `type="tel"` dan `inputMode="tel"`.
4. **Live E.164 Preview & Status Visual Dinamis:**
   - Border hijau lembut (`border-emerald-500/70`) saat valid dengan teks konfirmasi: `✓ Format siap kirim: +62 8xx-xxxx-xxxx`.
   - State sedang mengetik menampilkan counter digit minimal 8 digit.
   - State over-limit menampilkan peringatan maksimal 15 digit.
5. **Submit Processing:**
   - Nomor yang dikirim ke `onSubmit` dipastikan dalam standar E.164 murni tanpa tanda `+` (contoh: `628123456789`).

---

## 2. Rincian File yang Diubah

Semua perubahan berada di `G:\WEB2026\fontwahide`:
1. `src/modules/reservation/components/AddReservationForm.tsx`: Integrasi `CountryCodeSelector`, auto-sanitize, live E.164 preview, dan validasi submit.
2. `src/locales/id/reservation.json`: String terjemahan bahasa Indonesia untuk placeholder dan preview.
3. `src/locales/en/reservation.json`: String terjemahan bahasa Inggris yang sepadan.

---

## 3. Rencana Verifikasi
- TypeScript check: `bun run typescript` -> 0 errors.
- ESLint: `bun run lint` -> 0 errors / 0 warnings.
