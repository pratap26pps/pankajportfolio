import path from "path";
import crypto from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/jsonStore";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/uploadStorage";

const DATA_FILE = "certifications.json";

const defaultData = {
  pageTitle: "Certifications",
  pageSubtitle: "",
  certifications: [],
};

async function readData() {
  const data = await readJsonFile(DATA_FILE, defaultData);
  return { ...defaultData, ...data };
}

async function writeData(data) {
  await writeJsonFile(DATA_FILE, data);
}

export async function getAllCertificationsData() {
  return readData();
}

export async function getPublicCertificationsData() {
  const data = await readData();
  return {
    pageTitle: data.pageTitle,
    pageSubtitle: data.pageSubtitle,
    certifications: (data.certifications || []).filter((item) => item.visible !== false),
  };
}

export async function updateCertificationsPage(payload) {
  const data = await readData();
  if (payload.pageTitle !== undefined) data.pageTitle = payload.pageTitle.trim();
  if (payload.pageSubtitle !== undefined) data.pageSubtitle = payload.pageSubtitle.trim();
  await writeData(data);
  return data;
}

export async function createCertification(payload) {
  const data = await readData();
  if (!payload.title?.trim()) throw new Error("Title is required");
  if (!payload.image?.trim()) throw new Error("Certificate image is required");

  const item = {
    id: crypto.randomUUID(),
    title: payload.title.trim(),
    issuer: (payload.issuer || "").trim(),
    date: (payload.date || "").trim(),
    description: (payload.description || "").trim(),
    category: (payload.category || "Course").trim(),
    image: payload.image.trim(),
    verifyLink: (payload.verifyLink || "").trim(),
    visible: payload.visible !== false,
  };
  data.certifications.unshift(item);
  await writeData(data);
  return item;
}

export async function updateCertification(id, payload) {
  const data = await readData();
  const index = data.certifications.findIndex((item) => item.id === id);
  if (index === -1) return null;

  data.certifications[index] = {
    ...data.certifications[index],
    ...(payload.title !== undefined && { title: payload.title.trim() }),
    ...(payload.issuer !== undefined && { issuer: payload.issuer.trim() }),
    ...(payload.date !== undefined && { date: payload.date.trim() }),
    ...(payload.description !== undefined && { description: payload.description.trim() }),
    ...(payload.category !== undefined && { category: payload.category.trim() }),
    ...(payload.image !== undefined && { image: payload.image.trim() }),
    ...(payload.verifyLink !== undefined && { verifyLink: payload.verifyLink.trim() }),
    ...(payload.visible !== undefined && { visible: Boolean(payload.visible) }),
  };
  await writeData(data);
  return data.certifications[index];
}

export async function deleteCertification(id) {
  const data = await readData();
  const cert = data.certifications.find((item) => item.id === id);
  if (!cert) return false;

  if (cert.image) {
    await deleteUploadedFile(cert.image);
  }

  data.certifications = data.certifications.filter((item) => item.id !== id);
  await writeData(data);
  return true;
}

export async function saveUploadedCertificationImage(file) {
  return saveUploadedFile(file, {
    folder: "certifications",
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf"],
  });
}
