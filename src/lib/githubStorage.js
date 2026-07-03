const DEFAULT_BRANCH = "main";

function getRepo() {
  return process.env.GITHUB_REPO?.trim() || "";
}

function getToken() {
  return process.env.GITHUB_TOKEN?.trim() || "";
}

function getBranch() {
  return process.env.GITHUB_BRANCH?.trim() || DEFAULT_BRANCH;
}

export function useGithubStorage() {
  return Boolean(getToken() && getRepo());
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function getFileMeta(filePath) {
  const res = await fetch(
    `https://api.github.com/repos/${getRepo()}/contents/${filePath}?ref=${getBranch()}`,
    { headers: githubHeaders(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub read failed (${res.status}): ${err}`);
  }
  return res.json();
}

export async function readGithubText(filePath) {
  const meta = await getFileMeta(filePath);
  if (!meta) return null;

  if (meta.content && meta.encoding === "base64") {
    return Buffer.from(meta.content, "base64").toString("utf-8");
  }

  if (meta.download_url) {
    const res = await fetch(meta.download_url, { cache: "no-store" });
    if (!res.ok) throw new Error(`GitHub download failed (${res.status})`);
    return res.text();
  }

  return null;
}

export async function writeGithubFile(filePath, content, message) {
  const existing = await getFileMeta(filePath);
  const body = {
    message: message || `Update ${filePath} via portfolio admin`,
    content: Buffer.from(content).toString("base64"),
    branch: getBranch(),
  };
  if (existing?.sha) body.sha = existing.sha;

  const res = await fetch(`https://api.github.com/repos/${getRepo()}/contents/${filePath}`, {
    method: "PUT",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.content?.download_url || data.content?.html_url || null;
}

export function githubRawUrl(filePath) {
  const [owner, repo] = getRepo().split("/");
  if (!owner || !repo) return null;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${getBranch()}/${filePath}`;
}

export async function writeGithubBinary(filePath, buffer, message) {
  return writeGithubFile(filePath, buffer, message);
}
