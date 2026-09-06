"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  HelpCircle,
  Calendar,
  UserPlus,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useI18n } from "@/lib/i18n/context";
import {
  Form,
  FormField,
  FormFieldType,
  FormType,
  CreateFormInput,
  UpdateFormInput,
} from "../types/form.types";

interface FormBuilderModalProps {
  form: Form | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (input: CreateFormInput) => Promise<Form | null>;
  onSubmitUpdate: (id: string, input: UpdateFormInput) => Promise<Form | null>;
}

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Teks Pendek (Text)" },
  { value: "textarea", label: "Teks Panjang (Textarea)" },
  { value: "number", label: "Angka (Number)" },
  { value: "email", label: "Alamat Email" },
  { value: "phone", label: "Nomor Telepon Tambahan" },
  { value: "date", label: "Tanggal (Date Picker)" },
  { value: "time", label: "Jam (Time Picker)" },
  { value: "select", label: "Pilihan Dropdown (Select)" },
];

export function FormBuilderModal({
  form,
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: FormBuilderModalProps) {
  const { t } = useI18n();
  const isEdit = Boolean(form);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FormType>("STANDARD");
  const [fields, setFields] = useState<FormField[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form state on open/change
  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setSlug(form.slug);
      setDescription(form.description || "");
      setType(form.type || "STANDARD");
      setFields(form.fields || []);
      setSuccessMessage(form.successMessage || "");
      setRedirectUrl(form.redirectUrl || "");
      setIsActive(form.isActive ?? true);
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setType("STANDARD");
      setFields([
        {
          id: "f_notes",
          label: "Pesan / Catatan Tambahan",
          name: "notes",
          fieldType: "textarea",
          required: false,
          placeholder: "Tuliskan catatan Anda di sini...",
        },
      ]);
      setSuccessMessage("Terima kasih! Formulir Anda telah berhasil kami terima.");
      setRedirectUrl("");
      setIsActive(true);
    }
  }, [form, isOpen]);

  // Generate slug automatically when creating new form
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
    }
  };

  // Add custom field
  const handleAddField = () => {
    const newId = "f_" + Date.now().toString(36);
    const newField: FormField = {
      id: newId,
      label: `Pertanyaan Baru`,
      name: `field_${fields.length + 1}`,
      fieldType: "text",
      required: false,
      placeholder: "",
    };
    setFields([...fields, newField]);
  };

  // Update field property
  const handleUpdateField = (
    index: number,
    key: keyof FormField,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val: any
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: val };
    setFields(updated);
  };

  // Remove field
  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // Quick preset templates
  const applyReservationPreset = () => {
    setType("RESERVATION");
    if (!title) setTitle("Booking Janji Temu");
    if (!slug && !isEdit) setSlug("booking-jadwal");
    setFields([
      {
        id: "f_date",
        label: "Tanggal Booking",
        name: "booking_date",
        fieldType: "date",
        required: true,
      },
      {
        id: "f_time",
        label: "Jam Booking",
        name: "booking_time",
        fieldType: "time",
        required: false,
        placeholder: "Contoh: 10:00",
      },
      {
        id: "f_service",
        label: "Pilihan Layanan / Jasa",
        name: "service",
        fieldType: "select",
        required: true,
        options: ["Konsultasi Umum", "Paket Premium", "Perawatan Standar"],
      },
      {
        id: "f_notes",
        label: "Catatan atau Keluhan",
        name: "notes",
        fieldType: "textarea",
        required: false,
        placeholder: "Tulis catatan tambahan Anda...",
      },
    ]);
  };

  const applyLeadPreset = () => {
    setType("LEAD");
    if (!title) setTitle("Daftar Informasi & Penawaran");
    if (!slug && !isEdit) setSlug("daftar-penawaran");
    setFields([
      {
        id: "f_email",
        label: "Alamat Email",
        name: "email",
        fieldType: "email",
        required: true,
        placeholder: "nama@perusahaan.com",
      },
      {
        id: "f_company",
        label: "Nama Perusahaan / Usaha",
        name: "company",
        fieldType: "text",
        required: false,
        placeholder: "PT Contoh Sukses",
      },
      {
        id: "f_needs",
        label: "Kebutuhan Anda",
        name: "needs",
        fieldType: "textarea",
        required: false,
        placeholder: "Ceritakan kebutuhan atau produk yang dicari...",
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEdit && form) {
        const res = await onSubmitUpdate(form.id, {
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          type,
          fields,
          successMessage: successMessage.trim(),
          redirectUrl: redirectUrl.trim() || undefined,
          isActive,
        });
        if (res) onClose();
      } else {
        const res = await onSubmitCreate({
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          type,
          fields,
          successMessage: successMessage.trim(),
          redirectUrl: redirectUrl.trim() || undefined,
          isActive,
        });
        if (res) onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {isEdit
                ? (t("form.editTitle") || "Edit Formulir")
                : (t("form.createTitle") || "Buat Formulir Baru")}
            </DialogTitle>
          </DialogHeader>

          {/* Quick Preset Buttons (Create only) */}
          {!isEdit && (
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preset Cepat:
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={applyReservationPreset}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Form Reservasi
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={applyLeadPreset}
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                Form Lead & Kontak
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="form-title" className="text-xs font-medium">
                  {t("form.fieldTitle") || "Judul Formulir"} *
                </Label>
                <Input
                  id="form-title"
                  placeholder="Contoh: Pendaftaran Workshop Bisnis"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="form-slug" className="text-xs font-medium">
                  {t("form.fieldSlug") || "URL Slug Publik"} *
                </Label>
                <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-800 px-3 bg-slate-50 dark:bg-slate-900">
                  <span className="text-xs text-slate-400 select-none">/f/</span>
                  <input
                    id="form-slug"
                    className="w-full bg-transparent py-2 pl-1 text-sm outline-none text-slate-900 dark:text-slate-100 font-mono"
                    placeholder="workshop-bisnis"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Type & Active */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  {t("form.fieldType") || "Tipe / Tujuan Formulir"}
                </Label>
                <NativeSelect
                  value={type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setType(e.target.value as FormType)
                  }
                  className="text-sm h-9"
                >
                  <NativeSelectOption value="STANDARD">
                    Standard (Formulir Umum)
                  </NativeSelectOption>
                  <NativeSelectOption value="RESERVATION">
                    Reservasi (Otomatis Masuk Kalender Reservasi)
                  </NativeSelectOption>
                  <NativeSelectOption value="LEAD">
                    Lead Capture (Otomatis Simpan Buku Kontak)
                  </NativeSelectOption>
                </NativeSelect>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {t("form.fieldStatus") || "Status Publik"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isActive
                      ? "Dapat diakses oleh publik"
                      : "Ditutup sementara (tidak menerima respons)"}
                  </div>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="form-desc" className="text-xs font-medium">
                {t("form.fieldDescription") || "Deskripsi Singkat (Opsional)"}
              </Label>
              <Textarea
                id="form-desc"
                placeholder="Penjelasan ringkas tentang formulir ini..."
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Form Fields Builder */}
            <div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    {t("form.fieldBuilderTitle") || "Pertanyaan Formulir"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Nama dan Nomor WhatsApp responden selalu otomatis dikumpulkan oleh sistem.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddField}
                  className="text-xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Pertanyaan
                </Button>
              </div>

              {/* Field Cards */}
              <div className="space-y-3 mt-3">
                {fields.map((f, idx) => (
                  <div
                    key={f.id || idx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-rose-500 hover:text-rose-700"
                        onClick={() => handleRemoveField(idx)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2 space-y-1">
                        <Label className="text-[11px] font-medium">
                          Label Pertanyaan
                        </Label>
                        <Input
                          value={f.label}
                          onChange={(e) => handleUpdateField(idx, "label", e.target.value)}
                          placeholder="Contoh: Pilih Lokasi"
                          className="text-xs h-8"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-medium">
                          Tipe Input
                        </Label>
                        <NativeSelect
                          value={f.fieldType}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleUpdateField(idx, "fieldType", e.target.value as FormFieldType)
                          }
                          className="text-xs h-8"
                        >
                          {FIELD_TYPES.map((ft) => (
                            <NativeSelectOption key={ft.value} value={ft.value}>
                              {ft.label}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </div>
                    </div>

                    {/* Field key (name) & Required */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                      <div className="sm:col-span-2 space-y-1">
                        <Label className="text-[11px] font-medium flex items-center gap-1">
                          Kunci Data (Field Name)
                          <Tooltip>
                            <TooltipTrigger
                              render={<span className="cursor-help inline-flex items-center" />}
                            >
                              <HelpCircle className="w-3 h-3 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Kunci data dipakai untuk otomatisasi kalender / integrasi webhook
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          value={f.name}
                          onChange={(e) =>
                            handleUpdateField(
                              idx,
                              "name",
                              e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                            )
                          }
                          placeholder="contoh: booking_date"
                          className="text-xs h-8 font-mono"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <Switch
                          checked={f.required}
                          onCheckedChange={(val) => handleUpdateField(idx, "required", val)}
                          id={`req-${idx}`}
                        />
                        <Label htmlFor={`req-${idx}`} className="text-xs font-medium cursor-pointer">
                          Wajib Diisi
                        </Label>
                      </div>
                    </div>

                    {/* Select options editor */}
                    {f.fieldType === "select" && (
                      <div className="space-y-1 pt-1">
                        <Label className="text-[11px] font-medium">
                          Pilihan Dropdown (Pisahkan dengan koma)
                        </Label>
                        <Input
                          value={f.options?.join(", ") || ""}
                          onChange={(e) =>
                            handleUpdateField(
                              idx,
                              "options",
                              e.target.value.split(",").map((s) => s.trim())
                            )
                          }
                          placeholder="Pilihan A, Pilihan B, Pilihan C"
                          className="text-xs h-8"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Post-submit behavior */}
            <div>
              <Separator className="my-3" />
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="success-msg" className="text-xs font-medium">
                    {t("form.fieldSuccessMsg") || "Pesan Sukses Setelah Kirim"}
                  </Label>
                  <Input
                    id="success-msg"
                    value={successMessage}
                    onChange={(e) => setSuccessMessage(e.target.value)}
                    placeholder="Terima kasih, data Anda telah berhasil terkirim!"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="redirect-url" className="text-xs font-medium">
                    {t("form.fieldRedirectUrl") || "URL Pengalihan / Redirect (Opsional)"}
                  </Label>
                  <Input
                    id="redirect-url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://tokoanda.com/terima-kasih"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2">
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
            <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs font-semibold">
              {isSubmitting
                ? (t("common.saving") || "Menyimpan...")
                : isEdit
                ? (t("form.saveChanges") || "Simpan Perubahan")
                : (t("form.createSubmit") || "Buat Formulir")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
