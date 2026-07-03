import fs from "fs/promises";
import path from "path";
import { put, list } from "@vercel/blob";
import {
  useBlobStorage,
  getBlobToken,
  assertProductionStorageConfigured,
} from "@/lib/blobStorage";
import { useGithubStorage, readGithubText, writeGithubFile } from "@/lib/githubStorage";

function blobKey(filename) {
  return `data/${filename}`;
}

async function readFromBlob(filename) {
  const key = blobKey(filename);
  const { blobs } = await list({ prefix: key, limit: 10, token: getBlobToken() });
  const match = blobs.find((blob) => blob.pathname === key);
  if (!match) return null;

  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return null;
  return JSON.parse(await res.text());
}

async function readFromGithub(filename) {
  const text = await readGithubText(`data/${filename}`);
  if (!text) return null;
  return JSON.parse(text);
}

async function readFromLocal(filename) {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function readJsonFile(filename, defaultValue) {
  try {
    if (useBlobStorage()) {
      const blobData = await readFromBlob(filename);
      if (blobData !== null) return blobData;
    }

    if (process.env.VERCEL && useGithubStorage()) {
      const githubData = await readFromGithub(filename);
      if (githubData !== null) return githubData;
    }

    return await readFromLocal(filename);
  } catch {
    return defaultValue;
  }
}

export async function writeJsonFile(filename, data) {
  assertProductionStorageConfigured();

  const content = JSON.stringify(data, null, 2);

  if (useBlobStorage()) {
    await put(blobKey(filename), content, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      allowOverwrite: true,
      token: getBlobToken(),
    });
    return;
  }

  if (process.env.VERCEL && useGithubStorage()) {
    await writeGithubFile(`data/${filename}`, content, `Update ${filename} via admin`);
    return;
  }

  const filePath = path.join(process.cwd(), "data", filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}
