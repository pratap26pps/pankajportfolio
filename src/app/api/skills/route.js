export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  getAllSkillsData,
  getPublicSkillsData,
  updateSkillsSection,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/skillsStore";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("all") === "true" && isAdminRequest(request)) {
      const data = await getAllSkillsData();
      return NextResponse.json({ ok: true, data });
    }
    const data = await getPublicSkillsData();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("GET /api/skills error", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (body.entity === "section") {
      const data = await updateSkillsSection(body);
      return NextResponse.json({ ok: true, data });
    }

    const item = await createSkill(body);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("POST /api/skills error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to create skill" },
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

    if (body.entity === "section") {
      const data = await updateSkillsSection(body);
      return NextResponse.json({ ok: true, data });
    }

    if (!body.id) {
      return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });
    }

    const item = await updateSkill(body.id, body);
    if (!item) {
      return NextResponse.json({ ok: false, error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("PUT /api/skills error", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to update skill" },
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

    const deleted = await deleteSkill(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/skills error", error);
    return NextResponse.json({ ok: false, error: "Failed to delete skill" }, { status: 500 });
  }
}
