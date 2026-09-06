"use client";

import React from "react";
import { Plus } from "lucide-react";

interface VariableQuickInsertProps {
  onInsert: (variableName: string) => void;
  customVariables?: string[];
}

const DEFAULT_VARIABLES = [
  { label: "Nama Pelanggan", key: "nama" },
  { label: "Nomor WhatsApp", key: "nomor" },
  { label: "Email", key: "email" },
  { label: "Tanggal Transaksi", key: "tanggal" },
  { label: "Nomor Faktur / Invoice", key: "invoice" },
  { label: "Link Tautan", key: "link" },
];

export function VariableQuickInsert({ onInsert, customVariables }: VariableQuickInsertProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span className="font-medium">Variabel Cepat (Klik untuk menyisipkan):</span>
        <span className="text-[11px] opacity-75">Format: {"{{variabel}}"}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DEFAULT_VARIABLES.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => onInsert(v.key)}
            className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 transition hover:border-emerald-500/40 hover:bg-emerald-500/20 dark:text-emerald-300"
          >
            <Plus className="size-3" />
            <span>{`{{${v.key}}}`}</span>
            <span className="text-[10px] opacity-70">({v.label})</span>
          </button>
        ))}
        {customVariables?.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onInsert(v)}
            className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 transition hover:border-blue-500/40 hover:bg-blue-500/20 dark:text-blue-300"
          >
            <Plus className="size-3" />
            <span>{`{{${v}}}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
