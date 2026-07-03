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

function withAuthHeaders(options = {}) {
  const headers = new Headers(options.headers);
  const token = getAdminToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

/** Authenticated fetch for admin dashboard — sends cookie + Bearer token. */
export function adminFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: withAuthHeaders(options),
  });
}
