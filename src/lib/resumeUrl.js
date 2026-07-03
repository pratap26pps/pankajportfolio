/** Resume URLs — PDF only, served via the app viewer. */

export const RESUME_VIEW_PATH = "/api/resume/view";
export const RESUME_PREVIEW_PATH = "/api/resume/preview";

function getResumeCacheVersion(data) {
  if (data?.updatedAt) return data.updatedAt;
  const versionMatch = data?.url?.match(/\/upload\/v(\d+)\//);
  if (versionMatch) return versionMatch[1];
  if (data?.url?.trim()) {
    return encodeURIComponent(data.url.trim().slice(-48));
  }
  return "";
}

/** Nav resume link — cache-busted so browsers always fetch the latest PDF. */
export function getResumeNavHref(data) {
  const version = getResumeCacheVersion(data);
  if (!version) return RESUME_VIEW_PATH;
  return `${RESUME_VIEW_PATH}?v=${version}`;
}

/** Admin embed preview — same-origin proxy, hides PDF toolbar where supported. */
export function getAdminResumePreviewSrc(pdfUrl, localBlobUrl) {
  if (localBlobUrl) return localBlobUrl;
  if (!pdfUrl?.trim()) return null;
  return `${RESUME_PREVIEW_PATH}?url=${encodeURIComponent(pdfUrl.trim())}`;
}

export function getAdminResumeEmbedSrc(src) {
  if (!src) return null;
  if (src.startsWith("blob:")) return src;
  return `${src}#toolbar=0&navpanes=0&scrollbar=0`;
}
