import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Wahide - Platform Otomasi Bisnis & WhatsApp Gateway",
  description:
    "Platform otomasi bisnis dan WhatsApp Gateway terpadu: kelola broadcast cerdas dengan proteksi reputasi, sistem reservasi, pengingat otomatis, dan formulir web tanpa coding.",
  keywords: [
    "Wahide",
    "Wahide Gateway",
    "WhatsApp Gateway Indonesia",
    "Platform Otomasi Bisnis",
    "Smart Broadcast WhatsApp",
    "Sistem Reservasi WhatsApp",
    "Pengingat Otomatis WhatsApp",
    "Formulir Dinamis WhatsApp",
    "Template Pesan Bisnis",
    "WhatsApp Multi Device",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wahide - Platform Otomasi Bisnis & WhatsApp Gateway",
    description:
      "Solusi terpadu otomasi bisnis dan integrasi WhatsApp: pengiriman pesan cerdas dengan proteksi reputasi, reservasi online, pengingat otomatis, dan formulir web siap pakai.",
    url: "/",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Bagaimana Wahide menjaga keamanan dan reputasi nomor bisnis saya?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wahide dilengkapi 5-Lapis Proteksi Pengiriman Cerdas meliputi variasi kata dinamis (spintax), simulasi pengetikan manusia alami (ChatPresence), jeda acak jitter 3–15 detik, dan rotasi nomor cerdas untuk menjaga pengiriman pesan tetap wajar dan terhindar dari spam reporting.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara menghubungkan nomor WhatsApp saya ke Wahide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prosesnya sangat mudah dan instan. Anda cukup membuka dashboard Wahide, klik Tambah Perangkat, lalu scan QR Code yang muncul menggunakan aplikasi WhatsApp di ponsel Anda (seperti menghubungkan WhatsApp Web).",
      },
    },
    {
      "@type": "Question",
      name: "Apakah Wahide mendukung pengiriman OTP dan notifikasi transaksi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya, Wahide memiliki antrean prioritas tinggi (high-priority queue) khusus untuk transmisi kode OTP, faktur transaksi, dan notifikasi pesanan agar terkirim dalam hitungan detik.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah saya bisa mengintegrasikan Wahide ke sistem website/aplikasi saya?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tentu saja! Kami menyediakan REST API lengkap dengan contoh kode dalam cURL, Node.js, Go, PHP, dan Python, serta Webhook dua arah terenkripsi HMAC SHA256.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana hubungan Wahide dengan WhatsApp dan Meta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wahide adalah platform piranti lunak otomasi independen yang memanfaatkan integrasi multi-device untuk kebutuhan operasional bisnis Anda. Wahide tidak berafiliasi resmi dengan WhatsApp LLC atau Meta Platforms, Inc., sehingga memberikan fleksibilitas operasional penuh bagi UMKM dan bisnis berkembang tanpa biaya percakapan per pesan yang membebani.",
      },
    },
    {
      "@type": "Question",
      name: "Selain gateway API, apa saja solusi bisnis siap pakai yang disediakan Wahide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wahide menyediakan 4 modul bisnis bawaan siap pakai tanpa perlu coding: Sistem Reservasi & Booking Jadwal, Otomasi Pengingat & Jatuh Tempo, Formulir Dinamis Publik (/f/nama-form), dan Pustaka Template Pesan CS & Sales.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeView />
    </>
  );
}
