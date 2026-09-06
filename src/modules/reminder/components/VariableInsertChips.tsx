"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface VariableInsertChipsProps {
  onInsert: (variableKey: string) => void;
}

export function VariableInsertChips({ onInsert }: VariableInsertChipsProps) {
  const { t } = useI18n();

  const reminderVariables = [
    { label: t("reminder.variables.name") || "Nama Penerima", key: "nama" },
    { label: t("reminder.variables.phone") || "Nomor WhatsApp", key: "nomor" },
    { label: t("reminder.variables.date") || "Tanggal Jadwal", key: "tanggal" },
    { label: t("reminder.variables.notes") || "Catatan Layanan", key: "catatan" },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span className="font-medium">{t("reminder.variables.title") || "Variabel Dinamis Pengingat:"}</span>
        <span className="text-[11px] opacity-75">{t("reminder.variables.format") || "Format: {{variabel}}"}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {reminderVariables.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => onInsert(v.key)}
            className="inline-flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 dark:text-emerald-300 cursor-pointer"
          >
            <Plus className="size-3" />
            <span>{`{{${v.key}}}`}</span>
            <span className="text-[10px] opacity-75">({v.label})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
