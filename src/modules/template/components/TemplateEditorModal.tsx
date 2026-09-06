"use client";

import React, { useState } from "react";
import {
  Template,
  TemplateCategory,
  TemplateMediaType,
  TemplateButton,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "../types/template.types";
import { WhatsAppPhoneMockup } from "./WhatsAppPhoneMockup";
import { VariableQuickInsert } from "./VariableQuickInsert";
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Smartphone,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTemplateInput | UpdateTemplateInput) => Promise<boolean>;
  initialData?: Template | null;
}

function TemplateEditorContent({
  onClose,
  onSubmit,
  initialData,
}: {
  onClose: () => void;
  onSubmit: (data: CreateTemplateInput | UpdateTemplateInput) => Promise<boolean>;
  initialData?: Template | null;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<TemplateCategory>(
    initialData?.category || "MARKETING"
  );
  const [content, setContent] = useState(
    initialData?.content ||
      "Halo {{nama}}, terima kasih telah menghubungi kami! Berikut adalah konfirmasi pesanan Anda dengan nomor {{invoice}}."
  );
  const [mediaType, setMediaType] = useState<TemplateMediaType>(
    initialData?.mediaType || "NONE"
  );
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || "");
  const [buttons, setButtons] = useState<TemplateButton[]>(
    initialData?.buttons ? [...initialData.buttons] : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const handleInsertVariable = (varName: string) => {
    setContent((prev) => `${prev} {{${varName}}}`);
  };

  const handleAddButton = () => {
    if (buttons.length >= 3) return; // WhatsApp allows up to 3 quick reply / CTA buttons
    setButtons((prev) => [...prev, { type: "QUICK_REPLY", text: "Balas Cepat", value: "" }]);
  };

  const handleRemoveButton = (index: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateButton = (
    index: number,
    field: keyof TemplateButton,
    val: string
  ) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === index ? { ...btn, [field]: val } : btn))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const payload: CreateTemplateInput = {
      name: name.trim(),
      category,
      content: content.trim(),
      mediaType,
      mediaUrl: mediaUrl.trim() || undefined,
      buttons: buttons.length > 0 ? buttons : undefined,
      isFavorite: initialData?.isFavorite || false,
    };

    const success = await onSubmit(payload);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground sm:text-lg">
                {initialData ? "Edit Template Pesan" : "Buat Template Pesan Baru"}
              </h2>
              <p className="text-xs text-foreground-muted">
                Didesain untuk siaran massal, balasan otomatis, dan notifikasi transaksi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Tab Toggle */}
            <div className="flex rounded-xl bg-muted p-0.5 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileTab("form")}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer",
                  mobileTab === "form"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-foreground-muted"
                )}
              >
                <Layers className="size-3.5" />
                <span>Form</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer",
                  mobileTab === "preview"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-foreground-muted"
                )}
              >
                <Smartphone className="size-3.5" />
                <span>Pratinjau</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-xl text-foreground-muted transition hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="flex flex-1 overflow-y-auto">
          {/* Left Column: Form Controls */}
          <div
            className={cn(
              "flex-1 p-6 space-y-5 lg:block lg:border-r lg:border-border/60",
              mobileTab === "form" ? "block" : "hidden"
            )}
          >
            <form id="template-editor-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Template Name & Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nama Template <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Notifikasi Invoice Lunas"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Kategori Template <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="MARKETING">Marketing & Promosi</option>
                    <option value="UTILITY">Operasional / Utility</option>
                    <option value="REMINDER">Pengingat & Tagihan</option>
                    <option value="RESERVATION">Reservasi & Booking</option>
                    <option value="QUICK_REPLY">Balasan Cepat (CS)</option>
                  </select>
                </div>
              </div>

              {/* Media Header Section */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Header Media (Opsional)
                  </span>
                  <div className="flex items-center gap-1 rounded-xl bg-muted p-0.5">
                    {(["NONE", "IMAGE", "DOCUMENT"] as TemplateMediaType[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMediaType(m)}
                        className={cn(
                          "rounded-lg px-2 py-1 text-[11px] font-medium transition cursor-pointer",
                          mediaType === m
                            ? "bg-background text-foreground shadow-xs"
                            : "text-foreground-muted hover:text-foreground"
                        )}
                      >
                        {m === "NONE" && "Tanpa Media"}
                        {m === "IMAGE" && "Gambar"}
                        {m === "DOCUMENT" && "Dokumen"}
                      </button>
                    ))}
                  </div>
                </div>

                {mediaType !== "NONE" && (
                  <div className="space-y-1 animate-in fade-in">
                    <label className="text-[11px] text-foreground-muted">
                      URL Berkas Media (HTTPS URL langsung ke gambar/PDF):
                    </label>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://domain.com/assets/banner-promo.jpg"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Message Content Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Isi Konten Pesan WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-foreground-muted">
                    {content.length} karakter
                  </span>
                </div>

                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ketik pesan Anda di sini. Gunakan {{variabel}} untuk data dinamis."
                  className="w-full rounded-2xl border border-border bg-background p-3.5 text-xs leading-relaxed text-foreground placeholder:text-foreground-muted/60 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />

                {/* Variable Quick Insert Chips */}
                <VariableQuickInsert onInsert={handleInsertVariable} />
              </div>

              {/* Interactive Buttons Builder */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground">
                      Tombol Aksi Interaktif WhatsApp
                    </span>
                    <p className="text-[11px] text-foreground-muted">
                      Maksimal 3 tombol (Quick Reply, Buka URL, atau Panggilan Telepon)
                    </p>
                  </div>

                  {buttons.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddButton}
                      className="h-7 gap-1 rounded-xl text-xs"
                    >
                      <Plus className="size-3" />
                      Tambah Tombol
                    </Button>
                  )}
                </div>

                {buttons.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-2.5 sm:flex-row sm:items-center"
                      >
                        <select
                          value={btn.type}
                          onChange={(e) =>
                            handleUpdateButton(idx, "type", e.target.value)
                          }
                          className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground"
                        >
                          <option value="QUICK_REPLY">Quick Reply</option>
                          <option value="URL">Buka Link URL</option>
                          <option value="CALL">Panggilan Telepon</option>
                        </select>

                        <input
                          type="text"
                          required
                          value={btn.text}
                          onChange={(e) =>
                            handleUpdateButton(idx, "text", e.target.value)
                          }
                          placeholder="Teks Tombol (cth: Cek Pesanan)"
                          className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground placeholder:text-foreground-muted/60"
                        />

                        {btn.type !== "QUICK_REPLY" && (
                          <input
                            type="text"
                            value={btn.value || ""}
                            onChange={(e) =>
                              handleUpdateButton(idx, "value", e.target.value)
                            }
                            placeholder={
                              btn.type === "URL"
                                ? "https://link.com"
                                : "+628123456789"
                            }
                            className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveButton(idx)}
                          className="flex size-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Live Phone Mockup Preview */}
          <div
            className={cn(
              "flex flex-1 items-center justify-center bg-muted/20 p-6 lg:flex",
              mobileTab === "preview" ? "flex" : "hidden"
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                📱 Pratinjau Tampilan WhatsApp Penerima
              </span>
              <WhatsAppPhoneMockup
                name={name || "Nama Template"}
                category={category}
                content={content}
                mediaType={mediaType}
                mediaUrl={mediaUrl}
                buttons={buttons}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border/60 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="template-editor-form"
            disabled={isSubmitting || !name.trim() || !content.trim()}
            className="rounded-xl"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyimpan...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Check className="size-4" />
                {initialData ? "Simpan Perubahan" : "Buat Template"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TemplateEditorModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TemplateEditorModalProps) {
  if (!isOpen) return null;

  return (
    <TemplateEditorContent
      key={initialData?.id || "new"}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
    />
  );
}
