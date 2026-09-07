import { GuideDoc } from "../types";

export const errorsDoc: GuideDoc = {
  type: "guide",
  id: "errors",
  slug: "errors",
  title: "Errors & Rate Limits",
  description:
    "Standard HTTP status codes, error payload schemas, and rate limit policies applied by the Wahide API Gateway.",
  category: "Getting Started",
  categorySlug: "getting-started",
  bannerNotice: {
    type: "warning",
    title: "Standardized Error Responses",
    content:
      "All non-2xx responses return a consistent JSON schema with machine-readable error codes and human-friendly troubleshooting messages.",
  },
  sections: [
    {
      id: "error-schema",
      title: "Standard Error Schema",
      content:
        "When an error occurs, Wahide returns a standardized response envelope:",
      code: {
        language: "json",
        title: "Error Envelope",
        content: `{
  "success": false,
  "message": "Invalid recipient phone number format",
  "error": "INVALID_PHONE_NUMBER",
  "additional_info": {
    "field": "phone",
    "received": "0812345",
    "expected": "E.164 format with country code (e.g., 628123456789)"
  }
}`,
      },
    },
    {
      id: "http-status-codes",
      title: "HTTP Status Code Matrix",
      content:
        "| Status | Code | Description |\n| :--- | :--- | :--- |\n| `200 OK` | Success | Request succeeded. Messages queued or dispatched. |\n| `201 Created` | Resource Created | Device slot, contact, or campaign successfully created. |\n| `400 Bad Request` | Validation Error | Missing required fields, invalid phone number, or malformed JSON. |\n| `401 Unauthorized` | Auth Error | Missing or invalid `Authorization: Bearer <key>` header. |\n| `403 Forbidden` | Access Denied | Insufficient permissions or quota exhausted. |\n| `404 Not Found` | Resource Missing | Device ID, contact ID, or campaign ID does not exist. |\n| `429 Too Many Requests` | Rate Limit Exceeded | Request velocity exceeded the tier threshold. Backoff requested. |\n| `503 Service Unavailable` | Gateway / WA Disconnected | Target WhatsApp device is offline or disconnected. |",
    },
    {
      id: "rate-limits",
      title: "Rate Limit Policies",
      content:
        "Rate limits are enforced at the API gateway layer per tenant API Key to protect system stability and WhatsApp number health:\n\n* **Free / Sandbox**: 60 requests/minute\n* **Pro Tier**: 600 requests/minute\n* **Enterprise Tier**: Custom dedicated throughput with Redis Stream buffer\n\nWhen rate limited, the API returns HTTP `429 Too Many Requests` alongside these standard response headers:\n\n* `X-RateLimit-Limit`: Maximum allowed requests in the window.\n* `X-RateLimit-Remaining`: Remaining requests allowed in the current minute.\n* `Retry-After`: Seconds to wait before attempting another request.",
      callout: {
        type: "tip",
        title: "Best Practice: Automated Retries with Exponential Jitter",
        content:
          "When handling `429 Too Many Requests`, inspect the `Retry-After` header and implement exponential backoff with random jitter to prevent thundering-herd issues.",
      },
    },
  ],
};
