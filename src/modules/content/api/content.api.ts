import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { BlogPost, SystemSettings } from "../types/content.types";

const PUBLIC_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "post_01",
    slug: "5-layer-smart-delivery-protection-whatsapp",
    title: "5 Lapisan Perlindungan Pengiriman WhatsApp Gateway Aman",
    excerpt:
      "Panduan praktis bagaimana variasi pesan otomatis dan jeda pengiriman cerdas menjaga keamanan nomor bisnis Anda saat broadcast.",
    content: `Mengirim pesan broadcast ke banyak pelanggan membutuhkan strategi pengiriman yang aman dan tertata. Di platform Wahide, kami menerapkan 5 Lapis Proteksi Pengiriman Cerdas:\n\n1. **Variasi Kata Otomatis (Spintax)**: Membuat sinonim kata berbeda di tiap pesan agar tidak terdeteksi monoton.\n2. **Simulasi Mengetik Alami**: Memberikan tanda 'sedang mengetik' selama 1-3 detik sebelum pesan terkirim.\n3. **Jeda Pengiriman Santai**: Interval waktu acak yang wajar antar pesan menyerupai cara manusia berkirim chat.\n4. **Proteksi Sesi Pintar**: Menjaga sesi koneksi WhatsApp tetap stabil dan aman saat tidak ada antrean.\n5. **Bagi Beban ke Banyak Nomor**: Distribusi pesan merata ke beberapa perangkat bisnis agar satu nomor tidak kelebihan beban.`,
    author: "Wahide Core Team",
    tags: ["WhatsApp", "Proteksi", "Variasi Kata", "Keamanan"],
    publishedAt: "2026-08-25T10:00:00Z",
  },
  {
    id: "post_02",
    slug: "integrasi-webhook-signature-hmac-sha256",
    title: "Panduan Verifikasi Webhook HMAC SHA256 di Node.js & Go",
    excerpt:
      "Cara mengamankan endpoint webhook aplikasi Anda dari serangan replay dan spoofing payload menggunakan header X-Wahide-Signature-256.",
    content: `Keamanan transmisi event real-time adalah prioritas utama. Setiap event HTTP POST yang dikirimkan oleh Wahide Gateway menyertakan header signature HMAC SHA256.\n\nContoh verifikasi di Node.js:\n\`\`\`javascript\nconst crypto = require('crypto');\nconst signature = req.headers['x-wahide-signature-256'];\nconst expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');\nif (signature !== expected) throw new Error('Invalid signature');\n\`\`\``,
    author: "Security Team",
    tags: ["Webhook", "Security", "HMAC", "API"],
    publishedAt: "2026-08-28T14:00:00Z",
  },
];

export const contentApi = {
  getPosts: async (): Promise<BlogPost[]> => {
    try {
      const res = await httpClient.get<BlogPost[]>(`${PUBLIC_BASE}/posts`);
      return res.payload || DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const res = await httpClient.get<BlogPost>(
        `${PUBLIC_BASE}/posts/${slug}`,
      );
      return res.payload || DEFAULT_POSTS.find((p) => p.slug === slug) || null;
    } catch {
      return DEFAULT_POSTS.find((p) => p.slug === slug) || null;
    }
  },

  getPublicSettings: async (): Promise<SystemSettings> => {
    try {
      const res = await httpClient.get<SystemSettings>(
        `${PUBLIC_BASE}/settings`,
      );
      return (
        res.payload || {
          siteName: "Wahide",
          allowRegistration: true,
          maintenanceMode: false,
          supportEmail: "support@wahide.com",
        }
      );
    } catch {
      return {
        siteName: "Wahide",
        allowRegistration: true,
        maintenanceMode: false,
        supportEmail: "support@wahide.com",
      };
    }
  },
};
