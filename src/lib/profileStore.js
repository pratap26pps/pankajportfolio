import { getDocument, saveDocument } from "@/lib/db";
import { uploadPortfolioFile, deletePortfolioFile } from "@/lib/cloudinary";

const defaultData = {
  name: "Pankaj Pratap Singh",
  designation: "Full-stack developer",
  image: "/image.png",
};

async function readData() {
  const stored = await getDocument("profile", null);
  if (!stored?.image?.trim()) {
    return { ...defaultData, updatedAt: 0 };
  }

  return {
    name: stored.name?.trim() || defaultData.name,
    designation: stored.designation?.trim() || defaultData.designation,
    image: stored.image.trim(),
    updatedAt: stored.updatedAt || 0,
  };
}

export async function getProfileData() {
  return readData();
}

export function getProfileImageSrc(data) {
  const image = data?.image?.trim() || defaultData.image;
  if (!data?.updatedAt) return image;
  const separator = image.includes("?") ? "&" : "?";
  return `${image}${separator}v=${data.updatedAt}`;
}

export async function updateProfile(payload) {
  const current = await readData();
  const nextImage = (payload.image ?? current.image)?.trim();

  if (!nextImage) throw new Error("Profile image is required");

  if (
    current.image?.includes("res.cloudinary.com") &&
    current.image !== nextImage
  ) {
    await deletePortfolioFile(current.image);
  }

  const data = {
    name: (payload.name ?? current.name)?.trim() || defaultData.name,
    designation: (payload.designation ?? current.designation)?.trim() || defaultData.designation,
    image: nextImage,
    updatedAt: Date.now(),
  };

  await saveDocument("profile", data);
  return data;
}

export async function saveUploadedProfileImage(file) {
  return uploadPortfolioFile(file, {
    subfolder: "profile",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    resourceType: "image",
  });
}
