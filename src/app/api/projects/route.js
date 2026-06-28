export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  getAllProjects,
  getVisibleProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/projectsStore";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = isAdminRequest(request);

    if (searchParams.get("all") === "true" && isAdmin) {
      const items = await getAllProjects();
      return NextResponse.json({ ok: true, items });
    }

    const items = await getVisibleProjects();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error("GET /api/projects error", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
    }

    const item = await createProject(body);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("POST /api/projects error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to create project" },
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

    const item = await updateProject(body.id, body);
    if (!item) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("PUT /api/projects error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to update project" },
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

    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/projects error", error);
    return NextResponse.json({ ok: false, error: "Failed to delete project" }, { status: 500 });
  }
}
