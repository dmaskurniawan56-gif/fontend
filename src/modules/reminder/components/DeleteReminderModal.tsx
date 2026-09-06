"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  recipientName: string;
}

export function DeleteReminderModal({
  isOpen,
  onClose,
  onConfirm,
  recipientName,
}: DeleteReminderModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    const success = await onConfirm();
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Hapus Jadwal Pengingat</h3>
            <p className="text-xs text-foreground-muted">Tindakan ini bersifat permanen</p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-foreground-secondary">
          Apakah Anda yakin ingin menghapus jadwal pengingat untuk{" "}
          <strong className="text-foreground font-semibold">&ldquo;{recipientName}&rdquo;</strong>?
          Pesan otomatis untuk jadwal ini tidak akan dievaluasi maupun dikirimkan lagi.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="size-3.5 animate-spin" />
                Menghapus...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Trash2 className="size-3.5" />
                Ya, Hapus
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
