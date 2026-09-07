import { Metadata } from "next";
import { DocsLayoutClient } from "@/components/doc/DocsLayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://wahide.id"),
  title: {
    template: "%s | Wahide API",
    default: "Wahide WhatsApp API Documentation",
  },
  description:
    "Official developer reference for Wahide WhatsApp Multi-Device REST API. Fast integration with cURL, Node.js, PHP, Python, and Go with high deliverability.",
  keywords: [
    "WhatsApp API",
    "WhatsApp REST API",
    "WhatsApp Multi Device API",
    "WhatsApp Gateway Indonesia",
    "WhatsApp API Documentation",
    "Kirim Pesan WhatsApp API",
  ],
  authors: [{ name: "Wahide Engineering" }],
  creator: "Wahide",
  publisher: "Wahide",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wahide API Docs",
    title: "Wahide WhatsApp API Documentation",
    description:
      "Official developer reference for Wahide WhatsApp Multi-Device REST API. Fast integration with cURL, Node.js, PHP, Python, and Go.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahide WhatsApp API Documentation",
    description:
      "Official developer reference for Wahide WhatsApp Multi-Device REST API. Fast integration with cURL, Node.js, PHP, Python, and Go.",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
