export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  getAllCertificationsData,
  getPublicCertificationsData,
  updateCertificationsPage,
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/lib/certificationsStore";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("all") === "true" && isAdminRequest(request)) {
      const data = await getAllCertificationsData();
      return NextResponse.json({ ok: true, data });
    }
    const data = await getPublicCertificationsData();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("GET /api/certifications error", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (body.entity === "page") {
      const data = await updateCertificationsPage(body);
      return NextResponse.json({ ok: true, data });
    }

    const item = await createCertification(body);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("POST /api/certifications error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to create certification" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.entity === "page") {
      const data = await updateCertificationsPage(body);
      return NextResponse.json({ ok: true, data });
    }

    if (!body.id) {
      return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });
    }

    const item = await updateCertification(body.id, body);
    if (!item) {
      return NextResponse.json({ ok: false, error: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("PUT /api/certifications error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to update certification" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });
    }

    const deleted = await deleteCertification(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/certifications error", error);
    return NextResponse.json({ ok: false, error: "Failed to delete certification" }, { status: 500 });
  }
}
