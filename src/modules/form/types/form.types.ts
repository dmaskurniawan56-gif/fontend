// ==============================================================================
// Wahide Frontend - Dynamic Form Module Types
// Synchronized with Wahide Go Backend: internal/modules/form/domain
// ==============================================================================

export type FormType = "STANDARD" | "RESERVATION" | "LEAD";

export type FormFieldType =
  | "text"
  | "number"
  | "phone"
  | "email"
  | "date"
  | "time"
  | "select"
  | "textarea";

export interface FormField {
  id: string;
  label: string;
  name: string;
  fieldType: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface Form {
  id: string;
  tenantId?: string;
  title: string;
  slug: string;
  description: string;
  type: FormType;
  fields: FormField[];
  successMessage: string;
  redirectUrl?: string;
  isActive: boolean;
  viewCount: number;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicForm {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: FormType;
  fields: FormField[];
  successMessage: string;
  redirectUrl?: string;
}

export type SubmissionStatus = "PENDING" | "PROCESSED" | "ARCHIVED";

export interface FormSubmission {
  id: string;
  tenantId?: string;
  formId: string;
  respondentName: string;
  respondentPhone: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses: Record<string, any>;
  ipAddress?: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormInput {
  title: string;
  slug: string;
  description?: string;
  type?: FormType;
  fields: FormField[];
  successMessage?: string;
  redirectUrl?: string;
  isActive?: boolean;
}

export interface UpdateFormInput {
  title?: string;
  slug?: string;
  description?: string;
  type?: FormType;
  fields?: FormField[];
  successMessage?: string;
  redirectUrl?: string;
  isActive?: boolean;
}

export interface ListFormsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: FormType | "ALL";
  isActive?: boolean;
}

export interface SubmitFormInput {
  respondentName: string;
  respondentPhone: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses: Record<string, any>;
  hpCompanyField?: string; // Anti-bot honeypot
}

export interface ListSubmissionsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SubmissionStatus | "ALL";
}
