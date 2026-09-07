import { EndpointDoc } from "../types";

export const campaignsEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "campaigns-list",
    slug: "campaigns/list",
    title: "List Campaigns",
    description: "Fetch broadcast campaigns, their delivery progress, and schedule states.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "GET",
    path: "/api/v1/campaigns",
    parameters: [
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter by status: 'DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED'.",
        example: "RUNNING",
      },
      {
        name: "page",
        type: "integer",
        required: false,
        defaultValue: "1",
        description: "Page number.",
      },
      {
        name: "size",
        type: "integer",
        required: false,
        defaultValue: "10",
        description: "Page size.",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/campaigns?status=RUNNING" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";
const res = await axios.get("https://api.wahide.com/api/v1/campaigns", {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
});`,
      php: `// List campaigns in PHP`,
      python: `// List campaigns in Python`,
      go: `// List campaigns in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaigns array.",
        json: `{
  "success": true,
  "payload": [
    {
      "id": "01M1CP001",
      "name": "September Flash Sale Promo",
      "status": "RUNNING",
      "total_recipients": 1200,
      "sent_count": 845,
      "failed_count": 5,
      "device_pool": ["01M1WW3FKR1JS7CW4KGY78Q5ND"]
    }
  ]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-create",
    slug: "campaigns/create",
    title: "Create Campaign",
    description: "Configures a new broadcast queue with rate limits, jitter, and target contact tags.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Campaign display name.",
        example: "Weekend Flash Sale 50%",
      },
      {
        name: "message_template",
        type: "string",
        required: true,
        description: "Message template with variables like {{name}} and Spintax.",
        example: "{Hi|Hello} {{name}}, our flash sale is live!",
      },
      {
        name: "tag_ids",
        type: "array",
        required: true,
        description: "List of contact tag IDs to target for broadcast.",
        example: '["01M1TAG01"]',
      },
      {
        name: "min_delay_seconds",
        type: "integer",
        required: false,
        defaultValue: "5",
        description: "Minimum jitter delay between outbound dispatches (anti-ban).",
      },
      {
        name: "max_delay_seconds",
        type: "integer",
        required: false,
        defaultValue: "15",
        description: "Maximum jitter delay between dispatches.",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Weekend Flash Sale",
    "message_template": "Hello {{name}}, sale is active!",
    "tag_ids": ["01M1TAG01"]
  }'`,
      nodejs: `// Create campaign in Node.js`,
      php: `// Create campaign in PHP`,
      python: `// Create campaign in Python`,
      go: `// Create campaign in Go`,
    },
    responses: [
      {
        status: 201,
        statusText: "Created",
        description: "Campaign created in DRAFT state.",
        json: `{
  "success": true,
  "message": "campaign created successfully",
  "payload": {
    "id": "01M1CP002",
    "name": "Weekend Flash Sale",
    "status": "DRAFT"
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-start",
    slug: "campaigns/start",
    title: "Start Campaign",
    description: "Triggers the Redis Streams background worker to begin dispatching queued messages.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns/{campaignId}/start",
    parameters: [
      {
        name: "campaignId",
        type: "string",
        required: true,
        description: "ULID of campaign to launch.",
        example: "01M1CP002",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/campaigns/01M1CP002/start" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `// Start campaign in Node.js`,
      php: `// Start campaign in PHP`,
      python: `// Start campaign in Python`,
      go: `// Start campaign in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaign started.",
        json: `{ "success": true, "message": "campaign started" }`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-pause",
    slug: "campaigns/pause",
    title: "Pause Campaign",
    description: "Halts dispatching temporarily without losing queue index.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns/{campaignId}/pause",
    parameters: [
      {
        name: "campaignId",
        type: "string",
        required: true,
        description: "ULID of campaign to pause.",
        example: "01M1CP002",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/campaigns/01M1CP002/pause" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `// Pause campaign in Node.js`,
      php: `// Pause campaign in PHP`,
      python: `// Pause campaign in Python`,
      go: `// Pause campaign in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaign paused.",
        json: `{ "success": true, "message": "campaign paused" }`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-logs",
    slug: "campaigns/logs",
    title: "Campaign Delivery Logs",
    description: "Inspect message-by-message delivery status, timestamps, and error codes for a campaign.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "GET",
    path: "/api/v1/campaigns/logs",
    parameters: [
      {
        name: "campaign_id",
        type: "string",
        required: true,
        description: "ULID of the campaign.",
        example: "01M1CP001",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/campaigns/logs?campaign_id=01M1CP001" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `// Get campaign logs in Node.js`,
      php: `// Get campaign logs in PHP`,
      python: `// Get campaign logs in Python`,
      go: `// Get campaign logs in Go`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Delivery log items.",
        json: `{
  "success": true,
  "payload": [
    {
      "id": "01M1LOG01",
      "phone": "628123456789",
      "status": "SENT",
      "message_id": "3EB0ABC123",
      "dispatched_at": "2026-09-07T10:15:00.000+07:00"
    }
  ]
}`,
      },
    ],
  },
];
