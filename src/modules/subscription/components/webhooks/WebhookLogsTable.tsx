"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { subscriptionApi } from "../../api/subscription.api";
import {
  WebhookLogItem,
  WebhookLogFilters,
} from "../../types/subscription.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Activity,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Trash2,
  Eye,
  Copy,
  ShieldAlert,
} from "lucide-react";

export function WebhookLogsTable() {
  const [logs, setLogs] = useState<WebhookLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<WebhookLogFilters>({
    page: 1,
    page_size: 15,
    search: "",
    event_name: "ALL",
  });

  const [selectedLog, setSelectedLog] = useState<WebhookLogItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await subscriptionApi.getWebhookLogs(filters);
      setLogs(res.data);
      setTotal(res.total);
    } catch {
      toast.error("Gagal memuat riwayat log webhook");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRetry = async (log: WebhookLogItem) => {
    setRetryingId(log.id);
    try {
      await subscriptionApi.retryWebhookLog(log.id);
      toast.success("Pengiriman ulang webhook dijadwalkan!");
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
      retryTimerRef.current = setTimeout(() => {
        fetchLogs();
        retryTimerRef.current = null;
      }, 1500);
    } catch {
      toast.error("Gagal mengirim ulang webhook");
    } finally {
      setRetryingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await subscriptionApi.deleteWebhookLog(id);
      toast.success("Log webhook berhasil dihapus");
      setLogs((prev) => prev.filter((l) => l.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (selectedLog?.id === id) {
        setIsDetailOpen(false);
      }
    } catch {
      toast.error("Gagal menghapus log webhook");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard!`);
  };

  const formatPayload = (raw?: string) => {
    if (!raw) return "-";
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  };

  const renderStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          {status} OK
        </span>
      );
    }
    if (status >= 400 && status < 500) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          <AlertTriangle className="size-3.5" />
          {status} Client Err
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
        <XCircle className="size-3.5" />
        {status ? `${status} Error` : "Failed"}
      </span>
    );
  };

  return (
    <div className="border-border bg-surface space-y-6 rounded-xl border p-6 shadow-sm sm:p-8">
      {/* Header & Subtitle */}
      <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Activity className="size-5" />
          </div>
          <div>
            <h3 className="text-foreground text-lg font-black tracking-tight">
              Riwayat Pengiriman Webhook
            </h3>
            <p className="text-foreground-secondary text-xs font-semibold">
              Audit log pengiriman event secara real-time. Data otomatis
              dibersihkan setiap 3 hari (Rolling Retention).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
            className="gap-1.5 rounded-full text-xs font-bold"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Segarkan</span>
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
        <div className="relative sm:col-span-6">
          <Search className="text-foreground-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Cari URL endpoint, Event ID, atau payload..."
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
            className="pl-9 text-xs font-medium"
            variant="pill"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={filters.event_name || "ALL"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                event_name: e.target.value,
                page: 1,
              }))
            }
            className="border-border bg-background text-foreground h-10 w-full rounded-full border px-3 text-xs font-bold focus:outline-none"
          >
            <option value="ALL">Semua Event</option>
            <option value="message.received">message.received</option>
            <option value="message.sent">message.sent</option>
            <option value="message.delivered">message.delivered</option>
            <option value="message.read">message.read</option>
            <option value="device.status">device.status</option>
            <option value="test.ping">test.ping</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={
              filters.response_status ? String(filters.response_status) : "ALL"
            }
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                response_status:
                  e.target.value === "ALL" ? undefined : Number(e.target.value),
                page: 1,
              }))
            }
            className="border-border bg-background text-foreground h-10 w-full rounded-full border px-3 text-xs font-bold focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="200">200 OK (Berhasil)</option>
            <option value="400">400 Bad Request</option>
            <option value="404">404 Not Found</option>
            <option value="500">500 Server Error</option>
            <option value="502">502 Bad Gateway</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border-border overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-foreground-secondary border-border border-b font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Target Endpoint</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y font-medium">
              {isLoading && logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-foreground-muted px-4 py-12 text-center"
                  >
                    <RefreshCw className="mx-auto mb-2 size-5 animate-spin" />
                    Memuat log pengiriman...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-foreground-muted px-4 py-12 text-center"
                  >
                    <Activity className="mx-auto mb-2 size-8 opacity-40" />
                    <p className="text-foreground font-bold">
                      Belum Ada Riwayat Webhook
                    </p>
                    <p className="mt-1 text-xs">
                      Saat event WhatsApp terjadi, Wahide akan mengirimkan HTTP
                      POST callback dan mencatat statusnya di sini.
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {renderStatusBadge(log.response_status)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-foreground bg-muted/50 rounded px-2 py-0.5">
                        {log.event_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-55">
                      <span
                        className="truncate font-mono block text-foreground-secondary"
                        title={log.target_url}
                      >
                        {log.target_url}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-foreground-secondary">
                        {log.latency_ms} ms
                      </span>
                      {log.attempt > 1 && (
                        <span className="ml-1.5 text-[10px] text-amber-500 font-bold">
                          (Try #{log.attempt})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground-secondary whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsDetailOpen(true);
                          }}
                          className="size-7 rounded-full p-0"
                          title="Lihat Detail Payload & Response"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(log)}
                          disabled={retryingId === log.id}
                          className="size-7 rounded-full p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          title="Kirim Ulang (Retry)"
                        >
                          <RotateCw
                            className={`size-3.5 ${retryingId === log.id ? "animate-spin" : ""}`}
                          />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(log.id)}
                          disabled={deletingId === log.id}
                          className="size-7 rounded-full p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                          title="Hapus Log"
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
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="flex items-center justify-between text-xs font-semibold text-foreground-secondary pt-2">
          <span>
            Menampilkan {logs.length} dari total {total} log
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={filters.page === 1 || isLoading}
              onClick={() =>
                setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))
              }
              className="rounded-full h-8 text-xs font-bold"
            >
              Sebelumnya
            </Button>
            <span className="font-mono font-bold text-foreground">
              Halaman {filters.page}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={logs.length < (filters.page_size || 15) || isLoading}
              onClick={() =>
                setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))
              }
              className="rounded-full h-8 text-xs font-bold"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              {selectedLog && renderStatusBadge(selectedLog.response_status)}
              <DialogTitle className="text-base font-black">
                Detail Pengiriman Webhook: {selectedLog?.event_name}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs font-mono break-all text-foreground-secondary">
              ID: {selectedLog?.id} • Target: {selectedLog?.target_url}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 overflow-y-auto pr-1 text-xs">
              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 bg-muted/30 p-3 rounded-lg border border-border">
                <div>
                  <span className="text-foreground-secondary block text-[10px] uppercase font-bold">
                    Latency
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedLog.latency_ms} ms
                  </span>
                </div>
                <div>
                  <span className="text-foreground-secondary block text-[10px] uppercase font-bold">
                    Percobaan
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    Percobaan #{selectedLog.attempt}
                  </span>
                </div>
                <div>
                  <span className="text-foreground-secondary block text-[10px] uppercase font-bold">
                    Device ID
                  </span>
                  <span className="font-mono font-bold text-foreground truncate block">
                    {selectedLog.device_id || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-foreground-secondary block text-[10px] uppercase font-bold">
                    Waktu
                  </span>
                  <span className="font-mono font-bold text-foreground truncate block">
                    {new Date(selectedLog.created_at).toLocaleTimeString(
                      "id-ID",
                    )}
                  </span>
                </div>
              </div>

              {/* Error Message if any */}
              {selectedLog.error_message && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-rose-600 dark:text-rose-400">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldAlert className="size-4" />
                    <span>Pesan Kesalahan:</span>
                  </div>
                  <p className="font-mono text-xs">
                    {selectedLog.error_message}
                  </p>
                </div>
              )}

              {/* Request Payload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Request Payload (JSON)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy(
                        formatPayload(selectedLog.request_payload),
                        "Payload",
                      )
                    }
                    className="h-6 gap-1 px-2 text-[11px] font-bold"
                  >
                    <Copy className="size-3" />
                    Salin
                  </Button>
                </div>
                <pre className="bg-[#10110e] text-[#f4f4f0] p-3 rounded-lg font-mono text-[11px] overflow-x-auto max-h-48 border border-border">
                  {formatPayload(selectedLog.request_payload)}
                </pre>
              </div>

              {/* Response Body */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Response Body (HTTP {selectedLog.response_status})
                  </span>
                  {selectedLog.response_body && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(selectedLog.response_body || "", "Response")
                      }
                      className="h-6 gap-1 px-2 text-[11px] font-bold"
                    >
                      <Copy className="size-3" />
                      Salin
                    </Button>
                  )}
                </div>
                <pre className="bg-muted/40 text-foreground p-3 rounded-lg font-mono text-[11px] overflow-x-auto max-h-36 border border-border">
                  {selectedLog.response_body || "(Empty response body)"}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4 gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => selectedLog && handleDelete(selectedLog.id)}
              className="text-rose-500 hover:text-rose-600 rounded-full text-xs font-bold"
            >
              <Trash2 className="size-3.5 mr-1" />
              Hapus Log Ini
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => selectedLog && handleRetry(selectedLog)}
                disabled={retryingId === selectedLog?.id}
                className="rounded-full text-xs font-bold gap-1.5"
              >
                <RotateCw
                  className={`size-3.5 ${retryingId === selectedLog?.id ? "animate-spin" : ""}`}
                />
                Kirim Ulang
              </Button>
              <Button
                type="button"
                variant="primaryPill"
                size="sm"
                onClick={() => setIsDetailOpen(false)}
                className="text-xs font-bold px-5"
              >
                Tutup
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
