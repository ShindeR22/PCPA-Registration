# API integration

Put API-related request code in this folder. `client.js` provides a shared JSON
request helper; set `API_BASE_URL` there to the base URL supplied by the API
owner, then import `apiRequest` where the app submits registration data.

Before wiring the registration form, get these details from the API owner:

- Base URL and registration endpoint path
- HTTP method and required request fields
- Example success and error responses
- Whether authentication or extra headers are required
- Allowed frontend origins (CORS), if the API is hosted separately

Do not put private API keys in browser JavaScript. Any secret credential should
be handled by a server-side service.
