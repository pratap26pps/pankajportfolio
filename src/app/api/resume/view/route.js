export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getResumeData } from "@/lib/resumeStore";
import { fetchCloudinaryPdf, inlinePdfResponse } from "@/lib/resumePdf";

export async function GET() {
  try {
    const data = await getResumeData();
    const url = data.url?.trim();

    if (!url) {
      return NextResponse.json({ ok: false, error: "Resume not configured" }, { status: 404 });
    }

    if (url.includes("res.cloudinary.com")) {
      const buffer = await fetchCloudinaryPdf(url);

      if (!buffer) {
        return NextResponse.json(
          {
            ok: false,
            error: "Could not load PDF. Please re-upload your resume from Admin → Resume.",
          },
          { status: 502 }
        );
      }

      return inlinePdfResponse(buffer, String(data.updatedAt || url));
    }

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("GET /api/resume/view error", error);
    return NextResponse.json({ ok: false, error: "Failed to open resume" }, { status: 500 });
  }
}
