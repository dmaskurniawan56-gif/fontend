"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  User,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Building2,
  ShoppingBag,
  Code2,
  Radio,
  Sparkles,
} from "lucide-react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PublicHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${targetId}`);
      }
    }
  };

  const handleMobileAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${targetId}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-wise-green shadow-xs transition-transform group-hover:scale-110" />
          <span className="font-black text-xl sm:text-2xl tracking-tight text-foreground">
            Wahide
            <span className="text-dark-green dark:text-wise-green">.</span>
          </span>
        </Link>

        {/* Desktop Navigation: Solusi (Dropdown), Fitur (Dropdown), Harga, FAQ */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-bold text-foreground-secondary">
          {/* Solusi Hover Dropdown */}
          <div className="relative group py-2">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-foreground transition-colors outline-none cursor-pointer"
            >
              <span>{t("common.nav.solutions")}</span>
              <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 pt-2 w-80 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="rounded-2xl border border-border bg-surface p-2.5 shadow-xl ring-1 ring-border/50 space-y-1">
                <Link
                  href="/solutions/enterprise"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors group/item"
                >
                  <div className="size-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover/item:text-dark-green dark:group-hover/item:text-wise-green">
                      Enterprise & Dedicated
                    </div>
                    <div className="text-[11px] font-medium text-foreground-muted leading-tight mt-0.5">
                      Private VPS, SLA 99.9%, isolasi data korporat
                    </div>
                  </div>
                </Link>

                <Link
                  href="/solutions/ecommerce"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors group/item"
                >
                  <div className="size-9 rounded-lg bg-emerald-500/10 text-wise-green flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover/item:text-dark-green dark:group-hover/item:text-wise-green">
                      E-Commerce & Retail
                    </div>
                    <div className="text-[11px] font-medium text-foreground-muted leading-tight mt-0.5">
                      Konfirmasi order otomatis, kirim resi & cart recovery
                    </div>
                  </div>
                </Link>

                <div className="border-t border-border/60 pt-1.5 mt-1">
                  <Link
                    href="/#solutions"
                    onClick={(e) => handleAnchorClick(e, "solutions")}
                    className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-dark-green dark:text-wise-green hover:underline"
                  >
                    <span>Lihat Ringkasan Solusi</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Fitur Hover Dropdown */}
          <div className="relative group py-2">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-foreground transition-colors outline-none cursor-pointer"
            >
              <span>{t("common.nav.features")}</span>
              <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 pt-2 w-84 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="rounded-2xl border border-border bg-surface p-2.5 shadow-xl ring-1 ring-border/50 space-y-1">
                <Link
                  href="/features/api-gateway"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors group/item"
                >
                  <div className="size-9 rounded-lg bg-emerald-500/10 text-wise-green flex items-center justify-center shrink-0 mt-0.5">
                    <Code2 className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover/item:text-dark-green dark:group-hover/item:text-wise-green">
                      WhatsApp API Gateway
                    </div>
                    <div className="text-[11px] font-medium text-foreground-muted leading-tight mt-0.5">
                      REST API, 2-way Webhooks, antrean OTP &lt;400ms
                    </div>
                  </div>
                </Link>

                <Link
                  href="/features/broadcast-messaging"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors group/item"
                >
                  <div className="size-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover/item:text-dark-green dark:group-hover/item:text-wise-green">
                      Smart Broadcast Messaging
                    </div>
                    <div className="text-[11px] font-medium text-foreground-muted leading-tight mt-0.5">
                      5-lapis anti-ban, spintax simulator, kampanye massal
                    </div>
                  </div>
                </Link>

                <Link
                  href="/features/business-automation"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors group/item"
                >
                  <div className="size-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover/item:text-dark-green dark:group-hover/item:text-wise-green">
                      Business Automation
                    </div>
                    <div className="text-[11px] font-medium text-foreground-muted leading-tight mt-0.5">
                      Sistem booking jadwal, auto-reminder, web forms
                    </div>
                  </div>
                </Link>

                <div className="border-t border-border/60 pt-1.5 mt-1">
                  <Link
                    href="/#features"
                    onClick={(e) => handleAnchorClick(e, "features")}
                    className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-dark-green dark:text-wise-green hover:underline"
                  >
                    <span>Lihat Semua Fitur & Ringkasan</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/#pricing"
            onClick={(e) => handleAnchorClick(e, "pricing")}
            className="hover:text-foreground transition-colors"
          >
            {t("common.nav.pricing")}
          </Link>
          <Link
            href="/#faq"
            onClick={(e) => handleAnchorClick(e, "faq")}
            className="hover:text-foreground transition-colors"
          >
            {t("common.nav.faq")}
          </Link>
        </nav>

        {/* Action Controls & Auth State */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <LocaleSwitcher />
          <ThemeToggle />

          {isClient && isAuthenticated && user ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "primaryPill", size: "sm" }),
                "gap-2 px-5 font-bold shadow-xs min-h-9",
              )}
            >
              <User className="size-3.5" />
              <span>
                {t("common.nav.dashboard")} ({user.name.split(" ")[0]})
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "font-bold text-xs sm:text-sm text-foreground-secondary hover:text-foreground rounded-full px-4 min-h-9",
                )}
              >
                {t("common.nav.login")}
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "primaryPill", size: "sm" }),
                  "font-bold text-xs sm:text-sm gap-1.5 px-5 shadow-xs min-h-9",
                )}
              >
                <span>{t("common.nav.register")}</span>
                <ArrowRight className="size-3.5 hidden xl:inline" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-foreground-secondary hover:text-foreground hover:bg-muted/60 transition min-size-10 flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-surface px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col gap-1 text-sm font-bold text-foreground">
            {/* Solusi Section */}
            <div className="py-2 px-1 text-xs font-bold uppercase tracking-wider text-foreground-muted">
              {t("common.nav.solutions")}
            </div>
            <Link
              href="/solutions/enterprise"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-muted/60 transition flex items-center gap-2.5 text-xs font-bold text-foreground-secondary hover:text-foreground"
            >
              <Building2 className="size-3.5 text-blue-500" />
              <span>Enterprise & Dedicated</span>
            </Link>
            <Link
              href="/solutions/ecommerce"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-muted/60 transition flex items-center gap-2.5 text-xs font-bold text-foreground-secondary hover:text-foreground"
            >
              <ShoppingBag className="size-3.5 text-wise-green" />
              <span>E-Commerce & Retail</span>
            </Link>

            {/* Fitur Section */}
            <div className="pt-3 pb-1 px-1 text-xs font-bold uppercase tracking-wider text-foreground-muted">
              {t("common.nav.features")}
            </div>
            <Link
              href="/features/api-gateway"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-muted/60 transition flex items-center gap-2.5 text-xs font-bold text-foreground-secondary hover:text-foreground"
            >
              <Code2 className="size-3.5 text-wise-green" />
              <span>WhatsApp API Gateway</span>
            </Link>
            <Link
              href="/features/broadcast-messaging"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-muted/60 transition flex items-center gap-2.5 text-xs font-bold text-foreground-secondary hover:text-foreground"
            >
              <Radio className="size-3.5 text-amber-500" />
              <span>Smart Broadcast Messaging</span>
            </Link>
            <Link
              href="/features/business-automation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-muted/60 transition flex items-center gap-2.5 text-xs font-bold text-foreground-secondary hover:text-foreground"
            >
              <Sparkles className="size-3.5 text-purple-500" />
              <span>Business Automation</span>
            </Link>

            {/* Standalone Links */}
            <div className="pt-2 border-t border-border/40 mt-2 flex flex-col gap-1">
              <Link
                href="/#pricing"
                onClick={(e) => handleMobileAnchorClick(e, "pricing")}
                className="py-2.5 px-3 rounded-md hover:bg-muted/60 transition min-h-11 flex items-center"
              >
                {t("common.nav.pricing")}
              </Link>
              <Link
                href="/#faq"
                onClick={(e) => handleMobileAnchorClick(e, "faq")}
                className="py-2.5 px-3 rounded-md hover:bg-muted/60 transition min-h-11 flex items-center"
              >
                {t("common.nav.faq")}
              </Link>
            </div>
          </nav>

          <div className="pt-3 border-t border-border/70 flex flex-col gap-2.5">
            {isClient && isAuthenticated && user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "primaryPill", size: "default" }),
                  "w-full gap-2 font-bold shadow-xs min-h-11",
                )}
              >
                <User className="size-4" />
                <span>
                  {t("common.nav.dashboard")} ({user.name.split(" ")[0]})
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "w-full rounded-full font-bold border-border min-h-11",
                  )}
                >
                  {t("common.nav.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "primaryPill", size: "default" }),
                    "w-full font-bold shadow-sm min-h-11",
                  )}
                >
                  {t("common.nav.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
