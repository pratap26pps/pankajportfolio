import crypto from "crypto";

const COOKIE_NAME = "admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf-8"));
}

export function signAdminToken() {
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    role: "admin",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token) return false;
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return false;

    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (signature !== expected) return false;

    const data = decode(payload);
    if (!data.exp || Date.now() > data.exp) return false;
    return data.role === "admin";
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password) {
  return password === process.env.JWT_SECRET;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  };
}

export function getTokenFromRequest(request) {
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

export function isAdminRequest(request) {
  return verifyAdminToken(getTokenFromRequest(request));
}
