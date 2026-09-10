"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { LocaleSwitcher } from "@/components/layout/shared/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/shared/ThemeToggle";
import { X } from "lucide-react";

interface DashboardMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardMobileNav({ open, onClose }: DashboardMobileNavProps) {
  const { t } = useI18n();
  useEscapeKey(open, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="bg-surface animate-in slide-in-from-left fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col shadow-2xl duration-200 dark:bg-[#131412]">
        <div className="absolute top-2.5 right-3 z-50">
          <button
            onClick={onClose}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted/60 flex size-9 cursor-pointer items-center justify-center rounded-full transition active:scale-95"
            aria-label={t("common.closeMenuAria") || "Tutup Menu"}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DashboardSidebar
            onItemClick={onClose}
            className="w-full flex-1 border-r-0"
          />
        </div>
        {/* Mobile Drawer Footer: Quick Settings */}
        <div className="border-border bg-surface/90 dark:bg-[#161715]/90 flex shrink-0 items-center justify-between border-t px-4 py-3 backdrop-blur-md">
          <LocaleSwitcher />
          <ThemeToggle showLabel={true} />
        </div>
      </div>
    </div>
  );
}
