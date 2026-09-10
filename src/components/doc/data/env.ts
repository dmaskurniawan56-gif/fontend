import { env } from "@/lib/config/env";

/**
 * Dynamic API Base URL resolver for Wahide API Documentation
 * Resolves directly from NEXT_PUBLIC_API_BASE_URL environment variable
 */
export function getApiBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return env.NEXT_PUBLIC_API_BASE_URL || "";
}

/**
 * Returns the origin / host (e.g. https://api-wa.hidessh.com or https://api.wahide.com)
 */
export function getApiHost(): string {
  const baseUrl = getApiBaseUrl();
  try {
    const parsed = new URL(baseUrl);
    return parsed.origin;
  } catch {
    return baseUrl.replace(/\/api\/v1\/?$/, "");
  }
}
