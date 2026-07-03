import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { put, del } from "@vercel/blob";
import { useBlobStorage, assertBlobConfiguredOnVercel } from "@/lib/blobStorage";

function getExtension(file, fallback = ".png") {
  return path.extname(file.name || fallback).toLowerCase() || fallback;
}

function assertAllowedExtension(ext, allowed) {
  if (!allowed.includes(ext)) {
    throw new Error("Unsupported file type");
  }
}

/** Saves an uploaded file to Vercel Blob (production) or public/ (local dev). */
export async function saveUploadedFile(file, { folder, allowedExtensions }) {
  assertBlobConfiguredOnVercel();

  const ext = getExtension(file);
  assertAllowedExtension(ext, allowedExtensions);
  const filename = `${crypto.randomUUID()}${ext}`;
  const key = `${folder}/${filename}`;

  if (useBlobStorage()) {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const uploadDir = path.join(process.cwd(), "public", folder);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return `/${folder}/${filename}`;
}

/** Removes a previously uploaded file (Blob URL or local public/ path). */
export async function deleteUploadedFile(filePath) {
  if (!filePath) return;

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    if (!useBlobStorage()) return;
    try {
      await del(filePath);
    } catch {
      // ignore missing blobs
    }
    return;
  }

  if (!filePath.startsWith("/")) return;

  const localPath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""));
  try {
    await fs.unlink(localPath);
  } catch {
    // ignore missing files
  }
}
