"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { Reservation } from "../types/reservation.types";

interface DeleteReservationModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, name?: string) => Promise<boolean>;
}

export function DeleteReservationModal({
  reservation,
  isOpen,
  onClose,
  onConfirm,
}: DeleteReservationModalProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!reservation) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onConfirm(reservation.id, reservation.customerName);
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-rose-600 mb-1">
            <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-950/50">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base sm:text-lg">
              {t("reservation.deleteTitle") || "Hapus Jadwal Reservasi"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 pt-2 leading-relaxed">
            {t("reservation.deleteConfirmPrompt") ||
              "Apakah Anda yakin ingin menghapus reservasi untuk"}{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              {reservation.customerName}
            </strong>{" "}
            ({reservation.bookingDate})?
            <br />
            <br />
            <span className="text-rose-600 dark:text-rose-400 font-medium">
              {t("reservation.deleteWarning") ||
                "Perhatian: Pengingat otomatis (Reminder) terkait reservasi ini juga akan dibatalkan."}
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="text-xs"
          >
            {t("common.cancel") || "Batal"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs"
          >
            {isDeleting
              ? t("common.deleting") || "Menghapus..."
              : t("common.delete") || "Hapus Reservasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
