"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTemplates } from "../hooks/useTemplates";
import { TemplateFilterBar } from "../components/TemplateFilterBar";
import { TemplateCard } from "../components/TemplateCard";
import {
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "../types/template.types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import {
  Plus,
  RefreshCw,
  FileText,
  Layers,
  Flame,
  Info,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TemplateEditorModal = dynamic(
  () =>
    import("../components/TemplateEditorModal").then(
      (m) => m.TemplateEditorModal,
    ),
  { ssr: false },
);

const DeleteTemplateModal = dynamic(
  () =>
    import("../components/DeleteTemplateModal").then(
      (m) => m.DeleteTemplateModal,
    ),
  { ssr: false },
);

export function TemplatesView() {
  const { t } = useI18n();
  const {
    templates,
    isLoading,
    error,
    stats,
    search,
    category,
    favoriteOnly,
    page,
    totalPages,
    handleSearchChange,
    handleCategoryChange,
    handleFavoriteOnlyToggle,
    goToPage,
    createTemplate,
    updateTemplate,
    duplicateTemplate,
    deleteTemplate,
    toggleFavorite,
    reload,
  } = useTemplates();

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (t: Template) => {
    setEditingTemplate(t);
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = async (
    data: CreateTemplateInput | UpdateTemplateInput,
  ): Promise<boolean> => {
    if (editingTemplate) {
      return await updateTemplate(editingTemplate.id, data);
    } else {
      return await createTemplate(data as CreateTemplateInput);
    }
  };

  const handleConfirmDelete = async (): Promise<boolean> => {
    if (!deletingTemplate) return false;
    return await deleteTemplate(deletingTemplate.id, deletingTemplate.name);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("template.title")}
          </h1>
          <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
            {t("template.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={isLoading}
            className="h-9 gap-1.5 rounded-full border-border/70 text-xs"
            title="Muat Ulang"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={handleOpenCreate}
            className="h-9 gap-1.5 px-4 text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("template.addTemplate")}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Layers className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">
              {t("template.stats.total")}
            </p>
            <p className="text-lg font-bold text-foreground">{stats.total}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Flame className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">
              {t("template.stats.marketing")}
            </p>
            <p className="text-lg font-bold text-foreground">
              {stats.marketing}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Info className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">
              {t("template.stats.utility")}
            </p>
            <p className="text-lg font-bold text-foreground">{stats.utility}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs">
          <div className="flex size-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            <Star className="size-4 fill-yellow-500" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">
              {t("template.stats.favorites")}
            </p>
            <p className="text-lg font-bold text-foreground">
              {stats.favorites}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TemplateFilterBar
        currentCategory={category}
        onSelectCategory={handleCategoryChange}
        search={search}
        onSearchChange={handleSearchChange}
        favoriteOnly={favoriteOnly}
        onToggleFavoriteOnly={handleFavoriteOnlyToggle}
        stats={stats}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex h-56 flex-col justify-between rounded-2xl border border-border/60 bg-card p-4"
            >
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-5 w-48 rounded-lg" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/40 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            className="mt-3 rounded-xl border-red-500/30 text-xs"
          >
            {t("common.retry")}
          </Button>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground">
            {search || category !== "ALL" || favoriteOnly
              ? t("template.noMatching")
              : t("template.emptyTitle")}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-foreground-muted">
            {search || category !== "ALL" || favoriteOnly
              ? t("template.noMatchingDesc")
              : t("template.emptyDesc")}
          </p>
          <Button
            variant="primaryPill"
            onClick={handleOpenCreate}
            size="sm"
            className="mt-5 gap-1.5 px-4 text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("template.addTemplate")}</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Templates Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tmpl) => (
              <TemplateCard
                key={tmpl.id}
                template={tmpl}
                onEdit={handleOpenEdit}
                onDuplicate={duplicateTemplate}
                onDelete={(id, name) => setDeletingTemplate({ id, name })}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-foreground-muted">
              <span>
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="size-8 rounded-lg p-0"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="size-8 rounded-lg p-0"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <TemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={handleSaveTemplate}
        initialData={editingTemplate}
      />

      <DeleteTemplateModal
        isOpen={!!deletingTemplate}
        onClose={() => setDeletingTemplate(null)}
        onConfirm={handleConfirmDelete}
        templateName={deletingTemplate?.name || ""}
      />
    </div>
  );
}
