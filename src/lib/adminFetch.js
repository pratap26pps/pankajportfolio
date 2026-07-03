const TOKEN_KEY = "portfolio_admin_token";

export function saveAdminToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

export function clearAdminToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

function getAdminToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function attachFormToken(body) {
  if (!(body instanceof FormData)) return body;

  const token = getAdminToken();
  if (token && !body.has("_adminToken")) {
    body.append("_adminToken", token);
  }
  return body;
}

function withAuthHeaders(options = {}) {
  const headers = new Headers(options.headers);
  const token = getAdminToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("x-admin-token", token);
  }
  return headers;
}

/** Authenticated fetch for admin dashboard — sends cookie + Bearer token. */
export function adminFetch(url, options = {}) {
  const body = attachFormToken(options.body);

  return fetch(url, {
    ...options,
    body,
    credentials: "include",
    headers: withAuthHeaders(options),
  });
}

/** Sync sessionStorage token from httpOnly cookie (runs on admin page load). */
export async function syncAdminSession() {
  try {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    const data = await res.json();
    if (res.ok && data.ok && data.token) {
      saveAdminToken(data.token);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}
