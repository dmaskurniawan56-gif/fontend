// ==============================================================================
// Wahide Frontend - Reminder Module API Client
// Standard REST API communication with Go Backend
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Reminder,
  CreateReminderInput,
  UpdateReminderInput,
  ListRemindersQuery,
  ReminderRule,
  UpdateReminderRuleInput,
  ReminderLog,
  ListReminderLogsQuery,
  DispatchResult,
} from "../types/reminder.types";

const REMINDER_BASE = env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendReminder = (r: any): Reminder => {
  if (!r || typeof r !== "object") {
    return {
      id: "",
      recipientName: "",
      phone: "",
      targetDate: new Date().toISOString().slice(0, 10),
      notes: "",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Normalize target_date: can be RFC3339 string from Go or YYYY-MM-DD
  let targetDate = r.target_date || r.targetDate || "";
  if (targetDate.includes("T")) {
    targetDate = targetDate.split("T")[0];
  }

  return {
    id: r.id || "",
    tenantId: r.tenant_id || r.tenantId,
    recipientName: r.recipient_name || r.recipientName || "",
    phone: r.phone || "",
    targetDate,
    notes: r.notes || "",
    status: (r.status || "ACTIVE").toUpperCase(),
    createdAt: r.created_at || r.createdAt || new Date().toISOString(),
    updatedAt: r.updated_at || r.updatedAt || new Date().toISOString(),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendReminderRule = (rule: any): ReminderRule => {
  if (!rule || typeof rule !== "object") {
    return {
      id: "",
      tenantId: "",
      deviceId: "",
      sendTime: "09:00",
      showInChat: true,
      rules: [
        {
          daysOffset: -1,
          name: "Pengingat H-1",
          isEnabled: true,
          template: "Halo Kak {{nama}}, besok {{tanggal}} ada jadwal: {{catatan}}.",
        },
        {
          daysOffset: 0,
          name: "Pengingat Hari H",
          isEnabled: true,
          template: "Halo Kak {{nama}}, hari ini kami tunggu untuk jadwal: {{catatan}}.",
        },
        {
          daysOffset: 3,
          name: "Follow Up H+3",
          isEnabled: false,
          template: "Halo Kak {{nama}}, bagaimana kondisi setelah kunjungan tanggal {{tanggal}}?",
        },
      ],
    };
  }

  let items = rule.rules;
  if (typeof items === "string" && items.trim() !== "") {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }

  return {
    id: rule.id || "",
    tenantId: rule.tenant_id || rule.tenantId || "",
    deviceId: rule.device_id || rule.deviceId || "",
    sendTime: rule.send_time || rule.sendTime || "09:00",
    showInChat: rule.show_in_chat ?? rule.showInChat ?? true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rules: Array.isArray(items)
      ? items.map((i: any) => ({
          daysOffset: Number(i.days_offset ?? i.daysOffset ?? 0),
          name: i.name || "",
          isEnabled: Boolean(i.is_enabled ?? i.isEnabled ?? false),
          template: i.template || "",
        }))
      : [],
    createdAt: rule.created_at || rule.createdAt,
    updatedAt: rule.updated_at || rule.updatedAt,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendReminderLog = (log: any): ReminderLog => {
  return {
    id: log.id || "",
    reminderId: log.reminder_id || log.reminderId || "",
    tenantId: log.tenant_id || log.tenantId || "",
    daysOffset: Number(log.days_offset ?? log.daysOffset ?? 0),
    recipientName: log.recipient_name || log.recipientName || "",
    phone: log.phone || "",
    messageContent: log.message_content || log.messageContent || "",
    status: (log.status || "SENT").toUpperCase() === "FAILED" ? "FAILED" : "SENT",
    errorReason: log.error_reason || log.errorReason || undefined,
    sentAt: log.sent_at || log.sentAt || new Date().toISOString(),
  };
};

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export const reminderApi = {
  // Reminder CRUD
  getReminders: async (params?: ListRemindersQuery): Promise<PaginatedResult<Reminder>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.startDate) query.set("start_date", params.startDate);
    if (params?.endDate) query.set("end_date", params.endDate);

    const qs = query.toString();
    const endpoint = `${REMINDER_BASE}/reminders${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const rawItems = res.payload || (Array.isArray(res) ? res : []);
    const items = Array.isArray(rawItems) ? rawItems.map(mapBackendReminder) : [];

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

  getReminder: async (id: string): Promise<Reminder> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(`${REMINDER_BASE}/reminders/${id}`);
    return mapBackendReminder(res.payload || res);
  },

  createReminder: async (input: CreateReminderInput): Promise<Reminder> => {
    const payload = {
      recipient_name: input.recipientName,
      phone: input.phone,
      target_date: input.targetDate,
      notes: input.notes || "",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(`${REMINDER_BASE}/reminders`, payload);
    return mapBackendReminder(res.payload || res);
  },

  updateReminder: async (id: string, input: UpdateReminderInput): Promise<Reminder> => {
    const payload: Record<string, unknown> = {};
    if (input.recipientName !== undefined) payload.recipient_name = input.recipientName;
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.targetDate !== undefined) payload.target_date = input.targetDate;
    if (input.notes !== undefined) payload.notes = input.notes;
    if (input.status !== undefined) payload.status = input.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(`${REMINDER_BASE}/reminders/${id}`, payload);
    return mapBackendReminder(res.payload || res);
  },

  deleteReminder: async (id: string): Promise<void> => {
    await httpClient.delete(`${REMINDER_BASE}/reminders/${id}`);
  },

  // Tenant Rules
  getRules: async (): Promise<ReminderRule> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(`${REMINDER_BASE}/reminders/rules`);
    return mapBackendReminderRule(res.payload || res);
  },

  updateRules: async (input: UpdateReminderRuleInput): Promise<ReminderRule> => {
    const payload = {
      device_id: input.deviceId || "",
      send_time: input.sendTime,
      show_in_chat: input.showInChat,
      rules: input.rules.map((r) => ({
        days_offset: r.daysOffset,
        name: r.name,
        is_enabled: r.isEnabled,
        template: r.template,
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(`${REMINDER_BASE}/reminders/rules`, payload);
    return mapBackendReminderRule(res.payload || res);
  },

  // Reminder Logs
  getLogs: async (params?: ListReminderLogsQuery): Promise<PaginatedResult<ReminderLog>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.reminderId) query.set("reminder_id", params.reminderId);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);

    const qs = query.toString();
    const endpoint = `${REMINDER_BASE}/reminders/logs${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const rawItems = res.payload || (Array.isArray(res) ? res : []);
    const items = Array.isArray(rawItems) ? rawItems.map(mapBackendReminderLog) : [];

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

  // Manual Trigger Cron Dispatch
  dispatchNow: async (): Promise<DispatchResult> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(`${REMINDER_BASE}/cronjob/reminders/dispatch`);
    const p = res.payload || res;
    return {
      dispatched: Number(p.dispatched ?? 0),
      skipped: Number(p.skipped ?? 0),
      failed: Number(p.failed ?? 0),
    };
  },
};
