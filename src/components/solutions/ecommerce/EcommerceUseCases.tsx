"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  FileText,
  Truck,
  ShoppingCart,
  Users,
  CheckCheck,
} from "lucide-react";

export function EcommerceUseCases() {
  const { t } = useI18n();

  const useCases = [
    {
      icon: <FileText className="size-5 text-emerald-500" />,
      title:
        t("landingPages.ecommerce.useCaseOrderTitle") ||
        "Konfirmasi Pesanan & Faktur Instan",
      desc:
        t("landingPages.ecommerce.useCaseOrderDesc") ||
        "Otomatis kirim rincian pembelian, tagihan pembayaran (Midtrans/Xendit), dan instruksi transfer setelah checkout.",
      badge: "Instant Order",
      mockup: {
        time: "10:14",
        text: "Halo Kak Budi, pesanan #INV-88219 telah kami terima! 🛍️\n\nTotal: Rp 285.000\nMetode: QRIS / Virtual Account\n\nSelesaikan pembayaran sebelum 12:14 WIB agar langsung diproses:\nhttps://pay.tokokamu.com/inv/88219",
      },
    },
    {
      icon: <Truck className="size-5 text-blue-500" />,
      title:
        t("landingPages.ecommerce.useCaseShippingTitle") ||
        "Notifikasi Resi & Pelacakan Pengiriman",
      desc:
        t("landingPages.ecommerce.useCaseShippingDesc") ||
        "Kirim nomor resi kurir dan link pelacakan langsung ke WhatsApp pembeli saat barang dikirim.",
      badge: "Automated Resi",
      mockup: {
        time: "14:30",
        text: "Paket pesanan #INV-88219 telah diserahkan ke kurir J&T Express! 🚚\n\nNo. Resi: JP9018276354\nLacak status pengiriman Anda secara live di: https://lacak.tokokamu.com/JP9018276354",
      },
    },
    {
      icon: <ShoppingCart className="size-5 text-amber-500" />,
      title:
        t("landingPages.ecommerce.useCaseCartTitle") ||
        "Pemulihan Keranjang Belanja (Abandoned Cart)",
      desc:
        t("landingPages.ecommerce.useCaseCartDesc") ||
        "Ingatkan calon pembeli yang belum menyelesaikan pembayaran dengan penawaran khusus via WhatsApp.",
      badge: "Cart Recovery",
      mockup: {
        time: "16:45",
        text: "Hai Kak Sarah! Masih ada 2 barang impian di keranjang belanja Anda nih ✨\n\nCheckout sekarang dan gunakan kupon HEMAT10 untuk cashback 10% spesial hari ini: https://tokokamu.com/cart",
      },
    },
    {
      icon: <Users className="size-5 text-purple-500" />,
      title:
        t("landingPages.ecommerce.useCaseSupportTitle") ||
        "Layanan CS & Reseller Multi-Device",
      desc:
        t("landingPages.ecommerce.useCaseSupportDesc") ||
        "Kelola interaksi pelanggan dan jaringan reseller secara rapi dengan multi-nomor terhubung.",
      badge: "Multi-Agent Support",
      mockup: {
        time: "09:00",
        text: "[Sistem Agen Wahide]\nPesan baru dari Reseller VIP (Jawa Barat). Dialihkan otomatis ke Tim CS Wilayah 1.",
      },
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.ecommerce.useCasesTitle") ||
            "Skenario Otomasi Toko Online"}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          Ubah proses manual menjadi serba otomatis dengan pemicu webhook dari platform toko online Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {useCases.map((uc, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="size-11 rounded-xl bg-muted/60 flex items-center justify-center">
                  {uc.icon}
                </div>
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-wise-green/10 text-dark-green dark:text-wise-green">
                  {uc.badge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {uc.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {uc.desc}
              </p>
            </div>

            {/* Simulated WhatsApp Bubble */}
            <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-foreground-muted font-medium">
                <span>Notifikasi WhatsApp Pelanggan</span>
                <span className="text-[10px]">{uc.mockup.time}</span>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 p-3 text-foreground text-xs leading-relaxed whitespace-pre-line font-mono">
                {uc.mockup.text}
                <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                  <span>{uc.mockup.time}</span>
                  <CheckCheck className="size-3.5 inline text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
