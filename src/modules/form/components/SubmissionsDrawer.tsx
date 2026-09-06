"use client";

import React, { useState } from "react";
import {
  Inbox,
  Search,
  MessageCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/context";
import { Form, FormSubmission, SubmissionStatus } from "../types/form.types";
import { useFormSubmissions } from "../hooks/useFormSubmissions";

interface SubmissionsDrawerProps {
  form: Form | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadge = (status: SubmissionStatus) => {
  switch (status) {
    case "PROCESSED":
      return {
        label: "Diproses",
        variant: "success" as const,
      };
    case "ARCHIVED":
      return {
        label: "Diarsipkan",
        variant: "secondary" as const,
      };
    default:
      return {
        label: "Menunggu (Pending)",
        variant: "warning" as const,
      };
  }
};

export function SubmissionsDrawer({
  form,
  isOpen,
  onClose,
}: SubmissionsDrawerProps) {
  const { t } = useI18n();
  const {
    submissions,
    isLoading,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    total,
    totalPages,
    updateStatus,
    deleteSubmission,
  } = useFormSubmissions(form?.id || null);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!form) return null;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCleanPhone = (raw: string) => {
    let clean = raw.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = "62" + clean.slice(1);
    return clean;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-212.5 max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {t("form.submissionsTitle") || "Daftar Respons Formulir"}
                </DialogTitle>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {form.title} ({total} respons terkumpul)
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder={t("form.searchSubmissions") || "Cari nama atau no. WA..."}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 text-xs h-8"
            />
          </div>

          <Tabs
            value={status}
            onValueChange={(val) => {
              setStatus(val as SubmissionStatus | "ALL");
              setPage(1);
            }}
          >
            <TabsList className="h-8">
              <TabsTrigger value="ALL" className="text-xs px-2.5">
                Semua
              </TabsTrigger>
              <TabsTrigger value="PENDING" className="text-xs px-2.5">
                Pending
              </TabsTrigger>
              <TabsTrigger value="PROCESSED" className="text-xs px-2.5">
                Diproses
              </TabsTrigger>
              <TabsTrigger value="ARCHIVED" className="text-xs px-2.5">
                Arsip
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Submissions List Body */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Memuat respons...
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-14 text-center">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t("form.noSubmissionsFound") || "Belum ada respons yang masuk untuk formulir ini."}
              </p>
            </div>
          ) : (
            submissions.map((sub: FormSubmission) => {
              const isExpanded = expandedId === sub.id;
              const badge = getStatusBadge(sub.status);
              const waLink = `https://wa.me/${getCleanPhone(sub.respondentPhone)}`;
              const formattedDate = new Date(sub.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={sub.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3.5 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {sub.respondentName}
                        </span>
                        <Badge variant={badge.variant} className="text-[10px] py-0 px-2 font-medium">
                          {badge.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {sub.respondentPhone}
                        </a>
                        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Status Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2.5 cursor-pointer">
                          Status <ChevronDown className="w-3 h-3 ml-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateStatus(sub.id, "PENDING")}>
                            Tandai Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(sub.id, "PROCESSED")}>
                            Tandai Diproses
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(sub.id, "ARCHIVED")}>
                            Arsipkan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Detail Expand Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => toggleExpand(sub.id)}
                      >
                        {isExpanded ? (
                          <>
                            Tutup <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            Jawaban <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        onClick={() => deleteSubmission(sub.id)}
                        title="Hapus respons"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="mt-3 bg-slate-50 dark:bg-slate-800/40 rounded-md p-3">
                      <Separator className="mb-2.5" />
                      <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Jawaban Pertanyaan:
                      </h5>
                      {Object.keys(sub.responses).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          Tidak ada jawaban tambahan.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {Object.entries(sub.responses).map(([key, value]) => {
                            // Find human-friendly label from form fields if available
                            const matchedField = form.fields.find((f) => f.name === key);
                            const label = matchedField ? matchedField.label : key;

                            return (
                              <div
                                key={key}
                                className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800"
                              >
                                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                                  {label}
                                </span>
                                <span className="text-slate-900 dark:text-slate-100 font-mono text-[11px] wrap-break-word">
                                  {value !== null && value !== undefined
                                    ? String(value)
                                    : "-"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div>
            <Separator className="mb-3" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
