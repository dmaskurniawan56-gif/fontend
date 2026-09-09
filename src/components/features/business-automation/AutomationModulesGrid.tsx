"use client";

import React from "react";
import {
  CalendarDays,
  BellRing,
  FormInput,
  BookOpenCheck,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function AutomationModulesGrid() {
  const { t } = useI18n();

  const modules = [
    {
      id: "reservation",
      icon: <CalendarDays className="size-6 text-emerald-500" />,
      title:
        t("landingPages.automation.reservationTitle") ||
        "Sistem Reservasi & Booking Jadwal",
      desc:
        t("landingPages.automation.reservationDesc") ||
        "Pelanggan memilih slot waktu layanan secara online, dan sistem otomatis mengirimkan konfirmasi serta pengingat via WhatsApp.",
      benefits: [
        "Link booking publik mandiri",
        "Pencegahan jadwal bentrok otomatis",
        "Notifikasi WhatsApp ke pelanggan & tim",
      ],
      badge: "Booking & Appointment",
    },
    {
      id: "reminder",
      icon: <BellRing className="size-6 text-amber-500" />,
      title:
        t("landingPages.automation.reminderTitle") ||
        "Otomasi Pengingat & Jatuh Tempo",
      desc:
        t("landingPages.automation.reminderDesc") ||
        "Kirim pengingat otomatis H-3, H-1 jadwal janji temu, jatuh tempo faktur, atau perpanjangan langganan pelanggan.",
      benefits: [
        "Jadwal pengingat berkala otomatis",
        "Pengurangan risiko tagihan macet",
        "Variabel dinamis nama & nominal faktur",
      ],
      badge: "Due Date & Invoicing",
    },
    {
      id: "form",
      icon: <FormInput className="size-6 text-blue-500" />,
      title:
        t("landingPages.automation.formTitle") ||
        "Formulir Dinamis Publik (/f/[slug])",
      desc:
        t("landingPages.automation.formDesc") ||
        "Buat formulir survei, pendaftaran, atau pesanan tanpa coding. Notifikasi submit langsung terkirim ke nomor Anda.",
      benefits: [
        "Link instan siap bagikan di bio medsos",
        "Validasi input nomor telepon WhatsApp",
        "Otomatis kirim pesan terima kasih ke responden",
      ],
      badge: "No-Code Dynamic Forms",
    },
    {
      id: "template",
      icon: <BookOpenCheck className="size-6 text-indigo-500" />,
      title:
        t("landingPages.automation.templateTitle") ||
        "Pustaka Template Pesan Bisnis",
      desc:
        t("landingPages.automation.templateDesc") ||
        "Simpan dan gunakan kembali template pesan siap pakai untuk Customer Service, Penjualan, dan Notifikasi Resmi.",
      benefits: [
        "Standarisasi komunikasi tim CS",
        "Kategori pesan lengkap (Sales, Billing, CS)",
        "Dukungan media gambar dan tombol pesan",
      ],
      badge: "Template Library",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.automation.modulesTitle") ||
            "4 Modul Bisnis Siap Pakai"}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.automation.modulesSubtitle") ||
            "Semua modul langsung terhubung ke WhatsApp bisnis Anda dan dapat diatur dalam beberapa klik."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {modules.map((m) => (
          <div
            key={m.id}
            id={m.id}
            className="rounded-3xl border border-border bg-surface p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                  {m.icon}
                </div>
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-wise-green/10 text-dark-green dark:text-wise-green">
                  {m.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {m.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
                  {m.desc}
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-border/60">
                {m.benefits.map((b, bi) => (
                  <li
                    key={bi}
                    className="flex items-center gap-2 text-xs font-semibold text-foreground-secondary"
                  >
                    <CheckCircle2 className="size-3.5 text-wise-green shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
