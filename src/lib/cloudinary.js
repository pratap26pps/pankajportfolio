import { v2 as cloudinary } from "cloudinary";
import path from "path";

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });
}

export function assertCloudinaryConfigured() {
  if (!process.env.CLOUD_NAME?.trim() || !process.env.API_KEY?.trim() || !process.env.API_SECRET?.trim()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUD_NAME, API_KEY, and API_SECRET in your environment variables."
    );
  }
}

function getCloudinaryFolder(subfolder) {
  const base = process.env.FOLDER_NAME?.trim() || "portfolio";
  return subfolder ? `${base}/${subfolder}` : base;
}

function assertAllowedExtension(file, allowedExtensions) {
  const ext = path.extname(file.name || ".png").toLowerCase() || ".png";
  if (!allowedExtensions.includes(ext)) {
    throw new Error("Unsupported file type");
  }
}

export function resourceTypeFromUrl(url) {
  if (!url?.includes("res.cloudinary.com")) return "auto";
  if (url.includes("/raw/upload/")) return "raw";
  if (url.includes("/video/upload/")) return "video";
  if (url.includes("/image/upload/")) return "image";
  return "auto";
}

function publicIdFromUrl(url) {
  if (!url?.includes("res.cloudinary.com")) return null;
  const afterUpload = url.split("/upload/")[1];
  if (!afterUpload) return null;
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  return withoutVersion.replace(/\.[^/.]+$/, "");
}

export async function uploadResumePdf(file) {
  assertCloudinaryConfigured();
  assertAllowedExtension(file, [".pdf"]);
  configureCloudinary();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: getCloudinaryFolder("resume"),
        resource_type: "raw",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

export async function uploadPortfolioFile(file, { subfolder, allowedExtensions, resourceType = "auto" }) {
  assertCloudinaryConfigured();
  assertAllowedExtension(file, allowedExtensions);
  configureCloudinary();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: getCloudinaryFolder(subfolder),
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function deletePortfolioFile(url) {
  const publicId = publicIdFromUrl(url);
  if (!publicId) return;

  assertCloudinaryConfigured();
  configureCloudinary();

  const resourceType = resourceTypeFromUrl(url);

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch {
    // ignore missing assets
  }
}
