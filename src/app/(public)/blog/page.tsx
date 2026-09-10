import type { Metadata } from "next";
import { BlogListView } from "@/components/public/BlogListView";

export const metadata: Metadata = {
  title: "Blog & Panduan WhatsApp Gateway",
  description:
    "Panduan praktis integrasi WhatsApp Multi-Device, keamanan Webhook, dan strategi pengiriman pesan yang aman.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog & Panduan WhatsApp Gateway",
    description:
      "Panduan praktis integrasi WhatsApp Multi-Device, keamanan Webhook, dan strategi pengiriman pesan yang aman.",
    url: "/blog",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogListView />;
}
