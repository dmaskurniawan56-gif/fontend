"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ShoppingBag, Sparkles, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function EcommerceCtaSection() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-dark-green to-zinc-950 p-8 sm:p-14 text-white shadow-xl text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-wise-green">
          <Sparkles className="size-3.5" />
          <span>Siap Terkoneksi ke Webhook Toko Anda</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
          Tingkatkan Penjualan Toko Online Anda Hari Ini
        </h2>

        <p className="text-zinc-200 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
          Hubungkan WhatsApp toko ke sistem checkout Anda dalam hitungan menit dan biarkan bot menangani notifikasi otomatis 24/7.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "primaryPill", size: "default" }),
              "min-h-12 bg-wise-green hover:bg-wise-green/90 text-zinc-950 font-bold px-8 py-5 text-sm sm:text-base shadow-lg gap-2",
            )}
          >
            <ShoppingBag className="size-4" />
            <span>{t("landingPages.ecommerce.ctaTrial") || "Mulai Otomasi Olshop"}</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/features/broadcast-messaging"
            className="inline-flex items-center justify-center min-h-12 rounded-full px-6 py-5 text-sm sm:text-base font-bold text-white hover:bg-white/10 transition-colors border border-white/20"
          >
            Lihat Fitur Broadcast Promosi
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs font-semibold text-zinc-300">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-wise-green" /> Setup Mudah dalam 3 Menit
          </span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-wise-green" /> Support REST API & Webhooks
          </span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-wise-green" /> Gratis Coba Akun Baru
          </span>
        </div>
      </div>
    </section>
  );
}
