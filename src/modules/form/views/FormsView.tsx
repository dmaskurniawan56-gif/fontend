"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  FileSpreadsheet,
  Eye,
  FileCheck2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useI18n } from "@/lib/i18n/context";
import { Form, FormType } from "../types/form.types";
import { useForms } from "../hooks/useForms";
import { FormCard } from "../components/FormCard";
import { FormBuilderModal } from "../components/FormBuilderModal";
import { DeleteFormModal } from "../components/DeleteFormModal";
import { SubmissionsDrawer } from "../components/SubmissionsDrawer";

export function FormsView() {
  const { t } = useI18n();
  const {
    forms,
    isLoading,
    search,
    setSearch,
    type,
    setType,
    isActiveFilter,
    setIsActiveFilter,
    page,
    setPage,
    total,
    totalPages,
    createForm,
    updateForm,
    toggleActive,
    deleteForm,
    copyPublicLink,
  } = useForms();

  // Modal states
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingForm, setDeletingForm] = useState<Form | null>(null);

  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [viewingSubmissionsForm, setViewingSubmissionsForm] = useState<Form | null>(null);

  // Aggregated Stats from loaded forms
  const stats = useMemo(() => {
    let totalViews = 0;
    let totalSubmissions = 0;
    forms.forEach((f) => {
      totalViews += f.viewCount;
      totalSubmissions += f.submissionCount;
    });
    const avgConversion =
      totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : "0.0";

    return {
      totalForms: total,
      totalViews,
      totalSubmissions,
      avgConversion,
    };
  }, [forms, total]);

  const handleCreateNew = () => {
    setEditingForm(null);
    setIsBuilderOpen(true);
  };

  const handleEdit = (form: Form) => {
    setEditingForm(form);
    setIsBuilderOpen(true);
  };

  const handleDelete = (form: Form) => {
    setDeletingForm(form);
    setIsDeleteOpen(true);
  };

  const handleViewSubmissions = (form: Form) => {
    setViewingSubmissionsForm(form);
    setIsSubmissionsOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t("form.viewTitle") || "Formulir Dinamis (Lead & Booking)"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("form.viewSubtitle") ||
              "Buat landing page formulir publik untuk reservasi, pendaftaran, dan penangkapan prospek otomatis."}
          </p>
        </div>

        <Button onClick={handleCreateNew} className="gap-2 font-semibold shadow-sm">
          <Plus className="w-4 h-4" />
          {t("form.createNewButton") || "Buat Formulir"}
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-slate-500 mb-1">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Total Formulir</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats.totalForms}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-slate-500 mb-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium">Total Dilihat (Views)</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats.totalViews.toLocaleString()}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-slate-500 mb-1">
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium">Respons Terkumpul</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {stats.totalSubmissions.toLocaleString()}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium">Rata-rata Konversi</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.avgConversion}%
          </span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t("form.searchPlaceholder") || "Cari formulir atau slug..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Type Filter */}
          <NativeSelect
            value={type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setType(e.target.value as FormType | "ALL");
              setPage(1);
            }}
            wrapperClassName="w-[140px]"
            className="text-xs h-9"
          >
            <NativeSelectOption value="ALL">Semua Tipe</NativeSelectOption>
            <NativeSelectOption value="STANDARD">Standard</NativeSelectOption>
            <NativeSelectOption value="RESERVATION">Reservasi</NativeSelectOption>
            <NativeSelectOption value="LEAD">Lead Capture</NativeSelectOption>
          </NativeSelect>

          {/* Status Filter */}
          <NativeSelect
            value={
              isActiveFilter === undefined
                ? "ALL"
                : isActiveFilter
                ? "ACTIVE"
                : "INACTIVE"
            }
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const val = e.target.value;
              if (val === "ALL") setIsActiveFilter(undefined);
              else if (val === "ACTIVE") setIsActiveFilter(true);
              else setIsActiveFilter(false);
              setPage(1);
            }}
            wrapperClassName="w-[130px]"
            className="text-xs h-9"
          >
            <NativeSelectOption value="ALL">Semua Status</NativeSelectOption>
            <NativeSelectOption value="ACTIVE">Aktif</NativeSelectOption>
            <NativeSelectOption value="INACTIVE">Nonaktif</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* Forms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 animate-pulse"
            />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {t("form.emptyTitle") || "Belum Ada Formulir"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {t("form.emptyDescription") ||
              "Buat formulir pertama Anda untuk mulai mengumpulkan leads, pesanan, atau pendaftaran otomatis via WhatsApp."}
          </p>
          <Button onClick={handleCreateNew} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            {t("form.createNewButton") || "Buat Formulir Sekarang"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((f) => (
            <FormCard
              key={f.id}
              form={f}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewSubmissions={handleViewSubmissions}
              onToggleActive={toggleActive}
              onCopyLink={copyPublicLink}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500">
            Halaman {page} dari {totalPages} ({total} formulir)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <FormBuilderModal
        form={editingForm}
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setEditingForm(null);
        }}
        onSubmitCreate={createForm}
        onSubmitUpdate={updateForm}
      />

      <DeleteFormModal
        form={deletingForm}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingForm(null);
        }}
        onConfirm={deleteForm}
      />

      <SubmissionsDrawer
        form={viewingSubmissionsForm}
        isOpen={isSubmissionsOpen}
        onClose={() => {
          setIsSubmissionsOpen(false);
          setViewingSubmissionsForm(null);
        }}
      />
    </div>
  );
}
