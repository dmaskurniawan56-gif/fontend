"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Building2, Headphones, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function EnterpriseContactCta() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-emerald-950 p-8 sm:p-14 text-white shadow-xl text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-wise-green">
          <Building2 className="size-3.5" />
          <span>Dukungan Penuh & Pendampingan Bisnis</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
          Diskusikan Kebutuhan Komunikasi Perusahaan Anda
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
          Konsultasikan alur komunikasi pelanggan, perkiraan kebutuhan pesan, serta integrasi ke sistem kantor Anda bersama tim konsultan kami.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "primaryPill", size: "default" }),
              "min-h-12 bg-wise-green hover:bg-wise-green/90 text-zinc-950 font-bold px-8 py-5 text-sm sm:text-base shadow-lg gap-2",
            )}
          >
            <Headphones className="size-4" />
            <span>{t("landingPages.enterprise.ctaContact") || "Konsultasi Tim Ahli Kami"}</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center min-h-12 rounded-full px-6 py-5 text-sm sm:text-base font-bold text-white hover:bg-white/10 transition-colors border border-white/20"
          >
            {t("landingPages.enterprise.ctaDemo") || "Minta Jadwal Demo"}
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs font-semibold text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-wise-green" /> Tim Pendamping Langsung
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-wise-green" /> Perjanjian Kerahasiaan & Faktur Resmi
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-wise-green" /> Panduan Penggunaan Lengkap
          </span>
        </div>
      </div>
    </section>
  );
}
