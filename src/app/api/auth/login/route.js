export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  verifyAdminPassword,
  signAdminToken,
  getAdminCookieName,
  getAdminCookieOptions,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const { password } = await request.json();
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }

    const token = signAdminToken();
    const response = NextResponse.json({ ok: true, token });
    response.cookies.set(getAdminCookieName(), token, getAdminCookieOptions());
    return response;
  } catch (error) {
    console.error("POST /api/auth/login error", error);
    return NextResponse.json({ ok: false, error: "Login failed" }, { status: 500 });
  }
}
