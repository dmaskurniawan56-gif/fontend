"use client";

import React from "react";
import {
  Shuffle,
  Keyboard,
  Clock,
  TrendingUp,
  RotateCw,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function AntiBan5LayersVisual() {
  const { t } = useI18n();

  const layers = [
    {
      num: "01",
      icon: <Shuffle className="size-5 text-emerald-600 dark:text-wise-green" />,
      title: t("landingPages.broadcast.layer1Title"),
      desc: t("landingPages.broadcast.layer1Desc"),
      tag: "Pesan Selalu Berbeda",
      badgeStyle:
        "bg-emerald-500/10 text-emerald-800 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    },
    {
      num: "02",
      icon: <Keyboard className="size-5 text-blue-600 dark:text-blue-400" />,
      title: t("landingPages.broadcast.layer2Title"),
      desc: t("landingPages.broadcast.layer2Desc"),
      tag: "Meniru Kebiasaan Mengetik",
      badgeStyle:
        "bg-blue-500/10 text-blue-800 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
    },
    {
      num: "03",
      icon: <Clock className="size-5 text-amber-600 dark:text-amber-400" />,
      title: t("landingPages.broadcast.layer3Title"),
      desc: t("landingPages.broadcast.layer3Desc"),
      tag: "Jeda Waktu Kirim Santai",
      badgeStyle:
        "bg-amber-500/10 text-amber-900 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    },
    {
      num: "04",
      icon: <TrendingUp className="size-5 text-teal-600 dark:text-teal-400" />,
      title: t("landingPages.broadcast.layer4Title"),
      desc: t("landingPages.broadcast.layer4Desc"),
      tag: "Penyesuaian Nomor Baru",
      badgeStyle:
        "bg-teal-500/10 text-teal-800 border-teal-500/20 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30",
    },
    {
      num: "05",
      icon: <RotateCw className="size-5 text-indigo-600 dark:text-indigo-400" />,
      title: t("landingPages.broadcast.layer5Title"),
      desc: t("landingPages.broadcast.layer5Desc"),
      tag: "Bagi Beban Banyak Nomor",
      badgeStyle:
        "bg-indigo-500/10 text-indigo-800 border-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
    },
  ];

  return (
    <section
      id="anti-ban"
      className="scroll-mt-20 sm:scroll-mt-24 mx-auto max-w-5xl px-4 sm:px-6 py-4 sm:py-6"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wise-green/15 text-dark-green dark:text-wise-green text-xs font-bold">
          <ShieldCheck className="size-3.5" />
          <span>Sistem Perlindungan Akun WhatsApp</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.broadcast.protectionTitle")}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.broadcast.protectionSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {layers.map((layer, index) => (
          <div
            key={index}
            className={`rounded-2xl border border-border bg-surface p-6 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-wise-green/50 transition-all hover:-translate-y-1 ${
              index === 4 ? "md:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center">
                  {layer.icon}
                </div>
                <span className="font-mono text-xs font-bold text-foreground-muted">
                  {layer.num}
                </span>
              </div>

              <div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${layer.badgeStyle}`}
                >
                  {layer.tag}
                </span>
                <h3 className="text-base font-bold text-foreground mt-2">
                  {layer.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                  {layer.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
