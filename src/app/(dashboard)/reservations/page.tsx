import type { Metadata } from "next";
import { ReservationsView } from "@/modules/reservation/views/ReservationsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Jadwal Reservasi & Janji Temu Pelanggan",
  description:
    "Kelola booking, kalender reservasi, dan integrasi pengingat janji temu WhatsApp otomatis.",
  alternates: {
    canonical: "/reservations",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReservationsPage() {
  return (
    <SellerRouteGuard>
      <ReservationsView />
    </SellerRouteGuard>
  );
}
