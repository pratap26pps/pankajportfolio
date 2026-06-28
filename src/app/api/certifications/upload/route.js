export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { saveUploadedCertificationImage } from "@/lib/certificationsStore";

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
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
