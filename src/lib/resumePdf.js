function normalizeCloudinaryUrl(url) {
  return url.replace("/upload/fl_inline/", "/upload/");
}

function isPdfBuffer(buffer) {
  if (buffer.byteLength < 4) return false;
  const bytes = new Uint8Array(buffer.slice(0, 4));
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
}

export async function fetchCloudinaryPdf(storedUrl) {
  const candidates = [normalizeCloudinaryUrl(storedUrl)];

  if (storedUrl.includes("/image/upload/")) {
    candidates.push(
      storedUrl.replace("/image/upload/", "/raw/upload/").replace("/upload/fl_inline/", "/upload/")
    );
  }

  for (const pdfUrl of candidates) {
    try {
      const response = await fetch(pdfUrl, { cache: "no-store" });
      if (!response.ok) continue;

      const buffer = await response.arrayBuffer();
      if (isPdfBuffer(buffer)) {
        return buffer;
      }
    } catch {
      // try next candidate
    }
  }

  return null;
}

export function inlinePdfResponse(buffer, etag) {
  const headers = {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'inline; filename="resume.pdf"',
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "X-Content-Type-Options": "nosniff",
  };

  if (etag) {
    headers.ETag = `"${etag}"`;
  }

  return new Response(buffer, { headers });
}
