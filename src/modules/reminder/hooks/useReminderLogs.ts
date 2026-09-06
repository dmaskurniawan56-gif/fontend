"use client";

import { useState, useEffect, useCallback } from "react";
import { ReminderLog } from "../types/reminder.types";
import { reminderApi } from "../api/reminder.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useReminderLogs() {
  const { t } = useI18n();
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchLogs = useCallback(
    async (overridePage?: number, signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryPage = overridePage !== undefined ? overridePage : page;
        const res = await reminderApi.getLogs({
          page: queryPage,
          pageSize,
        });

        if (signal?.aborted) return;

        setLogs(res.items);
        setTotal(res.total);
        setPage(res.page);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error
            ? err.message
            : t("reminder.logsFetchFailed") || "Gagal memuat riwayat pengiriman";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, t]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchLogs(1, controller.signal);
    return () => controller.abort();
  }, [fetchLogs]);

  const goToPage = (p: number) => {
    if (p < 1 || (total > 0 && p > totalPages) || p === page) return;
    setPage(p);
    fetchLogs(p);
  };

  const dispatchNow = async () => {
    setIsDispatching(true);
    try {
      const result = await reminderApi.dispatchNow();
      toast.success(
        t("reminder.dispatchSuccess") ||
          `Evaluasi pengingat selesai! Terkirim: ${result.dispatched}, Dilewati: ${result.skipped}, Gagal: ${result.failed}`
      );
      await fetchLogs(1);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reminder.dispatchFailed") || "Gagal memicu evaluasi pengingat";
      toast.error(msg);
    } finally {
      setIsDispatching(false);
    }
  };

  return {
    logs,
    isLoading,
    isDispatching,
    error,
    page,
    pageSize,
    total,
    totalPages,
    goToPage,
    dispatchNow,
    reload: () => fetchLogs(),
  };
}
