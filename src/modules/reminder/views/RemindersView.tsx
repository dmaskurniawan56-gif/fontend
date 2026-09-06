"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useReminders } from "../hooks/useReminders";
import { useReminderRules } from "../hooks/useReminderRules";
import { useReminderLogs } from "../hooks/useReminderLogs";
import { QuickScheduleCard } from "../components/QuickScheduleCard";
import { DeliveryRulesCard } from "../components/DeliveryRulesCard";
import { ReminderTable } from "../components/ReminderTable";
import { ReminderLogsTable } from "../components/ReminderLogsTable";
import { Reminder } from "../types/reminder.types";
import { Button } from "@/components/ui/button";
import {
  BellRing,
  RefreshCw,
  Calendar,
  Layers,
  History,
  CheckCircle2,
  Clock,
  Pause,
  Send,
} from "lucide-react";

const DeleteReminderModal = dynamic(
  () =>
    import("../components/DeleteReminderModal").then(
      (m) => m.DeleteReminderModal
    ),
  { ssr: false }
);

type ActiveTab = "schedules" | "rules" | "logs";

export function RemindersView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("schedules");

  // Reminders hook
  const {
    reminders,
    isLoading: isRemindersLoading,
    stats,
    search,
    status,
    page: remindersPage,
    totalPages: remindersTotalPages,
    total: remindersTotal,
    handleSearchChange,
    handleStatusChange,
    goToPage: goToRemindersPage,
    createReminder,
    deleteReminder,
    toggleStatus,
    reload: reloadReminders,
  } = useReminders();

  // Reminder rules hook
  const {
    rule,
    isSaving: isSavingRules,
    updateRule,
    reload: reloadRules,
  } = useReminderRules();

  // Reminder logs hook
  const {
    logs,
    isLoading: isLogsLoading,
    isDispatching,
    page: logsPage,
    totalPages: logsTotalPages,
    total: logsTotal,
    goToPage: goToLogsPage,
    dispatchNow,
    reload: reloadLogs,
  } = useReminderLogs();

  // Delete modal state
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(null);

  const handleConfirmDelete = async (): Promise<boolean> => {
    if (!deletingReminder) return false;
    return await deleteReminder(deletingReminder.id, deletingReminder.recipientName);
  };

  const handleGlobalRefresh = () => {
    reloadReminders();
    reloadRules();
    reloadLogs();
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Pengingat Otomatis WhatsApp
            </h1>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Modul 2: Pengingat
            </span>
          </div>
          <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
            Jadwalkan pengingat tanggal target, automasi pesan drip (H-1, Hari H, H+3), dan pantau audit pengiriman.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGlobalRefresh}
            disabled={isRemindersLoading || isLogsLoading}
            className="h-9 gap-1.5 rounded-xl border-border/70 text-xs"
            title="Muat Ulang Data"
          >
            <RefreshCw
              className={`size-3.5 ${
                isRemindersLoading || isLogsLoading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={dispatchNow}
            disabled={isDispatching}
            className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
            title="Kirim semua pengingat yang jatuh tempo sekarang"
          >
            <Send className="size-3.5" />
            <span className="hidden sm:inline">Kirim Sekarang</span>
          </Button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Reminders */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Total Jadwal</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">{stats.total}</div>
          <div className="mt-1 text-[11px] text-foreground-muted">Semua jadwal tersimpan</div>
        </div>

        {/* Active Reminders */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Jadwal Aktif</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </div>
          <div className="mt-1 text-[11px] text-foreground-muted">Menunggu evaluasi cron</div>
        </div>

        {/* Paused Reminders */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Ditunda</span>
            <Pause className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats.paused}
          </div>
          <div className="mt-1 text-[11px] text-foreground-muted">Pengiriman dinonaktifkan</div>
        </div>

        {/* Total Logs Dispatched */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Riwayat Audit</span>
            <History className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {logsTotal}
          </div>
          <div className="mt-1 text-[11px] text-foreground-muted">Total log eksekusi idempoten</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("schedules")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "schedules"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-foreground-muted hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Calendar className="size-3.5" />
          <span>Jadwal Pengingat</span>
          <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
            {stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rules")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "rules"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-foreground-muted hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Layers className="size-3.5" />
          <span>Aturan Pengiriman & Drip</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "logs"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-foreground-muted hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <History className="size-3.5" />
          <span>Riwayat Pengiriman</span>
          <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-[10px]">
            {logsTotal}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "schedules" && (
        <div className="flex flex-col gap-6">
          <QuickScheduleCard onSchedule={createReminder} />
          <ReminderTable
            reminders={reminders}
            isLoading={isRemindersLoading}
            search={search}
            status={status}
            page={remindersPage}
            totalPages={remindersTotalPages}
            total={remindersTotal}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPageChange={goToRemindersPage}
            onToggleStatus={toggleStatus}
            onDeleteRequest={(rem) => setDeletingReminder(rem)}
          />
        </div>
      )}

      {activeTab === "rules" && (
        <div className="flex flex-col gap-6">
          <DeliveryRulesCard
            initialRule={rule}
            onSave={updateRule}
            isSaving={isSavingRules}
          />
        </div>
      )}

      {activeTab === "logs" && (
        <div className="flex flex-col gap-6">
          <ReminderLogsTable
            logs={logs}
            isLoading={isLogsLoading}
            isDispatching={isDispatching}
            page={logsPage}
            totalPages={logsTotalPages}
            total={logsTotal}
            onPageChange={goToLogsPage}
            onDispatchNow={dispatchNow}
            onReload={reloadLogs}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteReminderModal
        isOpen={Boolean(deletingReminder)}
        onClose={() => setDeletingReminder(null)}
        onConfirm={handleConfirmDelete}
        recipientName={deletingReminder?.recipientName || ""}
      />
    </div>
  );
}
