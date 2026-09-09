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
      "The Wahide Webhook Engine automatically streams incoming 1-on-1 WhatsApp messages directly to your backend endpoint in high-speed, zero-heap JSON format.",
  },
  sections: [
    {
      id: "architecture",
      title: "1. How Wahide Webhooks Work",
      content:
        "When a customer sends a WhatsApp message to your connected business number, the Wahide engine immediately processes the event through a resilient, event-driven pipeline:\n\n1. **Zero-Heap Event Filtering**: Unnecessary noisy events (groups, stories, channel newsletters) are filtered out to protect your server from overload.\n2. **Standardized JSON Envelope**: The message text, sender details, phone number, and timestamp are packaged into a structured schema.\n3. **Asynchronous HTTP POST Delivery**: Wahide dispatches an HTTP POST request to the webhook URL configured in your dashboard.\n4. **Instant Acknowledgment**: Your server acknowledges receipt by returning an HTTP `200 OK` response within 8 seconds.",
      callout: {
        type: "tip",
        title: "Public HTTPS Endpoint Required",
        content:
          "Your webhook URL must be publicly accessible over valid HTTPS. For local development, use tunneling solutions such as Ngrok or Cloudflare Tunnels.",
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
X-Wahide-Secret: whsec_live_9f8e7d6c5b4a3210fedcba9876543210`,
      },
      callout: {
        type: "warning",
        title: "Mandatory Server Validation",
        content:
          "Always verify that the secret key in the \`X-Wahide-Secret\` header matches your configured Webhook Secret before processing payloads.",
      },
    },
    {
      id: "retry-policy",
      title: "3. Automatic Retry Policy & Dead Letter Queue (DLQ)",
      content:
        "If your endpoint is temporarily unreachable, responds with 5xx errors, or times out (> 8 seconds), Wahide employs enterprise-grade delivery resilience:\n\n- **Jittered Exponential Backoff**: Retries are attempted up to **5 times** with increasing intervals (3s, 6s, 12s, 24s, 48s plus random jitter to avoid thundering-herd issues).\n- **Dead Letter Queue (DLQ)**: If all 5 attempts fail, the failed event is preserved in the in-memory DLQ, allowing you to inspect error diagnostics or replay dispatches from the dashboard.",
    },
    {
      id: "code-examples",
      title: "4. Receiver Server Implementation (Code Examples)",
      content:
        "Select your backend language below to view a production-ready webhook receiver boilerplate featuring header verification and instant HTTP 200 OK acknowledgments. You can also run the cURL command to simulate an incoming webhook payload locally.",
      codeTabsTitle: "Webhook Receiver Boilerplate & Simulation",
      codeTabs: {
        curl: `curl -X POST "http://localhost:3000/api/webhook/whatsapp" \\
  -H "Content-Type: application/json" \\
  -H "X-Wahide-Secret: wh_sec_9f8e7d6c5b4a3210fedcba9876543210" \\
  -d '{
    "event": "message.received",
    "device_id": "c1f76e5d-8b22-4211-9a11-87265143a123",
    "timestamp": 1711200000,
    "data": {
      "message_id": "3EB0ABC123456789DEF0",
      "sender": "6281234567890@s.whatsapp.net",
      "push_name": "Budi Santoso",
      "text": "Hello admin, is this product in stock?"
    }
  }'`,
        nodejs: `const express = require('express');
const app = express();
app.use(express.json());

const WAHIDE_SECRET = process.env.WAHIDE_WEBHOOK_SECRET || "wh_sec_your_secret_here";

app.post('/api/webhook/whatsapp', (req, res) => {
  const incomingSecret = req.headers['x-wahide-secret'];
  
  // 1. Verify X-Wahide-Secret Header Security
  if (!incomingSecret || incomingSecret !== WAHIDE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Invalid X-Wahide-Secret Header' });
  }

  const { event, device_id, data } = req.body;

  // 2. Handle Incoming Message Event
  if (event === 'message.received') {
    console.log(\`[Incoming Message] From: \${data.sender} (\${data.push_name}): \${data.text}\`);
    // TODO: Execute business logic (Auto-reply, CRM storage, CS notification)
  }

  // 3. Fast HTTP 200 OK Response (< 8 seconds)
  return res.status(200).json({ status: 'success', received: true });
});

app.listen(3000, () => console.log('Webhook server ready on port 3000'));`,
        php: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;

class WhatsAppWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $secret = config('services.wahide.webhook_secret');
        $incomingSecret = $request->header('X-Wahide-Secret', '');

        // 1. Verify Secret Key via X-Wahide-Secret Header
        if ($incomingSecret !== $secret) {
            return response()->json(['error' => 'Unauthorized: Invalid X-Wahide-Secret Header'], 401);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'message.received') {
            Log::info("Incoming message from {$data['sender']}: {$data['text']}");
            // TODO: Dispatch Job or persist to CRM database
        }

        // 2. Return 200 OK immediately (< 8s)
        return response()->json(['status' => 'success']);
    }
}`,
        python: `from fastapi import FastAPI, Header, HTTPException, status
from pydantic import BaseModel
import os

app = FastAPI()
WAHIDE_SECRET = os.getenv("WAHIDE_WEBHOOK_SECRET", "wh_sec_your_secret_here")

class WebhookPayload(BaseModel):
    event: str
    device_id: str
    timestamp: int
    data: dict

@app.post("/api/webhook/whatsapp")
async def receive_whatsapp_webhook(
    payload: WebhookPayload,
    x_wahide_secret: str = Header(None, alias="X-Wahide-Secret")
):
    # 1. Verify X-Wahide-Secret Header Security
    if not x_wahide_secret or x_wahide_secret != WAHIDE_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid X-Wahide-Secret Header"
        )

    # 2. Process Event
    if payload.event == "message.received":
        sender = payload.data.get("sender")
        text = payload.data.get("text")
        print(f"Message from {sender}: {text}")

    # 3. Return Fast 200 OK Response
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
		http.Error(w, "Unauthorized: Invalid X-Wahide-Secret Header", http.StatusUnauthorized)
		return
	}

	var payload WebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if payload.Event == "message.received" {
		fmt.Printf("Incoming WhatsApp message from %v: %v\\n", payload.Data["sender"], payload.Data["text"])
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

export const webhooksEventsDoc: EndpointDoc = {
  type: "endpoint",
  id: "webhooks-events",
  slug: "webhooks/events",
  title: "Webhook Event: message.received",
  description:
    "JSON payload schema dispatched by Wahide to your destination server whenever an incoming WhatsApp message is received by your device.",
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
      description: "Official authentication header containing your Tenant Webhook Secret for signature verification.",
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
      example: "dev_01HV2A4F...",
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
      description: "Text body content of the conversation message sent by the customer.",
      example: "Hello admin, I would like to inquire about the Wahide subscription plan.",
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
  -H "X-Wahide-Secret: wh_sec_9f8e7d6c5b4a3210fedcba9876543210" \\
  -H "User-Agent: Wahide-WhatsApp-Webhook-Engine/2.0" \\
  -d '{
    "event": "message.received",
    "device_id": "dev_01HV2A4F...",
    "timestamp": 1725845000,
    "data": {
      "message_id": "3EB0A1B2C3D4E5F6",
      "sender": "6281234567890",
      "sender_jid": "6281234567890@s.whatsapp.net",
      "push_name": "Budi Santoso",
      "text": "Hello admin, I would like to inquire about the Wahide subscription plan.",
      "timestamp": 1725844998
    }
  }'`,
    nodejs: `// Incoming Webhook Event sample in Express handler
app.post('/webhook', (req, res) => {
  const { event, device_id, data } = req.body;
  console.log("Received event:", event);
  console.log("Sender:", data.sender, "Message:", data.text);
  res.status(200).json({ received: true });
});`,
    php: `// Incoming Webhook Event sample in PHP
$payload = json_decode(file_get_contents('php://input'), true);
if ($payload['event'] === 'message.received') {
    $sender = $payload['data']['sender'];
    $text = $payload['data']['text'];
}
http_response_code(200);
echo json_encode(['status' => 'success']);`,
    python: `// Incoming Webhook Event sample in FastAPI
@app.post("/webhook")
async def webhook(payload: dict):
    if payload.get("event") == "message.received":
        data = payload.get("data", {})
        print("Received text:", data.get("text"))
    return {"status": "success"}`,
    go: `// Incoming Webhook Event sample in Go Net/HTTP
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
      description:
        "Mandatory HTTP acknowledgment response required from your server to confirm successful event delivery.",
      json: `{
  "status": "success",
  "received": true
}`,
      attributes: [
        {
          name: "status",
          type: "string",
          description: "Delivery receipt confirmation status acknowledgment.",
        },
      ],
    },
  ],
};
