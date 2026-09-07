"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Reservation,
  ReservationStatus,
  CreateReservationInput,
  UpdateReservationInput,
  CalendarSummary,
} from "../types/reservation.types";
import { reservationApi } from "../api/reservation.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useReservations() {
  const { t } = useI18n();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReservationStatus | "ALL">("ALL");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Calendar State
  const initialMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }, []);

  const [currentMonth, setCurrentMonth] = useState<string>(initialMonth);
  const [calendarSummary, setCalendarSummary] = useState<CalendarSummary | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 1. Fetch Calendar Summary (Single aggregation query - Anti-N+1)
  const fetchCalendarSummary = useCallback(
    async (month: string) => {
      setIsCalendarLoading(true);
      try {
        const summary = await reservationApi.getCalendarSummary(month);
        setCalendarSummary(summary);
      } catch (err: unknown) {
        console.error("Failed fetching calendar summary:", err);
      } finally {
        setIsCalendarLoading(false);
      }
    },
    []
  );

  // 2. Fetch Reservations List
  const fetchReservations = useCallback(
    async (
      overrideParams?: {
        search?: string;
        status?: ReservationStatus | "ALL";
        date?: string;
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
        const queryDate =
          overrideParams?.date !== undefined ? overrideParams.date : selectedDate;
        const queryPage = overrideParams?.page !== undefined ? overrideParams.page : page;

        const res = await reservationApi.getReservations({
          page: queryPage,
          pageSize,
          search: querySearch.trim() || undefined,
          status: queryStatus,
          date: queryDate || undefined,
        });

        if (signal?.aborted) return;

        setReservations(res.items);
        setTotal(res.total);
        setPage(res.page);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error
            ? err.message
            : t("reservation.fetchFailed");
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [search, status, selectedDate, page, pageSize, t]
  );

  // Initial Load
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        const [res, cal] = await Promise.all([
          reservationApi.getReservations({ page: 1, pageSize }),
          reservationApi.getCalendarSummary(initialMonth),
        ]);
        if (isMounted) {
          setReservations(res.items);
          setTotal(res.total);
          setPage(res.page);
          setCalendarSummary(cal);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat data reservasi"
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
  }, [pageSize, initialMonth]);

  // Month change
  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
    fetchCalendarSummary(newMonth);
  };

  // Date selection
  const handleSelectDate = (dateStr: string) => {
    // If clicking same date, toggle to clear filter
    const newDate = selectedDate === dateStr ? "" : dateStr;
    setSelectedDate(newDate);
    setPage(1);
    fetchReservations({ date: newDate, page: 1 });
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
    fetchReservations({ search: query, page: 1 });
  };

  const handleStatusChange = (newStatus: ReservationStatus | "ALL") => {
    setStatus(newStatus);
    setPage(1);
    fetchReservations({ status: newStatus, page: 1 });
  };

  const goToPage = (p: number) => {
    if (p < 1 || (total > 0 && p > totalPages) || p === page) return;
    setPage(p);
    fetchReservations({ page: p });
  };

  // CRUD Actions
  const createReservation = async (input: CreateReservationInput): Promise<boolean> => {
    try {
      await reservationApi.createReservation(input);
      toast.success(t("reservation.createdSuccess"));
      await Promise.all([
        fetchReservations({ page: 1 }),
        fetchCalendarSummary(currentMonth),
      ]);
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reservation.createFailed");
      toast.error(msg);
      return false;
    }
  };

  const updateReservation = async (
    id: string,
    input: UpdateReservationInput
  ): Promise<boolean> => {
    try {
      const updated = await reservationApi.updateReservation(id, input);
      toast.success(t("reservation.updatedSuccess"));
      setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      fetchCalendarSummary(currentMonth);
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reservation.updateFailed");
      toast.error(msg);
      return false;
    }
  };

  const updateStatus = async (
    id: string,
    nextStatus: ReservationStatus
  ): Promise<boolean> => {
    try {
      const updated = await reservationApi.updateReservationStatus(id, nextStatus);
      toast.success(t("reservation.statusUpdated"));
      setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      fetchCalendarSummary(currentMonth);
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reservation.statusUpdateFailed");
      toast.error(msg);
      return false;
    }
  };

  const deleteReservation = async (id: string, _name?: string): Promise<boolean> => {
    try {
      await reservationApi.deleteReservation(id);
      toast.success(t("reservation.deletedSuccess"));
      setReservations((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      fetchCalendarSummary(currentMonth);
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("reservation.deleteFailed");
      toast.error(msg);
      return false;
    }
  };

  // Calculated Stats
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;
    const completedCount = reservations.filter((r) => r.status === "COMPLETED").length;
    const cancelledCount = reservations.filter((r) => r.status === "CANCELLED").length;
    const todayCount = (calendarSummary?.summary && calendarSummary.summary[todayStr]) || 0;

    return {
      totalMonth: calendarSummary?.totalBookings || 0,
      today: todayCount,
      confirmed: confirmedCount,
      completed: completedCount,
      cancelled: cancelledCount,
    };
  }, [reservations, calendarSummary]);

  return {
    reservations,
    isLoading,
    error,
    stats,
    // Filters & Pagination
    search,
    status,
    selectedDate,
    page,
    pageSize,
    total,
    totalPages,
    handleSearchChange,
    handleStatusChange,
    handleSelectDate,
    goToPage,
    // Calendar
    currentMonth,
    calendarSummary,
    isCalendarLoading,
    handleMonthChange,
    // Actions
    createReservation,
    updateReservation,
    updateStatus,
    deleteReservation,
    reload: () => {
      fetchReservations();
      fetchCalendarSummary(currentMonth);
    },
  };
}
