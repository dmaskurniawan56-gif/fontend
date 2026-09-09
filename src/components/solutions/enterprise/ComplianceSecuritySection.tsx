"use client";

import React from "react";
import {
  Search,
  Compass,
  Rocket,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function ComplianceSecuritySection() {
  const { t } = useI18n();

  const steps = [
    {
      num: "01",
      icon: <Search className="size-5 text-emerald-500" />,
      title: t("landingPages.enterprise.step1Title"),
      desc: t("landingPages.enterprise.step1Desc"),
    },
    {
      num: "02",
      icon: <Compass className="size-5 text-blue-500" />,
      title: t("landingPages.enterprise.step2Title"),
      desc: t("landingPages.enterprise.step2Desc"),
    },
    {
      num: "03",
      icon: <Rocket className="size-5 text-amber-500" />,
      title: t("landingPages.enterprise.step3Title"),
      desc: t("landingPages.enterprise.step3Desc"),
    },
    {
      num: "04",
      icon: <TrendingUp className="size-5 text-purple-500" />,
      title: t("landingPages.enterprise.step4Title"),
      desc: t("landingPages.enterprise.step4Desc"),
    },
  ];

  return (
    <section className="border-border/60 bg-muted/20 border-y py-6 sm:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto mb-6 sm:mb-8 max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>Pendampingan Bisnis Terpercaya</span>
          </div>
          <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            {t("landingPages.enterprise.processTitle")}
          </h2>
          <p className="text-foreground-secondary text-sm font-semibold leading-relaxed sm:text-base">
            {t("landingPages.enterprise.processSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-surface border-border rounded-2xl border p-6 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold font-mono text-foreground-muted">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-foreground text-base font-bold">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-foreground-secondary font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
