"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Clock, ArrowRight, ShieldCheck, Lock } from "lucide-react";

export function PublicFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-surface py-12 lg:py-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Main Balanced Grid (Golden Ratio: 2 - 1 - 1 - 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand & Operating Hours Card (Spans 2 columns on desktop) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-wise-green shadow-xs transition-transform group-hover:scale-110" />
              <span className="font-black text-xl sm:text-2xl tracking-tight text-foreground">
                Wahide
                <span className="text-dark-green dark:text-wise-green">.</span>
              </span>
            </Link>

            <div className="text-xs font-bold text-foreground">
              {t("footer.by")}
            </div>

            {/* Operating Hours Micro-Card */}
            <div className="max-w-sm rounded-xl border border-border/70 bg-background/60 p-3 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Clock className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
                <span>{t("footer.openHoursTitle")}</span>
              </div>
              <p className="text-[11px] font-medium text-foreground-muted pl-5 leading-relaxed">
                {t("footer.openHoursDesc")}
              </p>
            </div>
          </div>

          {/* Column 2: Business Solutions */}
          <div className="space-y-3 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              {t("footer.solutionsTitle")}
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-foreground-secondary">
              <li>
                <Link
                  href="/solutions/enterprise"
                  className="hover:text-foreground transition-colors"
                >
                  Enterprise & Dedicated
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/ecommerce"
                  className="hover:text-foreground transition-colors"
                >
                  E-Commerce & Retail
                </Link>
              </li>
              <li>
                <Link
                  href="/features/business-automation"
                  className="hover:text-foreground transition-colors"
                >
                  Business Automation
                </Link>
              </li>
              <li>
                <Link
                  href="/features/broadcast-messaging"
                  className="hover:text-foreground transition-colors"
                >
                  Smart Broadcast
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developer & API */}
          <div className="space-y-3 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              {t("footer.developerTitle")}
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-foreground-secondary">
              <li>
                <Link
                  href="/features/api-gateway"
                  className="hover:text-foreground transition-colors"
                >
                  API Gateway RESTful
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/intro"
                  className="inline-flex items-center gap-1 hover:text-foreground text-dark-green dark:text-wise-green font-bold transition-colors group"
                >
                  <span>{t("footer.devDocs")}</span>
                  <ArrowRight className="size-3 opacity-80 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/features/api-gateway#otp-express-lane"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.devOtp")}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/webhooks"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.devWebhook")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Company */}
          <div className="space-y-3 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              {t("footer.legalTitle")}
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-foreground-secondary">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Copyright & Trust SLA Bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-foreground-muted">
          <span>
            &copy; {new Date().getFullYear()} Hide Group. {t("footer.rights")}
          </span>
          <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
              <ShieldCheck className="size-3.5" />
              <span>{t("footer.sla")}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 text-foreground-secondary font-bold border border-border/80">
              <Lock className="size-3 text-dark-green dark:text-wise-green" />
              <span>{t("footer.encryption")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
