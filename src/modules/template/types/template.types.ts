// ==============================================================================
// Wahide Frontend - Template Module Types
// Strictly synchronized with Wahide Go Backend: internal/modules/template/domain
// ==============================================================================

export type TemplateCategory =
  "MARKETING" | "UTILITY" | "REMINDER" | "RESERVATION" | "QUICK_REPLY";

export type TemplateMediaType = "NONE" | "IMAGE" | "DOCUMENT";

export type TemplateButtonType = "QUICK_REPLY" | "URL" | "CALL";

export interface TemplateButton {
  type: TemplateButtonType;
  text: string;
  value?: string;
}

export interface Template {
  id: string;
  tenantId?: string;
  name: string;
  category: TemplateCategory;
  content: string;
  mediaType: TemplateMediaType;
  mediaUrl?: string;
  buttons?: TemplateButton[];
  variables: string[];
  isFavorite: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  category: TemplateCategory;
  content: string;
  mediaType?: TemplateMediaType;
  mediaUrl?: string;
  buttons?: TemplateButton[];
  isFavorite?: boolean;
}

export interface UpdateTemplateInput {
  name?: string;
  category?: TemplateCategory;
  content?: string;
  mediaType?: TemplateMediaType;
  mediaUrl?: string;
  buttons?: TemplateButton[];
  isFavorite?: boolean;
}

export interface ListTemplatesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: TemplateCategory | "ALL";
  favoriteOnly?: boolean;
  isFavorite?: boolean;
}
