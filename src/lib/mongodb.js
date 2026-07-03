import { MongoClient } from "mongodb";

const uri = process.env.PROJECT_URL?.trim();

let client;
let clientPromise;

function getClientPromise() {
  if (!uri) {
    throw new Error("PROJECT_URL is not configured");
  }

  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb() {
  const connected = await getClientPromise();
  return connected.db();
}

export function assertMongoConfigured() {
  if (!uri) {
    throw new Error("MongoDB is not configured. Set PROJECT_URL in your environment variables.");
  }
}
