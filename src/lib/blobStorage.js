export function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function assertBlobConfiguredOnVercel() {
  if (process.env.VERCEL && !useBlobStorage()) {
    throw new Error(
      "Vercel Blob is not configured. In Vercel Dashboard go to Storage → Create Blob store, connect it to this project, then redeploy."
    );
  }
}
