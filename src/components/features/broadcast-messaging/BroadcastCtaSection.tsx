"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { ArrowRight, Sparkles } from "lucide-react";

export function BroadcastCtaSection() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-dark-green to-zinc-950 p-8 sm:p-14 text-white shadow-xl text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-wise-green">
          <Sparkles className="size-3.5" />
          <span>Gratis Coba Sekarang</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
          {t("landingPages.broadcast.ctaBoxTitle") ||
            "Mulai Tingkatkan Penjualan dengan Smart Broadcast"}
        </h2>

        <p className="text-zinc-200 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
          {t("landingPages.broadcast.ctaBoxSubtitle") ||
            "Bergabunglah dengan ribuan bisnis yang menggunakan Wahide untuk komunikasi pelanggan yang lebih efektif."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "primaryPill", size: "default" }),
              "min-h-12 bg-wise-green hover:bg-wise-green/90 text-zinc-950 font-bold px-8 py-5 text-sm sm:text-base shadow-lg gap-2",
            )}
          >
            <span>Daftar & Mulai Siaran</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center min-h-12 rounded-full px-6 py-5 text-sm sm:text-base font-bold text-white hover:bg-white/10 transition-colors border border-white/20"
          >
            Lihat Paket Harga
          </Link>
        </div>
      </div>
    </section>
  );
}
