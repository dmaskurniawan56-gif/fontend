"use client";

import React, { useState, useEffect } from "react";
import { ReminderRule, DripRuleItem, UpdateReminderRuleInput } from "../types/reminder.types";
import { VariableInsertChips } from "./VariableInsertChips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import {
  Clock,
  Smartphone,
  MessageSquare,
  Layers,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface DeliveryRulesCardProps {
  initialRule: ReminderRule;
  onSave: (input: UpdateReminderRuleInput) => Promise<boolean>;
  isSaving: boolean;
}

export function DeliveryRulesCard({
  initialRule,
  onSave,
  isSaving,
}: DeliveryRulesCardProps) {
  const [deviceId, setDeviceId] = useState(initialRule.deviceId || "");
  const [sendTime, setSendTime] = useState(initialRule.sendTime || "09:00");
  const [showInChat, setShowInChat] = useState(initialRule.showInChat ?? true);
  const [rules, setRules] = useState<DripRuleItem[]>(initialRule.rules || []);
  const [activeTabOffset, setActiveTabOffset] = useState<number>(-1);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  // Sync state if initialRule updates
  useEffect(() => {
    setDeviceId(initialRule.deviceId || "");
    setSendTime(initialRule.sendTime || "09:00");
    setShowInChat(initialRule.showInChat ?? true);
    if (initialRule.rules && initialRule.rules.length > 0) {
      setRules(initialRule.rules);
    }
  }, [initialRule]);

  // Load WhatsApp devices for device selector
  useEffect(() => {
    let isMounted = true;
    const loadDevices = async () => {
      try {
        const list = await whatsappApi.getDevices();
        if (isMounted) {
          setDevices(list);
          // If no device selected and list has devices, auto select first connected device
          if (!deviceId && list.length > 0) {
            const connected = list.find((d) => d.status === "CONNECTED");
            setDeviceId(connected?.id || list[0].id);
          }
        }
      } catch {
        // Silently handle if devices fail to load
      } finally {
        if (isMounted) setIsLoadingDevices(false);
      }
    };

    loadDevices();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRuleToggle = (offset: number, isEnabled: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.daysOffset === offset ? { ...r, isEnabled } : r))
    );
  };

  const handleRuleTemplateChange = (offset: number, template: string) => {
    setRules((prev) =>
      prev.map((r) => (r.daysOffset === offset ? { ...r, template } : r))
    );
  };

  const handleInsertVariable = (offset: number, variableKey: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.daysOffset === offset) {
          return {
            ...r,
            template: `${r.template} {{${variableKey}}}`,
          };
        }
        return r;
      })
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      deviceId,
      sendTime,
      showInChat,
      rules,
    });
  };

  const activeRule = rules.find((r) => r.daysOffset === activeTabOffset) || rules[0];

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="flex flex-col gap-2 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Clock className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Aturan Pengiriman & Drip Otomatis</h2>
            <p className="text-xs text-foreground-muted">
              Tentukan jam eksekusi cron harian, slot nomor pengirim, dan template pesan untuk tiap fase drip.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleFormSubmit}
          disabled={isSaving}
          className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold self-start sm:self-auto shadow-xs"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              Simpan Aturan
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleFormSubmit} className="mt-5 flex flex-col gap-6">
        {/* Core Settings: Device & Time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Device Selector */}
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
              <Smartphone className="size-3.5 text-primary" />
              Nomor WhatsApp Pengirim
            </label>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              disabled={isSaving || isLoadingDevices}
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="">-- Pilih Slot Device --</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.phone ? `(${d.phone})` : ""} - [{d.status}]
                </option>
              ))}
            </select>
            {devices.length === 0 && !isLoadingDevices && (
              <p className="text-[11px] text-amber-500 flex items-center gap-1">
                <AlertCircle className="size-3" /> Belum ada perangkat WhatsApp terhubung.
              </p>
            )}
          </div>

          {/* Send Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
              <Clock className="size-3.5 text-blue-500" />
              Jam Kirim Harian (WIB)
            </label>
            <Input
              type="time"
              value={sendTime}
              onChange={(e) => setSendTime(e.target.value)}
              disabled={isSaving}
              className="h-10 text-xs rounded-xl"
              required
            />
          </div>

          {/* Show in Chat Switch */}
          <div className="flex flex-col justify-center gap-2 rounded-xl border border-border/50 bg-background/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-emerald-500" />
                Tampilkan di Chat
              </span>
              <Switch
                checked={showInChat}
                onCheckedChange={setShowInChat}
                disabled={isSaving}
              />
            </div>
            <span className="text-[11px] text-foreground-muted">
              Pesan pengingat akan muncul di riwayat obrolan WhatsApp bisnis.
            </span>
          </div>
        </div>

        {/* Drip Rules Tabs & Editor */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Fase Drip Pengingat</span>
            </div>
            <div className="flex items-center gap-1.5">
              {rules.map((r) => (
                <button
                  key={r.daysOffset}
                  type="button"
                  onClick={() => setActiveTabOffset(r.daysOffset)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeTabOffset === r.daysOffset
                      ? "bg-background text-foreground shadow-xs border border-border/60"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      r.isEnabled ? "bg-emerald-500" : "bg-muted-foreground/40"
                    }`}
                  />
                  <span>
                    {r.daysOffset < 0
                      ? `H${r.daysOffset}`
                      : r.daysOffset === 0
                      ? "Hari H"
                      : `H+${r.daysOffset}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {activeRule && (
            <div className="mt-1 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-foreground">{activeRule.name}</h3>
                  <p className="text-[11px] text-foreground-muted">
                    {activeRule.daysOffset === -1 && "Dikirimkan 1 hari sebelum tanggal jadwal target."}
                    {activeRule.daysOffset === 0 && "Dikirimkan tepat pada hari H tanggal jadwal target."}
                    {activeRule.daysOffset > 0 && `Dikirimkan ${activeRule.daysOffset} hari setelah tanggal target (Follow-up).`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground-muted">
                    {activeRule.isEnabled ? "Aktif" : "Nonaktif"}
                  </span>
                  <Switch
                    checked={activeRule.isEnabled}
                    onCheckedChange={(val) => handleRuleToggle(activeRule.daysOffset, val)}
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Variable Chips */}
              <VariableInsertChips
                onInsert={(varKey) => handleInsertVariable(activeRule.daysOffset, varKey)}
              />

              {/* Textarea Template */}
              <div className="flex flex-col gap-1.5">
                <Textarea
                  value={activeRule.template}
                  onChange={(e) =>
                    handleRuleTemplateChange(activeRule.daysOffset, e.target.value)
                  }
                  placeholder="Ketik template pesan pengingat..."
                  rows={4}
                  className="rounded-xl text-xs font-mono leading-relaxed"
                  disabled={isSaving}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
