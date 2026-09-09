"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function EcommerceCtaSection() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-2 pb-6 sm:pt-4 sm:pb-8">
      <div className="border border-wise-green/40 bg-wise-green/10 dark:bg-wise-green/5 space-y-6 rounded-2xl p-7 sm:p-10 text-center shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-[11px] font-bold text-dark-green dark:text-wise-green shadow-2xs">
          <Sparkles className="size-3" />
          <span>Siap Terkoneksi ke Webhook Toko Anda</span>
        </div>

        <div className="mx-auto max-w-xl space-y-2">
          <h2 className="text-foreground text-2xl leading-tight font-black tracking-tight sm:text-3xl lg:text-4xl">
            Tingkatkan Penjualan Toko Online Anda Hari Ini
          </h2>
          <p className="text-foreground-secondary text-xs sm:text-sm font-semibold leading-relaxed">
            Hubungkan WhatsApp toko ke sistem checkout Anda dalam hitungan menit
            dan biarkan bot menangani notifikasi otomatis 24/7.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "primaryPill", size: "default" }),
              "min-h-11 sm:min-h-12 gap-2 px-6 sm:px-7 text-xs sm:text-sm font-bold shadow-sm",
            )}
          >
            <ShoppingBag className="size-4" />
            <span>{t("landingPages.ecommerce.ctaTrial")}</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/features/broadcast-messaging"
            className={cn(
              buttonVariants({ variant: "secondaryPill", size: "default" }),
              "min-h-11 sm:min-h-12 px-6 sm:px-7 text-xs sm:text-sm font-bold",
            )}
          >
            Lihat Fitur Broadcast Promosi
          </Link>
        </div>
      </div>
    </section>
  );
}
