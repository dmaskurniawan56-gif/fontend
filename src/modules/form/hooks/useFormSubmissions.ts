"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FormSubmission,
  SubmissionStatus,
} from "../types/form.types";
import { formApi } from "../api/form.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useFormSubmissions(formId: string | null) {
  const { t } = useI18n();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 1. Fetch Submissions
  const fetchSubmissions = useCallback(
    async (signal?: AbortSignal) => {
      if (!formId) {
        setSubmissions([]);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await formApi.getSubmissions(formId, {
          page,
          pageSize,
          search: search.trim() || undefined,
          status,
        });

        if (signal?.aborted) return;

        setSubmissions(res.items);
        setTotal(res.total);
        setPage(res.page);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error
            ? err.message
            : t("form.submissionsFetchFailed");
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [formId, page, pageSize, search, status, t]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchSubmissions(controller.signal);
    return () => controller.abort();
  }, [fetchSubmissions]);

  // 2. Update Status
  const updateStatus = async (
    id: string,
    newStatus: SubmissionStatus
  ): Promise<boolean> => {
    try {
      const updated = await formApi.updateSubmissionStatus(id, newStatus);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
      toast.success(t("form.statusUpdated"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("form.statusUpdateFailed");
      toast.error(msg);
      return false;
    }
  };

  // 3. Delete Submission
  const deleteSubmission = async (id: string): Promise<boolean> => {
    try {
      await formApi.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(t("form.submissionDeleted"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("form.submissionDeleteFailed");
      toast.error(msg);
      return false;
    }
  };

  return {
    submissions,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    fetchSubmissions,
    updateStatus,
    deleteSubmission,
  };
}
