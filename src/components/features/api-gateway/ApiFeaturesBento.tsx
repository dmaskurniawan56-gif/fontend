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
      title: t("landingPages.apiGateway.featureFastTitle") || "Latensi Sub-Detik (<400ms)",
      desc:
        t("landingPages.apiGateway.featureFastDesc") ||
        "Rute pengiriman optimal dengan respons cepat di bawah 400ms untuk transmisi pesan real-time.",
      badge: "Sub-Second",
    },
    {
      icon: <Layers className="size-5 text-wise-green" />,
      title: t("landingPages.apiGateway.featureOtpTitle") || "VIP Express Lane OTP",
      desc:
        t("landingPages.apiGateway.featureOtpDesc") ||
        "Jalur bebas hambatan khusus kode verifikasi OTP dan notifikasi darurat yang memotong antrean pesan broadcast.",
      badge: "Preemption",
    },
    {
      icon: <Webhook className="size-5 text-blue-500" />,
      title:
        t("landingPages.apiGateway.featureWebhookTitle") || "Dua Arah Realtime Webhook",
      desc:
        t("landingPages.apiGateway.featureWebhookDesc") ||
        "Terima pesan masuk dan update status pengiriman secara instan dengan verifikasi signature X-Wahide-Secret HMAC-SHA256.",
      badge: "Two-Way",
    },
    {
      icon: <ShieldCheck className="size-5 text-emerald-500" />,
      title:
        t("landingPages.apiGateway.featureMultiTitle") || "Multi-Device Multi-Instance",
      desc:
        t("landingPages.apiGateway.featureMultiDesc") ||
        "Hubungkan puluhan nomor WhatsApp dalam satu API terpadu. Dilengkapi Session Hibernation hemat RAM.",
      badge: "Hibernation",
    },
    {
      icon: <Lock className="size-5 text-rose-500" />,
      title:
        t("landingPages.apiGateway.featureSecurityTitle") || "Keamanan Tingkat Korporat",
      desc:
        t("landingPages.apiGateway.featureSecurityDesc") ||
        "Autentikasi Bearer Token 'hide_live_...', enkripsi TLS modern, dan isolasi data multi-tenant berbasis ULID.",
      badge: "ULID Isolation",
    },
    {
      icon: <RotateCcw className="size-5 text-indigo-500" />,
      title:
        t("landingPages.apiGateway.featureRetryTitle") ||
        "Automatic Exponential Backoff",
      desc:
        t("landingPages.apiGateway.featureRetryDesc") ||
        "Mekanisme pengiriman ulang cerdas dan Dead-Letter Queue (DLQ) untuk menjamin tidak ada pesan yang hilang.",
      badge: "Zero Dropped",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.apiGateway.featuresTitle") ||
            "Mengapa Developer Memilih Wahide API Gateway"}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.apiGateway.featuresSubtitle") ||
            "Dirancang dengan arsitektur Go modern untuk latensi ultra rendah, efisiensi memori, dan keandalan tingkat enterprise."}
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
                <div className="size-10 rounded-xl bg-wise-green/10 flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-muted/60 text-foreground-muted">
                  {f.badge}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-wise-green transition-colors">
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
