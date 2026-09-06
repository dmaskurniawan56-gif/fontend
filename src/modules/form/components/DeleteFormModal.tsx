"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
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
import { useI18n } from "@/lib/i18n/context";
import { Form } from "../types/form.types";

interface DeleteFormModalProps {
  form: Form | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<boolean>;
}

export function DeleteFormModal({
  form,
  isOpen,
  onClose,
  onConfirm,
}: DeleteFormModalProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!form) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    const success = await onConfirm(form.id);
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-105">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-base font-bold text-foreground">
                {t("form.deleteTitle") || "Hapus Formulir"}
              </AlertDialogTitle>
              <p className="text-xs text-foreground-muted">
                {t("form.deleteIrreversible") || "Tindakan ini tidak dapat dibatalkan"}
              </p>
            </div>
          </div>
          <AlertDialogDescription className="mt-2 text-xs leading-relaxed text-foreground-secondary">
            {t("form.deleteConfirmPrompt") ||
              "Apakah Anda yakin ingin menghapus formulir"}{" "}
            <strong className="font-semibold text-foreground">
              &ldquo;{form.title}&rdquo;
            </strong>{" "}
            (/{form.slug})?
            <br />
            <br />
            <span className="text-destructive font-medium">
              {t("form.deleteWarning") ||
                "Perhatian: Tautan publik tidak akan dapat diakses lagi. Data respons yang tersimpan akan ikut terhapus."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            size="sm"
            className="rounded-xl cursor-pointer"
          >
            {t("common.cancel") || "Batal"}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {t("common.deleting") || "Menghapus..."}
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                {t("common.delete") || "Hapus Formulir"}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
