import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wahide - Platform Otomasi Bisnis & WhatsApp Gateway",
    short_name: "Wahide",
    description:
      "Platform Otomasi Bisnis & WhatsApp Gateway Terpadu: Pengiriman pesan cerdas dengan proteksi reputasi, sistem reservasi, pengingat otomatis, dan formulir web terintegrasi.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0f0c",
    theme_color: "#163300",
    orientation: "portrait",
    lang: "id",
    categories: ["business", "productivity", "utilities"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
