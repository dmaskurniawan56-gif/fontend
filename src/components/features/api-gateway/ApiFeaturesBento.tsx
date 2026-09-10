"use client";

import React from "react";
import {
  Zap,
  ShieldCheck,
  Webhook,
  Layers,
  RotateCcw,
  Lock,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function ApiFeaturesBento() {
  const { t } = useI18n();

  const features = [
    {
      icon: <Zap className="size-5 text-amber-500" />,
      title: t("landingPages.apiGateway.featureFastTitle"),
      desc: t("landingPages.apiGateway.featureFastDesc"),
      badge: t("landingPages.apiGateway.bentoBadgeFast"),
    },
    {
      icon: <Layers className="size-5 text-emerald-600 dark:text-wise-green" />,
      title: t("landingPages.apiGateway.featureOtpTitle"),
      desc: t("landingPages.apiGateway.featureOtpDesc"),
      badge: t("landingPages.apiGateway.bentoBadgeOtp"),
    },
    {
      icon: <Webhook className="size-5 text-blue-500" />,
      title: t("landingPages.apiGateway.featureWebhookTitle"),
      desc: t("landingPages.apiGateway.featureWebhookDesc"),
      badge: t("landingPages.apiGateway.bentoBadgeWebhook"),
    },
    {
      icon: <ShieldCheck className="size-5 text-emerald-500" />,
      title: t("landingPages.apiGateway.featureMultiTitle"),
      desc: t("landingPages.apiGateway.featureMultiDesc"),
      badge: t("landingPages.apiGateway.bentoBadgeMulti"),
    },
    {
      icon: <Lock className="size-5 text-rose-500" />,
      title: t("landingPages.apiGateway.featureSecurityTitle"),
      desc: t("landingPages.apiGateway.featureSecurityDesc"),
      badge: t("landingPages.apiGateway.bentoBadgeSecurity"),
    },
    {
      icon: <RotateCcw className="size-5 text-indigo-500" />,
      title: t("landingPages.apiGateway.featureRetryTitle"),
      desc: t("landingPages.apiGateway.featureRetryDesc"),
      badge: t("landingPages.apiGateway.bentoBadgeRetry"),
    },
  ];

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
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-wise-green/50 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted/80 text-foreground-secondary border border-border/60">
                  {f.badge}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-dark-green dark:group-hover:text-wise-green transition-colors">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
