"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import {
  ShieldCheck,
  Smartphone,
  Code2,
  Megaphone,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";

export function CoreFeaturesSection() {
  const { t } = useI18n();

  return (
    <section id="features" className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl space-y-2.5 text-center">
        <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold shadow-xs">
          <Sparkles className="size-3.5" />
          <span>{t("common.landing.features.badge")}</span>
        </div>
        <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-4xl">
          {t("common.landing.features.title")}
        </h2>
        <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
          {t("common.landing.features.subtitle")}
        </p>
      </div>

      {/* Modern Bento Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: HERO BENTO - WhatsApp OTP & Fast Verification Engine (Col-Span 1 md:col-span-2) */}
        <div className="border-wise-green/50 bg-gradient-to-br from-wise-green/10 via-surface to-surface dark:from-wise-green/15 relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs transition hover:border-wise-green/80 sm:p-8 md:col-span-2">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="bg-wise-green text-near-black inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-black tracking-wider uppercase shadow-xs">
                <span className="size-1.5 animate-ping rounded-full bg-black/60" />
                <span>{t("common.landing.features.otpBadge")}</span>
              </div>
              <div className="text-foreground-muted flex items-center gap-1 text-xs font-bold">
                <Zap className="text-dark-green dark:text-wise-green size-3.5" />
                <span>In-Memory Redis 5-Min TTL</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                {t("common.landing.features.otpTitle")}
              </h3>
              <p className="text-foreground-secondary text-xs leading-relaxed font-medium sm:text-sm">
                {t("common.landing.features.otpDesc")}
              </p>
            </div>

            {/* Interactive Visual OTP Simulation Card */}
            <div className="border-wise-green/30 my-4 overflow-hidden rounded-xl border bg-black/80 p-4 text-white shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="bg-wise-green text-near-black flex size-6 items-center justify-center rounded-full font-bold text-[10px]">
                    W
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-white text-[11px]">
                      <span>Wahide OTP Auth</span>
                      <ShieldCheck className="text-wise-green inline size-3" />
                    </div>
                    <div className="text-[10px] text-white/60">Node VIP Express • Sub-second</div>
                  </div>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                  Delivered
                </span>
              </div>

              <div className="space-y-2.5 pt-3">
                <p className="text-[11px] text-white/90">
                  Kode verifikasi keamanan akun Anda adalah:
                </p>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/5 p-3">
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-wise-green">
                    849 - 201
                  </span>
                  <div className="text-right">
                    <span className="font-mono text-[11px] font-bold text-amber-400">
                      ⏱ 04:58
                    </span>
                    <p className="text-[9px] text-white/50">Auto-burn on verify</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/60">
                  <span>Proteksi: 60s cooldown • 5x anti brute-force</span>
                  <span className="text-emerald-400 font-semibold">Single-Use Valid</span>
                </div>
              </div>
            </div>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
              {[
                t("common.landing.features.otpF1"),
                t("common.landing.features.otpF2"),
                t("common.landing.features.otpF3"),
                t("common.landing.features.otpF4"),
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="text-dark-green dark:text-wise-green size-4 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/docs/otp/send"
              className="bg-surface border-border text-foreground hover:border-wise-green group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold shadow-xs transition"
            >
              <span>{t("common.landing.features.otpCta")}</span>
              <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Card 2: Multi-Device Smart Pool & Load Balancing */}
        <div className="border-border bg-surface flex flex-col justify-between space-y-4 rounded-2xl border p-6 shadow-xs transition hover:border-border/90">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-11 items-center justify-center rounded-xl">
                <Smartphone className="size-5" />
              </div>
              <span className="text-foreground-muted bg-muted/60 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                {t("common.landing.features.multiDeviceBadge")}
              </span>
            </div>

            <h3 className="text-foreground text-base font-bold">
              {t("common.landing.features.multiDeviceTitle")}
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
              {t("common.landing.features.multiDeviceDesc")}
            </p>
          </div>

          {/* Mini Status Visualizer */}
          <div className="space-y-1.5 rounded-xl border border-border/80 bg-muted/30 p-3 text-[11px]">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>Pool Perangkat Aktif</span>
              <span className="text-dark-green dark:text-wise-green">Round-Robin</span>
            </div>
            <div className="flex items-center justify-between text-foreground-secondary font-mono text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Slot 01: +62 812-xxxx
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Healthy</span>
            </div>
            <div className="flex items-center justify-between text-foreground-secondary font-mono text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Slot 02: +62 877-xxxx
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Healthy</span>
            </div>
          </div>
        </div>

        {/* Card 3: 5-Layer Anti-Ban Protection */}
        <div className="border-border bg-surface flex flex-col justify-between space-y-4 rounded-2xl border p-6 shadow-xs transition hover:border-border/90">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-11 items-center justify-center rounded-xl">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-foreground-muted bg-muted/60 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                {t("common.landing.features.antiBanBadge")}
              </span>
            </div>

            <h3 className="text-foreground text-base font-bold">
              {t("common.landing.features.antiBanTitle")}
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
              {t("common.landing.features.antiBanDesc")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            <div className="rounded-lg border border-border/70 bg-muted/30 p-2 text-center">
              <span className="text-dark-green dark:text-wise-green block">ChatPresence</span>
              <span className="text-foreground-muted text-[9px]">Simulasi Ketik</span>
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/30 p-2 text-center">
              <span className="text-dark-green dark:text-wise-green block">Spintax Engine</span>
              <span className="text-foreground-muted text-[9px]">Variasi Sinonim</span>
            </div>
          </div>
        </div>

        {/* Card 4: Meta WhatsApp Cloud API Drop-in & REST API */}
        <div className="border-border bg-surface flex flex-col justify-between space-y-4 rounded-2xl border p-6 shadow-xs transition hover:border-border/90">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-11 items-center justify-center rounded-xl">
                <Code2 className="size-5" />
              </div>
              <span className="text-foreground-muted bg-muted/60 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                {t("common.landing.features.metaBadge")}
              </span>
            </div>

            <h3 className="text-foreground text-base font-bold">
              {t("common.landing.features.metaTitle")}
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
              {t("common.landing.features.metaDesc")}
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-muted/30 p-2.5 font-mono text-[10px] text-foreground-secondary flex items-center justify-between">
            <span>POST /api/v1/v18.0/:id/messages</span>
            <span className="text-blue-500 font-bold">v18–v20</span>
          </div>
        </div>

        {/* Card 5: Broadcast Campaigns & Redis Streams Pipeline */}
        <div className="border-border bg-surface flex flex-col justify-between space-y-4 rounded-2xl border p-6 shadow-xs transition hover:border-border/90">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-11 items-center justify-center rounded-xl">
                <Megaphone className="size-5" />
              </div>
              <span className="text-foreground-muted bg-muted/60 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                {t("common.landing.features.broadcastBadge")}
              </span>
            </div>

            <h3 className="text-foreground text-base font-bold">
              {t("common.landing.features.broadcastTitle")}
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
              {t("common.landing.features.broadcastDesc")}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-foreground-secondary border-t border-border/60 pt-3">
            <span className="flex items-center gap-1">
              <Check className="size-3.5 text-dark-green dark:text-wise-green" />
              Jadwal Otomatis
            </span>
            <span className="flex items-center gap-1">
              <Check className="size-3.5 text-dark-green dark:text-wise-green" />
              Delivery Audit Log
            </span>
          </div>
        </div>

        {/* Card 6: Multi-Tenant & CS Agent Collaboration (Span 1 md:col-span-2 lg:col-span-3) */}
        <div className="border-border bg-surface flex flex-col justify-between space-y-4 rounded-2xl border p-6 shadow-xs transition hover:border-border/90 md:col-span-2 lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-9 items-center justify-center rounded-lg">
                  <Users className="size-4" />
                </div>
                <span className="text-foreground-muted bg-muted/60 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                  {t("common.landing.features.teamBadge")}
                </span>
              </div>
              <h3 className="text-foreground text-lg font-bold">
                {t("common.landing.features.teamTitle")}
              </h3>
              <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
                {t("common.landing.features.teamDesc")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-foreground">
                Role: Owner
              </span>
              <span className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-foreground">
                Role: Seller
              </span>
              <span className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-foreground">
                Role: CS Agent
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
