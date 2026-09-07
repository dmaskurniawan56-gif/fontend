import { EndpointDoc } from "../types";

export const devicesEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "devices-list",
    slug: "devices/list",
    title: "List Devices",
    description:
      "Retrieves all WhatsApp device slots configured for your organization, including their live connection states, trust scores, and warmup limits.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "GET",
    path: "/api/v1/wa/devices",
    parameters: [
      {
        name: "page",
        type: "integer",
        required: false,
        defaultValue: "1",
        description: "Page number for pagination.",
        example: "1",
      },
      {
        name: "size",
        type: "integer",
        required: false,
        defaultValue: "10",
        description: "Number of devices per page (max: 50).",
        example: "10",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/wa/devices?page=1&size=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.get("https://api.wahide.com/api/v1/wa/devices", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  params: { page: 1, size: 10 }
});
console.log(res.data);`,
      php: `// List devices in PHP`,
      python: `import requests
res = requests.get("https://api.wahide.com/api/v1/wa/devices", headers={"Authorization": "Bearer YOUR_API_KEY"})
print(res.json())`,
      go: `// List devices in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Array of device objects with pagination metadata.",
        json: `{
  "success": true,
  "message": "devices retrieved successfully",
  "payload": [
    {
      "id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
      "tenant_id": "01M1TG7TWDHZSXVPBEAZVFNF24",
      "jid": "628123456789@s.whatsapp.net",
      "push_name": "Customer Support 1",
      "status": "CONNECTED",
      "trust_score": 85,
      "warmup_day": 14,
      "daily_sent_count": 42,
      "last_seen_at": "2026-09-07T09:45:35.481+07:00",
      "created_at": "2026-08-24T10:00:00.000+07:00"
    }
  ],
  "additional_info": {
    "page": 1,
    "size": 10,
    "total": 1
  }
}`,
        attributes: [
          {
            name: "payload[].status",
            type: "string",
            description: "Connection status: 'QR_PENDING', 'CONNECTED', or 'DISCONNECTED'.",
          },
          {
            name: "payload[].trust_score",
            type: "integer",
            description: "Dynamic health score (0-100) calculated from account age, spam flags, and response rates.",
          },
          {
            name: "payload[].warmup_day",
            type: "integer",
            description: "Current day in anti-ban warmup schedule (Day 1: 50 msgs/day -> Day 14+: Unrestricted).",
          },
        ],
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-create",
    slug: "devices/create",
    title: "Create Device Slot",
    description: "Allocates a new WhatsApp device slot ready for QR code pairing.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices",
    parameters: [
      {
        name: "push_name",
        type: "string",
        required: true,
        description: "Friendly label for this device (e.g. 'CS Sales Bandung').",
        example: "CS Sales Bandung",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/devices" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "push_name": "CS Sales Bandung"
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/devices", {
  push_name: "CS Sales Bandung"
}, {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
});`,
      php: `// Create device in PHP`,
      python: `import requests
res = requests.post("https://api.wahide.com/api/v1/wa/devices", json={"push_name": "CS Sales Bandung"}, headers={"Authorization": "Bearer YOUR_API_KEY"})`,
      go: `// Create device in Go`,
    },
    responses: [
      {
        status: 201,
        statusText: "Created",
        description: "Device slot created with QR_PENDING status.",
        json: `{
  "success": true,
  "message": "device created successfully",
  "payload": {
    "id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
    "push_name": "CS Sales Bandung",
    "status": "QR_PENDING",
    "trust_score": 10,
    "warmup_day": 1
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-pair",
    slug: "devices/pair",
    title: "Pair Device (QR Code)",
    description:
      "Initiates Multi-Device WhatsApp pairing and returns the Base64 QR code string to scan with the WhatsApp mobile app.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices/{deviceId}/pair",
    parameters: [
      {
        name: "deviceId",
        type: "string",
        required: true,
        description: "Unique ULID identifier of the device slot.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/devices/01M1WW3FKR1JS7CW4KGY78Q5ND/pair" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/devices/01M1WW3FKR1JS7CW4KGY78Q5ND/pair", {}, {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
});`,
      php: `// Pair device in PHP`,
      python: `// Pair device in Python`,
      go: `// Pair device in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "QR pairing code generated.",
        json: `{
  "success": true,
  "message": "QR code generated",
  "payload": {
    "device_id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
    "qr_code": "2@qP...base64_qr_data...",
    "expires_in_seconds": 60
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-disconnect",
    slug: "devices/disconnect",
    title: "Disconnect Device",
    description:
      "Gracefully terminates the WhatsApp Web session and transitions the device to DISCONNECTED status without deleting historic analytics.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices/{deviceId}/disconnect",
    parameters: [
      {
        name: "deviceId",
        type: "string",
        required: true,
        description: "Unique ULID identifier of the device.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/devices/01M1WW3FKR1JS7CW4KGY78Q5ND/disconnect" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `// Disconnect device in Node.js`,
      php: `// Disconnect device in PHP`,
      python: `// Disconnect device in Python`,
      go: `// Disconnect device in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Device disconnected successfully.",
        json: `{
  "success": true,
  "message": "device disconnected successfully"
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-delete",
    slug: "devices/delete",
    title: "Delete Device Slot",
    description: "Permanently removes a device slot from your tenant organization.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "DELETE",
    path: "/api/v1/wa/devices/{deviceId}",
    parameters: [
      {
        name: "deviceId",
        type: "string",
        required: true,
        description: "Device ULID to delete.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
    ],
    snippets: {
      curl: `curl -X DELETE "https://api.wahide.com/api/v1/wa/devices/01M1WW3FKR1JS7CW4KGY78Q5ND" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `// Delete device in Node.js`,
      php: `// Delete device in PHP`,
      python: `// Delete device in Python`,
      go: `// Delete device in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Device removed.",
        json: `{
  "success": true,
  "message": "device deleted successfully"
}`,
      },
    ],
  },
];
