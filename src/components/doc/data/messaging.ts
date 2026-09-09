import { EndpointDoc } from "../types";

export const messagingEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "messaging-send-text",
    slug: "messaging/send-text",
    title: "Send Text Messages",
    description:
      "Dispatches an instant WhatsApp text message to a single recipient phone number with automatic typing simulation, Spintax variation, and smart device rotation.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    badge: "Popular",
    bannerNotice: {
      type: "success",
      title: "Automatic Device Rotation & Delivery Dynamics",
      content:
        "Includes automated typing presence simulation, device warmup pacing, and automatic round-robin fallback across active devices.",
    },
    headers: [
      {
        key: "Authorization",
        value: "Bearer <your_api_key>",
        required: true,
        description: "Your secret Wahide API Key prefixed with Bearer.",
      },
      {
        key: "Content-Type",
        value: "application/json",
        required: true,
        description: "Must be set to application/json.",
      },
    ],
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description:
          "Target recipient phone number in international E.164 format without spaces, dashes, or leading plus. Example: 628123456789.",
        example: "628123456789",
      },
      {
        name: "message",
        type: "string",
        required: true,
        description:
          "Text message body to send. Supports full UTF-8 emojis, WhatsApp bold (*bold*), italic (_italic_), strikethrough (~strike~), monospace (```code```), and Spintax format `{Hello|Hi|Greetings}`.",
        example:
          "Hello from Wahide WhatsApp API! Your verification code is 884920.",
      },
      {
        name: "device_id",
        type: "string",
        required: false,
        defaultValue: `"auto"`,
        description:
          "Specific WhatsApp Device ID slot to dispatch the message from. If omitted or set to 'auto', the engine uses intelligent round-robin across all connected healthy devices.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
      {
        name: "simulate_typing",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description:
          "When true, broadcasts a natural 'typing...' presence event to WhatsApp for the recipient before dispatching the message, emulating authentic human behavior.",
        example: "true",
      },
      {
        name: "typing_delay_ms",
        type: "integer",
        required: false,
        defaultValue: "0",
        description:
          "Custom typing indicator duration in milliseconds. If 0 or omitted with simulate_typing: true, duration is dynamically calculated based on message length (~40ms per character, clamped between 1,000ms and 5,000ms).",
        example: "2500",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "Hello from Wahide WhatsApp API! Your order #INV-2026 is confirmed.",
    "device_id": "auto",
    "simulate_typing": true,
    "typing_delay_ms": 1500
  }'`,
      nodejs: `import axios from "axios";

const response = await axios.post(
  "https://api.wahide.com/api/v1/wa/messages/send",
  {
    phone: "628123456789",
    message: "Hello from Wahide WhatsApp API! Your order #INV-2026 is confirmed.",
    device_id: "auto",
    simulate_typing: true,
    typing_delay_ms: 1500,
  },
  {
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
  }
);

console.log(response.data);`,
      php: `<?php

$curl = curl_init();

$payload = [
    "phone" => "628123456789",
    "message" => "Hello from Wahide WhatsApp API! Your order #INV-2026 is confirmed.",
    "device_id" => "auto",
    "simulate_typing" => true,
    "typing_delay_ms" => 1500
];

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.com/api/v1/wa/messages/send",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer YOUR_API_KEY",
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/wa/messages/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "phone": "628123456789",
    "message": "Hello from Wahide WhatsApp API! Your order #INV-2026 is confirmed.",
    "device_id": "auto",
    "simulate_typing": True,
    "typing_delay_ms": 1500
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":           "628123456789",
		"message":         "Hello from Wahide WhatsApp API! Your order #INV-2026 is confirmed.",
		"device_id":       "auto",
		"simulate_typing": true,
		"typing_delay_ms": 1500,
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Message successfully queued and dispatched to WhatsApp.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "628123456789",
      "wa_id": "628123456789"
    }
  ],
  "messages": [
    {
      "id": "3EB0A1B2C3D4E5F6"
    }
  ]
}`,
        attributes: [
          {
            name: "messaging_product",
            type: "string",
            description:
              "Identifies the messaging platform. Always returns 'whatsapp'.",
          },
          {
            name: "contacts[].input",
            type: "string",
            description:
              "The original phone number string provided in the request.",
          },
          {
            name: "contacts[].wa_id",
            type: "string",
            description:
              "Normalized international WhatsApp JID identifier without suffixes.",
          },
          {
            name: "messages[].id",
            type: "string",
            description:
              "Unique WhatsApp message ID assigned by WhatsApp servers (e.g., 3EB0...). Can be tracked via webhooks for delivery status.",
          },
        ],
      },
      {
        status: 400,
        statusText: "Bad Request",
        description:
          "Invalid phone number format or missing required payload parameters.",
        json: `{
  "success": false,
  "message": "Invalid recipient phone number format",
  "error": "INVALID_PHONE_NUMBER",
  "additional_info": {
    "field": "phone",
    "expected": "E.164 international format without leading +"
  }
}`,
        attributes: [
          {
            name: "success",
            type: "boolean",
            description: "Always false for non-2xx responses.",
          },
          {
            name: "message",
            type: "string",
            description:
              "Human-readable explanation of why the validation failed.",
          },
          {
            name: "error",
            type: "string",
            description: "Machine-readable standard error code.",
          },
        ],
      },
      {
        status: 401,
        statusText: "Unauthorized",
        description: "Missing or invalid API Key.",
        json: `{
  "success": false,
  "message": "Invalid API Key",
  "error": "UNAUTHORIZED"
}`,
      },
      {
        status: 503,
        statusText: "Service Unavailable",
        description: "Specified WhatsApp device is offline or session expired.",
        json: `{
  "success": false,
  "message": "WhatsApp device session is offline or unlinked",
  "error": "DEVICE_OFFLINE",
  "additional_info": {
    "device_id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
    "solution": "Reconnect or scan QR code in dashboard"
  }
}`,
      },
    ],
    errorMatrix: [
      {
        code: 400,
        error: "INVALID_PHONE_NUMBER",
        description:
          "Phone number contains non-numeric characters, too few digits, or starts with 0.",
        solution:
          "Format phone number to international E.164 (e.g., 628123456789).",
      },
      {
        code: 401,
        error: "UNAUTHORIZED",
        description: "API Key is missing from Authorization header or revoked.",
        solution: "Check Authorization: Bearer <API_KEY> header.",
      },
      {
        code: 429,
        error: "WARMUP_LIMIT_EXCEEDED",
        description:
          "Device is still in warmup period and reached its daily send ceiling.",
        solution:
          "Distribute across older devices or configure round-robin auto rotation.",
      },
      {
        code: 503,
        error: "DEVICE_OFFLINE",
        description: "Target WhatsApp device session disconnected.",
        solution: "Re-pair device using QR code endpoint or dashboard.",
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-round-robin",
    slug: "messaging/send-round-robin",
    title: "Round-Robin Multi-Device Sending",
    description:
      "Automatically load-balances outbound messages across a pool of connected devices to bypass single-number limits, prevent bans, and achieve high delivery throughput.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    badge: "Smart Pool",
    bannerNotice: {
      type: "info",
      title: "Multi-Device Load Distribution",
      content:
        "By setting `device_id: 'auto'` or omitting it, the queue worker dynamically routes messages across healthy connected devices.",
    },
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Target phone number in international E.164 format.",
        example: "628987654321",
      },
      {
        name: "message",
        type: "string",
        required: true,
        description: "Message content.",
        example: "Your daily report is ready to download.",
      },
      {
        name: "device_id",
        type: "string",
        required: false,
        defaultValue: `"auto"`,
        description:
          "Set to 'auto' to trigger round-robin across all active devices in your tenant.",
        example: "auto",
      },
      {
        name: "simulate_typing",
        type: "boolean",
        required: false,
        defaultValue: "true",
        description: "Simulate typing status before sending.",
        example: "true",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628987654321",
    "message": "Your automated report is ready for viewing.",
    "device_id": "auto",
    "simulate_typing": true
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/messages/send", {
  phone: "628987654321",
  message: "Your automated report is ready for viewing.",
  device_id: "auto",
  simulate_typing: true
}, {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
});`,
      php: `<?php
$curl = curl_init();

$payload = [
  "phone" => "628987654321",
  "message" => "Your automated report is ready for viewing.",
  "device_id" => "auto",
  "simulate_typing" => true,
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/messages/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

requests.post(
    "https://api.wahide.com/api/v1/wa/messages/send",
    json={
        "phone": "628987654321",
        "message": "Your automated report is ready for viewing.",
        "device_id": "auto",
        "simulate_typing": True
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":           "628987654321",
		"message":         "Your automated report is ready for viewing.",
		"device_id":       "auto",
		"simulate_typing": true,
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Message dispatched via optimal device from pool.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628987654321", "wa_id": "628987654321" }],
  "messages": [{ "id": "3EB09876543210AB" }]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-spintax",
    slug: "messaging/send-spintax",
    title: "Spintax Dynamic Variation",
    description:
      "Send randomized message variations using standard `{option1|option2|option3}` syntax to make every message unique and prevent WhatsApp anti-spam fingerprinting.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    bannerNotice: {
      type: "success",
      title: "Spintax Evaluation",
      content:
        "The engine evaluates nested Spintax tags server-side before queueing the message into the dispatch stream.",
    },
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Target phone number.",
        example: "628123456789",
      },
      {
        name: "message",
        type: "string",
        required: true,
        description:
          "Spintax formatted message string using `{option1|option2}` syntax.",
        example:
          "{Hello|Hi|Good day} {Kak|Bro}, {thank you for your order|your order has been received}!",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!"
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/messages/send", {
  phone: "628123456789",
  message: "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
}, {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

$payload = [
  "phone" => "628123456789",
  "message" => "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/messages/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/wa/messages/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "message": "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":   "628123456789",
		"message": "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Spintax processed and sent.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628123456789", "wa_id": "628123456789" }],
  "messages": [{ "id": "3EB0FF1122334455" }]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-media",
    slug: "messaging/send-media",
    title: "Send Media / Document",
    description:
      "Send images, PDF invoices, audio recordings, or video clips directly to WhatsApp recipients with optional captions.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    badge: "Media",
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Target phone number in international E.164 format.",
        example: "628123456789",
      },
      {
        name: "media_url",
        type: "string",
        required: true,
        description: "Direct publicly accessible HTTPS URL to the media asset.",
        example: "https://cdn.wahide.com/invoices/INV-2026.pdf",
      },
      {
        name: "caption",
        type: "string",
        required: false,
        description: "Optional text caption accompanying the media file.",
        example: "Here is your invoice for September 2026.",
      },
      {
        name: "filename",
        type: "string",
        required: false,
        description:
          "Custom filename for PDF / document files shown to the recipient.",
        example: "Invoice-September-2026.pdf",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "media_url": "https://cdn.wahide.com/invoices/INV-2026.pdf",
    "caption": "Your official invoice",
    "filename": "Invoice-INV2026.pdf"
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/messages/send", {
  phone: "628123456789",
  media_url: "https://cdn.wahide.com/invoices/INV-2026.pdf",
  caption: "Your official invoice",
  filename: "Invoice-INV2026.pdf",
}, {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

$payload = [
  "phone" => "628123456789",
  "media_url" => "https://cdn.wahide.com/invoices/INV-2026.pdf",
  "caption" => "Your official invoice",
  "filename" => "Invoice-INV2026.pdf",
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/messages/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/wa/messages/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "media_url": "https://cdn.wahide.com/invoices/INV-2026.pdf",
    "caption": "Your official invoice",
    "filename": "Invoice-INV2026.pdf",
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":     "628123456789",
		"media_url": "https://cdn.wahide.com/invoices/INV-2026.pdf",
		"caption":   "Your official invoice",
		"filename":  "Invoice-INV2026.pdf",
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Media downloaded and dispatched to recipient.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628123456789", "wa_id": "628123456789" }],
  "messages": [{ "id": "3EB0CCDDEEFF0011" }]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-meta-cloud",
    slug: "messaging/meta-cloud-api",
    title: "Meta Cloud API Compatible",
    description:
      "Drop-in compatibility route for developers migrating from Meta WhatsApp Cloud API. Supports nested `text: { body }` and `template` objects.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/v18.0/{deviceId}/messages",
    badge: "Meta v18.0",
    bannerNotice: {
      type: "info",
      title: "Meta Cloud API Compatibility",
      content:
        "Point your existing Meta WhatsApp Cloud API SDK base URL to https://api.wahide.com/api/v1 without modifying your request schemas.",
    },
    parameters: [
      {
        name: "messaging_product",
        type: "string",
        required: true,
        description: "Always set to 'whatsapp'.",
        example: "whatsapp",
      },
      {
        name: "recipient_type",
        type: "string",
        required: false,
        defaultValue: `"individual"`,
        description: "Type of recipient. Defaults to 'individual'.",
      },
      {
        name: "to",
        type: "string",
        required: true,
        description: "Recipient phone number in E.164 international format.",
        example: "628123456789",
      },
      {
        name: "type",
        type: "string",
        required: true,
        description:
          "Message type: 'text', 'image', 'document', or 'template'.",
        example: "text",
      },
      {
        name: "text",
        type: "object",
        required: true,
        description: "Text message payload object containing the body string.",
        depth: 0,
      },
      {
        name: "text.body",
        type: "string",
        required: true,
        description:
          "The actual message content string inside the text object.",
        depth: 1,
        parent: "text",
        example: "Hello from Meta-compatible route!",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/v18.0/01M1WW3FKR1JS7CW4KGY78Q5ND/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "628123456789",
    "type": "text",
    "text": {
      "body": "Hello from Meta-compatible route!"
    }
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.com/api/v1/v18.0/DEVICE_ID/messages",
  {
    messaging_product: "whatsapp",
    to: "628123456789",
    type: "text",
    text: { body: "Hello from Meta SDK compatible format!" }
  },
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);`,
      php: `<?php
$deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
$curl = curl_init();

$payload = [
  "messaging_product" => "whatsapp",
  "recipient_type" => "individual",
  "to" => "628123456789",
  "type" => "text",
  "text" => [
    "body" => "Hello from Meta SDK compatible format!",
  ],
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/v18.0/{$deviceId}/messages",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

device_id = "01M1WW3FKR1JS7CW4KGY78Q5ND"
url = f"https://api.wahide.com/api/v1/v18.0/{device_id}/messages"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "628123456789",
    "type": "text",
    "text": {
        "body": "Hello from Meta SDK compatible format!"
    }
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	deviceID := "01M1WW3FKR1JS7CW4KGY78Q5ND"
	url := fmt.Sprintf("https://api.wahide.com/api/v1/v18.0/%s/messages", deviceID)

	payload := map[string]interface{}{
		"messaging_product": "whatsapp",
		"recipient_type":    "individual",
		"to":                "628123456789",
		"type":              "text",
		"text": map[string]string{
			"body": "Hello from Meta SDK compatible format!",
		},
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Meta formatted 200 OK message response.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "628123456789",
      "wa_id": "628123456789"
    }
  ],
  "messages": [
    {
      "id": "wamid.HBgNNjI4MTIzNDU2Nzg5FQIAERgSM0VCMEExQjJDM0Q0RTVGNkEA"
    }
  ]
}`,
        attributes: [
          {
            name: "messages[].id",
            type: "string",
            description: "Standard Meta WAMID (WhatsApp Message ID).",
          },
        ],
      },
    ],
  },
];
