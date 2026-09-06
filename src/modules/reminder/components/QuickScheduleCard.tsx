"use client";

import React, { useState, useEffect } from "react";
import { CreateReminderInput } from "../types/reminder.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  CalendarPlus,
  User,
  Phone,
  Calendar,
  FileText,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { normalizePhoneNumber, isValidE164 } from "@/lib/phone";

interface QuickScheduleCardProps {
  onSchedule: (input: CreateReminderInput) => Promise<boolean>;
  hasConfiguredDevice?: boolean;
  onNavigateToRules?: () => void;
}

export function QuickScheduleCard({
  onSchedule,
  hasConfiguredDevice = true,
  onNavigateToRules,
}: QuickScheduleCardProps) {
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [isoDate, setIsoDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  // Set default target date to tomorrow formatted as DD/MM/YYYY
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setIsoDate(`${yyyy}-${mm}-${dd}`);
    setDisplayDate(`${dd}/${mm}/${yyyy}`);
  }, []);

  const handleNativeDateChange = (val: string) => {
    if (!val) return;
    setIsoDate(val);
    const parts = val.split("-");
    if (parts.length === 3) {
      setDisplayDate(`${parts[2]}/${parts[1]}/${parts[0]}`);
    }
  };

  const handleDisplayDateChange = (val: string) => {
    setDisplayDate(val);
    const cleaned = val.trim().replace(/-/g, "/");
    const parts = cleaned.split("/");
    if (parts.length === 3 && parts[2].length === 4) {
      const dd = parts[0].padStart(2, "0");
      const mm = parts[1].padStart(2, "0");
      const yyyy = parts[2];
      setIsoDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  const getDatePreview = () => {
    let dateObj: Date | null = null;
    if (displayDate.includes("/")) {
      const [d, m, y] = displayDate.split("/");
      if (d && m && y && y.length === 4) {
        const numD = Number(d);
        const numM = Number(m);
        const numY = Number(y);
        if (numM >= 1 && numM <= 12 && numD >= 1 && numD <= 31) {
          dateObj = new Date(numY, numM - 1, numD);
        }
      }
    } else if (isoDate) {
      dateObj = new Date(isoDate);
    }
    if (dateObj && !isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasConfiguredDevice) {
      toast.warning("Perangkat WhatsApp belum dipilih", {
        description: "Mengalihkan Anda ke tab Aturan Pengiriman & Drip untuk menyimpan nomor pengirim terlebih dahulu.",
      });
      onNavigateToRules?.();
      return;
    }

    if (!recipientName.trim()) {
      toast.error("Nama penerima wajib diisi");
      return;
    }

    if (!phone.trim()) {
      toast.error("Nomor WhatsApp wajib diisi");
      return;
    }

    const cleanPhone = normalizePhoneNumber(phone);
    if (!isValidE164(cleanPhone)) {
      toast.error("Format nomor WhatsApp tidak valid (contoh: 08123456789 atau 628123456789)");
      return;
    }

    const finalDate = displayDate.trim();
    if (!finalDate) {
      toast.error("Tanggal target jadwal wajib dipilih");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSchedule({
        recipientName: recipientName.trim(),
        phone: cleanPhone,
        targetDate: finalDate,
        notes: notes.trim(),
      });

      if (success) {
        setRecipientName("");
        setPhone("");
        setNotes("");
        // reset to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        setIsoDate(`${yyyy}-${mm}-${dd}`);
        setDisplayDate(`${dd}/${mm}/${yyyy}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-5">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarPlus className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">Jadwalkan Pengingat Cepat</CardTitle>
            <CardDescription className="text-xs">
              Tambahkan kontak dan tanggal target. Sistem akan mengirimkan pesan otomatis sesuai aturan drip.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0 flex flex-col gap-4">
        {!hasConfiguredDevice && (
          <Alert
            variant="warning"
            className="border-amber-300/80 bg-amber-500/10 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl"
          >
            <AlertTriangle className="size-4.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between w-full">
              <div>
                <AlertTitle className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100">
                  Perangkat WhatsApp Pengirim Belum Dikonfigurasi
                </AlertTitle>
                <AlertDescription className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                  Sebelum menjadwalkan pengingat, Anda perlu memilih dan menyimpan nomor WhatsApp pengirim pada menu{" "}
                  <span className="font-semibold underline underline-offset-2">Aturan Drip & Jadwal Otomatis</span> agar pesan otomatis dapat terkirim.
                </AlertDescription>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  toast.info("Silakan pilih Perangkat WhatsApp Pengirim dan klik Simpan Aturan.");
                  onNavigateToRules?.();
                }}
                className="h-8.5 px-3.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shrink-0 self-start sm:self-auto gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Smartphone className="size-3.5" />
                <span>Atur Nomor Pengirim Sekarang</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Recipient Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rem-name" className="flex items-center gap-1.5 text-xs">
              <User className="size-3.5 text-primary" />
              <span>Nama Penerima *</span>
            </Label>
            <Input
              id="rem-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Contoh: Ahmad Dahlan"
              className="h-10 text-xs rounded-xl"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* WhatsApp Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rem-phone" className="flex items-center gap-1.5 text-xs">
              <Phone className="size-3.5 text-emerald-500" />
              <span>No. WhatsApp *</span>
            </Label>
            <Input
              id="rem-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789 atau 628123456789"
              className="h-10 text-xs rounded-xl"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Target Date */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="rem-date-display" className="flex items-center gap-1.5 text-xs">
                <Calendar className="size-3.5 text-blue-500" />
                <span>Tanggal Target *</span>
              </Label>
              <span className="text-[10px] font-mono text-foreground-muted">
                (Tgl/Bln/Thn)
              </span>
            </div>
            <div className="relative flex items-center">
              <Input
                id="rem-date-display"
                type="text"
                value={displayDate}
                onChange={(e) => handleDisplayDateChange(e.target.value)}
                placeholder="07/09/2026"
                className="h-10 text-xs font-mono rounded-xl pr-10"
                disabled={isSubmitting}
                required
              />
              {/* Invisible native input to invoke browser calendar picker via showPicker */}
              <input
                ref={datePickerRef}
                type="date"
                tabIndex={-1}
                aria-hidden="true"
                value={isoDate}
                onChange={(e) => handleNativeDateChange(e.target.value)}
                className="absolute right-2 opacity-0 pointer-events-none size-6"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  try {
                    datePickerRef.current?.showPicker?.();
                  } catch {
                    datePickerRef.current?.focus();
                  }
                }}
                disabled={isSubmitting}
                className="absolute right-1.5 size-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer"
                title="Pilih Tanggal dari Kalender"
              >
                <Calendar className="size-3.5" />
              </Button>
            </div>
            {/* Live Indonesian Confirmation Text */}
            {getDatePreview() && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                <Calendar className="size-3 shrink-0" />
                <span>{getDatePreview()}</span>
              </span>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rem-notes" className="flex items-center gap-1.5 text-xs">
              <FileText className="size-3.5 text-amber-500" />
              <span>Catatan / Layanan</span>
            </Label>
            <Input
              id="rem-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Kontrol Behel Gigi"
              className="h-10 text-xs rounded-xl"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Action */}
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-1">
            <Button
              type="submit"
              variant={hasConfiguredDevice ? "primaryPill" : "default"}
              disabled={isSubmitting}
              className={cn(
                "h-10 px-5 text-xs font-bold gap-2 shadow-xs cursor-pointer transition-all",
                !hasConfiguredDevice
                  ? "bg-amber-600 hover:bg-amber-700 text-white rounded-full"
                  : ""
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : !hasConfiguredDevice ? (
                <>
                  <Smartphone className="size-3.5" />
                  Atur Nomor Pengirim Dulu
                  <ArrowRight className="size-3" />
                </>
              ) : (
                <>
                  <CalendarPlus className="size-3.5" />
                  Simpan & Jadwalkan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
