export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  getAllServicesData,
  getPublicServicesData,
  updateServicesIntro,
  createService,
  updateService,
  deleteService,
  createPackage,
  updatePackage,
  deletePackage,
} from "@/lib/servicesStore";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("all") === "true" && isAdminRequest(request)) {
      const data = await getAllServicesData();
      return NextResponse.json({ ok: true, data });
    }
    const data = await getPublicServicesData();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("GET /api/services error", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { entity, ...payload } = body;

    if (entity === "intro") {
      const data = await updateServicesIntro(payload);
      return NextResponse.json({ ok: true, data });
    }
    if (entity === "service") {
      const item = await createService(payload);
      return NextResponse.json({ ok: true, item });
    }
    if (entity === "package") {
      const item = await createPackage(payload);
      return NextResponse.json({ ok: true, item });
    }

    return NextResponse.json({ ok: false, error: "Invalid entity type" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/services error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to create" },
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
    const { entity, id, ...payload } = body;

    if (entity === "intro") {
      const data = await updateServicesIntro(payload);
      return NextResponse.json({ ok: true, data });
    }
    if (entity === "service") {
      if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
      const item = await updateService(id, payload);
      if (!item) return NextResponse.json({ ok: false, error: "Service not found" }, { status: 404 });
      return NextResponse.json({ ok: true, item });
    }
    if (entity === "package") {
      if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
      const item = await updatePackage(id, payload);
      if (!item) return NextResponse.json({ ok: false, error: "Package not found" }, { status: 404 });
      return NextResponse.json({ ok: true, item });
    }

    return NextResponse.json({ ok: false, error: "Invalid entity type" }, { status: 400 });
  } catch (error) {
    console.error("PUT /api/services error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to update" },
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
    const entity = searchParams.get("entity");
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });

    let deleted = false;
    if (entity === "service") deleted = await deleteService(id);
    else if (entity === "package") deleted = await deletePackage(id);
    else return NextResponse.json({ ok: false, error: "Invalid entity type" }, { status: 400 });

    if (!deleted) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/services error", error);
    return NextResponse.json({ ok: false, error: "Failed to delete" }, { status: 500 });
  }
}
