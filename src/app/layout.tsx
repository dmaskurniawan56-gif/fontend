import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { env } from "@/lib/config/env";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = env.NEXT_PUBLIC_APP_URL || "https://wahide.id";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfcf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f0c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wahide - WhatsApp Gateway & Otomasi Bisnis",
    template: "%s | Wahide",
  },
  description:
    "Platform WhatsApp Gateway & otomasi bisnis: kirim broadcast anti-blokir, sistem reservasi, pengingat otomatis, dan formulir web terintegrasi.",
  keywords: [
    "WhatsApp Gateway",
    "WhatsApp Gateway Indonesia",
    "WhatsApp API Gateway",
    "WhatsApp Multi Device",
    "Broadcast WhatsApp Anti Blokir",
    "Otomasi WhatsApp Bisnis",
    "Sistem Reservasi WhatsApp",
    "Pengingat Otomatis WhatsApp",
    "Formulir Dinamis WhatsApp",
    "Wahide",
  ],
  authors: [{ name: "Hide Digital Security", url: siteUrl }],
  creator: "Wahide",
  publisher: "Hide Digital Security",
  applicationName: "Wahide",
  generator: "Next.js 16",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "id-ID": siteUrl,
      "en-US": `${siteUrl}/en`,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Wahide - WhatsApp Gateway & Otomasi Bisnis",
    description:
      "Solusi WhatsApp Gateway terpadu: broadcast massal anti-blokir, reservasi online, pengingat otomatis, dan formulir web siap pakai.",
    url: siteUrl,
    siteName: "Wahide",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: `${siteUrl}/icon.png`,
        width: 512,
        height: 512,
        alt: "Wahide - WhatsApp Gateway & Otomasi Bisnis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahide - WhatsApp Gateway & Otomasi Bisnis",
    description:
      "Solusi WhatsApp Gateway terpadu: broadcast massal anti-blokir, reservasi online, pengingat otomatis, dan formulir web siap pakai.",
    creator: "@wahide_app",
    images: [`${siteUrl}/icon.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Wahide",
      url: siteUrl,
      description: "Platform WhatsApp Gateway & Otomasi Bisnis Terpadu",
      inLanguage: "id-ID",
    },
    {
      "@type": "SoftwareApplication",
      name: "Wahide",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Cloud, Web-based",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
      description:
        "Solusi WhatsApp Gateway dan otomasi bisnis terpadu: broadcast massal anti-blokir, sistem reservasi online, pengingat otomatis, formulir dinamis, dan REST API.",
      featureList: [
        "WhatsApp Multi-Device Gateway",
        "Broadcast Promosi Anti-Blokir",
        "Sistem Reservasi & Booking Jadwal",
        "Otomasi Pengingat & Jatuh Tempo",
        "Formulir Dinamis Publik",
        "Pustaka Template Pesan Bisnis",
        "REST API & Webhook Real-Time",
      ],
    },
    {
      "@type": "Organization",
      name: "Hide Digital Security",
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62877111301818",
        contactType: "customer service",
        availableLanguage: ["Indonesian", "English"],
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`h-full font-sans antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {siteUrl && !siteUrl.includes("localhost") && (
          <>
            <link rel="preconnect" href={siteUrl} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={siteUrl} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground selection:bg-wise-green selection:text-dark-green flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
