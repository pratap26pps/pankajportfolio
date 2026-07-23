export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getProfileData, getProfileImageSrc, updateProfile } from "@/lib/profileStore";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getProfileData();
    return NextResponse.json({
      ok: true,
      data: {
        ...data,
        image: getProfileImageSrc(data),
      },
    });
  } catch (error) {
    console.error("GET /api/profile error", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.image?.trim()) {
      return NextResponse.json({ ok: false, error: "Profile image is required" }, { status: 400 });
    }

    const data = await updateProfile(body);
    return NextResponse.json({
      ok: true,
      data: {
        ...data,
        image: getProfileImageSrc(data),
      },
    });
  } catch (error) {
    console.error("PUT /api/profile error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
