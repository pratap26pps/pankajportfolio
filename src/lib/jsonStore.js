import fs from "fs/promises";
import path from "path";
import { put, list } from "@vercel/blob";
import { useBlobStorage, assertBlobConfiguredOnVercel } from "@/lib/blobStorage";

function blobKey(filename) {
  return `data/${filename}`;
}

async function readFromBlob(filename) {
  const key = blobKey(filename);
  const { blobs } = await list({ prefix: key, limit: 10 });
  const match = blobs.find((blob) => blob.pathname === key);
  if (!match) return null;

  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return null;
  return JSON.parse(await res.text());
}

async function readFromLocal(filename) {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

/** Read JSON — Blob override first on Vercel, then bundled data/*.json from the deploy. */
export async function readJsonFile(filename, defaultValue) {
  try {
    if (useBlobStorage()) {
      const blobData = await readFromBlob(filename);
      if (blobData !== null) return blobData;
    }
    return await readFromLocal(filename);
  } catch {
    return defaultValue;
  }
}

/** Write JSON — Blob on Vercel/production, local data/ folder in dev. */
export async function writeJsonFile(filename, data) {
  assertBlobConfiguredOnVercel();

  const content = JSON.stringify(data, null, 2);

  if (useBlobStorage()) {
    await put(blobKey(filename), content, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      allowOverwrite: true,
    });
    return;
  }

  const filePath = path.join(process.cwd(), "data", filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}
