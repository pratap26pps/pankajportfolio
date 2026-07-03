import crypto from "crypto";
import { getDocument, saveDocument } from "@/lib/db";
import { uploadPortfolioFile, deletePortfolioFile } from "@/lib/cloudinary";

async function readFile() {
  const data = await getDocument("projects", []);
  return Array.isArray(data) ? data : [];
}

async function writeFile(data) {
  await saveDocument("projects", data);
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

  if (project.img) {
    await deletePortfolioFile(project.img);
  }

  await writeFile(all.filter((item) => item.id !== id));
  return true;
}

export async function saveUploadedProjectImage(file) {
  return uploadPortfolioFile(file, {
    subfolder: "projects",
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp", ".gif"],
  });
}
