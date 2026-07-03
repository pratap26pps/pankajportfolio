export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getResumeData } from "@/lib/resumeStore";
import { fetchCloudinaryPdf, inlinePdfResponse } from "@/lib/resumePdf";

export async function GET(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const queryUrl = request.nextUrl.searchParams.get("url")?.trim();
    const url = queryUrl || (await getResumeData()).url?.trim();

    if (!url) {
      return NextResponse.json({ ok: false, error: "No PDF to preview" }, { status: 404 });
    }

    if (!url.includes("res.cloudinary.com")) {
      return NextResponse.redirect(url);
    }

    const buffer = await fetchCloudinaryPdf(url);
    if (!buffer) {
      return NextResponse.json({ ok: false, error: "Could not load PDF preview" }, { status: 502 });
    }

    return inlinePdfResponse(buffer);
  } catch (error) {
    console.error("GET /api/resume/preview error", error);
    return NextResponse.json({ ok: false, error: "Failed to load preview" }, { status: 500 });
  }
}
