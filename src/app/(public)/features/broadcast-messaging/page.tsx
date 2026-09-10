import type { Metadata } from "next";
import { BroadcastHero } from "@/components/features/broadcast-messaging/BroadcastHero";
import { AntiBan5LayersVisual } from "@/components/features/broadcast-messaging/AntiBan5LayersVisual";
import { LiveSpintaxPlayground } from "@/components/features/broadcast-messaging/LiveSpintaxPlayground";
import { BroadcastFeaturesGrid } from "@/components/features/broadcast-messaging/BroadcastFeaturesGrid";
import { BroadcastCtaSection } from "@/components/features/broadcast-messaging/BroadcastCtaSection";

export const metadata: Metadata = {
  title: "Kirim Pesan Promosi Massal WhatsApp & Bebas Blokir | Wahide",
  description:
    "Kirim pesan siaran massal WhatsApp ke ribuan pelanggan dengan aman tanpa khawatir nomor diblokir. Dilengkapi variasi kata otomatis, jeda kirim alami, dan rotasi nomor.",
  keywords: [
    "WhatsApp Broadcast",
    "WhatsApp Blast Anti Blokir",
    "WhatsApp Spintax",
    "Pesan Massal WhatsApp Aman",
    "Aplikasi Broadcast WhatsApp Indonesia",
    "Wahide Broadcast Messaging",
  ],
  alternates: {
    canonical: "/features/broadcast-messaging",
  },
  openGraph: {
    title: "Kirim Pesan Promosi Massal WhatsApp & Bebas Blokir | Wahide",
    description:
      "Kirim pesan siaran massal WhatsApp ke ribuan pelanggan dengan aman tanpa khawatir nomor diblokir. Dilengkapi variasi kata otomatis, jeda kirim alami, dan rotasi nomor.",
    url: "/features/broadcast-messaging",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

const broadcastJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Wahide Smart Broadcast Messaging",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Cloud / Web API",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
    availability: "https://schema.org/InStock",
  },
  description:
    "Kirim pesan siaran massal WhatsApp aman dengan perlindungan anti-blokir, variasi kata otomatis, dan pembagian ke banyak nomor.",
};

export default function BroadcastMessagingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(broadcastJsonLd) }}
      />
      <div className="space-y-10 sm:space-y-14 py-4 sm:py-6">
        <BroadcastHero />
        <AntiBan5LayersVisual />
        <LiveSpintaxPlayground />
        <BroadcastFeaturesGrid />
        <BroadcastCtaSection />
      </div>
    </>
  );
}
