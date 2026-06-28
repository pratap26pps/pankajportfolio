import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_PATH = path.join(process.cwd(), "data", "skills.json");

const defaultData = {
  sectionTitle: "Technologies I've Worked With",
  skills: [],
};

async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAllSkillsData() {
  return readData();
}

export async function getPublicSkillsData() {
  const data = await readData();
  return {
    sectionTitle: data.sectionTitle,
    skills: (data.skills || []).filter((item) => item.visible !== false),
  };
}

export async function updateSkillsSection(payload) {
  const data = await readData();
  if (payload.sectionTitle !== undefined) {
    data.sectionTitle = payload.sectionTitle.trim();
  }
  await writeData(data);
  return data;
}

export async function createSkill(payload) {
  const data = await readData();
  if (!payload.name?.trim()) throw new Error("Skill name is required");

  const item = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    desc: (payload.desc || "").trim(),
    icon: (payload.icon || "mdi:code-tags").trim(),
    visible: payload.visible !== false,
  };
  data.skills.unshift(item);
  await writeData(data);
  return item;
}

export async function updateSkill(id, payload) {
  const data = await readData();
  const index = data.skills.findIndex((item) => item.id === id);
  if (index === -1) return null;

  data.skills[index] = {
    ...data.skills[index],
    ...(payload.name !== undefined && { name: payload.name.trim() }),
    ...(payload.desc !== undefined && { desc: payload.desc.trim() }),
    ...(payload.icon !== undefined && { icon: payload.icon.trim() }),
    ...(payload.visible !== undefined && { visible: Boolean(payload.visible) }),
  };
  await writeData(data);
  return data.skills[index];
}

export async function deleteSkill(id) {
  const data = await readData();
  const before = data.skills.length;
  data.skills = data.skills.filter((item) => item.id !== id);
  if (data.skills.length === before) return false;
  await writeData(data);
  return true;
}
