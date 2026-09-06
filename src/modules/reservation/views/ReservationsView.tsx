"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { useReservations } from "../hooks/useReservations";
import { MonthlyCalendar } from "../components/MonthlyCalendar";
import { DailyAgendaList } from "../components/DailyAgendaList";
import { AddReservationForm } from "../components/AddReservationForm";
import { DeleteReservationModal } from "../components/DeleteReservationModal";
import { Reservation } from "../types/reservation.types";

export function ReservationsView() {
  const { t } = useI18n();
  const {
    reservations,
    isLoading,
    error,
    stats,
    search,
    status,
    selectedDate,
    page,
    totalPages,
    total,
    handleSearchChange,
    handleStatusChange,
    handleSelectDate,
    goToPage,
    currentMonth,
    calendarSummary,
    isCalendarLoading,
    handleMonthChange,
    createReservation,
    updateStatus,
    deleteReservation,
    reload,
  } = useReservations();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CalendarDays className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
            {t("reservation.pageTitle")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("reservation.pageSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={isLoading || isCalendarLoading}
            className="h-9 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${
                isLoading || isCalendarLoading ? "animate-spin" : ""
              }`}
            />
            {t("common.refresh")}
          </Button>
          <Button
            variant="primaryPill"
            onClick={() => setIsAddOpen(true)}
            size="sm"
            className="h-9 cursor-pointer gap-1.5 px-4 text-xs font-bold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{t("reservation.newReservation")}</span>
          </Button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={reload}
            className="text-xs h-7 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50"
          >
            {t("common.retry")}
          </Button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("reservation.metricMonth")}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stats.totalMonth}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("reservation.metricToday")}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stats.today}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("reservation.metricConfirmed")}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stats.confirmed}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("reservation.metricCompleted")}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stats.completed}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Monthly Calendar (Left) + Daily Agenda (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Monthly Calendar Grid */}
        <div className="lg:col-span-5 w-full">
          <MonthlyCalendar
            currentMonth={currentMonth}
            calendarSummary={calendarSummary}
            isLoading={isCalendarLoading}
            selectedDate={selectedDate}
            onMonthChange={handleMonthChange}
            onSelectDate={handleSelectDate}
          />
        </div>

        {/* Right Column: Daily Agenda Timeline & Search */}
        <div className="lg:col-span-7 w-full">
          <DailyAgendaList
            reservations={reservations}
            isLoading={isLoading}
            search={search}
            status={status}
            selectedDate={selectedDate}
            page={page}
            totalPages={totalPages}
            total={total}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPageChange={goToPage}
            onStatusUpdate={updateStatus}
            onDeleteClick={(r) => setReservationToDelete(r)}
            onAddClick={() => setIsAddOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <AddReservationForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={createReservation}
        defaultDate={selectedDate}
      />

      <DeleteReservationModal
        reservation={reservationToDelete}
        isOpen={Boolean(reservationToDelete)}
        onClose={() => setReservationToDelete(null)}
        onConfirm={deleteReservation}
      />
    </div>
  );
}
