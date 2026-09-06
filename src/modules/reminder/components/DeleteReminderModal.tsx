"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
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

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    const success = await onConfirm();
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-base font-bold text-foreground">
                Hapus Jadwal Pengingat
              </AlertDialogTitle>
              <p className="text-xs text-foreground-muted">Tindakan ini bersifat permanen</p>
            </div>
          </div>
          <AlertDialogDescription className="mt-2 text-xs leading-relaxed text-foreground-secondary">
            Apakah Anda yakin ingin menghapus jadwal pengingat untuk{" "}
            <strong className="font-semibold text-foreground">&ldquo;{recipientName}&rdquo;</strong>?
            Pesan otomatis untuk jadwal ini tidak akan dievaluasi maupun dikirimkan lagi.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            size="sm"
            className="rounded-xl cursor-pointer"
          >
            Batal
          </AlertDialogCancel>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-xl cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                Ya, Hapus
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
