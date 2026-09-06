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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
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
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Pengingat Otomatis WhatsApp
          </h1>
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
            className="h-9 gap-1.5 rounded-xl border-border/70 text-xs cursor-pointer"
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
            className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs cursor-pointer"
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
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Total Jadwal</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">{stats.total}</div>
          <div className="mt-1 text-[11px] text-foreground-muted">Semua jadwal tersimpan</div>
        </Card>

        {/* Active Reminders */}
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Jadwal Aktif</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </div>
          <div className="mt-1 text-[11px] text-foreground-muted">Menunggu evaluasi cron</div>
        </Card>

        {/* Paused Reminders */}
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Ditunda</span>
            <Pause className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats.paused}
          </div>
          <div className="mt-1 text-[11px] text-foreground-muted">Pengiriman dinonaktifkan</div>
        </Card>

        {/* Total Logs Dispatched */}
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-xs font-medium">Total Terkirim</span>
            <Clock className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {logsTotal}
          </div>
          <div className="mt-1 text-[11px] text-foreground-muted">Pesan berhasil dikirim</div>
        </Card>
      </div>

      {/* Tabs Navigation (Elevated Segmented Modern Nav) */}
      <div className="overflow-x-auto scrollbar-none pb-1 sm:pb-0 w-full sm:w-fit">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)}>
          <TabsList className="h-12 sm:h-13 p-1.5 rounded-2xl bg-muted/70 dark:bg-muted/40 border border-border/80 shadow-xs flex items-center gap-1.5 w-full sm:w-auto shrink-0">
            <TabsTrigger
              value="schedules"
              className="h-9.5 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold gap-2.5 rounded-xl cursor-pointer transition-all data-active:bg-card data-active:text-foreground data-active:shadow-xs data-active:font-bold border border-transparent data-active:border-border/60 shrink-0"
            >
              <Calendar className="size-4 sm:size-4.5 text-primary shrink-0" />
              <span>Jadwal Pengingat</span>
              <span
                className={cn(
                  "text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full transition-colors",
                  activeTab === "schedules"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-background/80 text-muted-foreground border border-border/50"
                )}
              >
                {stats.total}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="rules"
              className="h-9.5 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold gap-2.5 rounded-xl cursor-pointer transition-all data-active:bg-card data-active:text-foreground data-active:shadow-xs data-active:font-bold border border-transparent data-active:border-border/60 shrink-0"
            >
              <Layers className="size-4 sm:size-4.5 text-amber-500 shrink-0" />
              <span>Aturan Pengiriman & Drip</span>
            </TabsTrigger>

            <TabsTrigger
              value="logs"
              className="h-9.5 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold gap-2.5 rounded-xl cursor-pointer transition-all data-active:bg-card data-active:text-foreground data-active:shadow-xs data-active:font-bold border border-transparent data-active:border-border/60 shrink-0"
            >
              <History className="size-4 sm:size-4.5 text-purple-500 shrink-0" />
              <span>Riwayat Pengiriman</span>
              <span
                className={cn(
                  "text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full transition-colors",
                  activeTab === "logs"
                    ? "bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30"
                    : "bg-background/80 text-muted-foreground border border-border/50"
                )}
              >
                {logsTotal}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Panels */}
      {activeTab === "schedules" && (
        <div className="flex flex-col gap-6">
          <QuickScheduleCard
            onSchedule={createReminder}
            hasConfiguredDevice={Boolean(rule?.deviceId && rule.deviceId.trim() !== "")}
            onNavigateToRules={() => setActiveTab("rules")}
          />
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
        <DeliveryRulesCard
          initialRule={rule}
          onSave={updateRule}
          isSaving={isSavingRules}
        />
      )}

      {activeTab === "logs" && (
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
