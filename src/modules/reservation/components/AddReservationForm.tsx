"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User, Phone, Tag, FileText, Info } from "lucide-react";
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
import { useI18n } from "@/lib/i18n/context";
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

    setIsSubmitting(true);
    const success = await onSubmit({
      customerName: customerName.trim(),
      phone: phone.trim(),
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
          <DialogTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-emerald-600" />
            {t("reservation.addReservationTitle") || "Jadwalkan Reservasi Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("reservation.addReservationDesc") ||
              "Daftarkan jadwal janji temu pelanggan. Sistem otomatis mengirim konfirmasi instan dan sinkronisasi pengingat WhatsApp."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-2 text-xs">
          {/* Customer Name */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {t("reservation.customerName") || "Nama Pelanggan / Pasien"}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Customer Phone */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {t("reservation.phone") || "Nomor WhatsApp"}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              placeholder="081234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Booking Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                {t("reservation.bookingDate") || "Tanggal Kedatangan"}
                <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {t("reservation.bookingTime") || "Jam Kedatangan"}
              </label>
              <Input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Service Name */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              {t("reservation.serviceName") || "Nama Layanan / Keperluan"}
            </label>
            <Input
              placeholder="Contoh: Konsultasi Dokter Gigi / Potong Rambut"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              {t("reservation.notes") || "Catatan Tambahan"}
            </label>
            <Textarea
              rows={2}
              placeholder="Catatan khusus atau permintaan pelanggan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs resize-none"
            />
          </div>

          {/* Cross-module Sync Banner */}
          <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
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
              className="text-xs"
            >
              {t("common.cancel") || "Batal"}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              {isSubmitting
                ? t("common.saving") || "Menyimpan..."
                : t("reservation.saveReservation") || "Konfirmasi Jadwal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
