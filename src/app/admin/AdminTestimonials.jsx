"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { toast } from "react-hot-toast";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

const emptyForm = {
  quote: "",
  name: "",
  title: "",
  date: "",
  verified: true,
  visible: true,
};

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/testimonials?all=true");
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to load");
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to create");
      toast.success("Testimonial added");
      setForm(emptyForm);
      setShowForm(false);
      loadItems();
    } catch (err) {
      toast.error(err.message || "Failed to add testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function toggleField(id, field, value) {
    try {
      const res = await adminFetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");
      setItems((prev) => prev.map((item) => (item.id === id ? data.item : item)));
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await adminFetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed");
      toast.success("Testimonial deleted");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Testimonials</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Endorsements from past clients</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold">Add Testimonial</h3>
          <textarea
            rows={4}
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="Testimonial quote"
            required
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              required
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title / Role"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Date (e.g. Oct 2025)"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
              />
              Verified
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              />
              Visible on portfolio
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Testimonial"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-neutral-500">Loading testimonials...</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-500">No testimonials yet. Click Add to create one.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-neutral-500">Visibility</span>
                  <button
                    type="button"
                    onClick={() => toggleField(item.id, "visible", !item.visible)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      item.visible ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                    aria-label="Toggle visibility"
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white dark:bg-neutral-900 transition-transform ${
                        item.visible ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold">
                    {item.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {item.name}
                      {item.title ? ` | ${item.title}` : ""}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span>{item.date}</span>
                      {item.verified && (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleField(item.id, "verified", !item.verified)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700"
                  >
                    {item.verified ? "Unverify" : "Verify"}
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
