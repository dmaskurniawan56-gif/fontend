"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Form,
  FormType,
  CreateFormInput,
  UpdateFormInput,
} from "../types/form.types";
import { formApi } from "../api/form.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useForms() {
  const { t } = useI18n();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [type, setType] = useState<FormType | "ALL">("ALL");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 3x3 grid
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 1. Fetch Forms List
  const fetchForms = useCallback(
    async (
      overrideParams?: {
        search?: string;
        type?: FormType | "ALL";
        isActive?: boolean;
        page?: number;
      },
      signal?: AbortSignal,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const querySearch =
          overrideParams?.search !== undefined ? overrideParams.search : search;
        const queryType =
          overrideParams?.type !== undefined ? overrideParams.type : type;
        const queryActive =
          overrideParams?.isActive !== undefined
            ? overrideParams.isActive
            : isActiveFilter;
        const queryPage =
          overrideParams?.page !== undefined ? overrideParams.page : page;

        const res = await formApi.getForms({
          page: queryPage,
          pageSize,
          search: querySearch.trim() || undefined,
          type: queryType,
          isActive: queryActive,
        });

        if (signal?.aborted) return;

        setForms(res.items);
        setTotal(res.total);
        setPage(res.page);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : t("form.fetchFailed");
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [search, type, isActiveFilter, page, pageSize, t],
  );

  // Auto-fetch on parameter changes
  useEffect(() => {
    const controller = new AbortController();
    fetchForms(undefined, controller.signal);
    return () => controller.abort();
  }, [fetchForms]);

  // 2. Create Form
  const createForm = async (input: CreateFormInput): Promise<Form | null> => {
    try {
      const created = await formApi.createForm(input);
      toast.success(t("form.createSuccess"));
      await fetchForms();
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("form.createFailed");
      toast.error(msg);
      return null;
    }
  };

  // 3. Update Form
  const updateForm = async (
    id: string,
    input: UpdateFormInput,
  ): Promise<Form | null> => {
    try {
      const updated = await formApi.updateForm(id, input);
      toast.success(t("form.updateSuccess"));
      setForms((prev) => prev.map((f) => (f.id === id ? updated : f)));
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("form.updateFailed");
      toast.error(msg);
      return null;
    }
  };

  // 4. Toggle Active Status
  const toggleActive = async (form: Form): Promise<void> => {
    const newStatus = !form.isActive;
    try {
      await formApi.updateForm(form.id, { isActive: newStatus });
      setForms((prev) =>
        prev.map((f) => (f.id === form.id ? { ...f, isActive: newStatus } : f)),
      );
      toast.success(newStatus ? t("form.activated") : t("form.deactivated"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("form.toggleFailed");
      toast.error(msg);
    }
  };

  // 5. Delete Form
  const deleteForm = async (id: string): Promise<boolean> => {
    try {
      await formApi.deleteForm(id);
      toast.success(t("form.deleteSuccess"));
      setForms((prev) => prev.filter((f) => f.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("form.deleteFailed");
      toast.error(msg);
      return false;
    }
  };

  // 6. Copy Form Identifier
  const copyPublicLink = (slug: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(slug);
      toast.success(t("form.linkCopied"));
    }
  };

  return {
    forms,
    isLoading,
    error,
    search,
    setSearch,
    type,
    setType,
    isActiveFilter,
    setIsActiveFilter,
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    fetchForms,
    createForm,
    updateForm,
    toggleActive,
    deleteForm,
    copyPublicLink,
  };
}
