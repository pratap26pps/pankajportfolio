import fs from "fs/promises";
import path from "path";
import { getDb, assertMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "portfolio_content";

async function readLocalJson(key) {
  try {
    const filePath = path.join(process.cwd(), "data", `${key}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function seedFromLocalJson(key) {
  const local = await readLocalJson(key);
  if (local === null) return null;
  await saveDocument(key, local);
  return local;
}

export async function getDocument(key, defaultValue) {
  assertMongoConfigured();
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ key });

  if (doc?.data !== undefined) {
    return doc.data;
  }

  const seeded = await seedFromLocalJson(key);
  if (seeded !== null) {
    return seeded;
  }

  return defaultValue;
}

export async function saveDocument(key, data) {
  assertMongoConfigured();
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { key },
    {
      $set: {
        key,
        data,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}
