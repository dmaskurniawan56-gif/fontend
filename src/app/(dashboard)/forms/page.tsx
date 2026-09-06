import type { Metadata } from "next";
import { FormsView } from "@/modules/form/views/FormsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Formulir Dinamis & Pendaftaran Publik",
  description:
    "Buat dan kelola landing page formulir publik untuk reservasi, leads WhatsApp, dan pengumpulan data otomatis.",
  alternates: {
    canonical: "/forms",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FormsPage() {
  return (
    <SellerRouteGuard>
      <FormsView />
    </SellerRouteGuard>
  );
}
