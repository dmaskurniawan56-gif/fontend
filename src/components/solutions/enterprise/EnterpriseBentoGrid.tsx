"use client";

import React from "react";
import { Users, ShieldCheck, Layers, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function EnterpriseBentoGrid() {
  const { t } = useI18n();

  const features = [
    {
      icon: <Users className="size-5 text-wise-green" />,
      title: t("landingPages.enterprise.featureWorkflowsTitle"),
      desc: t("landingPages.enterprise.featureWorkflowsDesc"),
      badge: "Kolaborasi Tim",
    },
    {
      icon: <ShieldCheck className="size-5 text-blue-500" />,
      title: t("landingPages.enterprise.featureSecurityTitle"),
      desc: t("landingPages.enterprise.featureSecurityDesc"),
      badge: "Kontrol Privasi",
    },
    {
      icon: <Layers className="size-5 text-purple-500" />,
      title: t("landingPages.enterprise.featureIntegrationTitle"),
      desc: t("landingPages.enterprise.featureIntegrationDesc"),
      badge: "Integrasi Fleksibel",
    },
    {
      icon: <Headphones className="size-5 text-emerald-500" />,
      title: t("landingPages.enterprise.featureSupportTitle"),
      desc: t("landingPages.enterprise.featureSupportDesc"),
      badge: "Bantuan Prioritas",
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-11 rounded-xl bg-muted/60 flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-wise-green/10 text-dark-green dark:text-wise-green">
                  {f.badge}
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
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
