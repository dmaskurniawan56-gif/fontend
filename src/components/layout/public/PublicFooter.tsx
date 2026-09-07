"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Clock, ArrowRight } from "lucide-react";

export function PublicFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-surface py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
        {/* Brand & Operating Hours Information */}
        <div className="space-y-3.5 md:col-span-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="h-3.5 w-3.5 rounded-full bg-wise-green shadow-xs transition-transform group-hover:scale-110" />
            <span className="font-black text-xl sm:text-2xl tracking-tight text-foreground">
              Wahide<span className="text-dark-green dark:text-wise-green">.</span>
            </span>
          </Link>

          <div className="space-y-2 text-xs font-semibold text-foreground-secondary leading-relaxed max-w-sm">
            <div className="font-bold text-foreground">
              {t("footer.by")}
            </div>

            <div className="pt-1.5 border-t border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-foreground font-bold">
                <Clock className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
                <span>{t("footer.openHoursTitle")}</span>
              </div>
              <div className="text-[11px] text-foreground-muted pl-5">
                {t("footer.openHoursDesc")}
              </div>
            </div>
          </div>
        </div>

        {/* Developer Column */}
        <div className="space-y-3 md:col-span-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            {t("footer.developer")}
          </p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li>
              <Link
                href="/docs/intro"
                className="inline-flex items-center gap-1.5 hover:text-foreground text-dark-green dark:text-wise-green font-bold transition-colors group"
              >
                <span>{t("common.landing.apiSandbox.docsBtn")}</span>
                <ArrowRight className="size-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Support Column */}
        <div className="space-y-3 md:col-span-3">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            {t("footer.legal")}
          </p>
          <ul className="space-y-2 text-xs font-semibold text-foreground-secondary">
            <li>
              <Link href="/about" className="hover:text-foreground transition-colors">
                {t("common.nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                {t("common.nav.contact")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                {t("footer.terms")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Copyright & Trust SLA Bar */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-foreground-muted">
        <span>&copy; {new Date().getFullYear()} Hide Group. {t("footer.rights")}</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span>{t("footer.sla")}</span>
          <span>•</span>
          <span>{t("footer.encryption")}</span>
        </div>
      </div>
    </footer>
  );
}
