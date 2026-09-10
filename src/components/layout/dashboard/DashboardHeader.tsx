"use client";

import React from "react";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { DashboardUserNav } from "./DashboardUserNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { useI18n } from "@/lib/i18n/context";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  onOpenMobileNav?: () => void;
}

export function DashboardHeader({ onOpenMobileNav }: DashboardHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-3.5 backdrop-blur-md sm:h-16 sm:px-6 lg:h-18 lg:px-8">
      {/* Kiri: Mobile Nav Button & Breadcrumb */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="hover:bg-muted text-foreground-secondary hover:text-foreground flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl p-2 transition active:scale-95 lg:hidden"
            aria-label={t("nav.openMenu")}
          >
            <Menu className="size-5" />
          </button>
        )}
        <DashboardBreadcrumb />
      </div>

      {/* Kanan: Locale Switcher, Theme Toggle, & User Dropdown */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <div className="hidden sm:block">
          <LocaleSwitcher />
        </div>
        <ThemeToggle />
        <div className="bg-border hidden h-6 w-px sm:block" />
        <DashboardUserNav />
      </div>
    </header>
  );
}
