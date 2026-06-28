export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  getAllTestimonials,
  getVisibleTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/testimonialsStore";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = isAdminRequest(request);

    if (searchParams.get("all") === "true" && isAdmin) {
      const items = await getAllTestimonials();
      return NextResponse.json({ ok: true, items });
    }

    const items = await getVisibleTestimonials();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error("GET /api/testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.quote?.trim() || !body.name?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Quote and name are required" },
        { status: 400 }
      );
    }

    const item = await createTestimonial(body);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("POST /api/testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create testimonial" },
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
    if (!body.id) {
      return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });
    }

    const item = await updateTestimonial(body.id, body);
    if (!item) {
      return NextResponse.json({ ok: false, error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("PUT /api/testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update testimonial" },
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

    const deleted = await deleteTestimonial(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
