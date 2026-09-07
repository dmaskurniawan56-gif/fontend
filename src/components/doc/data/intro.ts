import { GuideDoc } from "../types";

export const introDoc: GuideDoc = {
  type: "guide",
  id: "intro",
  slug: "intro",
  title: "Introduction",
  description:
    "The Wahide REST API provides programmatic access to WhatsApp Multi-Device features, allowing you to send messages, manage device connections, handle incoming webhooks, and orchestrate campaigns.",
  category: "Getting Started",
  categorySlug: "getting-started",
  sections: [
    {
      id: "api-overview",
      title: "API Architecture & Standards",
      content:
        "The Wahide API is organized around RESTful principles. All requests are communicated over HTTPS using standard HTTP verbs (GET, POST, PUT, DELETE) and expect/return UTF-8 encoded JSON payloads.\n\nAll endpoints require authentication using a Bearer token or API key in the request headers.",
      callout: {
        type: "info",
        title: "API Base URL",
        content:
          "Active API Base URL:\n`https://api.wahide.com/api/v1`\n\nAll endpoint paths documented in this reference are relative to this root URL. In local development or staging, this dynamically adapts from `NEXT_PUBLIC_API_BASE_URL`.",
      },
    },
    {
      id: "phone-format",
      title: "Phone Number Formatting",
      content:
        "All phone numbers must follow the international E.164 standard without spaces, dashes, parentheses, or a leading plus sign (+) or zero.\n\nFor example, an Indonesian number 0812-3456-7890 should be formatted as:\n`6281234567890`",
      callout: {
        type: "tip",
        title: "Country Code Required",
        content:
          "Always include the country dial code (e.g. 62 for Indonesia, 1 for United States, 60 for Malaysia). Requests with invalid formats will return an HTTP 400 response.",
      },
    },
    {
      id: "quick-start",
      title: "Quickstart",
      content:
        "You can test your API connectivity by dispatching a test message via cURL. Replace `YOUR_API_KEY` with your secret key from the dashboard settings:",
      code: {
        language: "bash",
        title: "cURL Quickstart",
        content: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "Hello, your order #INV-2026 has been confirmed."
  }'`,
      },
    },
    {
      id: "features",
      title: "Key Capabilities",
      content:
        "• **Multi-Device Rotation**: Connect multiple WhatsApp phone numbers and distribute message loads automatically via round-robin pooling.\n• **Natural Delivery Dynamics**: Support for typing presence indicators and configurable jitter backoff.\n• **Dynamic Spintax**: Use syntax like {Hello|Hi|Greetings} to produce unique variations across bulk deliveries.\n• **Meta Cloud API Compatibility**: Drop-in endpoint compatibility (/api/v1/v18.0/{deviceId}/messages) for existing Meta integrations.\n• **Delivery Tracking**: Track real-time message states (PENDING, SENT, DELIVERED, READ, FAILED) through inbound webhook callbacks.",
    },
  ],
};
