"use client";

import React from "react";
import {
  Zap,
  ShieldCheck,
  Webhook,
  Layers,
  RotateCcw,
  Clock,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function ApiFeaturesBento() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-4 sm:py-6">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.apiGateway.featuresTitle")}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.apiGateway.featuresSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Bento 1: VIP Priority OTP Express (Span 2 on lg, 1 on mobile/tablet) */}
        <div className="lg:col-span-2 group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-wise-green/50 hover:shadow-md space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
                <Layers className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-wise-green border border-emerald-500/20">
                {t("landingPages.apiGateway.bentoBadgeOtp")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green transition-colors">
                {t("landingPages.apiGateway.featureOtpTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.apiGateway.featureOtpDesc")}
              </p>
            </div>
          </div>

          {/* Micro-visual Priority Stream Box */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-foreground">
                VIP Express Pipeline
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-foreground-secondary">
              <span className="px-2 py-0.5 rounded bg-background border border-border font-semibold">
                Priority: High
              </span>
              <span className="text-dark-green dark:text-wise-green font-bold">
                &lt; 400ms Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Bento 2: Sub-second Response Time */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-wise-green/50 hover:shadow-md space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Zap className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                {t("landingPages.apiGateway.bentoBadgeFast")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green transition-colors">
                {t("landingPages.apiGateway.featureFastTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.apiGateway.featureFastDesc")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 flex items-center justify-between text-xs">
            <span className="text-foreground-muted flex items-center gap-1">
              <Clock className="size-3.5" />
              Rata-rata Respon:
            </span>
            <span className="font-mono font-bold text-dark-green dark:text-wise-green">
              ~210ms
            </span>
          </div>
        </div>

        {/* Bento 3: Two-Way Webhook Pipeline */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-wise-green/50 hover:shadow-md space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-blue-500/15 text-blue-800 dark:text-blue-300 flex items-center justify-center">
                <Webhook className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20">
                {t("landingPages.apiGateway.bentoBadgeWebhook")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green transition-colors">
                {t("landingPages.apiGateway.featureWebhookTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.apiGateway.featureWebhookDesc")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 font-mono text-[11px] text-foreground-secondary flex items-center justify-between">
            <span>Header:</span>
            <span className="text-foreground font-semibold">
              X-Wahide-Signature-256
            </span>
          </div>
        </div>

        {/* Bento 4: Multi-Number Load Balancing */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-wise-green/50 hover:shadow-md space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                {t("landingPages.apiGateway.bentoBadgeMulti")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green transition-colors">
                {t("landingPages.apiGateway.featureMultiTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.apiGateway.featureMultiDesc")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs flex items-center justify-between text-foreground-secondary">
            <span>Algoritma Distribusi:</span>
            <span className="font-bold text-foreground">
              Round-Robin Pooling
            </span>
          </div>
        </div>

        {/* Bento 5: Enterprise Security & Retry Guarantee */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-wise-green/50 hover:shadow-md space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-purple-500/15 text-purple-800 dark:text-purple-300 flex items-center justify-center">
                <RotateCcw className="size-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-500/20">
                {t("landingPages.apiGateway.bentoBadgeRetry")}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green transition-colors">
                {t("landingPages.apiGateway.featureRetryTitle")}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {t("landingPages.apiGateway.featureRetryDesc")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs flex items-center justify-between text-foreground-secondary">
            <span>Strategi Kirim Ulang:</span>
            <span className="font-bold text-foreground">
              Exponential Backoff
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
