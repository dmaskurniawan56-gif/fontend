"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { ArrowRight, Building2, Headphones, ShieldCheck, Clock } from "lucide-react";

export function EnterpriseHero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden pt-4 pb-2 sm:pt-8 sm:pb-4">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
          {/* Top Badge */}
          <div className="bg-surface border-border inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold shadow-xs">
            <Building2 className="size-4 text-wise-green" />
            <span className="text-foreground">
              {t("landingPages.enterprise.badge")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-foreground max-w-4xl text-3xl leading-[1.08] font-black tracking-tight sm:text-5xl lg:text-6xl">
            {t("landingPages.enterprise.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-foreground-secondary max-w-3xl text-sm leading-relaxed font-semibold sm:text-base lg:text-lg">
            {t("landingPages.enterprise.subtitle")}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 pt-2">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "default" }),
                "min-h-12 gap-2.5 px-7 py-5 text-sm font-bold shadow-sm sm:text-base",
              )}
            >
              <span>{t("landingPages.enterprise.ctaContact")}</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "border-border hover:border-foreground-muted min-h-12 rounded-full px-6 py-5 text-sm font-bold sm:text-base",
              )}
            >
              {t("landingPages.enterprise.ctaDemo")}
            </Link>
          </div>

          {/* Trust Strip */}
          <div className="border-border/60 flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 border-t pt-4 text-xs font-semibold text-foreground-secondary">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Clock className="size-3.5" /> Layanan Siap Pakai 24/7
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-blue-500">
              <ShieldCheck className="size-3.5" /> Data Terjaga Rahasia & Aman
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-indigo-500">
              <Headphones className="size-3.5" /> Pendampingan Langsung Tim Ahli
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
