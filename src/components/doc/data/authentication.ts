import { GuideDoc } from "../types";

export const authenticationDoc: GuideDoc = {
  type: "guide",
  id: "authentication",
  slug: "authentication",
  title: "Authentication & Security",
  description:
    "Learn how to authenticate requests to the Wahide REST API using standard HTTP Authorization Bearer tokens.",
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
        "1. Log in to your [Wahide Dashboard](/dashboard).\n2. Navigate to **Settings > API Keys**.\n3. Click **Generate New Key**, enter a descriptive label (e.g. `Production Server`), and copy your key.\n\nKeys are prefixed with `hide_` to ensure ultra-fast in-memory validation via the Redis pipeline.",
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
        "Include your API Key in the standard HTTP `Authorization` header of every request with the `Bearer` prefix:",
      code: {
        language: "http",
        title: "HTTP Request Header",
        content: `POST /api/v1/wa/messages/send HTTP/1.1
Host: api.wahide.com
Authorization: Bearer hide_9a8b7c6d5e4f3a2b1c0d9e8f
Content-Type: application/json`,
      },
    },
    {
      id: "security-best-practices",
      title: "Security Best Practices",
      content:
        "• **Environment Variables**: Never hardcode API Keys in your application source code. Store them in secure server-side environment variables (e.g., `WAHIDE_API_KEY`).\n• **Zero Client-Side Exposure**: Never invoke Wahide API endpoints directly from web browsers, mobile apps, or client-side JavaScript.\n• **Immediate Key Rotation**: If your API Key is accidentally leaked or committed to a repository, navigate to **Settings > API Keys** on your dashboard and click **Regenerate Key** immediately to revoke the compromised token.",
      callout: {
        type: "tip",
        title: "Sub-millisecond Redis Fast-Path",
        content:
          "Wahide API Gateway utilizes an in-memory Redis pipeline to validate API Keys in sub-milliseconds (< 0.2ms) without adding latency to your high-throughput messaging workloads.",
      },
    },
    {
      id: "unauthorized-response",
      title: "Unauthorized Error Format",
      content:
        "If you omit the Authorization header, supply an invalid key, or the key has been revoked, the API returns `401 Unauthorized` with a standardized JSON error response:",
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
