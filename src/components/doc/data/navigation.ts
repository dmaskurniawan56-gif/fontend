import { NavSection } from "../types";

export const docNavigation: NavSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "BookOpen",
    items: [
      {
        id: "intro",
        title: "Introduction",
        path: "/docs/intro",
      },
      {
        id: "authentication",
        title: "Authentication",
        path: "/docs/authentication",
      },
      {
        id: "errors",
        title: "Errors & Rate Limits",
        path: "/docs/errors",
      },
    ],
  },
  {
    id: "devices",
    title: "WhatsApp Devices",
    icon: "Smartphone",
    items: [
      {
        id: "devices-list",
        title: "List Devices",
        path: "/docs/devices/list",
        method: "GET",
      },
      {
        id: "devices-create",
        title: "Create Device Slot",
        path: "/docs/devices/create",
        method: "POST",
      },
      {
        id: "devices-pair",
        title: "Pair Device (QR)",
        path: "/docs/devices/pair",
        method: "POST",
      },
      {
        id: "devices-disconnect",
        title: "Disconnect Device",
        path: "/docs/devices/disconnect",
        method: "POST",
      },
      {
        id: "devices-delete",
        title: "Delete Device",
        path: "/docs/devices/delete",
        method: "DELETE",
      },
    ],
  },
  {
    id: "messaging",
    title: "Messaging",
    icon: "MessageSquare",
    items: [
      {
        id: "messaging-send-text",
        title: "Send Text Message",
        path: "/docs/messaging/send-text",
        method: "POST",
        badge: "Popular",
      },
      {
        id: "messaging-round-robin",
        title: "Round-Robin Multi-Device",
        path: "/docs/messaging/send-round-robin",
        method: "POST",
        badge: "Smart",
      },
      {
        id: "messaging-spintax",
        title: "Spintax Dynamic Text",
        path: "/docs/messaging/send-spintax",
        method: "POST",
      },
      {
        id: "messaging-media",
        title: "Send Media / Document",
        path: "/docs/messaging/send-media",
        method: "POST",
      },
      {
        id: "messaging-meta-cloud",
        title: "Meta Cloud API Compatible",
        path: "/docs/messaging/meta-cloud-api",
        method: "POST",
      },
    ],
  },
  {
    id: "otp",
    title: "OTP & Verification",
    icon: "ShieldCheck",
    items: [
      {
        id: "otp-send",
        title: "Send OTP Code",
        path: "/docs/otp/send",
        method: "POST",
        badge: "Instant VIP",
      },
      {
        id: "otp-verify",
        title: "Verify OTP Code",
        path: "/docs/otp/verify",
        method: "POST",
        badge: "Secure",
      },
    ],
  },
  {
    id: "contacts",
    title: "Contacts Management",
    icon: "Users",
    items: [
      {
        id: "contacts-list",
        title: "List Contacts",
        path: "/docs/contacts/list",
        method: "GET",
      },
      {
        id: "contacts-create",
        title: "Create Contact",
        path: "/docs/contacts/create",
        method: "POST",
      },
      {
        id: "contacts-bulk-import",
        title: "Bulk Import Contacts",
        path: "/docs/contacts/bulk-import",
        method: "POST",
      },
      {
        id: "contacts-bulk-delete",
        title: "Bulk Delete Contacts",
        path: "/docs/contacts/bulk-delete",
        method: "POST",
      },
      {
        id: "contacts-tags",
        title: "Contact Tags",
        path: "/docs/contacts/tags",
        method: "GET",
      },
    ],
  },
  {
    id: "campaigns",
    title: "Campaigns & Broadcasts",
    icon: "Megaphone",
    items: [
      {
        id: "campaigns-list",
        title: "List Campaigns",
        path: "/docs/campaigns/list",
        method: "GET",
      },
      {
        id: "campaigns-create",
        title: "Create Campaign",
        path: "/docs/campaigns/create",
        method: "POST",
      },
      {
        id: "campaigns-start",
        title: "Start Campaign",
        path: "/docs/campaigns/start",
        method: "POST",
      },
      {
        id: "campaigns-pause",
        title: "Pause Campaign",
        path: "/docs/campaigns/pause",
        method: "POST",
      },
      {
        id: "campaigns-logs",
        title: "Campaign Delivery Logs",
        path: "/docs/campaigns/logs",
        method: "GET",
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: "Webhook",
    items: [
      {
        id: "webhooks-overview",
        title: "Overview & Quickstart",
        path: "/docs/webhooks",
      },
      {
        id: "webhooks-events",
        title: "Event: message.received",
        path: "/docs/webhooks/events",
        method: "POST",
        badge: "Real-Time",
      },
    ],
  },
];
