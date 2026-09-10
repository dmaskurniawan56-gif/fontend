"use client";

import React from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import type { PhoneWarningResult } from "@/lib/countryCodes";

interface PhoneWarningNoticeProps {
  warning: PhoneWarningResult;
  onFix?: (suggestedValue: string) => void;
  className?: string;
}

export const PhoneWarningNotice: React.FC<PhoneWarningNoticeProps> = ({
  warning,
  onFix,
  className = "",
}) => {
  if (!warning.hasWarning || !warning.message) return null;

  return (
    <div
      role="alert"
      className={`mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-800 transition-all dark:border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-200 ${className}`}
    >
      <div className="flex items-center gap-1.5 font-medium">
        <AlertCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>{warning.message}</span>
      </div>

      {onFix && (
        <button
          type="button"
          onClick={() => onFix(warning.suggestedValue)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-amber-600/15 px-2 py-0.5 text-[11px] font-bold text-amber-900 transition hover:bg-amber-600/25 active:scale-95 dark:bg-amber-400/20 dark:text-amber-100 dark:hover:bg-amber-400/30"
          title="Perbaiki format nomor secara otomatis"
        >
          <Sparkles className="size-3 text-amber-600 dark:text-amber-400" />
          <span>
            Perbaiki
            {warning.suggestedValue ? `: ${warning.suggestedValue}` : ""}
          </span>
        </button>
      )}
    </div>
  );
};
