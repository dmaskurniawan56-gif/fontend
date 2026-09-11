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
      title: t("landingPages.automation.reservationTitle"),
      desc: t("landingPages.automation.reservationDesc"),
      benefits: [
        t("landingPages.automation.resB1"),
        t("landingPages.automation.resB2"),
        t("landingPages.automation.resB3"),
      ],
      badge: t("landingPages.automation.badgeReservation"),
    },
    {
      id: "reminder",
      icon: <BellRing className="size-6 text-amber-500" />,
      title: t("landingPages.automation.reminderTitle"),
      desc: t("landingPages.automation.reminderDesc"),
      benefits: [
        t("landingPages.automation.remB1"),
        t("landingPages.automation.remB2"),
        t("landingPages.automation.remB3"),
      ],
      badge: t("landingPages.automation.badgeReminder"),
    },
    {
      id: "form",
      icon: <FormInput className="size-6 text-blue-500" />,
      title: t("landingPages.automation.formTitle"),
      desc: t("landingPages.automation.formDesc"),
      benefits: [
        t("landingPages.automation.formB1"),
        t("landingPages.automation.formB2"),
        t("landingPages.automation.formB3"),
      ],
      badge: t("landingPages.automation.badgeForm"),
    },
    {
      id: "template",
      icon: <BookOpenCheck className="size-6 text-indigo-500" />,
      title: t("landingPages.automation.templateTitle"),
      desc: t("landingPages.automation.templateDesc"),
      benefits: [
        t("landingPages.automation.tmplB1"),
        t("landingPages.automation.tmplB2"),
        t("landingPages.automation.tmplB3"),
      ],
      badge: t("landingPages.automation.badgeTemplate"),
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-4 sm:py-6">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {t("landingPages.automation.modulesTitle")}
        </h2>
        <p className="text-foreground-secondary text-sm sm:text-base font-semibold leading-relaxed">
          {t("landingPages.automation.modulesSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {modules.map((m) => (
          <div
            key={m.id}
            id={m.id}
            className="rounded-2xl border border-border bg-surface p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:border-wise-green/50 transition-all space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                  {m.icon}
                </div>
                <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-muted/80 text-foreground-secondary border border-border/60">
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
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-wise-green shrink-0" />
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
