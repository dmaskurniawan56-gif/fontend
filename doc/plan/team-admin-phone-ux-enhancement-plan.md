# Rencana Peningkatan UX/UI Input Nomor WhatsApp Tim & Admin

Dokumentasi implementasi standardisasi input nomor WhatsApp pada modal **Tambah Akun Agen Tim** (`AddTeamMemberModal.tsx`) dan modal **Edit Data Pengguna** (`EditUserModal.tsx`) dengan menyertakan **Region / Country Code Selector** dan validasi E.164.

---

## 1. Konsep & Desain Solusi (Zero-Friction Smart Approach)

1. **Pemilih Region Berbendera (`CountryCodeSelector`):**
   - Menggunakan komponen bersama `@/components/shared/CountryCodeSelector` dengan `variant="rounded"`.
   - Default negara: **Indonesia (`🇮🇩 +62`)**, atau auto-detect dari nomor pengguna yang ada saat membuka edit modal.
   - Popover pencarian negara lengkap dan berbendera (Malaysia `🇲🇾 +60`, Singapura `🇸🇬 +65`, dll.).
2. **Auto-Detect Region Saat Paste:**
   - Menempelkan (_paste_) nomor internasional berawalan `+` otomatis beralih bendera via `detectCountryFromPhone`.
3. **Smart Input & Sanitasi Otomatis:**
   - Menghapus otomatis awalan `0` berlebih via `sanitizeSubscriberInput`.
   - Mencegah input non-angka dengan `type="tel"` dan `inputMode="tel"`.
4. **Live E.164 Preview & Status Visual Dinamis:**
   - Border hijau lembut (`border-emerald-500/70`) saat valid dengan teks konfirmasi: `✓ Format siap kirim: +62 8xx-xxxx-xxxx`.
   - State sedang mengetik menampilkan counter digit minimal 8 digit.
   - State over-limit (> 14 digit) menampilkan peringatan maksimal 15 digit.
5. **Submit Processing:**
   - Nomor yang dikirim ke backend dipastikan dalam format E.164 valid tanpa tanda `+` (contoh: `628123456789`).

---

## 2. Rincian File yang Diubah

Semua perubahan berada di `G:\WEB2026\fontwahide`:

1. `src/modules/team/components/modals/AddTeamMemberModal.tsx`
2. `src/modules/admin/components/users/EditUserModal.tsx`
3. `src/locales/id/team.json`
4. `src/locales/en/team.json`
5. `src/locales/id/admin.json`
6. `src/locales/en/admin.json`

---

## 3. Rencana Verifikasi

- TypeScript check: `bun run typescript` -> 0 errors.
- ESLint: `bun run lint` -> 0 errors / 0 warnings.
