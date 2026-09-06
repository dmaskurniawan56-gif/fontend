"use client";

import React, { useState } from "react";
import { Template } from "../types/template.types";
import {
  Star,
  Copy,
  Check,
  MoreVertical,
  Edit2,
  CopyPlus,
  Trash2,
  Flame,
  Info,
  Bell,
  CalendarCheck,
  MessageSquareReply,
  Image as ImageIcon,
  FileText,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onToggleFavorite: (template: Template) => void;
  onSelectForCampaign?: (template: Template) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onSelectForCampaign,
}: TemplateCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(template.content);
      setIsCopied(true);
      toast.success("Pesan template berhasil disalin ke clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin teks");
    }
  };

  const getCategoryMeta = () => {
    switch (template.category) {
      case "MARKETING":
        return {
          label: "Marketing",
          icon: Flame,
          badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        };
      case "REMINDER":
        return {
          label: "Pengingat",
          icon: Bell,
          badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
        };
      case "RESERVATION":
        return {
          label: "Reservasi",
          icon: CalendarCheck,
          badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        };
      case "QUICK_REPLY":
        return {
          label: "Balasan Cepat",
          icon: MessageSquareReply,
          badgeClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
        };
      case "UTILITY":
      default:
        return {
          label: "Operasional",
          icon: Info,
          badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        };
    }
  };

  const catMeta = getCategoryMeta();
  const CatIcon = catMeta.icon;

  // Highlight variables in preview
  const previewParts = template.content.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md dark:bg-card/80">
      {/* Top Bar: Category & Media & Favorite & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-semibold",
                catMeta.badgeClass
              )}
            >
              <CatIcon className="size-3" />
              {catMeta.label}
            </span>

            {template.mediaType !== "NONE" && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-foreground-muted">
                {template.mediaType === "IMAGE" && <ImageIcon className="size-3" />}
                {template.mediaType === "DOCUMENT" && <FileText className="size-3" />}
                <span>{template.mediaType}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Star Favorite Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(template)}
              className="flex size-7 items-center justify-center rounded-lg text-foreground-muted transition hover:bg-muted hover:text-amber-500 cursor-pointer"
              title={template.isFavorite ? "Hapus dari favorit" : "Tandai sebagai favorit"}
            >
              <Star
                className={cn(
                  "size-4 transition-colors",
                  template.isFavorite
                    ? "fill-amber-400 text-amber-500"
                    : "text-foreground-muted hover:text-amber-400"
                )}
              />
            </button>

            {/* Actions Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex size-7 items-center justify-center rounded-lg text-foreground-muted transition hover:bg-muted hover:text-foreground cursor-pointer"
                title="Menu Aksi"
              >
                <MoreVertical className="size-4" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-8 z-30 min-w-[140px] rounded-xl border border-border bg-popover p-1 shadow-lg animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onEdit(template);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground transition hover:bg-muted cursor-pointer"
                    >
                      <Edit2 className="size-3.5 text-foreground-muted" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDuplicate(template.id);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground transition hover:bg-muted cursor-pointer"
                    >
                      <CopyPlus className="size-3.5 text-foreground-muted" />
                      <span>Duplikat</span>
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDelete(template.id, template.name);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 transition hover:bg-red-500/10 dark:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Template Title */}
        <h3 className="mt-2.5 font-semibold text-foreground line-clamp-1 text-sm sm:text-base">
          {template.name}
        </h3>

        {/* Content Preview Box */}
        <div className="mt-2 min-h-[72px] rounded-xl bg-muted/40 p-3 text-xs leading-relaxed text-foreground-secondary line-clamp-4">
          {previewParts.map((part, idx) => {
            const isVar = part.startsWith("{{") && part.endsWith("}}");
            return isVar ? (
              <span
                key={idx}
                className="inline-block rounded bg-primary/15 px-1 py-0.2 font-mono font-medium text-primary text-[11px]"
              >
                {part}
              </span>
            ) : (
              <span key={idx}>{part}</span>
            );
          })}
        </div>

        {/* Interactive Buttons Preview (if any) */}
        {template.buttons && template.buttons.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {template.buttons.map((btn, bIdx) => (
              <span
                key={bIdx}
                className="inline-flex items-center gap-1 rounded-md bg-neutral-200/70 px-2 py-0.5 text-[10px] font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <span>🔘 {btn.text}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Meta & Quick Action */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-foreground-muted">
        <div className="flex items-center gap-2">
          <span>Dipakai {template.usageCount}x</span>
          {template.variables && template.variables.length > 0 && (
            <span className="rounded-full bg-border/40 px-1.5 py-0.2 text-[10px]">
              {template.variables.length} var
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-border/70 px-2 py-1 text-[11px] font-medium transition hover:bg-muted hover:text-foreground cursor-pointer"
            title="Salin isi pesan"
          >
            {isCopied ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Salin</span>
              </>
            )}
          </button>

          {onSelectForCampaign && (
            <button
              type="button"
              onClick={() => onSelectForCampaign(template)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/20 cursor-pointer"
              title="Gunakan untuk Siaran"
            >
              <Send className="size-3" />
              <span>Gunakan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
