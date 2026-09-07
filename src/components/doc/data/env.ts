/**
 * Dynamic API Base URL resolver for Wahide API Documentation
 * Resolves directly from NEXT_PUBLIC_API_BASE_URL environment variable
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "http://localhost:3030/api/v1";
}

/**
 * Returns the origin / host (e.g. http://localhost:3030 or https://api.wahide.com)
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
