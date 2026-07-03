export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getResumeData, updateResume } from "@/lib/resumeStore";
import { isAdminRequest } from "@/lib/auth";
import { getResumeNavHref } from "@/lib/resumeUrl";

export async function GET() {
  try {
    const data = await getResumeData();
    return NextResponse.json({
      ok: true,
      data,
      navHref: getResumeNavHref(data),
    });
  } catch (error) {
    console.error("GET /api/resume error", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.url?.trim()) {
      return NextResponse.json({ ok: false, error: "Resume PDF URL is required" }, { status: 400 });
    }

    const data = await updateResume(body);
    return NextResponse.json({ ok: true, data, navHref: getResumeNavHref(data) });
  } catch (error) {
    console.error("PUT /api/resume error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to update resume" },
      { status: 500 }
    );
  }
}
