import crypto from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/jsonStore";

const DATA_FILE = "services.json";

const defaultData = {
  intro: { title: "", subtitle: "" },
  servicesSectionTitle: "What I Build",
  packagesSectionTitle: "Service Packages",
  packagesSectionSubtitle: "",
  services: [],
  packages: [],
};

async function readData() {
  const data = await readJsonFile(DATA_FILE, defaultData);
  return { ...defaultData, ...data };
}

async function writeData(data) {
  await writeJsonFile(DATA_FILE, data);
}

function normalizeFeatures(features) {
  if (Array.isArray(features)) return features.map((f) => String(f).trim()).filter(Boolean);
  if (typeof features === "string") {
    return features.split("\n").map((f) => f.trim()).filter(Boolean);
  }
  return [];
}

export async function getAllServicesData() {
  return readData();
}

export async function getPublicServicesData() {
  const data = await readData();
  return {
    ...data,
    services: (data.services || []).filter((item) => item.visible !== false),
    packages: (data.packages || []).filter((item) => item.visible !== false),
  };
}

export async function updateServicesIntro(payload) {
  const data = await readData();
  data.intro = {
    title: (payload.title ?? data.intro?.title ?? "").trim(),
    subtitle: (payload.subtitle ?? data.intro?.subtitle ?? "").trim(),
  };
  if (payload.servicesSectionTitle !== undefined) {
    data.servicesSectionTitle = payload.servicesSectionTitle.trim();
  }
  if (payload.packagesSectionTitle !== undefined) {
    data.packagesSectionTitle = payload.packagesSectionTitle.trim();
  }
  if (payload.packagesSectionSubtitle !== undefined) {
    data.packagesSectionSubtitle = payload.packagesSectionSubtitle.trim();
  }
  await writeData(data);
  return data;
}

export async function createService(payload) {
  const data = await readData();
  if (!payload.title?.trim()) throw new Error("Title is required");

  const item = {
    id: crypto.randomUUID(),
    title: payload.title.trim(),
    description: (payload.description || "").trim(),
    icon: (payload.icon || "mdi:web").trim(),
    visible: payload.visible !== false,
  };
  data.services.unshift(item);
  await writeData(data);
  return item;
}

export async function updateService(id, payload) {
  const data = await readData();
  const index = data.services.findIndex((item) => item.id === id);
  if (index === -1) return null;

  data.services[index] = {
    ...data.services[index],
    ...(payload.title !== undefined && { title: payload.title.trim() }),
    ...(payload.description !== undefined && { description: payload.description.trim() }),
    ...(payload.icon !== undefined && { icon: payload.icon.trim() }),
    ...(payload.visible !== undefined && { visible: Boolean(payload.visible) }),
  };
  await writeData(data);
  return data.services[index];
}

export async function deleteService(id) {
  const data = await readData();
  const before = data.services.length;
  data.services = data.services.filter((item) => item.id !== id);
  if (data.services.length === before) return false;
  await writeData(data);
  return true;
}

export async function createPackage(payload) {
  const data = await readData();
  if (!payload.name?.trim()) throw new Error("Package name is required");

  const item = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    subtitle: (payload.subtitle || "").trim(),
    price: (payload.price || "").trim(),
    features: normalizeFeatures(payload.features),
    highlight: Boolean(payload.highlight),
    visible: payload.visible !== false,
  };
  data.packages.unshift(item);
  await writeData(data);
  return item;
}

export async function updatePackage(id, payload) {
  const data = await readData();
  const index = data.packages.findIndex((item) => item.id === id);
  if (index === -1) return null;

  data.packages[index] = {
    ...data.packages[index],
    ...(payload.name !== undefined && { name: payload.name.trim() }),
    ...(payload.subtitle !== undefined && { subtitle: payload.subtitle.trim() }),
    ...(payload.price !== undefined && { price: payload.price.trim() }),
    ...(payload.features !== undefined && { features: normalizeFeatures(payload.features) }),
    ...(payload.highlight !== undefined && { highlight: Boolean(payload.highlight) }),
    ...(payload.visible !== undefined && { visible: Boolean(payload.visible) }),
  };
  await writeData(data);
  return data.packages[index];
}

export async function deletePackage(id) {
  const data = await readData();
  const before = data.packages.length;
  data.packages = data.packages.filter((item) => item.id !== id);
  if (data.packages.length === before) return false;
  await writeData(data);
  return true;
}
