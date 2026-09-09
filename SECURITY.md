# 🛡️ Security Policy

## 🔒 Supported Versions

Kami secara aktif memelihara dan merilis pembaruan keamanan (_security patches_) untuk versi aktif berikut:

| Version | Supported          | Next.js Baseline    | Security Maintenance Status |
| ------- | ------------------ | ------------------- | --------------------------- |
| 0.1.x   | :white_check_mark: | 16.3.x (App Router) | Active Security Support     |
| < 0.1.0 | :x:                | Legacy              | End of Life (EOL)           |

---

## 🚨 Reporting a Vulnerability (Pelaporan Kerentanan)

**Hide Digital Security** mengutamakan keamanan data pengguna, enkripsi sesi multi-tenant, dan integritas gerbang API WhatsApp. Jika Anda menemukan kerentanan keamanan (_vulnerability_), mohon bantu kami dengan melakukan **Responsible Disclosure** melalui saluran privat resmi kami.

> [!CAUTION]
> **JANGAN MEMBUAT ISSUE PUBLIK DI GITHUB UNTUK LAPORAN KERENTANAN KEAMANAN.**
> Mohon jangan mendiskusikan atau mempublikasikan kerentanan sebelum tim teknis kami merilis patch perbaikan.

### 📬 Saluran Pelaporan Resmi:

1. **GitHub Private Vulnerability Reporting**: Gunakan fitur tab [Security -> Report a vulnerability](../../security/advisories/new) di repositori ini.
2. **Email Tim Keamanan**: Kirimkan detail temuan Anda ke:
   - **Email**: [`admin@hidessh.com`](mailto:admin@hidessh.com)
   - **Subjek**: `[SECURITY VULNERABILITY REPORT] fontwahide - <Judul Singkat>`

---

## 📋 Informasi yang Diperlukan dalam Laporan:

Untuk mempercepat proses investigasi dan mitigasi, mohon sertakan:

- Deskripsi detail mengenai jenis kerentanan (misal: XSS, CSRF, Token Leak, SSRF, RCE, IDOR).
- Langkah-langkah reproduksi (_step-by-step reproduction_) atau _Proof of Concept (PoC)_.
- Potensi dampak (_impact assessment_) terhadap sistem atau data pengguna.
- Versi browser / Node.js / Bun yang digunakan saat pengujian.

---

## ⏱️ Response Time & SLA:

- **Konfirmasi Penerimaan**: Tim kami akan merespons dan mengonfirmasi laporan Anda dalam waktu **maksimal 24 jam**.
- **Analisis & Patch**: Patch perbaikan akan diprioritaskan dan dirilis dalam waktu **1–3 hari kerja** tergantung tingkat keparahan (_Severity Level_).
- **Pengakuan & Kredit**: Kami sangat menghargai kontribusi etis peneliti keamanan (_White Hat Security Researchers_) dan akan memberikan atribusi resmi pada catatan rilis (_Release Notes_).

---

**Hide Digital Security (Hide Group)**  
_Jl. Kampung Baris No.391, Karangturi, Semarang, Jawa Tengah 50124_  
_Official Web_: [https://wahide.id](https://wahide.id)
