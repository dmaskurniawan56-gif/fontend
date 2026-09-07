import { Metadata } from "next";
import { DocsLayoutClient } from "@/components/doc/DocsLayoutClient";

export const metadata: Metadata = {
  title: {
    template: "%s | Wahide WhatsApp API Docs",
    default: "Wahide WhatsApp API Documentation - Developer Portal",
  },
  description:
    "Official developer documentation for Wahide WhatsApp Multi-Device REST API. Fast integration with cURL, Node.js, PHP, Python, and Go.",
  openGraph: {
    siteName: "Wahide WhatsApp API Docs",
    type: "website",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
