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
      icon: <Shuffle className="size-5 text-wise-green" />,
      title: t("landingPages.broadcast.layer1Title") || "1. Spintax Variasi Kata",
      desc:
        t("landingPages.broadcast.layer1Desc") ||
        "Otomatis mengacak sinonim kalimat seperti {Halo|Hai|Selamat Siang} sehingga setiap pesan unik dan menghancurkan pola deteksi spam Meta.",
      tag: "Anti-Hash Detection",
    },
    {
      num: "02",
      icon: <Keyboard className="size-5 text-blue-500" />,
      title:
        t("landingPages.broadcast.layer2Title") || "2. Simulasi Mengetik Alami",
      desc:
        t("landingPages.broadcast.layer2Desc") ||
        "Mengirimkan status ChatPresenceComposing secara proporsional sesuai panjang pesan, meniru perilaku pengetikan manusia nyata.",
      tag: "Human Emulation",
    },
    {
      num: "03",
      icon: <Clock className="size-5 text-amber-500" />,
      title:
        t("landingPages.broadcast.layer3Title") || "3. Dynamic Jitter Delay",
      desc:
        t("landingPages.broadcast.layer3Desc") ||
        "Menerapkan jeda acak 3–7 detik antar pengiriman pesan untuk menghindari lonjakan pengiriman tidak wajar.",
      tag: "Traffic Pacing",
    },
    {
      num: "04",
      icon: <TrendingUp className="size-5 text-emerald-500" />,
      title:
        t("landingPages.broadcast.layer4Title") || "4. Account Warmup Quota",
      desc:
        t("landingPages.broadcast.layer4Desc") ||
        "Pembatasan kuota bertahap untuk nomor WhatsApp baru agar terbiasa dengan volume kirim sebelum blast skala besar.",
      tag: "Reputation Guard",
    },
    {
      num: "05",
      icon: <RotateCw className="size-5 text-indigo-500" />,
      title:
        t("landingPages.broadcast.layer5Title") ||
        "5. Multi-Device Round-Robin Pool",
      desc:
        t("landingPages.broadcast.layer5Desc") ||
        "Mendistribusikan ribuan kontak secara merata ke beberapa nomor cadangan saat nomor utama mencapai batas harian.",
      tag: "Failover Balancing",
    },
  ];

  return (
    <section id="anti-ban" className="scroll-mt-20 sm:scroll-mt-24 mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wise-green/15 text-dark-green dark:text-wise-green text-xs font-bold">
          <ShieldCheck className="size-3.5" />
          <span>Exclusive Protection Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.broadcast.protectionTitle") ||
            "5-Lapis Proteksi Pengiriman Cerdas (Anti-Ban Engine)"}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.broadcast.protectionSubtitle") ||
            "Arsitektur proteksi terdepan di Indonesia yang menjaga kesehatan dan reputasi nomor WhatsApp bisnis Anda."}
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-wise-green">
                  {layer.tag}
                </span>
                <h3 className="text-base font-bold text-foreground mt-1">
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
