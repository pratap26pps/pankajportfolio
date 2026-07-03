"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Pencil, Upload } from "lucide-react";

const categories = ["Academic", "Internship", "Course", "Simulation", "Other"];

const emptyForm = {
  title: "",
  issuer: "",
  date: "",
  description: "",
  category: "Course",
  image: "",
  verifyLink: "",
  visible: true,
};

export default function AdminCertifications() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [pageForm, setPageForm] = useState({ pageTitle: "", pageSubtitle: "" });

  async function loadData() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/certifications?all=true");
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load");
      setData(json.data);
      setPageForm({
        pageTitle: json.data.pageTitle || "",
        pageSubtitle: json.data.pageSubtitle || "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load certifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function savePage(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "page", ...pageForm }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      setData(json.data);
      toast.success("Page content updated");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      issuer: item.issuer || "",
      date: item.date || "",
      description: item.description || "",
      category: item.category || "Course",
      image: item.image || "",
      verifyLink: item.verifyLink || "",
      visible: item.visible !== false,
    });
    setShowForm(true);
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const tid = toast.loading("Uploading certificate...");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await adminFetch("/api/certifications/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Upload failed");
      setForm((prev) => ({ ...prev, image: json.path }));
      toast.success("Certificate uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      toast.dismiss(tid);
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/certifications", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success(editingId ? "Certification updated" : "Certification added");
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(id, visible) {
    try {
      const res = await adminFetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visible }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Update failed");
      loadData();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this certification?")) return;
    try {
      const res = await adminFetch(`/api/certifications?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
      toast.success("Certification deleted");
      loadData();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  if (loading) return <p className="text-neutral-500">Loading certifications...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Certifications</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Upload and manage certificates shown on the certifications page
        </p>
      </div>

      <form onSubmit={savePage} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
        <h3 className="text-lg font-semibold">Page Content</h3>
        <input
          value={pageForm.pageTitle}
          onChange={(e) => setPageForm({ ...pageForm, pageTitle: e.target.value })}
          placeholder="Page title"
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
        />
        <textarea
          rows={2}
          value={pageForm.pageSubtitle}
          onChange={(e) => setPageForm({ ...pageForm, pageSubtitle: e.target.value })}
          placeholder="Page subtitle"
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3"
        />
        <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 font-semibold disabled:opacity-60">
          Save Page Content
        </button>
      </form>

      <div className="flex justify-end">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editingId ? "Edit Certification" : "Add Certification"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Certificate title"
              required
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
            />
            <input
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              placeholder="Issuing organization"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Date (e.g. May 2025)"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3 sm:col-span-2"
            />
            <input
              value={form.verifyLink}
              onChange={(e) => setForm({ ...form, verifyLink: e.target.value })}
              placeholder="Verification link (optional)"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Certificate image</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/certifications/your-file.png"
                required
                className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
              />
              <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {form.image && (
              <img src={form.image} alt="Preview" className="h-40 max-w-xs object-contain rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white" />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
            Visible on certifications page
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 font-semibold disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {(data?.certifications || []).map((item) => (
          <article key={item.id} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
            {item.image && (
              <img src={item.image} alt={item.title} className="h-44 w-full object-contain bg-neutral-100 dark:bg-neutral-950 p-2" />
            )}
            <div className="p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                    {item.category}
                  </span>
                  <h4 className="font-semibold mt-1">{item.title}</h4>
                  <p className="text-sm text-neutral-500">{item.issuer} · {item.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisible(item.id, !item.visible)}
                  className={`relative w-10 h-5 rounded-full shrink-0 transition-colors ${
                    item.visible !== false ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-neutral-900 transition-transform ${
                    item.visible !== false ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">{item.description}</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => startEdit(item)} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
