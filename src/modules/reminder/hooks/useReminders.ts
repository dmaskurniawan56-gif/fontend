"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Reminder,
  ReminderStatus,
  CreateReminderInput,
  UpdateReminderInput,
} from "../types/reminder.types";
import { reminderApi } from "../api/reminder.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useReminders() {
  const { t } = useI18n();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReminderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchReminders = useCallback(
    async (
      overrideParams?: {
        search?: string;
        status?: ReminderStatus | "ALL";
        page?: number;
      },
      signal?: AbortSignal
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const querySearch = overrideParams?.search !== undefined ? overrideParams.search : search;
        const queryStatus =
          overrideParams?.status !== undefined ? overrideParams.status : status;
        const queryPage = overrideParams?.page !== undefined ? overrideParams.page : page;

        const res = await reminderApi.getReminders({
          page: queryPage,
          pageSize,
          search: querySearch.trim() || undefined,
          status: queryStatus,
        });

        if (signal?.aborted) return;

        setReminders(res.items);
        setTotal(res.total);
        setPage(res.page);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error
            ? err.message
            : t("reminder.fetchFailed");
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [search, status, page, pageSize, t]
  );

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        const res = await reminderApi.getReminders({
          page: 1,
          pageSize,
        });
        if (isMounted) {
          setReminders(res.items);
          setTotal(res.total);
          setPage(res.page);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat daftar pengingat"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pageSize]);

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
    fetchReminders({ search: query, page: 1 });
  };

  const handleStatusChange = (newStatus: ReminderStatus | "ALL") => {
    setStatus(newStatus);
    setPage(1);
    fetchReminders({ status: newStatus, page: 1 });
  };

  const goToPage = (p: number) => {
    if (p < 1 || (total > 0 && p > totalPages) || p === page) return;
    setPage(p);
    fetchReminders({ page: p });
  };

  const createReminder = async (input: CreateReminderInput): Promise<boolean> => {
    try {
      await reminderApi.createReminder(input);
      toast.success(t("reminder.createdSuccess"));
      await fetchReminders({ page: 1 });
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reminder.createFailed");
      toast.error(msg);
      return false;
    }
  };

  const updateReminder = async (
    id: string,
    input: UpdateReminderInput
  ): Promise<boolean> => {
    try {
      const updated = await reminderApi.updateReminder(id, input);
      toast.success(t("reminder.updatedSuccess"));
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reminder.updateFailed");
      toast.error(msg);
      return false;
    }
  };

  const deleteReminder = async (id: string, _name?: string): Promise<boolean> => {
    try {
      await reminderApi.deleteReminder(id);
      toast.success(t("reminder.deletedSuccess"));
      setReminders((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reminder.deleteFailed");
      toast.error(msg);
      return false;
    }
  };

  const toggleStatus = async (
    id: string,
    currentStatus: ReminderStatus
  ): Promise<boolean> => {
    const nextStatus: ReminderStatus =
      currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    return updateReminder(id, { status: nextStatus });
  };

  // Stats calculation
  const stats = useMemo(() => {
    const activeCount = reminders.filter((r) => r.status === "ACTIVE").length;
    const pausedCount = reminders.filter((r) => r.status === "PAUSED").length;
    const completedCount = reminders.filter((r) => r.status === "COMPLETED").length;
    const cancelledCount = reminders.filter((r) => r.status === "CANCELLED").length;

    return {
      total,
      active: activeCount,
      paused: pausedCount,
      completed: completedCount,
      cancelled: cancelledCount,
    };
  }, [reminders, total]);

  return {
    reminders,
    isLoading,
    error,
    stats,
    // Filters & Pagination
    search,
    status,
    page,
    pageSize,
    total,
    totalPages,
    handleSearchChange,
    handleStatusChange,
    goToPage,
    // CRUD Actions
    createReminder,
    updateReminder,
    deleteReminder,
    toggleStatus,
    reload: () => fetchReminders(),
  };
}
