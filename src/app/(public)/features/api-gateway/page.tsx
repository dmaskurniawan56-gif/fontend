import type { Metadata } from "next";
import { ApiGatewayHero } from "@/components/features/api-gateway/ApiGatewayHero";
import { LiveEndpointSandbox } from "@/components/features/api-gateway/LiveEndpointSandbox";
import { ApiFeaturesBento } from "@/components/features/api-gateway/ApiFeaturesBento";
import { WebhookArchitecture } from "@/components/features/api-gateway/WebhookArchitecture";
import { ApiCtaSection } from "@/components/features/api-gateway/ApiCtaSection";

export const metadata: Metadata = {
  title: "WhatsApp API Gateway - RESTful API & Webhooks Cepat",
  description:
    "Integrasikan WhatsApp RESTful API ke aplikasi Anda dengan latensi sub-detik (<400ms), antrean prioritas OTP terpisah, dan Webhook dua arah terenkripsi HMAC SHA256.",
  keywords: [
    "WhatsApp API Gateway",
    "WhatsApp REST API Indonesia",
    "WhatsApp OTP Gateway",
    "Webhook WhatsApp Realtime",
    "WhatsApp API Murah",
    "Wahide API Gateway",
  ],
  alternates: {
    canonical: "/features/api-gateway",
  },
  openGraph: {
    title: "WhatsApp API Gateway - RESTful API & Webhooks Cepat | Wahide",
    description:
      "Integrasikan WhatsApp RESTful API ke aplikasi Anda dengan latensi sub-detik (<400ms), antrean prioritas OTP terpisah, dan Webhook dua arah terenkripsi HMAC SHA256.",
    url: "/features/api-gateway",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

const apiJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Wahide WhatsApp API Gateway",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Cloud / Web API",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
    availability: "https://schema.org/InStock",
  },
  description:
    "Enterprise-grade WhatsApp REST API Gateway with sub-400ms latency, high-priority OTP queue, and HMAC SHA256 two-way webhooks.",
};

export default function ApiGatewayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(apiJsonLd) }}
      />
      <div className="space-y-10 sm:space-y-14 py-4 sm:py-6">
        <ApiGatewayHero />
        <LiveEndpointSandbox />
        <ApiFeaturesBento />
        <WebhookArchitecture />
        <ApiCtaSection />
      </div>
    </>
  );
}
