"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Server, CheckCircle2, XCircle, Zap, ShieldCheck } from "lucide-react";

export function ArchitectureComparisonSection() {
  const { t } = useI18n();

  const rows = [
    {
      feature: t("common.landing.comparison.row1Feature"),
      wahide: t("common.landing.comparison.row1Wahide"),
      others: t("common.landing.comparison.row1Others"),
      winner: true,
    },
    {
      feature: t("common.landing.comparison.row2Feature"),
      wahide: t("common.landing.comparison.row2Wahide"),
      others: t("common.landing.comparison.row2Others"),
      winner: true,
    },
    {
      feature: t("common.landing.comparison.row3Feature"),
      wahide: t("common.landing.comparison.row3Wahide"),
      others: t("common.landing.comparison.row3Others"),
      winner: true,
    },
    {
      feature: t("common.landing.comparison.row4Feature"),
      wahide: t("common.landing.comparison.row4Wahide"),
      others: t("common.landing.comparison.row4Others"),
      winner: true,
    },
    {
      feature: t("common.landing.comparison.row5Feature"),
      wahide: t("common.landing.comparison.row5Wahide"),
      others: t("common.landing.comparison.row5Others"),
      winner: true,
    },
  ];

  return (
    <section className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl space-y-2.5 text-center">
        <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold shadow-xs">
          <Server className="size-3.5" />
          <span>{t("common.landing.comparison.badge")}</span>
        </div>
        <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-4xl">
          {t("common.landing.comparison.title")}
        </h2>
        <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
          {t("common.landing.comparison.subtitle")}
        </p>
      </div>

      {/* Comparison Table / Card */}
      <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-border bg-muted/40 border-b font-bold">
                <th className="p-4 sm:p-5 text-foreground font-black">
                  {t("common.landing.comparison.colFeature")}
                </th>
                <th className="border-wise-green/40 bg-wise-green/10 dark:bg-wise-green/15 p-4 sm:p-5 text-dark-green dark:text-wise-green border-x font-black">
                  <div className="flex items-center gap-2">
                    <span>{t("common.landing.comparison.colWahide")}</span>
                    <span className="bg-wise-green text-near-black rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      Unggul
                    </span>
                  </div>
                </th>
                <th className="text-foreground-muted p-4 sm:p-5 font-semibold">
                  {t("common.landing.comparison.colOthers")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="text-foreground p-4 sm:p-5 font-bold">
                    {row.feature}
                  </td>
                  <td className="border-wise-green/30 bg-wise-green/5 dark:bg-wise-green/10 border-x p-4 sm:p-5 font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-dark-green dark:text-wise-green size-4 shrink-0" />
                      <span>{row.wahide}</span>
                    </div>
                  </td>
                  <td className="text-foreground-secondary p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-4 shrink-0 text-rose-500/80" />
                      <span>{row.others}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Callout: Technical Assurance */}
        <div className="border-border bg-muted/30 flex flex-col items-start justify-between gap-3 border-t p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-wise-green/20 text-dark-green dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Zap className="size-5" />
            </div>
            <div>
              <h4 className="text-foreground text-xs font-bold sm:text-sm">
                Stabilitas Terjamin Tanpa Out-of-Memory (OOM)
              </h4>
              <p className="text-foreground-secondary text-[11px] sm:text-xs">
                Arsitektur Go Socket Native mengeliminasi ketergantungan pada browser headless yang berat dan rentan macet.
              </p>
            </div>
          </div>
          <div className="text-dark-green dark:text-wise-green flex items-center gap-1 text-xs font-bold shrink-0">
            <ShieldCheck className="size-4" />
            <span>99.9% Session Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
