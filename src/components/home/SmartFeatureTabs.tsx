"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import {
  Code2,
  Megaphone,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Server,
} from "lucide-react";

type TabType = "developer" | "marketing" | "business";

export function SmartFeatureTabs() {
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>("developer");
  const isId = locale !== "en";

  return (
    <section id="features" className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
      {/* Section Header */}
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold shadow-xs">
          <Sparkles className="size-3.5" />
          <span>{isId ? "Solusi Terpadu Sesuai Kebutuhan Anda" : "Tailored Solutions for Your Needs"}</span>
        </div>
        <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-4xl">
          {isId
            ? "Pilih Apa yang Ingin Anda Bangun"
            : "Choose What You Want to Build"}
        </h2>
        <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
          {isId
            ? "Semua fitur dirancang agar mudah digunakan, aman dari pemblokiran, dan langsung terintegrasi tanpa kerumitan."
            : "Engineered for high deliverability, zero ban risk, and instant zero-friction integration."}
        </p>
      </div>

      {/* Tab Selector Buttons */}
      <div className="flex justify-center">
        <div className="border-border bg-muted/40 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border p-1.5 shadow-xs sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("developer")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all sm:px-5 sm:text-sm ${
              activeTab === "developer"
                ? "bg-surface text-foreground shadow-xs border border-border"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Code2 className="size-4 text-emerald-600 dark:text-wise-green" />
            <span>{isId ? "⚡ Developer & OTP API" : "⚡ Developer & OTP API"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("marketing")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all sm:px-5 sm:text-sm ${
              activeTab === "marketing"
                ? "bg-surface text-foreground shadow-xs border border-border"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Megaphone className="size-4 text-blue-600 dark:text-blue-400" />
            <span>{isId ? "🚀 Broadcast & Anti-Ban" : "🚀 Broadcast & Anti-Ban"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("business")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all sm:px-5 sm:text-sm ${
              activeTab === "business"
                ? "bg-surface text-foreground shadow-xs border border-border"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Calendar className="size-4 text-amber-600 dark:text-amber-400" />
            <span>{isId ? "🛠️ Otomasi Bisnis Siap Pakai" : "🛠️ Turnkey Business Tools"}</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        {/* TAB 1: DEVELOPER & OTP API */}
        {activeTab === "developer" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* OTP Hero Card */}
            <div className="border-wise-green/50 bg-linear-to-br from-wise-green/10 via-surface to-surface dark:from-wise-green/15 flex flex-col justify-between rounded-2xl border p-6 shadow-xs sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-wise-green text-near-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    {isId ? "Fitur Baru • Fast Path" : "New Feature • Fast Path"}
                  </span>
                  <span className="text-foreground-muted flex items-center gap-1 font-mono text-xs font-bold">
                    <Zap className="size-3 text-amber-500" />
                    {"< 0.4s VIP Latency"}
                  </span>
                </div>

                  <div>
                  <h3 className="text-foreground text-lg font-black sm:text-xl">
                    {isId
                      ? "WhatsApp OTP & Verifikasi Instan"
                      : "WhatsApp OTP & Instant Verification"}
                  </h3>
                  <p className="text-foreground-secondary mt-1.5 text-xs leading-relaxed font-medium sm:text-sm">
                    {isId
                      ? "Kirim dan verifikasi kode OTP 6-digit via WhatsApp pelanggan secara instan. Kode otomatis berlaku 5 menit, langsung hangus setelah digunakan, dan dilindungi batas kirim ulang 60 detik tanpa perlu repot setup server database."
                      : "Dispatch and verify 6-digit OTP codes via WhatsApp instantly. Codes expire automatically in 5 minutes, burn after single use, and include a 60s cooldown without creating custom DB tables."}
                  </p>
                </div>

                {/* Visual OTP Bubble Card */}
                <div className="rounded-xl border border-border/80 bg-black/85 p-3.5 text-white shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-white/70 border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Kode Verifikasi Keamanan:</span>
                    <span className="font-mono text-amber-400 font-bold">⏱ 04:58</span>
                  </div>
                  <div className="my-2.5 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <span className="font-mono text-xl font-black tracking-widest text-wise-green">
                      849 - 201
                    </span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {isId ? "Sekali Pakai" : "Single-Use"}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/60">
                    {isId
                      ? "Proteksi Keamanan: Jeda kirim 60 detik • Kunci otomatis jika 5x salah input"
                      : "Security Protection: 60s resend cooldown • Auto-lock on 5 failed attempts"}
                  </p>
                </div>

                <div className="space-y-2 text-xs font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-dark-green dark:text-wise-green shrink-0" />
                    <span>{isId ? "Kunci API siap pakai untuk integrasi instan ke aplikasi Anda" : "Instant API Key authentication for rapid integration"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-dark-green dark:text-wise-green shrink-0" />
                    <span>{isId ? "Jalur Cepat Prioritas VIP — OTP sampai kilat tanpa antre" : "VIP Priority Stream bypasses bulk promotional queues"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/docs/otp/send"
                  className="bg-surface border-border text-foreground hover:border-wise-green inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold shadow-xs transition"
                >
                  <span>{isId ? "Buka Dokumentasi API OTP" : "Read OTP Documentation"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Meta Cloud API & SDK Card */}
            <div className="border-border bg-surface flex flex-col justify-between rounded-2xl border p-6 shadow-xs sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-muted text-foreground rounded-full px-3 py-0.5 text-[10px] font-bold">
                    {isId ? "Migrasi Mudah" : "Easy Migration"}
                  </span>
                  <span className="text-foreground-muted font-mono text-xs font-semibold">
                    v18.0 – v20.0
                  </span>
                </div>

                <div>
                  <h3 className="text-foreground text-lg font-black sm:text-xl">
                    {isId
                      ? "Kompatibel Meta WhatsApp Cloud API"
                      : "Meta WhatsApp Cloud API Compatible"}
                  </h3>
                  <p className="text-foreground-secondary mt-1.5 text-xs leading-relaxed font-medium sm:text-sm">
                    {isId
                      ? "Pindahkan aplikasi Anda dari WhatsApp Cloud API resmi tanpa mengubah kode atau format data. Cukup ganti Base URL ke Wahide dan nikmati pengiriman pesan tanpa biaya percakapan."
                      : "Migrate your existing Meta WhatsApp Cloud API code without rewriting payloads. Simply swap the Base URL to Wahide."}
                  </p>
                </div>

                {/* Code Endpoint Preview */}
                <div className="rounded-xl border border-border bg-muted/40 p-3.5 font-mono text-xs text-foreground-secondary space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                    HTTP ENDPOINT:
                  </div>
                  <div className="truncate text-foreground font-semibold">
                    POST /api/v1/v18.0/:device_id/messages
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-foreground-muted">
                    <span>cURL</span> • <span>Node.js</span> • <span>PHP</span> • <span>Python</span> • <span>Go</span>
                  </div>
                </div>

                {/* Enterprise Cloud Stability Box */}
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Server className="size-3.5 text-emerald-600 dark:text-wise-green" />
                    <span>{isId ? "Infrastruktur Cloud Berkinerja Tinggi" : "High-Performance Cloud Infrastructure"}</span>
                  </div>
                  <p className="text-foreground-secondary text-[11px]">
                    {isId
                      ? "Stabilitas 99.9% uptime dengan arsitektur cloud terisolasi. Pengiriman pesan berjalan lancar, instan, dan bebas gangguan."
                      : "Enterprise 99.9% uptime with isolated cloud architecture. Fast, reliable, and uninterrupted message delivery."}
                  </p>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/docs/intro"
                  className="bg-surface border-border text-foreground hover:border-foreground-muted inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold shadow-xs transition"
                >
                  <span>{isId ? "Lihat Panduan Developer" : "Explore Developer Docs"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BROADCAST & ANTI-BAN */}
        {activeTab === "marketing" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 5-Layer Anti-Ban Shield Card */}
            <div className="border-wise-green/50 bg-linear-to-br from-wise-green/10 via-surface to-surface dark:from-wise-green/15 flex flex-col justify-between rounded-2xl border p-6 shadow-xs sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-wise-green text-near-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    {isId ? "Proteksi Cerdas" : "Smart Protection"}
                  </span>
                  <span className="text-dark-green dark:text-wise-green font-mono text-xs font-bold">
                    {isId ? "Proteksi Reputasi" : "Reputation Guard"}
                  </span>
                </div>

                <div>
                  <h3 className="text-foreground text-lg font-black sm:text-xl">
                    {isId ? "5 Sistem Proteksi Pengiriman Cerdas" : "5-Layer Smart Delivery Shield"}
                  </h3>
                  <p className="text-foreground-secondary mt-1.5 text-xs leading-relaxed font-medium sm:text-sm">
                    {isId
                      ? "Nomor WhatsApp Anda tetap aman saat mengirim pesan promosi berkat simulasi pengetikan alami manusia, variasi kata otomatis, dan jeda pintar antar pengiriman."
                      : "Protect your WhatsApp account while broadcasting marketing updates with natural typing presence, dynamic word variations, and adaptive timing."}
                  </p>
                </div>

                <div className="space-y-2.5 rounded-xl border border-border/80 bg-muted/30 p-4 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
                    <span><strong>{isId ? "Simulasi Sedang Mengetik:" : "Natural Typing Simulation:"}</strong> {isId ? "Tampil status mengetik alami seperti chat manusia asli" : "Displays natural 'typing...' presence on recipient screens"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
                    <span><strong>{isId ? "Variasi Kata Otomatis:" : "Automated Word Variations:"}</strong> {isId ? "Acak kata sapaan otomatis {Halo|Hai|Selamat Pagi} agar setiap pesan unik" : "Rotates greetings {Hello|Hi|Greetings} so every message is unique"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
                    <span><strong>{isId ? "Jeda Acak Antar Pesan:" : "Adaptive Random Delays:"}</strong> {isId ? "Selang kirim acak 3–15 detik agar wajar dan terhindar dari pemblokiran" : "Random 3–15s delays to mimic human cadence and prevent spam detection"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
                    <span><strong>{isId ? "Proteksi Akun Siaga:" : "Smart Standby Protection:"}</strong> {isId ? "Istirahatkan koneksi otomatis agar baterai awet dan akun tetap stabil" : "Smart idle sleep to conserve device battery and maintain connection health"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/register"
                  className="bg-surface border-border text-foreground hover:border-wise-green inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold shadow-xs transition"
                >
                  <span>{isId ? "Coba Broadcast Aman Sekarang" : "Start Safe Broadcast Now"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Multi-Device Pool & Broadcast Engine */}
            <div className="border-border bg-surface flex flex-col justify-between rounded-2xl border p-6 shadow-xs sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-muted text-foreground rounded-full px-3 py-0.5 text-[10px] font-bold">
                    {isId ? "Kapasitas Tinggi" : "High Capacity"}
                  </span>
                  <span className="text-foreground-muted font-mono text-xs font-semibold">
                    {isId ? "Kapasitas Ribuan Pesan / Menit" : "High-Speed Message Pipeline"}
                  </span>
                </div>

                <div>
                  <h3 className="text-foreground text-lg font-black sm:text-xl">
                    {isId ? "Kirim Bareng dengan Banyak Nomor (Multi-Nomor)" : "Multi-Number Pool & Smart Distribution"}
                  </h3>
                  <p className="text-foreground-secondary mt-1.5 text-xs leading-relaxed font-medium sm:text-sm">
                    {isId
                      ? "Sambungkan beberapa nomor WhatsApp sekaligus. Sistem otomatis membagi beban pengiriman pesan keluar ke nomor-nomor Anda secara bergantian agar aman dari limit harian."
                      : "Connect multiple numbers under one dashboard. Messages are automatically distributed across active devices to stay within safe daily limits."}
                  </p>
                </div>

                {/* Device Pool Visualizer */}
                <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>{isId ? "Status Pembagian Beban:" : "Load Distribution Status:"}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">{isId ? "Rotasi Otomatis Aktif" : "Auto-Rotation Active"}</span>
                  </div>
                  <div className="flex items-center justify-between text-foreground-secondary font-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Device #1 (+62 812-xxxx)
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between text-foreground-secondary font-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Device #2 (+62 877-xxxx)
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Online</span>
                  </div>
                </div>

                <p className="text-foreground-secondary text-xs">
                  {isId
                    ? "Dilengkapi penjadwalan kampanye di jam terbaik dan laporan keterkiriman (Sent, Delivered, Read) secara real-time."
                    : "Includes scheduled broadcasts and real-time delivery tracking (Sent, Delivered, Read)."}
                </p>
              </div>

              <div className="pt-5">
                <Link
                  href="/register"
                  className="bg-surface border-border text-foreground hover:border-foreground-muted inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold shadow-xs transition"
                >
                  <span>{isId ? "Daftar Akun Broadcast" : "Get Started Free"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OTOMASI BISNIS SIAP PAKAI */}
        {activeTab === "business" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Reservasi */}
            <div className="border-border bg-surface flex flex-col justify-between space-y-3 rounded-2xl border p-5 shadow-xs transition hover:border-wise-green/60">
              <div className="space-y-2">
                <div className="bg-wise-green/15 text-dark-green dark:text-wise-green flex size-10 items-center justify-center rounded-xl">
                  <Calendar className="size-5" />
                </div>
                <h3 className="text-foreground text-sm font-bold">
                  {isId ? "Sistem Reservasi & Booking" : "Online Appointments"}
                </h3>
                <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
                  {isId
                    ? "Atur jadwal janji temu pelanggan, kurangi antrean manual, dan kirim tiket konfirmasi WhatsApp instan."
                    : "Manage appointment slots, reduce manual scheduling friction, and send automatic WhatsApp confirmation tickets."}
                </p>
              </div>
              <span className="text-dark-green dark:text-wise-green text-[11px] font-bold">
                Klinik • Salon • Konsultan
              </span>
            </div>

            {/* 2. Pengingat Tagihan */}
            <div className="border-border bg-surface flex flex-col justify-between space-y-3 rounded-2xl border p-5 shadow-xs transition hover:border-wise-green/60">
              <div className="space-y-2">
                <div className="bg-blue-500/15 text-blue-600 dark:text-blue-400 flex size-10 items-center justify-center rounded-xl">
                  <Clock className="size-5" />
                </div>
                <h3 className="text-foreground text-sm font-bold">
                  {isId ? "Pengingat Otomatis (Drip)" : "Automated Payment Reminders"}
                </h3>
                <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
                  {isId
                    ? "Kirim notifikasi tagihan jatuh tempo, follow-up prospek, atau servis berkala secara terjadwal."
                    : "Automate scheduled reminders for invoice due dates, prospect follow-ups, and recurring services."}
                </p>
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                Invoice • Servis • Cicilan
              </span>
            </div>

            {/* 3. Formulir Publik */}
            <div className="border-border bg-surface flex flex-col justify-between space-y-3 rounded-2xl border p-5 shadow-xs transition hover:border-wise-green/60">
              <div className="space-y-2">
                <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex size-10 items-center justify-center rounded-xl">
                  <FileText className="size-5" />
                </div>
                <h3 className="text-foreground text-sm font-bold">
                  {isId ? "Formulir Dinamis Publik" : "Dynamic Public Forms"}
                </h3>
                <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
                  {isId
                    ? "Buat form pendaftaran / survei dengan link ringkas /f/nama-form yang langsung merespons ke WhatsApp."
                    : "Build lead generation forms with clean shortlinks /f/form that instantly trigger WhatsApp receipts."}
                </p>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                Registrasi • Event • Leads
              </span>
            </div>

            {/* 4. Template CS */}
            <div className="border-border bg-surface flex flex-col justify-between space-y-3 rounded-2xl border p-5 shadow-xs transition hover:border-wise-green/60">
              <div className="space-y-2">
                <div className="bg-amber-500/15 text-amber-600 dark:text-amber-400 flex size-10 items-center justify-center rounded-xl">
                  <MessageSquare className="size-5" />
                </div>
                <h3 className="text-foreground text-sm font-bold">
                  {isId ? "Pustaka Template Pesan CS" : "CS & Sales Message Bank"}
                </h3>
                <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
                  {isId
                    ? "Standarisasi balasan cepat untuk tim Customer Support dan promosi sales lengkap dengan media faktur PDF."
                    : "Standardize quick replies for support and sales teams with dynamic variables and PDF attachments."}
                </p>
              </div>
              <span className="text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                Customer Support • Sales Team
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
