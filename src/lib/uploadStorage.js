import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { put, del } from "@vercel/blob";
import {
  useBlobStorage,
  getBlobToken,
  assertProductionStorageConfigured,
} from "@/lib/blobStorage";
import {
  useGithubStorage,
  writeGithubFile,
  githubRawUrl,
} from "@/lib/githubStorage";

function getExtension(file, fallback = ".png") {
  return path.extname(file.name || fallback).toLowerCase() || fallback;
}

function assertAllowedExtension(ext, allowed) {
  if (!allowed.includes(ext)) {
    throw new Error("Unsupported file type");
  }
}

export async function saveUploadedFile(file, { folder, allowedExtensions }) {
  assertProductionStorageConfigured();

  const ext = getExtension(file);
  assertAllowedExtension(ext, allowedExtensions);
  const filename = `${crypto.randomUUID()}${ext}`;
  const key = `${folder}/${filename}`;

  if (useBlobStorage()) {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
      token: getBlobToken(),
    });
    return blob.url;
  }

  if (process.env.VERCEL && useGithubStorage()) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = `public/${folder}/${filename}`;
    await writeGithubFile(filePath, buffer, `Upload ${filename} via admin`);
    return githubRawUrl(filePath);
  }

  const uploadDir = path.join(process.cwd(), "public", folder);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return `/${folder}/${filename}`;
}

export async function deleteUploadedFile(filePath) {
  if (!filePath) return;

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    if (useBlobStorage()) {
      try {
        await del(filePath, { token: getBlobToken() });
      } catch {
        // ignore missing blobs
      }
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
