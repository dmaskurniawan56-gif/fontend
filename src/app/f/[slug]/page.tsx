"use client";

import React, { useState, useEffect, use } from "react";
import {
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Calendar,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formApi } from "@/modules/form/api/form.api";
import { PublicForm, FormField } from "@/modules/form/types/form.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

interface PublicFormPageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicFormPage({ params }: PublicFormPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [form, setForm] = useState<PublicForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form submission state
  const [respondentName, setRespondentName] = useState("");
  const [respondentPhone, setRespondentPhone] = useState("");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState(""); // Bot trap

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadForm() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await formApi.getPublicForm(slug);
        setForm(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Formulir tidak ditemukan atau sudah dinonaktifkan.";
        setFetchError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    loadForm();
  }, [slug]);

  const handleResponseChange = (name: string, value: string) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondentName.trim() || !respondentPhone.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await formApi.submitPublicForm(slug, {
        respondentName: respondentName.trim(),
        respondentPhone: respondentPhone.trim(),
        responses,
        hpCompanyField: honeypot,
      });

      setIsSuccess(true);

      // Auto redirect if configured
      if (form?.redirectUrl) {
        setTimeout(() => {
          if (form.redirectUrl) {
            window.location.href = form.redirectUrl;
          }
        }, 3000);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengirim formulir. Pastikan semua data wajib telah diisi dengan benar.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs text-slate-500 font-medium">Memuat formulir...</span>
        </div>
      </div>
    );
  }

  // Error / Inactive Screen
  if (fetchError || !form) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Formulir Tidak Tersedia
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {fetchError || "Formulir ini sedang dinonaktifkan atau tautan yang Anda tuju sudah tidak berlaku."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            Coba Muat Ulang
          </Button>
        </div>
      </div>
    );
  }

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center mb-4 animate-in zoom-in-75">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Berhasil Terkirim!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {form.successMessage || "Terima kasih, data Anda telah berhasil dikirimkan kepada tim kami."}
          </p>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-6 text-left">
            <MessageCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Notifikasi konfirmasi WhatsApp akan segera dikirimkan ke nomor Anda.</span>
          </div>

          {form.redirectUrl && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Mengalihkan ke halaman tujuan dalam beberapa detik...
              </p>
              <Button
                type="button"
                className="w-full text-xs font-semibold gap-2"
                onClick={() => {
                  if (form.redirectUrl) window.location.href = form.redirectUrl;
                }}
              >
                Lanjutkan Sekarang <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Form Container Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-primary/5 dark:bg-primary/10 border-b border-slate-100 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Formulir Resmi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {form.description}
              </p>
            )}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {submitError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Hidden Honeypot Anti-Bot Field */}
            <div
              aria-hidden="true"
              style={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                zIndex: -1,
                overflow: "hidden",
              }}
            >
              <label htmlFor="hp_company_field">Company (Leave blank)</label>
              <input
                type="text"
                id="hp_company_field"
                name="hp_company_field"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Mandatory Respondent Details */}
            <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label htmlFor="resp-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="resp-name"
                  placeholder="Contoh: Budi Santoso"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  required
                  className="text-sm h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="resp-phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="resp-phone"
                    type="tel"
                    placeholder="081234567890"
                    value={respondentPhone}
                    onChange={(e) => setRespondentPhone(e.target.value)}
                    required
                    className="text-sm h-10 pr-9"
                  />
                  <MessageCircle className="absolute right-3 top-3 w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Konfirmasi pengisian formulir akan dikirimkan otomatis ke nomor ini.
                </p>
              </div>
            </div>

            {/* Dynamic Custom Fields */}
            {form.fields.map((f: FormField) => {
              const val = responses[f.name] || "";

              return (
                <div key={f.id || f.name} className="space-y-1.5">
                  <label htmlFor={`field-${f.name}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {f.label} {f.required && <span className="text-rose-500">*</span>}
                  </label>

                  {/* Render based on fieldType */}
                  {f.fieldType === "textarea" ? (
                    <Textarea
                      id={`field-${f.name}`}
                      placeholder={f.placeholder || ""}
                      value={val}
                      onChange={(e) => handleResponseChange(f.name, e.target.value)}
                      required={f.required}
                      rows={3}
                      className="text-sm"
                    />
                  ) : f.fieldType === "select" ? (
                    <NativeSelect
                      id={`field-${f.name}`}
                      value={val}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleResponseChange(f.name, e.target.value)
                      }
                      required={f.required}
                      className="text-sm h-10"
                    >
                      <NativeSelectOption value="">
                        {f.placeholder || "Pilih salah satu"}
                      </NativeSelectOption>
                      {f.options?.map((opt) => (
                        <NativeSelectOption key={opt} value={opt}>
                          {opt}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  ) : (
                    <Input
                      id={`field-${f.name}`}
                      type={
                        f.fieldType === "number"
                          ? "number"
                          : f.fieldType === "date"
                          ? "date"
                          : f.fieldType === "time"
                          ? "time"
                          : f.fieldType === "email"
                          ? "email"
                          : f.fieldType === "phone"
                          ? "tel"
                          : "text"
                      }
                      placeholder={f.placeholder || ""}
                      value={val}
                      onChange={(e) => handleResponseChange(f.name, e.target.value)}
                      required={f.required}
                      className="text-sm h-10"
                    />
                  )}
                </div>
              );
            })}

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-sm font-semibold gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim Formulir...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Formulir
                  </>
                )}
              </Button>
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400">
                Dilindungi dengan enkripsi & validasi anti-spam Wahide
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
