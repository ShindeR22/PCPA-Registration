import { apiRequest } from "./client.js";

/** Submit a new registration. */
export function registerVisitor(registration) {
  return apiRequest("/register", {
    method: "POST",
    body: registration,
  });
}
