export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isAdminRequest, getAdminCookieName } from "@/lib/auth";
import { saveUploadedCertificationImage } from "@/lib/certificationsStore";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const formToken = formData.get("_adminToken");
    const additionalTokens = typeof formToken === "string" ? [formToken] : [];

    if (!isAdminRequest(request, { additionalTokens })) {
      console.error("POST /api/certifications/upload unauthorized", {
        hasCookie: Boolean(request.cookies.get(getAdminCookieName())?.value),
        hasAuthHeader: Boolean(request.headers.get("authorization")),
        hasXAdminToken: Boolean(request.headers.get("x-admin-token")),
        hasFormToken: Boolean(additionalTokens.length),
        jwtConfigured: Boolean(process.env.JWT_SECRET?.trim()),
      });
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, error: "File is required" }, { status: 400 });
    }

    const path = await saveUploadedCertificationImage(file);
    return NextResponse.json({ ok: true, path });
  } catch (error) {
    console.error("POST /api/certifications/upload error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
