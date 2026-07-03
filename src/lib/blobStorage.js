import { useGithubStorage } from "@/lib/githubStorage";

export function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

export function useBlobStorage() {
  return Boolean(getBlobToken());
}

export function assertProductionStorageConfigured() {
  if (!process.env.VERCEL) return;

  if (useBlobStorage() || useGithubStorage()) return;

  throw new Error(
    "Production storage is not configured. Choose one option:\n" +
      "• Vercel Blob: Dashboard → Storage → Create Blob → Connect → Redeploy\n" +
      "• GitHub (no Blob needed): Add GITHUB_TOKEN + GITHUB_REPO in Vercel Environment Variables, then redeploy"
  );
}
