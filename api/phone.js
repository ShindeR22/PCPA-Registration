import { apiRequest } from "./client.js";

/** Check whether a phone number already has a registration. */
export function checkPhone(phone) {
  return apiRequest("/phone", {
    method: "POST",
    body: { phone },
  });
}
