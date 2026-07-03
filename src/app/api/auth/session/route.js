export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyAdminToken } from "@/lib/auth";

/** Returns the current admin token when the session cookie/header is valid. */
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: true, token });
  } catch (error) {
    console.error("GET /api/auth/session error", error);
    return NextResponse.json({ ok: false, error: "Session check failed" }, { status: 500 });
  }
}
