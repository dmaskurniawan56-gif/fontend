"use client";

import React from "react";
import { Users, ShieldCheck, Layers, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function EnterpriseBentoGrid() {
  const { t } = useI18n();

  const features = [
    {
      icon: <Users className="size-5 text-wise-green" />,
      title:
        t("landingPages.enterprise.featureWorkflowsTitle") ||
        "Alur Kerja Lintas Divisi & Tim",
      desc:
        t("landingPages.enterprise.featureWorkflowsDesc") ||
        "Bagi akses penanganan pesan secara rapi untuk tim Customer Service, Penjualan, Operasional, hingga Keuangan tanpa saling tumpang tindih.",
      badge: "Kolaborasi Tim",
    },
    {
      icon: <ShieldCheck className="size-5 text-blue-500" />,
      title:
        t("landingPages.enterprise.featureSecurityTitle") ||
        "Keamanan & Pengaturan Akses Staf",
      desc:
        t("landingPages.enterprise.featureSecurityDesc") ||
        "Atur peran staf dengan aman. Pimpinan memiliki kendali penuh menentukan data apa saja yang boleh dilihat atau dikelola oleh masing-masing staf.",
      badge: "Kontrol Privasi",
    },
    {
      icon: <Layers className="size-5 text-purple-500" />,
      title:
        t("landingPages.enterprise.featureIntegrationTitle") ||
        "Mudah Terhubung ke Aplikasi Kantor",
      desc:
        t("landingPages.enterprise.featureIntegrationDesc") ||
        "Dapat dihubungkan dengan mudah ke sistem yang sudah perusahaan Anda miliki seperti CRM, sistem kasir, atau software manajemen internal.",
      badge: "Integrasi Fleksibel",
    },
    {
      icon: <Headphones className="size-5 text-emerald-500" />,
      title:
        t("landingPages.enterprise.featureSupportTitle") ||
        "Dukungan Khusus & Pendampingan Penuh",
      desc:
        t("landingPages.enterprise.featureSupportDesc") ||
        "Tim kami siap membantu proses pemasangan, pelatihan penggunaan, serta memberikan pendampingan langsung jika Anda membutuhkan bantuan.",
      badge: "Bantuan Prioritas",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.enterprise.featuresTitle") ||
            "Kelebihan Utama untuk Operasional Perusahaan Anda"}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.enterprise.featuresSubtitle") ||
            "Solusi lengkap yang memudahkan koordinasi antar tim, menjaga kerahasiaan data, dan siap dihubungkan ke sistem kerja yang sudah Anda gunakan."}
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
