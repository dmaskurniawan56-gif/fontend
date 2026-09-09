import type { Metadata } from "next";
import { EcommerceHero } from "@/components/solutions/ecommerce/EcommerceHero";
import { EcommerceUseCases } from "@/components/solutions/ecommerce/EcommerceUseCases";
import { EcommerceCtaSection } from "@/components/solutions/ecommerce/EcommerceCtaSection";

export const metadata: Metadata = {
  title: "Solusi Notifikasi & Otomasi Toko Online via WhatsApp ",
  description:
    "Tingkatkan konversi penjualan toko online dengan notifikasi pesanan otomatis, pengiriman nomor resi instan, dan pemulihan keranjang belanja (abandoned cart) via WhatsApp Gateway Wahide.",
  keywords: [
    "WhatsApp Toko Online",
    "Notifikasi Pesanan WhatsApp",
    "Kirim Resi Otomatis WhatsApp",
    "WhatsApp Olshop",
    "Abandoned Cart Recovery WhatsApp",
    "Wahide E-Commerce",
  ],
  alternates: {
    canonical: "/solutions/ecommerce",
  },
  openGraph: {
    title: "Solusi Notifikasi & Otomasi Toko Online via WhatsApp | Wahide",
    description:
      "Tingkatkan konversi penjualan toko online dengan notifikasi pesanan otomatis, pengiriman nomor resi instan, dan pemulihan keranjang belanja (abandoned cart) via WhatsApp Gateway Wahide.",
    url: "/solutions/ecommerce",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

const ecommerceJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Wahide E-Commerce WhatsApp Automation",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Cloud / Web API",
  offers: {
    "@type": "Offer",
    priceCurrency: "IDR",
    availability: "https://schema.org/InStock",
  },
  description:
    "Automated WhatsApp notification solution for online stores: order confirmation, shipping tracking, and abandoned cart recovery.",
};

export default function EcommerceSolutionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ecommerceJsonLd) }}
      />
      <div className="space-y-6">
        <EcommerceHero />
        <EcommerceUseCases />
        <EcommerceCtaSection />
      </div>
    </>
  );
}
