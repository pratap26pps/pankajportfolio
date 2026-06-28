import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "projects");

async function readFile() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeFile(data) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function normalizeIcons(icon) {
  if (Array.isArray(icon)) {
    return icon.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof icon === "string") {
    return icon.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function buildProject(payload, existing) {
  return {
    id: existing?.id || crypto.randomUUID(),
    title: (payload.title ?? existing?.title ?? "").trim(),
    description: (payload.description ?? existing?.description ?? "").trim(),
    date: (payload.date ?? existing?.date ?? "").trim(),
    img: (payload.img ?? existing?.img ?? "").trim(),
    icon: payload.icon !== undefined ? normalizeIcons(payload.icon) : existing?.icon || [],
    link: (payload.link ?? existing?.link ?? "").trim(),
    visible: payload.visible !== undefined ? Boolean(payload.visible) : existing?.visible !== false,
  };
}

export async function getAllProjects() {
  return readFile();
}

export async function getVisibleProjects() {
  const all = await readFile();
  return all.filter((item) => item.visible !== false);
}

export async function createProject(payload) {
  const all = await readFile();
  if (!payload.title?.trim()) throw new Error("Title is required");

  const item = buildProject(payload);
  all.unshift(item);
  await writeFile(all);
  return item;
}

export async function updateProject(id, payload) {
  const all = await readFile();
  const index = all.findIndex((item) => item.id === id);
  if (index === -1) return null;

  all[index] = buildProject(payload, all[index]);
  await writeFile(all);
  return all[index];
}

export async function deleteProject(id) {
  const all = await readFile();
  const project = all.find((item) => item.id === id);
  if (!project) return false;

  if (project.img?.startsWith("/projects/")) {
    const filePath = path.join(process.cwd(), "public", project.img);
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore missing files
    }
  }

  await writeFile(all.filter((item) => item.id !== id));
  return true;
}

export async function saveUploadedProjectImage(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const originalName = file.name || "upload.png";
  const ext = path.extname(originalName).toLowerCase() || ".png";
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  if (!allowed.includes(ext)) throw new Error("Unsupported image type");

  const filename = `${crypto.randomUUID()}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/projects/${filename}`;
}
