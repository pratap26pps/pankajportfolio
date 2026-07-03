export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { saveUploadedProjectImage } from "@/lib/projectsStore";

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, error: "Image file is required" }, { status: 400 });
    }

    const path = await saveUploadedProjectImage(file);
    return NextResponse.json({ ok: true, path });
  } catch (error) {
    console.error("POST /api/projects/upload error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
