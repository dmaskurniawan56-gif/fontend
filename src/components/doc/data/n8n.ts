import { GuideDoc } from "../types";

export const n8nDoc: GuideDoc = {
  type: "guide",
  id: "webhooks-n8n",
  slug: "webhooks/n8n",
  title: "n8n & AI Bot Integration (Zero-Timeout)",
  description:
    "Architectural best-practice guide for connecting Wahide WhatsApp Webhooks with n8n and AI Agents (OpenAI, Claude, Gemini) without HTTP timeout errors or duplicate message executions.",
  category: "Webhooks",
  categorySlug: "webhooks",
  bannerNotice: {
    type: "info",
    title: "Enterprise-Grade Decoupled Asynchronous Pattern",
    content:
      "A Webhook is a one-way event notification. By configuring your n8n Webhook node to 'Immediately (200 OK)', the Wahide server receives an instant acknowledgment receipt (< 50ms), allowing downstream AI nodes to think freely in the background with zero time constraints.",
  },
  sections: [
    {
      id: "architecture-overview",
      title: "1. Why Decoupled Asynchronous Architecture is Mandatory",
      content:
        "When connecting WhatsApp to Large Language Models (LLMs), model inference via OpenAI GPT-4o, Anthropic Claude, or Google Gemini typically takes **10 to 30 seconds** to formulate a thoughtful response.\n\nIf the n8n Webhook node is configured in synchronous mode (*Respond: When Last Node Finishes*):\n1. n8n holds the HTTP response socket open for 15–30 seconds waiting for the AI agent to finish.\n2. The Wahide HTTP client has a 15-second timeout limit. Failing to receive an acknowledgment within 15 seconds, Wahide considers the delivery failed (*Context Deadline Exceeded*).\n3. Wahide's *Exponential Backoff* retry engine re-dispatches the webhook up to 5 times, triggering an expensive duplicate AI loop that wastes AI tokens and spams your customer with repeated messages.\n\n### The Solution: Decoupled Asynchronous Pattern\nWahide **never reads the AI response text from the webhook HTTP response body**. Wahide only expects a clean `200 OK` acknowledgment receipt. The generated AI response must be dispatched separately via an outbound call to the Wahide Send Message API (`POST /messages/send`).",
    },
    {
      id: "sync-vs-async-table",
      title: "2. Synchronous vs. Asynchronous Decoupled Comparison",
      content:
        "The following table highlights the performance and reliability differences between both integration patterns in n8n:\n\n| Technical Aspect | ❌ Synchronous Pattern (When Last Node Finishes) | ✅ Decoupled Asynchronous Pattern (Immediately 200 OK) |\n|---|---|---|\n| **Webhook Response Time** | 15–30 seconds (holds socket waiting for AI) | **< 50 milliseconds** (instant receipt) |\n| **Wahide Timeout Risk** | **High** (connection terminated at 15s) | **Zero (0%)** (acknowledged within 0.1s) |\n| **Duplicate Retry Risk** | **High** (triggers up to 5 duplicate runs) | **Zero (0%)** (zero false retries) |\n| **AI Thinking Time Budget** | Strictly limited (< 15 seconds) | **Unlimited** (free to run 30s, 60s, etc.) |\n| **AI Token Consumption** | Wasteful (re-executes prompts repeatedly) | **Predictable & Controlled** (1 chat = 1 execution) |",
      callout: {
        type: "tip",
        title: "Mandatory n8n Webhook Configuration Rule",
        content:
          "In the n8n Webhook node, always select: 'Respond: Immediately' with Response Code 200. Never use 'When Last Node Finishes' for AI automation workflows.",
      },
    },
    {
      id: "step-by-step-guide",
      title: "3. Step-by-Step n8n Workflow Configuration",
      content: `Follow these steps to wire the 3 core nodes in n8n for an automated WhatsApp AI Chatbot:

### Node 1: Inbound Webhook (Wahide)
- **HTTP Method**: \`POST\`
- **Path**: \`wahide-inbound\`
- **Authentication**: \`Header Auth\`
  - Header Name: \`X-Wahide-Secret\`
  - Header Value: Enter your Webhook Secret from the Wahide Dashboard (\`whsec_live_...\`)
- **Response Mode**: \`Immediately\` (Response Code: \`200\`)
- **Response Data**: \`{"status": "success", "received": true}\`

### Node 2: AI Agent (OpenAI / Claude / Gemini)
- Connect the output of the Webhook Node to your AI Agent node.
- Extract the customer's text message: \`{{ $json.body.data.text }}\`.
- Extract the customer's display name: \`{{ $json.body.data.push_name }}\`.
- Set a clear System Prompt, for example: *"You are an official customer support AI assistant. Respond warmly, concisely, and helpfully."*

### Node 3: Outbound HTTP Request (Wahide API)
- Connect the output of the AI Agent to an **HTTP Request** node to send the reply back to the customer:
- **Method**: \`POST\`
- **URL**: \`https://api.wahide.com/api/v1/messages/send\`
- **Headers**:
  - \`Authorization\`: \`Bearer YOUR_WAHIDE_API_KEY\`
  - \`Content-Type\`: \`application/json\`
- **Body (JSON)**:
\`\`\`json
{
  "device_id": "{{ $('Wahide Webhook Inbound').item.json.body.device_id }}",
  "phone": "{{ $('Wahide Webhook Inbound').item.json.body.data.sender }}",
  "message": "{{ $json.output }}"
}
\`\`\``,
      callout: {
        type: "tip",
        title: "Use Tenant Webhook (Workspace), Not Device Webhook",
        content:
          "Simply configure your n8n URL under **Settings (/settings) → Webhook Integration** and leave the webhook fields in /devices empty. In n8n, a single Webhook Node handles messages from all your WhatsApp numbers because the originating device slot is automatically provided in `{{ $json.body.device_id }}`.",
      },
    },
    {
      id: "ready-to-import-json",
      title: "4. Production-Ready Workflow JSON Template (1-Click Import)",
      content:
        "You can copy the entire JSON snippet below and paste it directly (*Ctrl+V* / *Cmd+V*) onto your n8n workflow canvas:",
      code: {
        language: "json",
        title: "n8n Template: WhatsApp AI Customer Service Bot (Zero-Timeout)",
        content: `{
  "name": "Wahide WhatsApp AI Customer Support Bot (Zero-Timeout)",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "wahide-inbound",
        "responseMode": "onReceived",
        "responseData": "{\\\"status\\\":\\\"success\\\",\\\"received\\\":true}",
        "options": {}
      },
      "id": "wahide-webhook-node",
      "name": "Wahide Webhook Inbound",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=Customer: {{ $json.body.data.push_name }} ({{ $json.body.data.sender }})\\nMessage: {{ $json.body.data.text }}",
        "options": {
          "systemMessage": "You are an official WhatsApp virtual customer assistant. Answer questions concisely, politely, and helpfully."
        }
      },
      "id": "ai-agent-node",
      "name": "AI Assistant (OpenAI / Claude)",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [540, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.wahide.com/api/v1/messages/send",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer hide_live_your_api_key_here"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\\n  \\\"device_id\\\": \\\"{{ $('Wahide Webhook Inbound').item.json.body.device_id }}\\\",\\n  \\\"phone\\\": \\\"{{ $('Wahide Webhook Inbound').item.json.body.data.sender }}\\\",\\n  \\\"message\\\": \\\"{{ $json.output }}\\\"\\n}",
        "options": {}
      },
      "id": "wahide-outbound-api",
      "name": "Send Reply via Wahide API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [840, 300]
    }
  ],
  "connections": {
    "Wahide Webhook Inbound": {
      "main": [
        [
          {
            "node": "AI Assistant (OpenAI / Claude)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Assistant (OpenAI / Claude)": {
      "main": [
        [
          {
            "node": "Send Reply via Wahide API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`,
      },
    },
    {
      id: "troubleshooting-n8n",
      title: "5. Troubleshooting & Local Development Tips",
      content:
        "### A. Testing n8n on Localhost\nIf your n8n instance runs locally on your computer (`http://localhost:5678`), Wahide cannot dispatch webhooks to a private `localhost` address directly. Use one of the following free public tunneling tools:\n- **Cloudflare Tunnel (`cloudflared`)**: `cloudflared tunnel --url http://localhost:5678`\n- **Ngrok**: `ngrok http 5678`\nCopy the resulting public HTTPS URL (e.g., `https://xyz.ngrok-free.app/webhook/wahide-inbound`) into your Wahide webhook settings.\n\n### B. Idempotency Verification (Preventing Duplicate Executions)\nWahide automatically attaches the `X-Wahide-Delivery-ID` header to every webhook request. If you use a cache/Redis node in n8n, you can store this ID for 5 minutes to ensure no incoming message is processed more than once.",
      callout: {
        type: "info",
        title: "Cloudflare R2 Media Protection",
        content:
          "When a customer sends photos or PDF documents, Wahide automatically offloads the media to Cloudflare R2 and provides a lightweight public URL at `data.media.url`. Your n8n server avoids Out of Memory (OOM) errors because it never needs to handle raw binary streams directly.",
      },
    },
  ],
};
