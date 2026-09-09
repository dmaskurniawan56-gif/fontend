import type { Metadata } from "next";
import { AutomationHero } from "@/components/features/business-automation/AutomationHero";
import { AutomationModulesGrid } from "@/components/features/business-automation/AutomationModulesGrid";
import { AutomationCtaSection } from "@/components/features/business-automation/AutomationCtaSection";

export const metadata: Metadata = {
  title: "Otomasi Bisnis WhatsApp: Reservasi, Pengingat & Formulir | Wahide",
  description:
    "Solusi otomasi bisnis siap pakai tanpa koding: Sistem booking reservasi jadwal, pengingat otomatis jatuh tempo faktur, formulir web publik (/f/[slug]), dan pustaka template CS.",
  keywords: [
    "Sistem Reservasi WhatsApp",
    "Otomasi Pengingat WhatsApp",
    "Formulir Online WhatsApp",
    "Template Pesan Bisnis",
    "Otomasi Operasional Bisnis",
    "Wahide Business Automation",
  ],
  alternates: {
    canonical: "/features/business-automation",
  },
  openGraph: {
    title: "Otomasi Bisnis WhatsApp: Reservasi, Pengingat & Formulir ",
    description:
      "Solusi otomasi bisnis siap pakai tanpa koding: Sistem booking reservasi jadwal, pengingat otomatis jatuh tempo faktur, formulir web publik (/f/[slug]), dan pustaka template CS.",
    url: "/features/business-automation",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

const automationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Wahide Business Automation Suite",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Cloud / Web API",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
    availability: "https://schema.org/InStock",
  },
  description:
    "Integrated no-code business automation suite including appointment reservations, payment reminders, dynamic web forms, and template libraries via WhatsApp.",
};

export default function BusinessAutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(automationJsonLd) }}
      />
      <div className="space-y-10 sm:space-y-14 py-4 sm:py-6">
        <AutomationHero />
        <AutomationModulesGrid />
        <AutomationCtaSection />
      </div>
    </>
  );
}
