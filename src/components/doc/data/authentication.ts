import { GuideDoc } from "../types";

export const authenticationDoc: GuideDoc = {
  type: "guide",
  id: "authentication",
  slug: "authentication",
  title: "Authentication & Security",
  description:
    "Learn how to authenticate requests to the Wahide REST API using API Keys and Bearer tokens.",
  category: "Getting Started",
  categorySlug: "getting-started",
  bannerNotice: {
    type: "info",
    title: "API Key Security & Confidentiality",
    content:
      "All requests require an active API Key generated from your Wahide Dashboard. Never expose your secret API keys in client-side code, public repositories, or mobile apps.",
  },
  sections: [
    {
      id: "api-keys",
      title: "Obtaining Your API Key",
      content:
        "1. Log in to your [Wahide Dashboard](/dashboard).\n2. Navigate to **Settings > API Keys**.\n3. Click **Generate New Key**, enter a descriptive label (e.g. `Production Server`), and copy your key.\n\nKeys are prefixed with `wh_live_` or `wh_test_` to help you differentiate between live production and staging environments.",
      callout: {
        type: "warning",
        title: "Keep your API Key Confidential",
        content:
          "Your API Key carries full permissions to send messages and manage connected devices. If a key is compromised, revoke it immediately from the dashboard.",
      },
    },
    {
      id: "headers",
      title: "Authentication Headers",
      content:
        "Include your API Key in the `Authorization` header of every HTTP request with the `Bearer` prefix:",
      code: {
        language: "http",
        title: "HTTP Request Header",
        content: `POST /api/v1/wa/messages/send HTTP/1.1
Host: api.wahide.com
Authorization: Bearer wh_live_9a8b7c6d5e4f3a2b1c0d9e8f
Content-Type: application/json`,
      },
    },
    {
      id: "alternative-header",
      title: "Alternative Header: X-API-Key",
      content:
        "Alternatively, if your HTTP client or webhook proxy prefers a custom header, Wahide also accepts `X-API-Key`:",
      code: {
        language: "http",
        title: "Custom Header Example",
        content: `X-API-Key: wh_live_9a8b7c6d5e4f3a2b1c0d9e8f`,
      },
    },
    {
      id: "unauthorized-response",
      title: "Unauthorized Error Format",
      content:
        "If you omit the header, supply an invalid key, or the key has been revoked, the API returns `401 Unauthorized` with a standardized JSON error response:",
      code: {
        language: "json",
        title: "401 Unauthorized Response",
        content: `{
  "success": false,
  "message": "Invalid API Key",
  "error": "UNAUTHORIZED"
}`,
      },
    },
  ],
};
