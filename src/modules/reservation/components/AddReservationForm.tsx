"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User, Phone, Tag, FileText, Info, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n/context";
import { normalizePhoneNumber, isValidE164 } from "@/lib/phone";
import { toast } from "sonner";
import { CreateReservationInput } from "../types/reservation.types";

interface AddReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateReservationInput) => Promise<boolean>;
  defaultDate?: string;
}

export function AddReservationForm({
  isOpen,
  onClose,
  onSubmit,
  defaultDate,
}: AddReservationFormProps) {
  const { t } = useI18n();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [isoDate, setIsoDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCustomerName("");
      setPhone("");
      setBookingTime("10:00");
      setServiceName("");
      setNotes("");

      const initialIso = defaultDate || new Date().toISOString().slice(0, 10);
      setIsoDate(initialIso);
      const parts = initialIso.split("-");
      if (parts.length === 3) {
        setDisplayDate(`${parts[2]}/${parts[1]}/${parts[0]}`);
      } else {
        setDisplayDate(initialIso);
      }
    }
  }, [isOpen, defaultDate]);

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
    const finalDate = isoDate || displayDate;
    if (!customerName.trim() || !phone.trim() || !finalDate.trim()) {
      return;
    }

    const cleanPhone = normalizePhoneNumber(phone);
    if (!isValidE164(cleanPhone)) {
      toast.error(t("contact.errPhonePrefix") || "Format nomor WhatsApp tidak valid");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      customerName: customerName.trim(),
      phone: cleanPhone,
      bookingDate: finalDate.trim(),
      bookingTime: bookingTime.trim() || undefined,
      serviceName: serviceName.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="border-b border-border/70 p-4 sm:p-5 shrink-0 text-left">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold">
            <CalendarIcon className="size-5 text-primary" />
            <span>{t("reservation.addReservationTitle") || "Jadwalkan Reservasi Baru"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-foreground-muted">
            {t("reservation.addReservationDesc") ||
              "Daftarkan jadwal janji temu pelanggan. Sistem otomatis mengirim konfirmasi instan dan sinkronisasi pengingat WhatsApp."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5 text-xs">
          {/* Customer Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="res-customer-name" className="text-xs">
              <User className="size-3.5 text-foreground-muted" />
              <span>{t("reservation.customerName") || "Nama Pelanggan / Pasien"}</span>
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="res-customer-name"
              required
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-9 text-xs rounded-xl"
            />
          </div>

          {/* Customer Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="res-phone" className="text-xs">
              <Phone className="size-3.5 text-foreground-muted" />
              <span>{t("reservation.phone") || "Nomor WhatsApp"}</span>
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="res-phone"
              required
              placeholder="08123456789 atau 628123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-9 text-xs rounded-xl"
            />
          </div>

          {/* Booking Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="res-booking-date" className="text-xs">
                  <CalendarIcon className="size-3.5 text-foreground-muted" />
                  <span>{t("reservation.bookingDate") || "Tanggal Kedatangan"}</span>
                  <span className="text-destructive">*</span>
                </Label>
                <span className="text-[10px] font-mono text-foreground-muted">
                  (Tgl/Bln/Thn)
                </span>
              </div>
              <div className="relative flex items-center">
                <Input
                  id="res-booking-date"
                  required
                  type="text"
                  placeholder="15/10/2026"
                  value={displayDate}
                  onChange={(e) => handleDisplayDateChange(e.target.value)}
                  className="h-9 text-xs font-mono rounded-xl pr-9"
                  disabled={isSubmitting}
                />
                <input
                  ref={datePickerRef}
                  type="date"
                  tabIndex={-1}
                  aria-hidden="true"
                  value={isoDate}
                  onChange={(e) => handleNativeDateChange(e.target.value)}
                  className="absolute right-2 opacity-0 pointer-events-none size-5"
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
                  className="absolute right-1 size-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer"
                  title="Pilih Tanggal dari Kalender"
                >
                  <CalendarIcon className="size-3.5" />
                </Button>
              </div>
              {getDatePreview() && (
                <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 rounded-lg px-2.5 py-1 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <span>🗓️</span>
                  <span>{getDatePreview()}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="res-booking-time" className="text-xs">
                <Clock className="size-3.5 text-foreground-muted" />
                <span>{t("reservation.bookingTime") || "Jam Kedatangan"}</span>
              </Label>
              <Input
                id="res-booking-time"
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Service Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="res-service" className="text-xs">
              <Tag className="size-3.5 text-foreground-muted" />
              <span>{t("reservation.serviceName") || "Nama Layanan / Keperluan"}</span>
            </Label>
            <Input
              id="res-service"
              placeholder="Contoh: Konsultasi Dokter Gigi / Potong Rambut"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="h-9 text-xs rounded-xl"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="res-notes" className="text-xs">
              <FileText className="size-3.5 text-foreground-muted" />
              <span>{t("reservation.notes") || "Catatan Tambahan"}</span>
            </Label>
            <Textarea
              id="res-notes"
              rows={2}
              placeholder="Catatan khusus atau permintaan pelanggan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs resize-none rounded-xl"
            />
          </div>

          {/* Cross-module Sync Banner */}
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2.5 text-foreground">
            <Info className="size-4 shrink-0 mt-0.5 text-primary" />
            <p className="text-[11px] leading-relaxed text-foreground-secondary">
              {t("reservation.syncNote") ||
                "Jadwal ini akan otomatis didaftarkan ke modul Pengingat (Reminder H-1 & Hari H) dan konfirmasi instan dikirim via WhatsApp."}
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-border/70 p-4 sm:p-5 bg-muted/20 shrink-0 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full cursor-pointer px-4"
          >
            {t("common.cancel") || "Batal"}
          </Button>
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isSubmitting}
            className="cursor-pointer px-5 font-bold shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("common.saving") || "Menyimpan..."}</span>
              </>
            ) : (
              <span>{t("reservation.saveReservation") || "Konfirmasi Jadwal"}</span>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
    </Dialog>
  );
}
