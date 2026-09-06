"use client";

import React, { useState, useEffect } from "react";
import { ReminderRule, DripRuleItem, UpdateReminderRuleInput } from "../types/reminder.types";
import { VariableInsertChips } from "./VariableInsertChips";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import {
  Clock,
  Smartphone,
  MessageSquare,
  Layers,
  Save,
  Loader2,
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
  }, [deviceId]);

  // Active drip rule item
  const activeRuleIndex = rules.findIndex((r) => r.daysOffset === activeTabOffset);
  const activeRule = activeRuleIndex >= 0 ? rules[activeRuleIndex] : null;

  const handleUpdateActiveRule = (field: keyof DripRuleItem, val: unknown) => {
    if (activeRuleIndex < 0) return;
    setRules((prev) => {
      const updated = [...prev];
      updated[activeRuleIndex] = {
        ...updated[activeRuleIndex],
        [field]: val,
      };
      return updated;
    });
  };

  const handleInsertVariable = (varName: string) => {
    if (!activeRule) return;
    const newTemplate = `${activeRule.template} {{${varName}}}`;
    handleUpdateActiveRule("template", newTemplate);
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

  return (
    <Card className="p-5">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Clock className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">Aturan Drip & Jadwal Otomatis</CardTitle>
            <CardDescription className="text-xs">
              Konfigurasikan template pesan bertahap (H-3, H-1, Hari H, H+1) dan perangkat pengirim.
            </CardDescription>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleFormSubmit}
          disabled={isSaving}
          className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold self-start sm:self-auto shadow-xs cursor-pointer"
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
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Core Settings: Device & Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Device Selector */}
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <Label htmlFor="rem-device" className="text-xs">
                <Smartphone className="size-3.5 text-primary" />
                <span>Nomor WhatsApp Pengirim</span>
              </Label>
              <NativeSelect
                id="rem-device"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                disabled={isSaving || isLoadingDevices}
                className="h-10 text-xs rounded-xl"
              >
                <NativeSelectOption value="">-- Pilih Slot Device --</NativeSelectOption>
                {devices.map((d) => (
                  <NativeSelectOption key={d.id} value={d.id}>
                    {d.name} {d.phone ? `(${d.phone})` : ""} - [{d.status}]
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {devices.length === 0 && !isLoadingDevices && (
                <p className="text-[11px] text-amber-500 flex items-center gap-1">
                  <AlertCircle className="size-3" /> Belum ada perangkat WhatsApp terhubung.
                </p>
              )}
            </div>

            {/* Send Time */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rem-send-time" className="text-xs">
                <Clock className="size-3.5 text-blue-500" />
                <span>Jam Kirim Harian (WIB)</span>
              </Label>
              <Input
                id="rem-send-time"
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
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
                  <MessageSquare className="size-3.5 text-emerald-500" />
                  <span>Tampilkan di Chat</span>
                </Label>
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
              <Tabs
                value={String(activeTabOffset)}
                onValueChange={(v) => setActiveTabOffset(Number(v))}
              >
                <TabsList className="h-8">
                  {rules.map((r) => (
                    <TabsTrigger
                      key={r.daysOffset}
                      value={String(r.daysOffset)}
                      className="text-xs gap-1.5"
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
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {activeRule && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{activeRule.name}</h3>
                    <p className="text-[11px] text-foreground-muted">
                      {activeRule.daysOffset < 0
                        ? `Dikirim ${Math.abs(activeRule.daysOffset)} hari sebelum tanggal target jadwal`
                        : activeRule.daysOffset === 0
                        ? "Dikirim pada tanggal target jadwal acara/janji temu"
                        : `Dikirim ${activeRule.daysOffset} hari setelah tanggal target (follow-up)`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-1.5 border border-border/60 self-start sm:self-auto">
                    <Label className="text-xs font-semibold text-foreground cursor-pointer">
                      Aktifkan Fase Ini
                    </Label>
                    <Switch
                      checked={activeRule.isEnabled}
                      onCheckedChange={(c) => handleUpdateActiveRule("isEnabled", c)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground-muted">
                      Template Pesan Fase Ini
                    </Label>
                    <span className="text-[10px] text-foreground-muted">
                      {activeRule.template.length} karakter
                    </span>
                  </div>

                  <Textarea
                    rows={4}
                    value={activeRule.template}
                    onChange={(e) => handleUpdateActiveRule("template", e.target.value)}
                    placeholder="Contoh: Halo Kak {{nama}}, mengingatkan jadwal Anda besok {{tanggal}}..."
                    className="rounded-xl p-3 text-xs leading-relaxed"
                  />

                  {/* Dynamic Variable Chips */}
                  <VariableInsertChips onInsert={handleInsertVariable} />
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
