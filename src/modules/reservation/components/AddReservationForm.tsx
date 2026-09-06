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
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomerName("");
      setPhone("");
      setBookingDate(defaultDate || new Date().toISOString().slice(0, 10));
      setBookingTime("10:00");
      setServiceName("");
      setNotes("");
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !bookingDate.trim()) {
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
      bookingDate: bookingDate.trim(),
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold">
            <CalendarIcon className="size-5 text-emerald-600" />
            <span>{t("reservation.addReservationTitle") || "Jadwalkan Reservasi Baru"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-foreground-muted">
            {t("reservation.addReservationDesc") ||
              "Daftarkan jadwal janji temu pelanggan. Sistem otomatis mengirim konfirmasi instan dan sinkronisasi pengingat WhatsApp."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 py-2 text-xs">
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
              <Label htmlFor="res-booking-date" className="text-xs">
                <CalendarIcon className="size-3.5 text-foreground-muted" />
                <span>{t("reservation.bookingDate") || "Tanggal Kedatangan"}</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="res-booking-date"
                required
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
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
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300">
            <Info className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-[11px] leading-relaxed">
              {t("reservation.syncNote") ||
                "Jadwal ini akan otomatis didaftarkan ke modul Pengingat (Reminder H-1 & Hari H) dan konfirmasi instan dikirim via WhatsApp."}
            </p>
          </div>

          <DialogFooter className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl cursor-pointer"
            >
              {t("common.cancel") || "Batal"}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl cursor-pointer"
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
