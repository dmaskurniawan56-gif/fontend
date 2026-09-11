"use client";

import React from "react";
import {
  Users,
  ShieldCheck,
  Layers,
  Headphones,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function EnterpriseBentoGrid() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-4 sm:py-6">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.enterprise.featuresTitle")}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.enterprise.featuresSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Bento 1: Multi-Agent & Team Workflow (Span 2 on desktop, 1 on mobile) */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
                <Users className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-wise-green border border-emerald-500/20">
                {t("landingPages.enterprise.badgeWorkflows")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {t("landingPages.enterprise.featureWorkflowsTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.enterprise.featureWorkflowsDesc")}
              </p>
            </div>
          </div>

          {/* Micro-visual Team Roles Bar */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-foreground">
                Role-Based Access (RBAC)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-background border border-border text-foreground font-semibold">
                Owner
              </span>
              <span className="px-2 py-0.5 rounded bg-background border border-border text-foreground font-semibold">
                Manager
              </span>
              <span className="px-2 py-0.5 rounded bg-background border border-border text-foreground font-semibold">
                Agent CS
              </span>
            </div>
          </div>
        </div>

        {/* Bento 2: Enterprise Security & Compliance (Span 1) */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-blue-500/15 text-blue-800 dark:text-blue-300 flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20">
                {t("landingPages.enterprise.badgeSecurity")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {t("landingPages.enterprise.featureSecurityTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.enterprise.featureSecurityDesc")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Lock className="size-3 text-blue-800 dark:text-blue-300" />
              <span>UU PDP & GDPR Ready</span>
            </div>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              Enkripsi payload AES-256 & isolasi data antar organisasi.
            </p>
          </div>
        </div>

        {/* Bento 3: Integration & Custom Systems (Span 1) */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-purple-500/15 text-purple-800 dark:text-purple-300 flex items-center justify-center">
                <Layers className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-500/20">
                {t("landingPages.enterprise.badgeIntegration")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {t("landingPages.enterprise.featureIntegrationTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.enterprise.featureIntegrationDesc")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 flex items-center justify-between font-mono text-[11px] text-foreground-secondary">
            <span>REST API</span>
            <span>•</span>
            <span>Webhooks</span>
            <span>•</span>
            <span>ERP / CRM</span>
          </div>
        </div>

        {/* Bento 4: Dedicated Priority Support & SLA (Span 2 on desktop, 1 on mobile) */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Headphones className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                {t("landingPages.enterprise.badgeSupport")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {t("landingPages.enterprise.featureSupportTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.enterprise.featureSupportDesc")}
              </p>
            </div>
          </div>

          {/* Micro SLA Badges Row */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Zap className="size-3.5 text-amber-500" />
              <span>Jaminan Layanan Prioritas</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground-secondary font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-800 dark:text-wise-green" />
                Respon &lt; 15 Menit
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-800 dark:text-wise-green" />
                Dedicated Account Manager
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
