"use client";

import React, { useState } from "react";
import { CreateReminderInput } from "../types/reminder.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarPlus, User, Phone, Calendar, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuickScheduleCardProps {
  onSchedule: (input: CreateReminderInput) => Promise<boolean>;
}

export function QuickScheduleCard({ onSchedule }: QuickScheduleCardProps) {
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default target date to tomorrow
  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setTargetDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim()) {
      toast.error("Nama penerima wajib diisi");
      return;
    }

    if (!phone.trim()) {
      toast.error("Nomor WhatsApp wajib diisi");
      return;
    }

    if (!targetDate) {
      toast.error("Tanggal target jadwal wajib dipilih");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSchedule({
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        targetDate,
        notes: notes.trim(),
      });

      if (success) {
        setRecipientName("");
        setPhone("");
        setNotes("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-border/50 pb-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarPlus className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Jadwalkan Pengingat Cepat</h2>
          <p className="text-xs text-foreground-muted">
            Tambahkan kontak dan tanggal target. Sistem akan mengirimkan pesan otomatis sesuai aturan drip.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Recipient Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <User className="size-3.5 text-primary" />
            Nama Penerima *
          </label>
          <Input
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
          <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <Phone className="size-3.5 text-emerald-500" />
            No. WhatsApp *
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08123456789 atau 628..."
            className="h-10 text-xs rounded-xl"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Target Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <Calendar className="size-3.5 text-blue-500" />
            Tanggal Target *
          </label>
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="h-10 text-xs rounded-xl"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
            <FileText className="size-3.5 text-amber-500" />
            Catatan / Layanan
          </label>
          <Input
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
            disabled={isSubmitting}
            className="h-10 rounded-xl px-5 text-xs font-semibold gap-2 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Menyimpan...
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
    </div>
  );
}
