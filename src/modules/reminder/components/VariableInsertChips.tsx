"use client";

import React from "react";
import { Plus } from "lucide-react";

interface VariableInsertChipsProps {
  onInsert: (variableKey: string) => void;
}

const REMINDER_VARIABLES = [
  { label: "Nama Penerima", key: "nama" },
  { label: "Nomor WhatsApp", key: "nomor" },
  { label: "Tanggal Jadwal", key: "tanggal" },
  { label: "Catatan Layanan", key: "catatan" },
];

export function VariableInsertChips({ onInsert }: VariableInsertChipsProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span className="font-medium">Variabel Dinamis Pengingat:</span>
        <span className="text-[11px] opacity-75">Format: {"{{variabel}}"}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {REMINDER_VARIABLES.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => onInsert(v.key)}
            className="inline-flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 dark:text-emerald-300"
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
