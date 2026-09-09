import { EndpointDoc, GuideDoc } from "../types";

export const webhooksGuideDoc: GuideDoc = {
  type: "guide",
  id: "webhooks-overview",
  slug: "webhooks",
  title: "Webhooks Overview & Quickstart",
  description:
    "Receive incoming messages, delivery reports, and real-time WhatsApp events on your application backend via secure HTTP Webhooks.",
  category: "Webhooks",
  categorySlug: "webhooks",
  bannerNotice: {
    type: "info",
    title: "Event-Driven Real-Time Delivery",
    content:
      "The Wahide Webhook Engine automatically streams incoming 1-on-1 WhatsApp messages, delivery receipts, and device status updates directly to your backend endpoint in high-speed, zero-heap JSON format.",
  },
  sections: [
    {
      id: "architecture",
      title: "1. How Wahide Webhooks Work",
      content:
        "When an event occurs on your connected WhatsApp devices (inbound message, status delivery tick, device disconnect, or QR stream), the Wahide engine immediately processes the event through a resilient, event-driven pipeline:\n\n1. **Zero-Heap Event Filtering**: Unnecessary noisy events (groups, stories, channel newsletters) are filtered out to protect your server from overload.\n2. **Standardized JSON Envelope**: The event data, device identifier, sender details, and timestamps are packaged into a structured schema.\n3. **Asynchronous HTTP POST Delivery**: Wahide dispatches an HTTP POST request to the webhook URL configured in your dashboard.\n4. **Instant Acknowledgment**: Your server acknowledges receipt by returning an HTTP `200 OK` response within 8 seconds.",
      callout: {
        type: "tip",
        title: "Public HTTPS Endpoint & n8n / AI Bot Integration",
        content:
          "Your webhook URL must be publicly accessible over valid HTTPS. For local development, use tunneling solutions such as Cloudflare Tunnels or Ngrok.\n\n💡 **Building with n8n or AI Agents (OpenAI/Claude)?** Check out our dedicated [n8n AI Chatbot & Automation Guide](/docs/webhooks/n8n) with a ready-to-import zero-timeout workflow template.",
      },
    },
    {
      id: "security",
      title: "2. Security & Header Verification",
      content:
        "To verify that incoming requests genuinely originate from Wahide and protect your endpoint from spoofing or replay attacks, Wahide includes standard HTTP authentication headers on every request:",
      code: {
        language: "http",
        title: "HTTP Request Headers from Wahide",
        content: `POST /api/webhook/whatsapp HTTP/1.1
Host: api.your-business.com
Content-Type: application/json
User-Agent: Wahide-WhatsApp-Webhook-Engine/2.0
X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210
X-Wahide-Delivery-ID: 01JPLAN0000000000000000099
X-Wahide-Event: message.received
X-Wahide-Device-ID: 01JPLAN0000000000000000001
X-Wahide-Timestamp: 1725845000`,
      },
      callout: {
        type: "warning",
        title: "Mandatory Server Validation",
        content:
          "Always verify that the secret key in the `X-Wahide-Secret` header matches your configured Webhook Secret before processing payloads.",
      },
    },
    {
      id: "retry-policy",
      title: "3. Automatic Retry Policy, Circuit Breaker & DLQ",
      content:
        "Wahide employs an enterprise-grade delivery resilience pipeline to ensure zero dropped messages:\n\n- **Circuit Breaker Protection**: If a destination endpoint experiences 5 consecutive failures (timeout or 5xx error), the circuit trips to **OPEN** state for 30 seconds. Outbound requests are immediately dropped with HTTP 503 without holding connection sockets or worker threads.\n- **Jittered Exponential Backoff**: Retries are attempted up to **5 times** with increasing intervals (3s, 6s, 12s, 24s, 48s plus random jitter to prevent thundering-herd issues).\n- **Dead Letter Queue (DLQ)**: If all 5 attempts fail, the failed event is preserved in the in-memory DLQ with strict per-tenant bounds (up to 200 items), allowing inspection and manual replay.",
    },
    {
      id: "granular-events",
      title: "4. Granular Event Subscriptions Catalog",
      content:
        "Wahide allows you to subscribe strictly to events your application needs, eliminating unnecessary server load. Click on any event below to view its dedicated payload schema, parameter table, and language code examples:\n\n- [⚡ Event: message.received](/docs/webhooks/events/message-received) (*Default ON*): Inbound 1-on-1 customer messages, including direct streaming of photos and PDF documents from Cloudflare R2.\n- [⚡ Event: message.ack](/docs/webhooks/events/message-ack) (*Optional*): Real-time delivery receipt checkmarks (Sent to server, Delivered double-check, Read blue tick).\n- [⚡ Event: message.sent](/docs/webhooks/events/message-sent) (*Optional*): Outbound dispatch confirmation from device to WhatsApp network.\n- [⚡ Event: device.status](/docs/webhooks/events/device-status) (*Default ON*): Device connection lifecycle updates (ONLINE, OFFLINE, HIBERNATED, LOGGED_OUT).\n- [⚡ Event: device.qr](/docs/webhooks/events/device-qr) (*Optional*): Live streaming Base64 QR code frames for custom web pairing interfaces.",
    },
    {
      id: "device-routing",
      title: "5. Multi-Device Routing & Mazhab 3 (Hierarchical Override)",
      content:
        "Enterprises managing multiple WhatsApp lines can specify custom webhook endpoints per device:\n\n- **Workspace Webhook (Default)**: Authenticated using `whsec_live_<32 hex>`. Handles all devices by default.\n- **Device-Specific Webhook**: Authenticated using `whsec_dev_<32 hex>`. When specified on a device, traffic for that phone routes directly to your specialized server (e.g. Freshdesk / ERP).\n- **Mazhab 3 Event Inheritance**: If custom events are left empty on a device, the device automatically inherits the workspace event whitelist.",
    },
    {
      id: "media-pipeline",
      title: "6. Media Attachment Pipeline (Cloudflare R2)",
      content:
        "Customer photos (JPEG, PNG, WebP) and PDF documents (up to 1 MB) are automatically decrypted in-memory and streamed directly to Cloudflare R2 object storage:\n\n- **$0 Egress Bandwidth**: Direct downloads via Cloudflare global edge CDN at zero bandwidth cost.\n- **Pre-Download Inspection**: Files larger than 1 MB or unsupported types (video, voice notes) are safely dropped before consuming gateway bandwidth, delivering a `media_error` diagnostic code.\n- **Auto-Purge Lifecycle**: Media objects reside under the `tmp/` prefix and are automatically deleted after 7 days.",
    },
    {
      id: "code-examples",
      title: "7. Receiver Server Boilerplate (All Languages)",
      content:
        "Select your backend language below to view a production-ready webhook receiver boilerplate featuring header verification, text handling, media attachment downloading, and instant HTTP 200 OK acknowledgments.",
      codeTabsTitle: "Webhook Receiver Boilerplate & Simulation",
      codeTabs: {
        curl: `curl -X POST "http://localhost:3000/api/webhook/whatsapp" \\
  -H "Content-Type: application/json" \\
  -H "X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210" \\
  -d '{
    "event": "message.received",
    "device_id": "01JPLAN0000000000000000001",
    "timestamp": 1725845000,
    "data": {
      "message_id": "3EB0A1B2C3D4E5F6",
      "sender": "6281234567890",
      "sender_jid": "6281234567890@s.whatsapp.net",
      "push_name": "Budi Santoso",
      "text": "Mohon cek bukti transfer terlampir",
      "has_media": true,
      "media": {
        "type": "image",
        "url": "https://pub-r2.wahide.com/tmp/whatsapp-media/01JPLAN000/2026/09/01JPLANXYZ123456.jpg",
        "file_name": "struk_transfer.jpg",
        "mime_type": "image/jpeg",
        "file_size": 245120
      },
      "timestamp": 1725844998
    }
  }'`,
        nodejs: `// Express.js Webhook Receiver Boilerplate
const express = require('express');
const app = express();

app.use(express.json());

const EXPECTED_SECRET = process.env.WAHIDE_WEBHOOK_SECRET || 'whsec_live_...';

app.post('/api/webhook/whatsapp', (req, res) => {
  // 1. Verify Secret Header
  const clientSecret = req.headers['x-wahide-secret'];
  if (clientSecret !== EXPECTED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Secret' });
  }

  const { event, device_id, data } = req.body;

  // 2. Handle Granular Events
  switch (event) {
    case 'message.received':
      console.log(\`[\${device_id}] Incoming message from \${data.sender}: \${data.text}\`);
      if (data.has_media && data.media) {
        console.log(\`Attached \${data.media.type}: \${data.media.url}\`);
      }
      break;

    case 'message.ack':
      console.log(\`Message \${data.message_id} status updated to \${data.status} (code \${data.status_code})\`);
      break;

    case 'device.status':
      console.log(\`Device \${device_id} state changed to \${data.status}: \${data.reason}\`);
      break;
  }

  // 3. Fast Acknowledgment
  res.status(200).json({ status: 'success', received: true });
});

app.listen(3000, () => console.log('Webhook receiver running on port 3000'));`,
        php: `<?php
// Laravel / PHP Native Webhook Receiver
\$secret = \$_SERVER['HTTP_X_WAHIDE_SECRET'] ?? '';
\$expectedSecret = getenv('WAHIDE_WEBHOOK_SECRET') ?: 'whsec_live_...';

if (\$secret !== \$expectedSecret) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

\$rawInput = file_get_contents('php://input');
\$payload = json_decode(\$rawInput, true);

if (\$payload['event'] === 'message.received') {
    \$sender = \$payload['data']['sender'];
    \$text = \$payload['data']['text'];
    if (!empty(\$payload['data']['has_media']) && !empty(\$payload['data']['media'])) {
        \$mediaURL = \$payload['data']['media']['url'];
    }
}

http_response_code(200);
echo json_encode(['status' => 'success']);`,
        python: `# FastAPI Webhook Receiver Boilerplate
from fastapi import FastAPI, Header, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os

app = FastAPI()
EXPECTED_SECRET = os.getenv("WAHIDE_WEBHOOK_SECRET", "whsec_live_...")

class WebhookPayload(BaseModel):
    event: str
    device_id: str
    timestamp: int
    data: Dict[str, Any]

@app.post("/api/webhook/whatsapp")
async def receive_webhook(
    payload: WebhookPayload,
    x_wahide_secret: Optional[str] = Header(None)
):
    if x_wahide_secret != EXPECTED_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid X-Wahide-Secret header"
        )

    if payload.event == "message.received":
        sender = payload.data.get("sender")
        text = payload.data.get("text")
        print(f"Message from {sender}: {text}")
        if payload.data.get("has_media") and payload.data.get("media"):
            media = payload.data["media"]
            print(f"Media [{media.get('type')}]: {media.get('url')}")

    return {"status": "success"}`,
        go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type WebhookPayload struct {
	Event    string         \`json:"event"\`
	DeviceID string         \`json:"device_id"\`
	Time     int64          \`json:"timestamp"\`
	Data     map[string]any \`json:"data"\`
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	expectedSecret := os.Getenv("WAHIDE_WEBHOOK_SECRET")
	incomingSecret := r.Header.Get("X-Wahide-Secret")

	if expectedSecret != "" && incomingSecret != expectedSecret {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var payload WebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if payload.Event == "message.received" {
		fmt.Printf("Incoming message: %v\\n", payload.Data["text"])
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func main() {
	http.HandleFunc("/api/webhook/whatsapp", webhookHandler)
	fmt.Println("Webhook receiver running on port 8080")
	_ = http.ListenAndServe(":8080", nil)
}`,
      },
    },
  ],
};

// ==========================================
// 1. EVENT: message.received
// ==========================================
export const webhooksReceivedDoc: EndpointDoc = {
  type: "endpoint",
  id: "webhook-event-received",
  slug: "webhooks/events/message-received",
  title: "Webhook Event: message.received",
  description:
    "JSON payload schema dispatched by Wahide to your destination server whenever an incoming 1-on-1 private WhatsApp message (text, image, or PDF document) is received by your device.",
  category: "Webhooks",
  categorySlug: "webhooks",
  method: "POST",
  path: "/your-configured-webhook-url",
  badge: "Real-Time Event",
  bannerNotice: {
    type: "info",
    title: "Incoming Direct Chat Event",
    content:
      "This event is triggered strictly by 1-on-1 direct customer chats. Group chats, status stories, public channels, and voice call signals are filtered out at the edge to optimize your server resources.",
  },
  headers: [
    {
      key: "Content-Type",
      value: "application/json",
      required: true,
      description: "Payload format encoded in UTF-8 JSON.",
    },
    {
      key: "X-Wahide-Secret",
      value: "whsec_live_...",
      required: true,
      description: "Official authentication header containing your Tenant or Device Webhook Secret (whsec_live_... or whsec_dev_...).",
    },
    {
      key: "X-Wahide-Delivery-ID",
      value: "01JPLAN0000000000000000099",
      required: true,
      description: "Unique ULID delivery identifier generated per webhook attempt for idempotency and de-duplication.",
    },
    {
      key: "X-Wahide-Event",
      value: "message.received",
      required: true,
      description: "Granular event type header matching the event field in payload.",
    },
    {
      key: "X-Wahide-Device-ID",
      value: "01JPLAN0000000000000000001",
      required: true,
      description: "Unique WhatsApp device slot ID that received the message.",
    },
    {
      key: "X-Wahide-Timestamp",
      value: "1725845000",
      required: true,
      description: "Unix epoch timestamp in seconds when the webhook was dispatched.",
    },
    {
      key: "User-Agent",
      value: "Wahide-WhatsApp-Webhook-Engine/2.0",
      required: true,
      description: "Official User-Agent identity of the Wahide Webhook Engine.",
    },
  ],
  parameters: [
    {
      name: "event",
      type: "string",
      required: true,
      description: "Event identifier. For incoming messages, value is always 'message.received'.",
      example: "message.received",
    },
    {
      name: "device_id",
      type: "string",
      required: true,
      description: "Unique WhatsApp device slot ID in Wahide that received the message.",
      example: "01JPLAN0000000000000000001",
    },
    {
      name: "timestamp",
      type: "integer",
      required: true,
      description: "Unix epoch timestamp in seconds when the event was dispatched by Wahide.",
      example: "1725845000",
    },
    {
      name: "data",
      type: "object",
      required: true,
      description: "Structured container object holding message details.",
    },
    {
      name: "data.message_id",
      type: "string",
      required: true,
      description: "Unique WhatsApp message identifier (WhatsApp Message ID).",
      example: "3EB0A1B2C3D4E5F6",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.sender",
      type: "string",
      required: true,
      description: "Normalized sender phone number in E.164 format without special characters.",
      example: "6281234567890",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.sender_jid",
      type: "string",
      required: true,
      description: "Official WhatsApp Jabber ID of the sender (e.g. 6281234567890@s.whatsapp.net).",
      example: "6281234567890@s.whatsapp.net",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.push_name",
      type: "string",
      required: false,
      description: "WhatsApp profile display name configured by the sender.",
      example: "Budi Santoso",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.text",
      type: "string",
      required: true,
      description: "Text body content or image/document caption sent by the customer.",
      example: "Mohon dicek bukti transfer terlampir ya min",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.has_media",
      type: "boolean",
      required: true,
      description: "Indicates whether the message includes an attachment (Photo or PDF Document).",
      example: "true",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.media",
      type: "object",
      required: false,
      description: "Decrypted media object stored in Cloudflare R2 (null if no media or rejected).",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.media.type",
      type: "string",
      required: false,
      description: "Media category: 'image' for JPEG/PNG/WebP photos, or 'document' for PDF files.",
      example: "image",
      depth: 2,
      parent: "data.media",
    },
    {
      name: "data.media.url",
      type: "string",
      required: false,
      description: "Direct public Cloudflare R2 CDN URL to download the attachment ($0 egress fee).",
      example: "https://pub-r2.wahide.com/tmp/whatsapp-media/01JPLAN000/2026/09/01JPLANXYZ123456.jpg",
      depth: 2,
      parent: "data.media",
    },
    {
      name: "data.media.file_name",
      type: "string",
      required: false,
      description: "Original filename or generated filename with appropriate extension.",
      example: "struk_transfer.jpg",
      depth: 2,
      parent: "data.media",
    },
    {
      name: "data.media.mime_type",
      type: "string",
      required: false,
      description: "Standard MIME type of the file (e.g. image/jpeg, image/png, application/pdf).",
      example: "image/jpeg",
      depth: 2,
      parent: "data.media",
    },
    {
      name: "data.media.file_size",
      type: "integer",
      required: false,
      description: "Size of the downloaded attachment in bytes (maximum 1 MB).",
      example: "245120",
      depth: 2,
      parent: "data.media",
    },
    {
      name: "data.media_error",
      type: "string",
      required: false,
      description: "Diagnostic error code if attachment was skipped ('file_size_exceeded_1mb', 'unsupported_media_type', 'storage_unavailable').",
      example: "file_size_exceeded_1mb",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.timestamp",
      type: "integer",
      required: true,
      description: "Unix epoch timestamp when the message was sent by the customer.",
      example: "1725844998",
      depth: 1,
      parent: "data",
    },
  ],
  snippets: {
    curl: `curl -X POST https://api.your-business.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210" \\
  -H "User-Agent: Wahide-WhatsApp-Webhook-Engine/2.0" \\
  -d '{
    "event": "message.received",
    "device_id": "01JPLAN0000000000000000001",
    "timestamp": 1725845000,
    "data": {
      "message_id": "3EB0A1B2C3D4E5F6",
      "sender": "6281234567890",
      "sender_jid": "6281234567890@s.whatsapp.net",
      "push_name": "Budi Santoso",
      "text": "Mohon dicek bukti transfer terlampir ya min",
      "has_media": true,
      "media": {
        "type": "image",
        "url": "https://pub-r2.wahide.com/tmp/whatsapp-media/01JPLAN000/2026/09/01JPLANXYZ123456.jpg",
        "file_name": "struk_transfer.jpg",
        "mime_type": "image/jpeg",
        "file_size": 245120
      },
      "timestamp": 1725844998
    }
  }'`,
    nodejs: `// Incoming Message Handler in Express.js
app.post('/webhook', (req, res) => {
  const { event, device_id, data } = req.body;
  if (event === 'message.received') {
    console.log(\`Message from \${data.sender}: \${data.text}\`);
    if (data.has_media && data.media) {
      console.log(\`Attachment [\${data.media.type}]: \${data.media.url}\`);
    }
  }
  res.status(200).json({ received: true });
});`,
    php: `// Incoming Message Handler in PHP
\$payload = json_decode(file_get_contents('php://input'), true);
if (\$payload['event'] === 'message.received') {
    \$sender = \$payload['data']['sender'];
    \$text = \$payload['data']['text'];
    if (!empty(\$payload['data']['has_media']) && !empty(\$payload['data']['media'])) {
        \$mediaURL = \$payload['data']['media']['url'];
    }
}
http_response_code(200);
echo json_encode(['status' => 'success']);`,
    python: `# Incoming Message Handler in FastAPI
@app.post("/webhook")
async def webhook(payload: dict):
    if payload.get("event") == "message.received":
        data = payload.get("data", {})
        print(f"Message from {data.get('sender')}: {data.get('text')}")
        if data.get("has_media") and data.get("media"):
            print(f"Media URL: {data['media'].get('url')}")
    return {"status": "success"}`,
    go: `// Incoming Message Handler in Go
func handler(w http.ResponseWriter, r *http.Request) {
    var payload map[string]any
    _ = json.NewDecoder(r.Body).Decode(&payload)
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"success"}\`))
}`,
  },
  responses: [
    {
      status: 200,
      statusText: "OK",
      description: "Mandatory HTTP acknowledgment response required from your server to confirm successful event receipt.",
      json: `{\\n  "status": "success",\\n  "received": true\\n}`,
      attributes: [
        {
          name: "status",
          type: "string",
          description: "Receipt acknowledgment status indicator.",
        },
      ],
    },
  ],
};

// Backward-compatibility alias for the old route /docs/webhooks/events
export const webhooksEventsDoc: EndpointDoc = {
  ...webhooksReceivedDoc,
  id: "webhooks-events",
  slug: "webhooks/events",
  title: "Webhook Events Catalog: message.received",
};

// ==========================================
// 2. EVENT: message.ack
// ==========================================
export const webhooksAckDoc: EndpointDoc = {
  type: "endpoint",
  id: "webhook-event-ack",
  slug: "webhooks/events/message-ack",
  title: "Webhook Event: message.ack",
  description:
    "JSON payload schema dispatched when outbound message delivery receipts update on WhatsApp (Sent to Server, Delivered to Recipient Phone, or Read / Blue Checkmark).",
  category: "Webhooks",
  categorySlug: "webhooks",
  method: "POST",
  path: "/your-configured-webhook-url",
  badge: "Delivery Receipt",
  bannerNotice: {
    type: "info",
    title: "Checkmark Tracking",
    content:
      "Use this event to synchronize delivery statuses in your CRM or database. Status codes correspond to WhatsApp protocol checkmarks (1 = Sent, 2 = Delivered / Double Grey Tick, 3 = Read / Double Blue Tick, 4 = Audio Played).",
  },
  headers: [
    {
      key: "Content-Type",
      value: "application/json",
      required: true,
      description: "Payload format encoded in UTF-8 JSON.",
    },
    {
      key: "X-Wahide-Secret",
      value: "whsec_live_...",
      required: true,
      description: "Official authentication header containing your Tenant or Device Webhook Secret.",
    },
    {
      key: "User-Agent",
      value: "Wahide-WhatsApp-Webhook-Engine/2.0",
      required: true,
      description: "Official User-Agent identity of the Wahide Webhook Engine.",
    },
  ],
  parameters: [
    {
      name: "event",
      type: "string",
      required: true,
      description: "Event identifier. Value is always 'message.ack'.",
      example: "message.ack",
    },
    {
      name: "device_id",
      type: "string",
      required: true,
      description: "Unique WhatsApp device slot ID that reported the delivery receipt.",
      example: "01JPLAN0000000000000000001",
    },
    {
      name: "timestamp",
      type: "integer",
      required: true,
      description: "Unix epoch timestamp in seconds when the receipt was processed.",
      example: "1725845015",
    },
    {
      name: "data",
      type: "object",
      required: true,
      description: "Container object holding delivery acknowledgment metadata.",
    },
    {
      name: "data.message_id",
      type: "string",
      required: true,
      description: "Unique WhatsApp message ID corresponding to the sent message.",
      example: "3EB0A1B2C3D4E5F6",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.chat_jid",
      type: "string",
      required: true,
      description: "WhatsApp Jabber ID of the destination chat.",
      example: "6281234567890@s.whatsapp.net",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.recipient",
      type: "string",
      required: true,
      description: "Normalized phone number of the recipient in E.164 format.",
      example: "6281234567890",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.status",
      type: "string",
      required: true,
      description: "Human-readable delivery receipt status: 'sent', 'delivered', 'read', or 'played'.",
      example: "read",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.status_code",
      type: "integer",
      required: true,
      description: "Numeric receipt code: 1 (Sent to Server), 2 (Delivered / Double Grey Tick), 3 (Read / Double Blue Tick), 4 (Audio Played).",
      example: "3",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.timestamp",
      type: "integer",
      required: true,
      description: "Unix timestamp when the receipt state was triggered on recipient device.",
      example: "1725845014",
      depth: 1,
      parent: "data",
    },
  ],
  snippets: {
    curl: `curl -X POST https://api.your-business.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210" \\
  -d '{
    "event": "message.ack",
    "device_id": "01JPLAN0000000000000000001",
    "timestamp": 1725845015,
    "data": {
      "message_id": "3EB0A1B2C3D4E5F6",
      "chat_jid": "6281234567890@s.whatsapp.net",
      "recipient": "6281234567890",
      "status": "read",
      "status_code": 3,
      "timestamp": 1725845014
    }
  }'`,
    nodejs: `// Delivery Receipt (ACK) Handler in Express.js
app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  if (event === 'message.ack') {
    console.log(\`Message \${data.message_id} to \${data.recipient} is now: \${data.status} (code \${data.status_code})\`);
  }
  res.status(200).json({ received: true });
});`,
    php: `// Delivery Receipt (ACK) Handler in PHP
\$payload = json_decode(file_get_contents('php://input'), true);
if (\$payload['event'] === 'message.ack') {
    \$msgId = \$payload['data']['message_id'];
    \$status = \$payload['data']['status']; // sent, delivered, read
}
http_response_code(200);
echo json_encode(['status' => 'success']);`,
    python: `# Delivery Receipt (ACK) Handler in FastAPI
@app.post("/webhook")
async def handle_ack(payload: dict):
    if payload.get("event") == "message.ack":
        data = payload.get("data", {})
        print(f"Message {data.get('message_id')} status updated to {data.get('status')}")
    return {"status": "success"}`,
    go: `// Delivery Receipt (ACK) Handler in Go
func handleAck(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"success"}\`))
}`,
  },
  responses: [
    {
      status: 200,
      statusText: "OK",
      description: "Acknowledgment response confirming receipt of the delivery status update.",
      json: `{\\n  "status": "success",\\n  "acknowledged": true\\n}`,
      attributes: [
        {
          name: "status",
          type: "string",
          description: "Status acknowledgment.",
        },
      ],
    },
  ],
};

// ==========================================
// 3. EVENT: message.sent
// ==========================================
export const webhooksSentDoc: EndpointDoc = {
  type: "endpoint",
  id: "webhook-event-sent",
  slug: "webhooks/events/message-sent",
  title: "Webhook Event: message.sent",
  description:
    "JSON payload schema dispatched immediately when an outbound message initiated via API is successfully transferred by your device to WhatsApp servers.",
  category: "Webhooks",
  categorySlug: "webhooks",
  method: "POST",
  path: "/your-configured-webhook-url",
  badge: "Outbound Sent",
  bannerNotice: {
    type: "info",
    title: "Outbound Dispatch Verification",
    content:
      "This event confirms that your WhatsApp device hardware processed the send command and successfully handed the message over to Meta WhatsApp edge servers.",
  },
  headers: [
    {
      key: "Content-Type",
      value: "application/json",
      required: true,
      description: "Payload format encoded in UTF-8 JSON.",
    },
    {
      key: "X-Wahide-Secret",
      value: "whsec_live_...",
      required: true,
      description: "Official authentication header containing your Tenant or Device Webhook Secret.",
    },
  ],
  parameters: [
    {
      name: "event",
      type: "string",
      required: true,
      description: "Event identifier. Value is always 'message.sent'.",
      example: "message.sent",
    },
    {
      name: "device_id",
      type: "string",
      required: true,
      description: "Unique WhatsApp device slot ID that dispatched the message.",
      example: "01JPLAN0000000000000000001",
    },
    {
      name: "timestamp",
      type: "integer",
      required: true,
      description: "Unix epoch timestamp in seconds when the message was dispatched.",
      example: "1725845010",
    },
    {
      name: "data",
      type: "object",
      required: true,
      description: "Container object holding outbound dispatch details.",
    },
    {
      name: "data.message_id",
      type: "string",
      required: true,
      description: "WhatsApp message identifier assigned to the sent message.",
      example: "3EB0F9E8D7C6B5A4",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.recipient",
      type: "string",
      required: true,
      description: "Destination phone number in E.164 format.",
      example: "6289876543210",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.recipient_jid",
      type: "string",
      required: true,
      description: "Destination WhatsApp Jabber ID.",
      example: "6289876543210@s.whatsapp.net",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.text",
      type: "string",
      required: true,
      description: "Text content of the dispatched message.",
      example: "Halo, pesanan Anda #INV-1029 sedang diproses.",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.status",
      type: "string",
      required: true,
      description: "Status of the dispatch: 'sent'.",
      example: "sent",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.timestamp",
      type: "integer",
      required: true,
      description: "Unix epoch timestamp when sent.",
      example: "1725845009",
      depth: 1,
      parent: "data",
    },
  ],
  snippets: {
    curl: `curl -X POST https://api.your-business.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210" \\
  -d '{
    "event": "message.sent",
    "device_id": "01JPLAN0000000000000000001",
    "timestamp": 1725845010,
    "data": {
      "message_id": "3EB0F9E8D7C6B5A4",
      "recipient": "6289876543210",
      "recipient_jid": "6289876543210@s.whatsapp.net",
      "text": "Halo, pesanan Anda #INV-1029 sedang diproses.",
      "status": "sent",
      "timestamp": 1725845009
    }
  }'`,
    nodejs: `// Outbound Sent Handler in Express.js
app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  if (event === 'message.sent') {
    console.log(\`Message \${data.message_id} sent to \${data.recipient}\`);
  }
  res.status(200).json({ received: true });
});`,
    php: `// Outbound Sent Handler in PHP
\$payload = json_decode(file_get_contents('php://input'), true);
if (\$payload['event'] === 'message.sent') {
    \$msgId = \$payload['data']['message_id'];
    \$to = \$payload['data']['recipient'];
}
http_response_code(200);
echo json_encode(['status' => 'success']);`,
    python: `# Outbound Sent Handler in FastAPI
@app.post("/webhook")
async def handle_sent(payload: dict):
    if payload.get("event") == "message.sent":
        data = payload.get("data", {})
        print(f"Message {data.get('message_id')} dispatched to {data.get('recipient')}")
    return {"status": "success"}`,
    go: `// Outbound Sent Handler in Go
func handleSent(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"success"}\`))
}`,
  },
  responses: [
    {
      status: 200,
      statusText: "OK",
      description: "Acknowledgment confirming receipt of the outbound sent event.",
      json: `{\\n  "status": "success"\\n}`,
    },
  ],
};

// ==========================================
// 4. EVENT: device.status
// ==========================================
export const webhooksStatusDoc: EndpointDoc = {
  type: "endpoint",
  id: "webhook-event-status",
  slug: "webhooks/events/device-status",
  title: "Webhook Event: device.status",
  description:
    "JSON payload schema dispatched when the connection state of a WhatsApp device changes (Online, Offline, Hibernated, Logged Out, or Cooldown).",
  category: "Webhooks",
  categorySlug: "webhooks",
  method: "POST",
  path: "/your-configured-webhook-url",
  badge: "Device Lifecycle",
  bannerNotice: {
    type: "info",
    title: "Operational Health Monitoring",
    content:
      "Listen to this event to trigger instant alerts (via Slack, Telegram, or SMS) when a WhatsApp business line drops offline, allowing immediate troubleshooting before customer SLA is breached.",
  },
  headers: [
    {
      key: "Content-Type",
      value: "application/json",
      required: true,
      description: "Payload format encoded in UTF-8 JSON.",
    },
    {
      key: "X-Wahide-Secret",
      value: "whsec_live_...",
      required: true,
      description: "Official authentication header containing your Tenant or Device Webhook Secret.",
    },
  ],
  parameters: [
    {
      name: "event",
      type: "string",
      required: true,
      description: "Event identifier. Value is always 'device.status'.",
      example: "device.status",
    },
    {
      name: "device_id",
      type: "string",
      required: true,
      description: "Unique WhatsApp device slot ID in Wahide.",
      example: "01JPLAN0000000000000000001",
    },
    {
      name: "timestamp",
      type: "integer",
      required: true,
      description: "Unix epoch timestamp in seconds when the state transition occurred.",
      example: "1725845100",
    },
    {
      name: "data",
      type: "object",
      required: true,
      description: "Container object holding device health and connection status.",
    },
    {
      name: "data.device_name",
      type: "string",
      required: true,
      description: "Descriptive label assigned to this device in the dashboard.",
      example: "Customer Service CS-1",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.phone",
      type: "string",
      required: true,
      description: "WhatsApp phone number associated with the device session.",
      example: "6281234567890",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.status",
      type: "string",
      required: true,
      description: "New connection state: 'ONLINE', 'OFFLINE', 'HIBERNATED', 'LOGGED_OUT', or 'COOLDOWN'.",
      example: "OFFLINE",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.reason",
      type: "string",
      required: true,
      description: "Detailed operational reason for the status change.",
      example: "Device was logged out from WhatsApp mobile application.",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.heat_score",
      type: "integer",
      required: false,
      description: "Real-time anti-ban heat score (0 to 100). Scores above 80 trigger automated safety throttling.",
      example: "15",
      depth: 1,
      parent: "data",
    },
  ],
  snippets: {
    curl: `curl -X POST https://api.your-business.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210" \\
  -d '{
    "event": "device.status",
    "device_id": "01JPLAN0000000000000000001",
    "timestamp": 1725845100,
    "data": {
      "device_name": "Customer Service CS-1",
      "phone": "6281234567890",
      "status": "OFFLINE",
      "reason": "Device was logged out from WhatsApp mobile application.",
      "heat_score": 15
    }
  }'`,
    nodejs: `// Device Health & Offline Alert in Express.js
app.post('/webhook', (req, res) => {
  const { event, device_id, data } = req.body;
  if (event === 'device.status') {
    console.log(\`Device [\${device_id}] state: \${data.status} (\${data.reason})\`);
  }
  res.status(200).json({ received: true });
});`,
    php: `// Device Health Monitoring in PHP
\$payload = json_decode(file_get_contents('php://input'), true);
if (\$payload['event'] === 'device.status') {
    \$status = \$payload['data']['status'];
    \$phone = \$payload['data']['phone'];
}
http_response_code(200);
echo json_encode(['status' => 'success']);`,
    python: `# Device Health Monitoring in FastAPI
@app.post("/webhook")
async def handle_device_status(payload: dict):
    if payload.get("event") == "device.status":
        data = payload.get("data", {})
        print(f"Device {data.get('phone')} changed status to {data.get('status')}")
    return {"status": "success"}`,
    go: `// Device Health Monitoring in Go
func handleDeviceStatus(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"success"}\`))
}`,
  },
  responses: [
    {
      status: 200,
      statusText: "OK",
      description: "Acknowledgment response confirming receipt of device status event.",
      json: `{\\n  "status": "success"\\n}`,
    },
  ],
};

// ==========================================
// 5. EVENT: device.qr
// ==========================================
export const webhooksQrDoc: EndpointDoc = {
  type: "endpoint",
  id: "webhook-event-qr",
  slug: "webhooks/events/device-qr",
  title: "Webhook Event: device.qr",
  description:
    "JSON payload schema dispatched in real-time with updated pairing QR code strings and Base64 images for custom client-side authentication screens.",
  category: "Webhooks",
  categorySlug: "webhooks",
  method: "POST",
  path: "/your-configured-webhook-url",
  badge: "Pairing Stream",
  bannerNotice: {
    type: "info",
    title: "Headless WhatsApp Pairing",
    content:
      "Use this event if you are building your own white-labeled dashboard or custom frontend. As soon as a user starts pairing, Wahide streams the raw QR code and Base64 image directly to your webhook so you can render it on your screen in real time.",
  },
  headers: [
    {
      key: "Content-Type",
      value: "application/json",
      required: true,
      description: "Payload format encoded in UTF-8 JSON.",
    },
    {
      key: "X-Wahide-Secret",
      value: "whsec_live_...",
      required: true,
      description: "Official authentication header containing your Tenant or Device Webhook Secret.",
    },
  ],
  parameters: [
    {
      name: "event",
      type: "string",
      required: true,
      description: "Event identifier. Value is always 'device.qr'.",
      example: "device.qr",
    },
    {
      name: "device_id",
      type: "string",
      required: true,
      description: "Unique WhatsApp device slot ID being paired.",
      example: "01JPLAN0000000000000000001",
    },
    {
      name: "timestamp",
      type: "integer",
      required: true,
      description: "Unix epoch timestamp in seconds when the QR code frame was generated.",
      example: "1725845000",
    },
    {
      name: "data",
      type: "object",
      required: true,
      description: "Container object holding raw QR string and image URI.",
    },
    {
      name: "data.qr_code",
      type: "string",
      required: true,
      description: "Raw WhatsApp pairing string payload suitable for rendering with qrcode.js / react-qr-code.",
      example: "2@XYZ123ABC456...==,DEF789...==,GHI012...==",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.qr_image_url",
      type: "string",
      required: true,
      description: "Base64 encoded Data URI image (data:image/png;base64,...) ready for direct <img src=...> rendering.",
      example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.attempt",
      type: "integer",
      required: true,
      description: "Pairing QR regeneration attempt count (1 to 5).",
      example: "1",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.expires_in",
      type: "integer",
      required: true,
      description: "Validity lifetime of this QR code in seconds before a refresh frame is dispatched (typically 20 seconds).",
      example: "20",
      depth: 1,
      parent: "data",
    },
  ],
  snippets: {
    curl: `curl -X POST https://api.your-business.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210" \\
  -d '{
    "event": "device.qr",
    "device_id": "01JPLAN0000000000000000001",
    "timestamp": 1725845000,
    "data": {
      "qr_code": "2@XYZ123ABC456...==,DEF789...==,GHI012...==",
      "qr_image_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "attempt": 1,
      "expires_in": 20
    }
  }'`,
    nodejs: `// Headless QR Streaming Handler via WebSocket/SSE to User Browser
app.post('/webhook', (req, res) => {
  const { event, device_id, data } = req.body;
  if (event === 'device.qr') {
    // Broadcast Base64 QR code image to client browser via Socket.io / WebSocket
    io.to(device_id).emit('qr_update', {
      imageUrl: data.qr_image_url,
      expiresIn: data.expires_in,
      attempt: data.attempt
    });
  }
  res.status(200).json({ received: true });
});`,
    php: `// QR Webhook in PHP
\$payload = json_decode(file_get_contents('php://input'), true);
if (\$payload['event'] === 'device.qr') {
    \$qrImage = \$payload['data']['qr_image_url'];
}
http_response_code(200);
echo json_encode(['status' => 'success']);`,
    python: `# QR Streaming in FastAPI
@app.post("/webhook")
async def handle_qr(payload: dict):
    if payload.get("event") == "device.qr":
        data = payload.get("data", {})
        print(f"New QR Code generated, attempt {data.get('attempt')}")
    return {"status": "success"}`,
    go: `// QR Streaming Handler in Go
func handleQR(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"success"}\`))
}`,
  },
  responses: [
    {
      status: 200,
      statusText: "OK",
      description: "Acknowledgment response confirming receipt of the QR stream frame.",
      json: `{\\n  "status": "success"\\n}`,
    },
  ],
};
