"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WebhookConfig } from "@/modules/subscription/types/subscription.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  Webhook,
  Key,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Radio,
  SlidersHorizontal,
  Check,
} from "lucide-react";

export interface WebhookEventDefinition {
  id: string;
  name: string;
  description: string;
  tag: string;
  defaultChecked: boolean;
}

export const AVAILABLE_WEBHOOK_EVENTS: WebhookEventDefinition[] = [
  {
    id: "message.received",
    name: "Pesan Masuk (Inbound Message)",
    description: "Callback setiap kali ada pesan WhatsApp baru yang masuk ke perangkat.",
    tag: "Pesan",
    defaultChecked: true,
  },
  {
    id: "message.ack",
    name: "Tanda Terima Pesan (Message Ack)",
    description: "Status pengiriman pesan keluar: Sent (1 centang), Delivered (2 centang), Read (centang biru).",
    tag: "Delivery",
    defaultChecked: false,
  },
  {
    id: "message.sent",
    name: "Pesan Terkirim (Outbound Sent)",
    description: "Konfirmasi instan saat pesan berhasil didispatch dari perangkat ponsel ke server WhatsApp.",
    tag: "Audit",
    defaultChecked: false,
  },
  {
    id: "device.status",
    name: "Status Perangkat (Lifecycle)",
    description: "Pemberitahuan perubahan status perangkat: Connected, Disconnected, Authenticated.",
    tag: "Koneksi",
    defaultChecked: true,
  },
  {
    id: "device.qr",
    name: "QR Code Baru (Pairing)",
    description: "Streaming Base64 QR code saat nomor sedang dalam proses scanning/pairing WhatsApp Web.",
    tag: "Pairing",
    defaultChecked: false,
  },
];

interface WebhookConfigCardProps {
  config: WebhookConfig | null;
  onSave: (url: string, isEnabled: boolean, secret?: string, events?: string[]) => Promise<unknown>;
  onRegenerateSecret: () => Promise<unknown>;
  onCopySecret: (secret: string) => void;
}

export function WebhookConfigCard({
  config,
  onSave,
  onRegenerateSecret,
  onCopySecret,
}: WebhookConfigCardProps) {
  const { t } = useI18n();
  const [url, setUrl] = useState(config?.url || "");
  const [isEnabled, setIsEnabled] = useState(config?.isEnabled ?? true);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    config?.events || ["message.received", "device.status"]
  );
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; latency?: number; error?: string } | null>(null);

  React.useEffect(() => {
    if (config) {
      setUrl(config.url || "");
      setIsEnabled(config.isEnabled);
      if (config.events && Array.isArray(config.events)) {
        setSelectedEvents(config.events);
      }
    }
  }, [config]);

  const handleTestPing = async () => {
    if (!url) {
      toast.error("Masukkan URL endpoint webhook terlebih dahulu");
      return;
    }
    setIsPinging(true);
    setPingResult(null);
    const startTime = performance.now();
    try {
      toast.info("Mengirim simulasi test.ping ke endpoint...", { id: "webhook-ping" });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Wahide-Secret": config?.secret || "",
          "User-Agent": "Wahide-WhatsApp-Webhook-Engine/2.0-TestPing",
        },
        body: JSON.stringify({
          event: "test.ping",
          device_id: "test_simulation_device",
          timestamp: Math.floor(Date.now() / 1000),
          data: {
            message: "Simulasi uji coba konektivitas webhook dari Wahide Dashboard.",
          },
        }),
        signal: controller.signal,
        mode: "no-cors",
      });
      clearTimeout(timeoutId);
      const latency = Math.round(performance.now() - startTime);
      setPingResult({ success: true, latency });
      toast.success(`Endpoint webhook terjangkau! (${latency}ms)`, { id: "webhook-ping" });
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === "AbortError";
      setPingResult({ success: false, error: isTimeout ? "Timeout (>7s)" : "Gagal terhubung" });
      toast.error(isTimeout ? "Endpoint timeout (>7 detik)" : "Gagal terhubung ke endpoint webhook", { id: "webhook-ping" });
    } finally {
      setIsPinging(false);
    }
  };

  const handleToggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleSelectAllEvents = () => {
    setSelectedEvents(AVAILABLE_WEBHOOK_EVENTS.map((e) => e.id));
  };

  const handleResetDefaultEvents = () => {
    setSelectedEvents(["message.received", "device.status"]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(url.trim(), isEnabled, config?.secret, selectedEvents);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateSecret();
      setIsConfirmOpen(false);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="border-border bg-surface space-y-6 rounded-xl border p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Webhook className="size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-xl font-black tracking-tight">
              {t("subscription.webhookTitle")}
            </h2>
            <p className="text-foreground-secondary text-xs font-semibold">
              {t("subscription.webhookSubtitle")}
            </p>
          </div>
        </div>

        {/* Actions & Toggle Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/docs/webhooks"
            target="_blank"
            className="text-foreground-secondary hover:text-foreground inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/50 px-3 py-1.5 text-xs font-bold transition-colors hover:border-border"
          >
            <BookOpen className="size-3.5" />
            <span>Dokumentasi Webhook</span>
            <ExternalLink className="size-3 opacity-70" />
          </Link>

          <div className="flex items-center gap-2.5 border-l border-border/60 pl-2">
            <span className="text-foreground text-xs font-bold">
              {isEnabled ? "Webhook Aktif" : "Webhook Nonaktif"}
            </span>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} aria-label="Toggle Webhook" />
          </div>
        </div>
      </div>

      {/* Workspace Webhook Inheritance Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-foreground-secondary">
        <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-foreground">Webhook Utama Workspace:</span> Semua nomor WhatsApp di workspace ini secara otomatis mewarisi (*inherit*) endpoint dan secret key ini secara default. Jika Anda membutuhkan routing terpisah untuk nomor tertentu, Anda dapat menyetel <span className="font-semibold text-foreground">Override Webhook Khusus</span> di menu Detail Perangkat masing-masing.
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Endpoint URL Input */}
        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("subscription.webhookUrlLabel")}
          </label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("subscription.webhookUrlPlaceholder")}
            disabled={!isEnabled || isSaving}
            variant="pill"
            className="h-11 font-mono"
          />
        </div>

        {/* Signing Secret Box */}
        <div className="border-border bg-muted/30 space-y-2 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="dark:text-wise-green size-4 text-emerald-700" />
              <span className="text-foreground text-xs font-bold">
                {t("subscription.signingSecretLabel")}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
                className="border-border size-7 rounded-full p-0"
                aria-label={showSecret ? "Sembunyikan Kunci" : "Tampilkan Kunci"}
              >
                {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => config?.secret && onCopySecret(config.secret)}
                className="border-border size-7 rounded-full p-0"
                aria-label="Salin Secret"
              >
                <Copy className="size-3.5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isRegenerating}
                onClick={() => setIsConfirmOpen(true)}
                className="border-border size-7 rounded-full p-0"
                aria-label="Regenerate Secret"
              >
                <RefreshCw className={`size-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="bg-surface border-border text-foreground rounded border p-2.5 font-mono text-xs font-semibold break-all dark:bg-[#10110e]">
            {showSecret ? config?.secret || "whsec_..." : "whsec_••••••••••••••••••••••••••••••••"}
          </div>

          <div className="text-foreground-muted flex items-center gap-1.5 pt-1 text-[11px] font-semibold">
            <ShieldCheck className="dark:text-wise-green size-3.5 shrink-0 text-emerald-600" />
            <span>
              Kunci rahasia ini dikirimkan otomatis oleh Wahide pada header <code className="font-mono text-foreground font-bold">X-Wahide-Secret</code> pada setiap callback event WhatsApp.
            </span>
          </div>
        </div>

        {/* Granular Webhook Event Subscriptions */}
        <div className="border-border bg-muted/20 space-y-3.5 rounded-xl border p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="dark:text-wise-green size-4 text-emerald-700" />
              <div>
                <span className="text-foreground text-xs font-bold">
                  Langganan Event Webhook (Event Subscriptions)
                </span>
                <p className="text-foreground-secondary text-[11px] font-medium">
                  Hanya event yang dipilih yang akan dikirim ke endpoint Anda. Event lainnya akan di-drop instan (Zero Allocation).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllEvents}
                disabled={!isEnabled}
                className="h-7 text-[11px] font-bold px-2 rounded-lg text-foreground-secondary hover:text-foreground"
              >
                Pilih Semua
              </Button>
              <span className="text-border">|</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetDefaultEvents}
                disabled={!isEnabled}
                className="h-7 text-[11px] font-bold px-2 rounded-lg text-foreground-secondary hover:text-foreground"
              >
                Reset Default
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2 lg:grid-cols-1">
            {AVAILABLE_WEBHOOK_EVENTS.map((ev) => {
              const isChecked = selectedEvents.includes(ev.id);
              return (
                <div
                  key={ev.id}
                  onClick={() => isEnabled && handleToggleEvent(ev.id)}
                  className={`flex items-start justify-between gap-3 rounded-lg border p-3 transition-all cursor-pointer select-none ${
                    isChecked
                      ? "border-emerald-500/40 bg-emerald-500/5 dark:border-emerald-400/30 dark:bg-emerald-500/10"
                      : "border-border/70 bg-surface/50 opacity-60 hover:opacity-100"
                  } ${!isEnabled ? "pointer-events-none opacity-40" : ""}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-foreground">
                        {ev.id}
                      </span>
                      <span className="rounded-md border border-border/80 bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold text-foreground-secondary">
                        {ev.tag}
                      </span>
                      {isChecked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Check className="size-3" />
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-foreground-secondary leading-relaxed font-medium">
                      {ev.description}
                    </p>
                  </div>

                  <Switch
                    checked={isChecked}
                    onCheckedChange={() => handleToggleEvent(ev.id)}
                    disabled={!isEnabled}
                    className="shrink-0 mt-0.5"
                    aria-label={`Toggle event ${ev.id}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons & Ping Feedback */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPinging || !url || !isEnabled}
              onClick={handleTestPing}
              className="border-border hover:border-foreground-muted gap-1.5 rounded-full text-xs font-bold"
            >
              {isPinging ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menguji Endpoint...</span>
                </>
              ) : (
                <>
                  <Radio className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Test Endpoint (Ping)</span>
                </>
              )}
            </Button>

            {pingResult && (
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {pingResult.success ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Terjangkau ({pingResult.latency}ms)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-rose-600 dark:text-rose-400">
                    <span className="size-1.5 rounded-full bg-rose-500" />
                    {pingResult.error}
                  </span>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isSaving || !isEnabled}
            className="gap-2 px-6 text-xs font-bold shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("subscription.saving")}</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>{t("subscription.saveWebhook")}</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog for Secret Rotation */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
          <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3.5 border-b p-5 text-left sm:p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-5.5" />
            </div>
            <div>
              <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight">
                Buat Ulang Signing Secret?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
                Tindakan rotasi kunci secret webhook sistem.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <div className="text-foreground-secondary min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs leading-relaxed sm:p-6">
            <p>
              Kunci Signing Secret lama akan segera tidak berlaku. Semua server endpoint yang
              memverifikasi header signature webhook harus diperbarui dengan kunci baru ini.
            </p>
          </div>

          <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 sm:p-5">
            <AlertDialogCancel
              disabled={isRegenerating}
              className="border-border hover:border-foreground-muted rounded-full text-xs font-bold"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRegenerating}
              onClick={handleConfirmRegenerate}
              variant="primaryPill"
              className="gap-1.5 rounded-full text-xs font-bold"
            >
              {isRegenerating && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isRegenerating ? "Memproses..." : "Ya, Buat Ulang"}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
