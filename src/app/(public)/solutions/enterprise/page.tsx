import type { Metadata } from "next";
import { EnterpriseHero } from "@/components/solutions/enterprise/EnterpriseHero";
import { EnterpriseBentoGrid } from "@/components/solutions/enterprise/EnterpriseBentoGrid";
import { ComplianceSecuritySection } from "@/components/solutions/enterprise/ComplianceSecuritySection";
import { EnterpriseContactCta } from "@/components/solutions/enterprise/EnterpriseContactCta";

export const metadata: Metadata = {
  title: "Solusi WhatsApp Skala Perusahaan & Korporat | Wahide",
  description:
    "Kelola komunikasi WhatsApp skala besar dengan alur kerja multi-divisi, keamanan data terjamin, dan integrasi mudah ke sistem kantor Anda bersama Wahide.",
  keywords: [
    "WhatsApp Perusahaan",
    "Solusi WhatsApp Korporat",
    "WhatsApp Bisnis Multi Divisi",
    "Integrasi WhatsApp CRM",
    "Wahide Enterprise",
  ],
  alternates: {
    canonical: "/solutions/enterprise",
  },
  openGraph: {
    title: "Solusi WhatsApp Skala Perusahaan & Korporat | Wahide",
    description:
      "Kelola komunikasi WhatsApp skala besar dengan alur kerja multi-divisi, keamanan data terjamin, dan integrasi mudah ke sistem kantor Anda bersama Wahide.",
    url: "/solutions/enterprise",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

const enterpriseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Wahide Solusi WhatsApp Perusahaan",
  category: "Business Communication Software",
  offers: {
    "@type": "Offer",
    priceCurrency: "IDR",
    availability: "https://schema.org/InStock",
  },
  description:
    "Solusi komunikasi WhatsApp terpadu untuk perusahaan skala besar: alur kerja lintas divisi, kontrol akses staf aman, integrasi sistem kantor, dan dukungan teknis langsung.",
};

export default function EnterpriseSolutionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(enterpriseJsonLd) }}
      />
      <div className="space-y-6">
        <EnterpriseHero />
        <EnterpriseBentoGrid />
        <ComplianceSecuritySection />
        <EnterpriseContactCta />
      </div>
    </>
  );
}
