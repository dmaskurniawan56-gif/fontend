// ==============================================================================
// Wahide Frontend - Form Module API Client
// Standard REST API communication with Go Backend
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Form,
  PublicForm,
  FormSubmission,
  CreateFormInput,
  UpdateFormInput,
  ListFormsQuery,
  SubmitFormInput,
  ListSubmissionsQuery,
  FormType,
  SubmissionStatus,
} from "../types/form.types";

const API_BASE = env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendForm = (f: any): Form => {
  if (!f || typeof f !== "object") {
    return {
      id: "",
      title: "",
      slug: "",
      description: "",
      type: "STANDARD",
      fields: [],
      successMessage: "",
      redirectUrl: "",
      isActive: true,
      viewCount: 0,
      submissionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const rawFields = Array.isArray(f.fields) ? f.fields : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = rawFields.map((field: any) => ({
    id: field.id || "",
    label: field.label || "",
    name: field.name || "",
    fieldType: field.field_type || field.fieldType || "text",
    required: Boolean(field.required),
    placeholder: field.placeholder || "",
    options: Array.isArray(field.options) ? field.options : [],
  }));

  return {
    id: f.id || "",
    tenantId: f.tenant_id || f.tenantId,
    title: f.title || "",
    slug: f.slug || "",
    description: f.description || "",
    type: (f.type || "STANDARD").toUpperCase() as FormType,
    fields,
    successMessage: f.success_message || f.successMessage || "",
    redirectUrl: f.redirect_url || f.redirectUrl || "",
    isActive: f.is_active !== undefined ? Boolean(f.is_active) : Boolean(f.isActive ?? true),
    viewCount: Number(f.view_count ?? f.viewCount ?? 0),
    submissionCount: Number(f.submission_count ?? f.submissionCount ?? 0),
    createdAt: f.created_at || f.createdAt || new Date().toISOString(),
    updatedAt: f.updated_at || f.updatedAt || new Date().toISOString(),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendSubmission = (s: any): FormSubmission => {
  if (!s || typeof s !== "object") {
    return {
      id: "",
      formId: "",
      respondentName: "",
      respondentPhone: "",
      responses: {},
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: s.id || "",
    tenantId: s.tenant_id || s.tenantId,
    formId: s.form_id || s.formId || "",
    respondentName: s.respondent_name || s.respondentName || "",
    respondentPhone: s.respondent_phone || s.respondentPhone || "",
    responses: typeof s.responses === "object" && s.responses !== null ? s.responses : {},
    ipAddress: s.ip_address || s.ipAddress || "",
    status: (s.status || "PENDING").toUpperCase() as SubmissionStatus,
    createdAt: s.created_at || s.createdAt || new Date().toISOString(),
    updatedAt: s.updated_at || s.updatedAt || new Date().toISOString(),
  };
};

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export const formApi = {
  // Seller: List Forms
  getForms: async (params?: ListFormsQuery): Promise<PaginatedResult<Form>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.type && params.type !== "ALL") query.set("type", params.type);
    if (params?.isActive !== undefined) query.set("is_active", params.isActive ? "true" : "false");

    const qs = query.toString();
    const endpoint = `${API_BASE}/forms${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const rawItems = res.payload || (Array.isArray(res) ? res : []);
    const items = Array.isArray(rawItems) ? rawItems.map(mapBackendForm) : [];

    const additionalInfo = res.additional_info as
      | { page?: number; size?: number; total?: number }
      | undefined;

    return {
      items,
      page: Number(additionalInfo?.page ?? params?.page ?? 1),
      pageSize: Number(additionalInfo?.size ?? params?.pageSize ?? 10),
      total: Number(additionalInfo?.total ?? items.length),
    };
  },

  // Seller: Get Form by ID
  getForm: async (id: string): Promise<Form> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(`${API_BASE}/forms/${id}`);
    return mapBackendForm(res.payload || res);
  },

  // Seller: Create Form
  createForm: async (input: CreateFormInput): Promise<Form> => {
    const payload = {
      title: input.title,
      slug: input.slug,
      description: input.description || "",
      type: input.type || "STANDARD",
      fields: input.fields.map((f) => ({
        id: f.id,
        label: f.label,
        name: f.name,
        field_type: f.fieldType,
        required: f.required,
        placeholder: f.placeholder || "",
        options: f.options || [],
      })),
      success_message: input.successMessage || "",
      redirect_url: input.redirectUrl || "",
      is_active: input.isActive ?? true,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(`${API_BASE}/forms`, payload);
    return mapBackendForm(res.payload || res);
  },

  // Seller: Update Form
  updateForm: async (id: string, input: UpdateFormInput): Promise<Form> => {
    const payload: Record<string, unknown> = {};
    if (input.title !== undefined) payload.title = input.title;
    if (input.slug !== undefined) payload.slug = input.slug;
    if (input.description !== undefined) payload.description = input.description;
    if (input.type !== undefined) payload.type = input.type;
    if (input.fields !== undefined) {
      payload.fields = input.fields.map((f) => ({
        id: f.id,
        label: f.label,
        name: f.name,
        field_type: f.fieldType,
        required: f.required,
        placeholder: f.placeholder || "",
        options: f.options || [],
      }));
    }
    if (input.successMessage !== undefined) payload.success_message = input.successMessage;
    if (input.redirectUrl !== undefined) payload.redirect_url = input.redirectUrl;
    if (input.isActive !== undefined) payload.is_active = input.isActive;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(`${API_BASE}/forms/${id}`, payload);
    return mapBackendForm(res.payload || res);
  },

  // Seller: Delete Form
  deleteForm: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_BASE}/forms/${id}`);
  },

  // Public: Get Form Schema by Slug
  getPublicForm: async (slug: string): Promise<PublicForm> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(`${API_BASE}/forms/public/${encodeURIComponent(slug)}`);
    const p = res.payload || res;
    const rawFields = Array.isArray(p.fields) ? p.fields : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = rawFields.map((field: any) => ({
      id: field.id || "",
      label: field.label || "",
      name: field.name || "",
      fieldType: field.field_type || field.fieldType || "text",
      required: Boolean(field.required),
      placeholder: field.placeholder || "",
      options: Array.isArray(field.options) ? field.options : [],
    }));

    return {
      id: p.id || "",
      title: p.title || "",
      slug: p.slug || slug,
      description: p.description || "",
      type: (p.type || "STANDARD").toUpperCase() as FormType,
      fields,
      successMessage: p.success_message || p.successMessage || "",
      redirectUrl: p.redirect_url || p.redirectUrl || "",
    };
  },

  // Public: Submit Form
  submitPublicForm: async (slug: string, input: SubmitFormInput): Promise<FormSubmission> => {
    const payload = {
      respondent_name: input.respondentName,
      respondent_phone: input.respondentPhone,
      responses: input.responses,
      hp_company_field: input.hpCompanyField || "",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(`${API_BASE}/forms/public/${encodeURIComponent(slug)}/submit`, payload);
    return mapBackendSubmission(res.payload || res);
  },

  // Seller: List Submissions by Form ID
  getSubmissions: async (formId: string, params?: ListSubmissionsQuery): Promise<PaginatedResult<FormSubmission>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);

    const qs = query.toString();
    const endpoint = `${API_BASE}/forms/${formId}/submissions${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const rawItems = res.payload || (Array.isArray(res) ? res : []);
    const items = Array.isArray(rawItems) ? rawItems.map(mapBackendSubmission) : [];

    const additionalInfo = res.additional_info as
      | { page?: number; size?: number; total?: number }
      | undefined;

    return {
      items,
      page: Number(additionalInfo?.page ?? params?.page ?? 1),
      pageSize: Number(additionalInfo?.size ?? params?.pageSize ?? 10),
      total: Number(additionalInfo?.total ?? items.length),
    };
  },

  // Seller: Update Submission Status
  updateSubmissionStatus: async (id: string, status: SubmissionStatus): Promise<FormSubmission> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.patch<any>(`${API_BASE}/forms/submissions/${id}/status`, { status });
    return mapBackendSubmission(res.payload || res);
  },

  // Seller: Delete Submission
  deleteSubmission: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_BASE}/forms/submissions/${id}`);
  },
};
