export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { saveUploadedResumePdf } from "@/lib/resumeStore";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const formToken = formData.get("_adminToken");
    const additionalTokens = typeof formToken === "string" ? [formToken] : [];

    if (!isAdminRequest(request, { additionalTokens })) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, error: "PDF file is required" }, { status: 400 });
    }

    const path = await saveUploadedResumePdf(file);
    return NextResponse.json({ ok: true, path });
  } catch (error) {
    console.error("POST /api/resume/upload error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to upload resume" },
      { status: 500 }
    );
  }
}
