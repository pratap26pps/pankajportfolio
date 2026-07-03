"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { getAdminResumeEmbedSrc, getAdminResumePreviewSrc } from "@/lib/resumeUrl";

async function readApiJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (res.status === 413) {
      throw new Error("PDF is too large. Max size is about 4 MB.");
    }
    throw new Error("Server returned an invalid response. Please try again.");
  }
}

function ResumePreview({ src }) {
  const embedSrc = getAdminResumeEmbedSrc(src);
  if (!embedSrc) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Preview</p>
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950">
        <iframe
          src={embedSrc}
          title="Resume preview"
          className="h-[min(70vh,640px)] w-full bg-white"
        />
      </div>
    </div>
  );
}

export default function AdminResume() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);

  const previewSrc = getAdminResumePreviewSrc(pdfUrl, localPreviewUrl);

  useEffect(() => {
    return () => {
      setLocalPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
    };
  }, []);

  function clearLocalPreview() {
    setLocalPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }

  async function saveResume(nextUrl) {
    const res = await adminFetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: nextUrl.trim() }),
    });
    const json = await readApiJson(res);
    if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
    setPdfUrl(json.data.url || "");
    return json;
  }

  async function loadData() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/resume");
      const json = await readApiJson(res);
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load");
      clearLocalPreview();
      setPdfUrl(json.data.url || "");
    } catch (err) {
      toast.error(err.message || "Failed to load resume settings");
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

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file");
      e.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("PDF must be under 4 MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    const tid = toast.loading("Uploading resume PDF...");
    try {
      clearLocalPreview();
      setLocalPreviewUrl(URL.createObjectURL(file));

      const body = new FormData();
      body.append("file", file);
      const res = await adminFetch("/api/resume/upload", { method: "POST", body });
      const json = await readApiJson(res);
      if (!res.ok || !json.ok) throw new Error(json.error || "Upload failed");

      setPdfUrl(json.path);
      toast.success("PDF uploaded — preview below, then click Save Resume");
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

    if (!pdfUrl.trim()) {
      toast.error("Upload a PDF first");
      return;
    }

    setSaving(true);
    try {
      await saveResume(pdfUrl);
      clearLocalPreview();
      toast.success("Resume saved — nav icon opens your PDF in a new tab");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-neutral-500">Loading resume settings...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Resume</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Upload your resume PDF — preview appears below. Save to update the nav resume icon.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6"
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium">Resume PDF</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={pdfUrl ? "PDF ready — preview below" : ""}
              readOnly
              placeholder="No PDF uploaded yet"
              className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-4 py-2.5 text-sm"
            />
            <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-neutral-500">
            Upload PDF → preview below → click <strong>Save Resume</strong> → nav resume icon opens it in a new tab
          </p>
        </div>

        <ResumePreview src={previewSrc} />

        <button
          type="submit"
          disabled={saving || uploading || !pdfUrl.trim()}
          className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Resume"}
        </button>
      </form>
    </div>
  );
}
