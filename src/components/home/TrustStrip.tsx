"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { CheckCircle2, Zap, ShieldCheck, BadgePercent } from "lucide-react";

export function TrustStrip() {
  const { t } = useI18n();

  const items = [
    {
      icon: CheckCircle2,
      metric: t("common.landing.trustStrip.item1Metric"),
      label: t("common.landing.trustStrip.item1Label"),
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Zap,
      metric: t("common.landing.trustStrip.item2Metric"),
      label: t("common.landing.trustStrip.item2Label"),
      accent: "text-amber-500 dark:text-amber-400",
    },
    {
      icon: ShieldCheck,
      metric: t("common.landing.trustStrip.item3Metric"),
      label: t("common.landing.trustStrip.item3Label"),
      accent: "text-dark-green dark:text-wise-green",
    },
    {
      icon: BadgePercent,
      metric: t("common.landing.trustStrip.item4Metric"),
      label: t("common.landing.trustStrip.item4Label"),
      accent: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="border-border bg-surface grid grid-cols-2 gap-3.5 rounded-2xl border p-4 shadow-xs sm:gap-4 sm:p-6 lg:grid-cols-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-border/60 hover:bg-muted/20"
            >
              <div className="bg-muted/60 flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Icon className={`size-5 ${item.accent}`} />
              </div>
              <div className="min-w-0">
                <div className="text-foreground font-mono text-sm font-black tracking-tight sm:text-base">
                  {item.metric}
                </div>
                <div className="text-foreground-secondary truncate text-[11px] font-semibold">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
