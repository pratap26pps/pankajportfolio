import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_PATH = path.join(process.cwd(), "data", "testimonials.json");

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

export async function getAllTestimonials() {
  return readFile();
}

export async function getVisibleTestimonials() {
  const all = await readFile();
  return all.filter((item) => item.visible !== false);
}

export async function createTestimonial(payload) {
  const all = await readFile();
  const item = {
    id: crypto.randomUUID(),
    quote: payload.quote?.trim() || "",
    name: payload.name?.trim() || "",
    title: payload.title?.trim() || "",
    date: payload.date?.trim() || "",
    verified: Boolean(payload.verified),
    visible: payload.visible !== false,
  };
  all.unshift(item);
  await writeFile(all);
  return item;
}

export async function updateTestimonial(id, payload) {
  const all = await readFile();
  const index = all.findIndex((item) => item.id === id);
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    ...(payload.quote !== undefined && { quote: payload.quote.trim() }),
    ...(payload.name !== undefined && { name: payload.name.trim() }),
    ...(payload.title !== undefined && { title: payload.title.trim() }),
    ...(payload.date !== undefined && { date: payload.date.trim() }),
    ...(payload.verified !== undefined && { verified: Boolean(payload.verified) }),
    ...(payload.visible !== undefined && { visible: Boolean(payload.visible) }),
  };

  await writeFile(all);
  return all[index];
}

export async function deleteTestimonial(id) {
  const all = await readFile();
  const filtered = all.filter((item) => item.id !== id);
  if (filtered.length === all.length) return false;
  await writeFile(filtered);
  return true;
}
