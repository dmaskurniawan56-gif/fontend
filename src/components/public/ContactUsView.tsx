"use client";

import React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Building2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Code2,
  Headphones,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function ContactUsView() {
  const { t } = useI18n();

  const googleMapsUrl =
    "https://maps.google.com/?q=Jl.+Kampung+Baris+No.391,+Karangturi,+Kec.+Semarang+Tim.,+Kota+Semarang,+Jawa+Tengah+50124";
  const whatsappUrl =
    "https://wa.me/62877111301818?text=Halo%20Tim%20Wahide,%20saya%20ingin%20konsultasi%20layanan%20WhatsApp%20Gateway";
  const enterpriseWaUrl =
    "https://wa.me/62877111301818?text=Halo%20Tim%20Wahide,%20saya%20ingin%20konsultasi%20kebutuhan%20skala%20Enterprise";

  return (
    <div className="space-y-12 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* 1. Header Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
          <MessageSquare className="size-3.5" />
          <span>{t("contactUs.badge")}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          {t("contactUs.title")}
        </h1>
        <p className="text-sm sm:text-base font-semibold text-foreground-secondary leading-relaxed">
          {t("contactUs.subtitle")}
        </p>
      </div>

      {/* 2. Top 3 Direct Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Direct Hotline */}
        <div className="p-6 rounded-xl border border-wise-green/30 bg-wise-green/5 space-y-4 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center shadow-xs">
                <Phone className="size-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Respon Cepat
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground">
                {t("contactUs.cardDirectWhatsApp")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
                {t("contactUs.cardDirectWhatsAppDesc")}
              </p>
            </div>

            <div className="text-base font-black font-mono text-dark-green dark:text-wise-green pt-1">
              0877-1113-01818
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block pt-2"
          >
            <Button
              variant="primaryPill"
              size="default"
              className="w-full text-xs font-bold gap-2 shadow-xs"
            >
              <MessageSquare className="size-4" />
              <span>{t("contactUs.btnChatWhatsApp")}</span>
            </Button>
          </a>
        </div>

        {/* Official Email */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-xs flex flex-col justify-between hover:border-border/80 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-muted flex items-center justify-center text-foreground-secondary shadow-xs">
                <Mail className="size-5" />
              </div>
              <span className="text-[11px] font-semibold text-foreground-muted">
                B2B &amp; Kemitraan
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground">
                {t("contactUs.cardEmail")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
                {t("contactUs.cardEmailDesc")}
              </p>
            </div>

            <div className="text-base font-black font-mono text-foreground pt-1">
              dmaskurniawan56@gmail.com
            </div>
          </div>

          <a href="mailto:dmaskurniawan56@gmail.com" className="block pt-2">
            <Button
              variant="outline"
              size="default"
              className="w-full rounded-full text-xs font-bold border-border hover:bg-muted/50"
            >
              <Mail className="size-3.5" />
              <span>{t("contactUs.btnSendEmail")}</span>
            </Button>
          </a>
        </div>

        {/* Office Address */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-xs flex flex-col justify-between hover:border-border/80 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-muted flex items-center justify-center text-foreground-secondary shadow-xs">
                <Building2 className="size-5" />
              </div>
              <span className="text-[11px] font-semibold text-foreground-muted">
                Semarang, ID
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground">
                {t("contactUs.cardOffice")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
                Jl. Kampung Baris No.391, Karangturi, Kec. Semarang Tim., Kota
                Semarang, Jawa Tengah 50124
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground-muted pt-1">
              <Clock className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
              <span>{t("contactUs.cardOfficeHours")}</span>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block pt-2"
          >
            <Button
              variant="outline"
              size="default"
              className="w-full rounded-full text-xs font-bold border-border hover:bg-muted/50 gap-1.5"
            >
              <MapPin className="size-3.5" />
              <span>{t("contactUs.btnOpenMaps")}</span>
              <ExternalLink className="size-3 opacity-70" />
            </Button>
          </a>
        </div>
      </div>

      {/* 3. Fast-Track Support & Integration Hub */}
      <div className="space-y-6">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t("contactUs.fastTrackTitle")}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary">
            {t("contactUs.fastTrackSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A: API Documentation & Integration */}
          <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-xs flex flex-col justify-between hover:border-foreground-muted/40 transition-colors">
            <div className="space-y-3">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-wise-green flex items-center justify-center">
                <Code2 className="size-5" />
              </div>
              <h3 className="text-base font-black text-foreground">
                {t("contactUs.fastTrackApiTitle")}
              </h3>
              <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
                {t("contactUs.fastTrackApiDesc")}
              </p>
            </div>

            <Link
              href="/docs/intro"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full rounded-full text-xs font-bold border-border hover:bg-muted/50 gap-1.5 justify-center",
              )}
            >
              <span>{t("contactUs.btnOpenDocs")}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Card B: Enterprise & High Volume Solution */}
          <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-xs flex flex-col justify-between hover:border-foreground-muted/40 transition-colors">
            <div className="space-y-3">
              <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Building2 className="size-5" />
              </div>
              <h3 className="text-base font-black text-foreground">
                {t("contactUs.fastTrackEnterpriseTitle")}
              </h3>
              <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
                {t("contactUs.fastTrackEnterpriseDesc")}
              </p>
            </div>

            <a
              href={enterpriseWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full rounded-full text-xs font-bold border-border hover:bg-muted/50 gap-1.5 justify-center",
              )}
            >
              <span>{t("contactUs.btnEnterpriseConsult")}</span>
              <ExternalLink className="size-3.5 opacity-70" />
            </a>
          </div>

          {/* Card C: Dashboard Technical Support */}
          <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-xs flex flex-col justify-between hover:border-foreground-muted/40 transition-colors">
            <div className="space-y-3">
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Headphones className="size-5" />
              </div>
              <h3 className="text-base font-black text-foreground">
                {t("contactUs.fastTrackSupportTitle")}
              </h3>
              <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
                {t("contactUs.fastTrackSupportDesc")}
              </p>
            </div>

            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full rounded-full text-xs font-bold border-border hover:bg-muted/50 gap-1.5 justify-center",
              )}
            >
              <span>{t("contactUs.btnDashboardSupport")}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Service Level & Operational Trust Bar */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="flex flex-col items-center gap-1.5 py-2 sm:py-0 px-3">
            <Zap className="size-4 text-dark-green dark:text-wise-green" />
            <span className="text-xs font-bold text-foreground">
              {t("contactUs.slaResponse")}
            </span>
            <span className="text-[11px] font-semibold text-foreground-secondary">
              WhatsApp CS Siap Membantu
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-2 sm:py-0 px-3">
            <ShieldCheck className="size-4 text-dark-green dark:text-wise-green" />
            <span className="text-xs font-bold text-foreground">
              {t("contactUs.slaSecurity")}
            </span>
            <span className="text-[11px] font-semibold text-foreground-secondary">
              Perlindungan Privasi Payload
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-2 sm:py-0 px-3">
            <CheckCircle2 className="size-4 text-dark-green dark:text-wise-green" />
            <span className="text-xs font-bold text-foreground">
              {t("contactUs.slaUptime")}
            </span>
            <span className="text-[11px] font-semibold text-foreground-secondary">
              Infrastruktur Terdistribusi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
