"use client";

import React from "react";
import { ReminderLog } from "../types/reminder.types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  History,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface ReminderLogsTableProps {
  logs: ReminderLog[];
  isLoading: boolean;
  isDispatching: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  onDispatchNow: () => void;
  onReload: () => void;
}

export function ReminderLogsTable({
  logs,
  isLoading,
  isDispatching,
  page,
  totalPages,
  total,
  onPageChange,
  onDispatchNow,
  onReload,
}: ReminderLogsTableProps) {
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getOffsetBadge = (offset: number) => {
    let label = `H${offset}`;
    let colorClass = "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

    if (offset === -1) {
      label = "H-1";
      colorClass = "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    } else if (offset === 0) {
      label = "Hari H";
      colorClass = "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    } else if (offset > 0) {
      label = `H+${offset}`;
      colorClass = "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }

    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${colorClass}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      {/* Header & Dispatch Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <History className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Riwayat Audit Pengiriman Pesan</h2>
            <p className="text-xs text-foreground-muted">
              Log pengiriman idempoten anti-duplikasi yang telah dieksekusi oleh mesin pengingat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReload}
            disabled={isLoading}
            className="h-9 gap-1.5 rounded-xl border-border/70 text-xs"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onDispatchNow}
            disabled={isDispatching}
            className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
            title="Jalankan evaluasi jadwal dan kirim pesan yang memenuhi syarat sekarang"
          >
            {isDispatching ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Mengevaluasi...
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                Kirim Sekarang
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/50 bg-muted/40 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Fase</th>
              <th className="px-4 py-3">Penerima</th>
              <th className="px-4 py-3">No. WhatsApp</th>
              <th className="px-4 py-3">Isi Pesan Terkirim</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Waktu Eksekusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Skeleton className="mx-auto h-4 w-16" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Skeleton className="ml-auto h-4 w-24" />
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-foreground-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock className="size-8 text-foreground-muted/40" />
                    <p className="text-sm font-medium">Belum ada riwayat pengiriman</p>
                    <p className="text-xs text-foreground-muted/70">
                      Pesan yang dieksekusi otomatis oleh scheduler akan tercatat di sini secara permanen.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3">
                    {getOffsetBadge(log.daysOffset)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <User className="size-3 text-primary/70" />
                      {log.recipientName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    <div className="flex items-center gap-1 font-mono">
                      <Phone className="size-3 text-emerald-500/70" />
                      {log.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    <div className="flex items-start gap-1 max-w-md">
                      <MessageSquare className="size-3 text-foreground-muted shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed text-[11px]">
                        {log.messageContent}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {log.status === "SENT" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        Sukses
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400"
                        title={log.errorReason || "Gagal terkirim"}
                      >
                        <AlertCircle className="size-3" />
                        Gagal
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-foreground-muted">
                    {formatDateTime(log.sentAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-foreground-muted">
          <span>
            Menampilkan halaman <strong className="text-foreground">{page}</strong> dari{" "}
            <strong className="text-foreground">{totalPages}</strong> (Total {total} log audit)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="size-8 p-0 rounded-xl"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="size-8 p-0 rounded-xl"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
