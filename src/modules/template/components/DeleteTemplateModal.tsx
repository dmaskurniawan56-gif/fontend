"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  templateName: string;
}

export function DeleteTemplateModal({
  isOpen,
  onClose,
  onConfirm,
  templateName,
}: DeleteTemplateModalProps) {
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
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Hapus Template Pesan</h3>
            <p className="text-xs text-foreground-muted">Tindakan ini bersifat permanen</p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-foreground-secondary">
          Apakah Anda yakin ingin menghapus template{" "}
          <strong className="text-foreground font-semibold">&ldquo;{templateName}&rdquo;</strong>?
          Template ini tidak akan dapat dipulihkan atau digunakan lagi dalam siaran pesan.
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
                <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
