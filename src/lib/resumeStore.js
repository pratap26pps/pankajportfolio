import { getDocument, saveDocument } from "@/lib/db";
import { uploadResumePdf, deletePortfolioFile } from "@/lib/cloudinary";

const defaultData = {
  type: "pdf",
  url: "",
};

async function readData() {
  const stored = await getDocument("resume", null);
  if (!stored?.url?.trim()) {
    return { ...defaultData };
  }

  return {
    type: "pdf",
    url: stored.url.trim(),
    updatedAt: stored.updatedAt || extractVersionFromUrl(stored.url),
  };
}

function extractVersionFromUrl(url) {
  const versionMatch = url?.match(/\/upload\/v(\d+)\//);
  if (versionMatch) return Number(versionMatch[1]);
  return 0;
}

export async function getResumeData() {
  return readData();
}

export async function getResumeUrl() {
  const data = await readData();
  return data.url?.trim() || "";
}

export async function updateResume(payload) {
  const current = await readData();
  const nextUrl = (payload.url ?? current.url)?.trim();

  if (!nextUrl) throw new Error("Resume PDF is required");

  if (
    current.url?.includes("res.cloudinary.com") &&
    current.url !== nextUrl
  ) {
    await deletePortfolioFile(current.url);
  }

  const data = { type: "pdf", url: nextUrl, updatedAt: Date.now() };
  await saveDocument("resume", data);
  return data;
}

export async function saveUploadedResumePdf(file) {
  return uploadResumePdf(file);
}
