"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Pencil, Upload } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  link: "",
  img: "",
  icon: "skill-icons:nextjs-dark, skill-icons:tailwindcss-dark",
  visible: true,
};

function iconsToString(icon) {
  return Array.isArray(icon) ? icon.join(", ") : icon || "";
}

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/projects?all=true");
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to load");
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      date: item.date || "",
      link: item.link || "",
      img: item.img || "",
      icon: iconsToString(item.icon),
      visible: item.visible !== false,
    });
    setShowForm(true);
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const tid = toast.loading("Uploading image...");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await adminFetch("/api/projects/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");
      setForm((prev) => ({ ...prev, img: data.path }));
      toast.success("Image uploaded");
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
      const payload = {
        ...form,
        icon: form.icon.split(",").map((item) => item.trim()).filter(Boolean),
      };

      const res = await adminFetch("/api/projects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");

      toast.success(editingId ? "Project updated" : "Project added");
      resetForm();
      loadItems();
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(id, visible) {
    try {
      const res = await adminFetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visible }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");
      setItems((prev) => prev.map((item) => (item.id === id ? data.item : item)));
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await adminFetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed");
      toast.success("Project deleted");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Upload, edit, and manage portfolio project cards
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
            } else {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold">{editingId ? "Edit Project" : "Add Project"}</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Project title"
              required
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
            />
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Project description"
              required
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3 sm:col-span-2"
            />
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Date (e.g. June 2025)"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="Live link URL"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Tech icons (comma separated iconify ids)"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Project image</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={form.img}
                onChange={(e) => setForm({ ...form, img: e.target.value })}
                placeholder="Image path e.g. /projects/image.png"
                className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
              />
              <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {form.img && (
              <img src={form.img} alt="Preview" className="h-32 w-full max-w-sm object-cover rounded-lg border border-neutral-200 dark:border-neutral-700" />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
            />
            Visible on portfolio
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Project" : "Save Project"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-neutral-500">Loading projects...</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-500">No projects yet. Click Add Project to create one.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
            >
              {item.img && (
                <img src={item.img} alt={item.title} className="h-40 w-full object-cover" />
              )}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-neutral-500">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-neutral-500">Visible</span>
                    <button
                      type="button"
                      onClick={() => toggleVisible(item.id, !item.visible)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        item.visible ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-neutral-900 transition-transform ${
                          item.visible ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">{item.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
