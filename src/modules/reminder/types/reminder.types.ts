// ==============================================================================
// Wahide Frontend - Reminder Module Types
// Strictly synchronized with Wahide Go Backend: internal/modules/reminder/domain
// ==============================================================================

export type ReminderStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

export type ReminderLogStatus = "SENT" | "FAILED";

export interface Reminder {
  id: string;
  tenantId?: string;
  recipientName: string;
  phone: string;
  targetDate: string; // YYYY-MM-DD
  notes: string;
  status: ReminderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  recipientName: string;
  phone: string;
  targetDate: string; // YYYY-MM-DD
  notes?: string;
}

export interface UpdateReminderInput {
  recipientName?: string;
  phone?: string;
  targetDate?: string; // YYYY-MM-DD
  notes?: string;
  status?: ReminderStatus;
}

export interface ListRemindersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ReminderStatus | "ALL";
  startDate?: string;
  endDate?: string;
}

export interface DripRuleItem {
  daysOffset: number; // e.g. -1 for H-1, 0 for Hari H, 3 for H+3
  name: string;
  isEnabled: boolean;
  template: string;
}

export interface ReminderRule {
  id: string;
  tenantId: string;
  deviceId: string;
  sendTime: string; // HH:mm
  showInChat: boolean;
  rules: DripRuleItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateReminderRuleInput {
  deviceId?: string;
  sendTime: string;
  showInChat: boolean;
  rules: DripRuleItem[];
}

export interface ReminderLog {
  id: string;
  reminderId: string;
  tenantId: string;
  daysOffset: number;
  recipientName: string;
  phone: string;
  messageContent: string;
  status: ReminderLogStatus;
  errorReason?: string;
  sentAt: string;
}

export interface ListReminderLogsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  reminderId?: string;
  status?: ReminderLogStatus | "ALL";
}

export interface DispatchResult {
  dispatched: number;
  skipped: number;
  failed: number;
}
