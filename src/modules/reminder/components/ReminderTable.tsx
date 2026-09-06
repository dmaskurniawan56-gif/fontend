"use client";

import React from "react";
import { Reminder, ReminderStatus } from "../types/reminder.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Calendar,
  Phone,
  User,
  FileText,
  Play,
  Pause,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface ReminderTableProps {
  reminders: Reminder[];
  isLoading: boolean;
  search: string;
  status: ReminderStatus | "ALL";
  page: number;
  totalPages: number;
  total: number;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: ReminderStatus | "ALL") => void;
  onPageChange: (p: number) => void;
  onToggleStatus: (id: string, currentStatus: ReminderStatus) => void;
  onDeleteRequest: (rem: Reminder) => void;
}

export function ReminderTable({
  reminders,
  isLoading,
  search,
  status,
  page,
  totalPages,
  total,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onToggleStatus,
  onDeleteRequest,
}: ReminderTableProps) {
  const getStatusBadge = (s: ReminderStatus) => {
    switch (s) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" />
            Aktif
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <Pause className="size-3" />
            Ditunda
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="size-3" />
            Selesai
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            <XCircle className="size-3" />
            Dibatalkan
          </span>
        );
      default:
        return <Badge variant="secondary">{s}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari penerima atau nomor telepon..."
            className="h-9 pl-9 text-xs rounded-xl"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                status === s
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-foreground-muted hover:bg-muted hover:text-foreground"
              }`}
            >
              {s === "ALL" && "Semua"}
              {s === "ACTIVE" && "Aktif"}
              {s === "PAUSED" && "Ditunda"}
              {s === "COMPLETED" && "Selesai"}
              {s === "CANCELLED" && "Batal"}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/50 bg-muted/40 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Penerima</th>
              <th className="px-4 py-3">No. WhatsApp</th>
              <th className="px-4 py-3">Tanggal Target</th>
              <th className="px-4 py-3">Catatan / Layanan</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-36" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Skeleton className="mx-auto h-4 w-16" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Skeleton className="ml-auto h-7 w-16" />
                  </td>
                </tr>
              ))
            ) : reminders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-foreground-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock className="size-8 text-foreground-muted/40" />
                    <p className="text-sm font-medium">Belum ada jadwal pengingat</p>
                    <p className="text-xs text-foreground-muted/70">
                      Gunakan form di atas untuk menjadwalkan pengingat pertama Anda.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              reminders.map((rem) => (
                <tr key={rem.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <User className="size-3 text-primary/70" />
                      {rem.recipientName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    <div className="flex items-center gap-1 font-mono">
                      <Phone className="size-3 text-emerald-500/70" />
                      {rem.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Calendar className="size-3 text-blue-500/70" />
                      {formatDate(rem.targetDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    <span className="line-clamp-1">
                      {rem.notes || <span className="opacity-50 italic">-</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(rem.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Toggle Pause / Active */}
                      {(rem.status === "ACTIVE" || rem.status === "PAUSED") && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(rem.id, rem.status)}
                          className="size-7 p-0 rounded-lg text-foreground-muted hover:text-foreground"
                          title={rem.status === "ACTIVE" ? "Tunda Jadwal" : "Aktifkan Jadwal"}
                        >
                          {rem.status === "ACTIVE" ? (
                            <Pause className="size-3.5 text-amber-500" />
                          ) : (
                            <Play className="size-3.5 text-emerald-500" />
                          )}
                        </Button>
                      )}

                      {/* Delete */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteRequest(rem)}
                        className="size-7 p-0 rounded-lg text-foreground-muted hover:text-red-600 dark:hover:text-red-400"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
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
            <strong className="text-foreground">{totalPages}</strong> (Total {total} data)
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
