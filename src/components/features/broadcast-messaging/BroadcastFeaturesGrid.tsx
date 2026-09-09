"use client";

import React from "react";
import { FileSpreadsheet, Tags, CalendarClock, BarChart3 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function BroadcastFeaturesGrid() {
  const { t } = useI18n();

  const features = [
    {
      icon: <FileSpreadsheet className="size-5 text-emerald-500" />,
      title:
        t("landingPages.broadcast.featureCsvTitle") ||
        "Impor Kontak Massal CSV & Excel",
      desc:
        t("landingPages.broadcast.featureCsvDesc") ||
        "Unggah ribuan nomor kontak sekaligus dengan pembersihan format nomor otomatis dan deteksi duplikat.",
    },
    {
      icon: <Tags className="size-5 text-blue-500" />,
      title:
        t("landingPages.broadcast.featureTagTitle") ||
        "Segmentasi Audiens Berdasarkan Tag",
      desc:
        t("landingPages.broadcast.featureTagDesc") ||
        "Kelompokkan pelanggan ke dalam tag khusus (VIP, Reseller, Leads) dan targetkan kampanye yang relevan.",
    },
    {
      icon: <CalendarClock className="size-5 text-amber-500" />,
      title:
        t("landingPages.broadcast.featureScheduleTitle") ||
        "Jadwal Siaran & Jam Kerja Otomatis",
      desc:
        t("landingPages.broadcast.featureScheduleDesc") ||
        "Atur pengiriman pesan pada jam-jam optimal pelanggan dengan fitur pause/resume instan.",
    },
    {
      icon: <BarChart3 className="size-5 text-purple-500" />,
      title:
        t("landingPages.broadcast.featureAnalyticsTitle") ||
        "Laporan Status Pengiriman Transparan",
      desc:
        t("landingPages.broadcast.featureAnalyticsDesc") ||
        "Pantau status TERKIRIM, DITERIMA, dan TERBACA secara real-time dari dashboard analitik.",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.broadcast.featuresTitle") ||
            "Fitur Kampanye Lengkap untuk Pertumbuhan Bisnis"}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.broadcast.featuresSubtitle") ||
            "Dari segmentasi audiens hingga pelacakan konversi riil."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex items-start gap-4 hover:border-wise-green/50 transition-colors"
          >
            <div className="size-11 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
              {f.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">{f.title}</h3>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
