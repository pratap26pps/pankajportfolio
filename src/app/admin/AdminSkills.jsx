"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Icon } from "@iconify/react";

const emptyForm = {
  name: "",
  desc: "",
  icon: "mdi:code-tags",
  visible: true,
};

export default function AdminSkills() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [sectionTitle, setSectionTitle] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/skills?all=true");
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load");
      setData(json.data);
      setSectionTitle(json.data.sectionTitle || "");
    } catch (err) {
      toast.error(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveSectionTitle(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "section", sectionTitle }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      setData(json.data);
      toast.success("Section title updated");
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
      name: item.name || "",
      desc: item.desc || "",
      icon: item.icon || "mdi:code-tags",
      visible: item.visible !== false,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/skills", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success(editingId ? "Skill updated" : "Skill added");
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
      const res = await fetch("/api/skills", {
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
    if (!confirm("Delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
      toast.success("Skill deleted");
      loadData();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  if (loading) return <p className="text-neutral-500">Loading skills...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize technology skills shown on your portfolio
        </p>
      </div>

      <form onSubmit={saveSectionTitle} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
        <h3 className="text-lg font-semibold">Section Title</h3>
        <input
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          placeholder="Technologies I've Worked With"
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-semibold disabled:opacity-60"
        >
          Save Section Title
        </button>
      </form>

      <div className="flex justify-end">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editingId ? "Edit Skill" : "Add Skill"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Skill name (e.g. React)"
              required
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <input
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Description (e.g. JS Framework)"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Iconify icon (e.g. skill-icons:react-dark)"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
            />
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
            <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 font-semibold disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Update Skill" : "Save Skill"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.skills || []).map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  <Icon icon={item.icon || "mdi:code-tags"} />
                </span>
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-neutral-500">{item.desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleVisible(item.id, !item.visible)}
                className={`relative w-10 h-5 rounded-full shrink-0 transition-colors ${
                  item.visible !== false ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-neutral-900 transition-transform ${
                    item.visible !== false ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => startEdit(item)}
                className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
