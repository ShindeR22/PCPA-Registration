/**
 * Shared JSON API client for the registration app.
 * Set API_BASE_URL to the base URL provided by the API owner.
 */
export const API_BASE_URL = "https://pcpa-registration.pratikmpatil9696.workers.dev";

export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Set it in api/client.js.");
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof result === "object" && result !== null && result.message
        ? result.message
        : `API request failed (${response.status})`;
    throw new Error(message);
  }

  return result;
}
