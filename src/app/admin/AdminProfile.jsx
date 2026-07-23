"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";

async function readApiJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (res.status === 413) {
      throw new Error("Image is too large. Max size is about 4 MB.");
    }
    throw new Error("Server returned an invalid response. Please try again.");
  }
}

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    return () => {
      setPreviewUrl((current) => {
        if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
        return "";
      });
    };
  }, []);

  function clearLocalPreview() {
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return "";
    });
  }

  async function saveProfile(nextImage) {
    const rawImage = nextImage.trim().split("?")[0];
    const res = await adminFetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: rawImage }),
    });
    const json = await readApiJson(res);
    if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
    setImageUrl(json.data.image || "");
    return json;
  }

  async function loadData() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/profile");
      const json = await readApiJson(res);
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load");
      clearLocalPreview();
      setImageUrl(json.data.image || "");
    } catch (err) {
      toast.error(err.message || "Failed to load profile settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      e.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4 MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    const tid = toast.loading("Uploading profile photo...");
    try {
      clearLocalPreview();
      setPreviewUrl(URL.createObjectURL(file));

      const body = new FormData();
      body.append("file", file);
      const res = await adminFetch("/api/profile/upload", { method: "POST", body });
      const json = await readApiJson(res);
      if (!res.ok || !json.ok) throw new Error(json.error || "Upload failed");

      setImageUrl(json.path);
      toast.success("Photo uploaded — preview below, then click Save Profile");
    } catch (err) {
      clearLocalPreview();
      toast.error(err.message || "Upload failed");
    } finally {
      toast.dismiss(tid);
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!imageUrl.trim()) {
      toast.error("Upload a profile photo first");
      return;
    }

    setSaving(true);
    try {
      const json = await saveProfile(imageUrl);
      clearLocalPreview();
      setImageUrl(json.data.image || "");
      toast.success("Profile photo saved — navbar updated");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const displayImage = previewUrl || imageUrl;

  if (loading) {
    return <p className="text-neutral-500">Loading profile settings...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Profile Photo</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Update the circular profile photo shown in the navbar.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6"
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium">Navbar profile photo</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={imageUrl ? "Photo ready — preview below" : ""}
              readOnly
              placeholder="No photo uploaded yet"
              className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-4 py-2.5 text-sm"
            />
            <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-neutral-500">
            Upload photo → preview below → click <strong>Save Profile</strong> to update the navbar
          </p>
        </div>

        {displayImage && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview</p>
            <div className="flex items-center gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 p-6">
              <Image
                src={displayImage}
                alt="Profile preview"
                width={112}
                height={112}
                unoptimized={displayImage.startsWith("blob:")}
                className="h-28 w-28 rounded-full border-2 border-white object-cover object-top shadow-md"
              />
              <p className="text-sm text-neutral-500">
                This is how your profile photo will appear in the navbar.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || uploading || !imageUrl.trim()}
          className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
