import crypto from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/jsonStore";

const DATA_FILE = "testimonials.json";

async function readFile() {
  const data = await readJsonFile(DATA_FILE, []);
  return Array.isArray(data) ? data : [];
}

async function writeFile(data) {
  await writeJsonFile(DATA_FILE, data);
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
