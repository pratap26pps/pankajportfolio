"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const emptyServiceForm = {
  title: "",
  description: "",
  icon: "mdi:web",
  visible: true,
};

const emptyPackageForm = {
  name: "",
  subtitle: "",
  price: "",
  features: "",
  highlight: false,
  visible: true,
};

function VisibilityToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        checked ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-neutral-900 transition-transform ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function AdminServices() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState("cards");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [packageForm, setPackageForm] = useState(emptyPackageForm);
  const [introForm, setIntroForm] = useState({
    title: "",
    subtitle: "",
    servicesSectionTitle: "",
    packagesSectionTitle: "",
    packagesSectionSubtitle: "",
  });

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/services?all=true");
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load");
      setData(json.data);
      setIntroForm({
        title: json.data.intro?.title || "",
        subtitle: json.data.intro?.subtitle || "",
        servicesSectionTitle: json.data.servicesSectionTitle || "",
        packagesSectionTitle: json.data.packagesSectionTitle || "",
        packagesSectionSubtitle: json.data.packagesSectionSubtitle || "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveIntro(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "intro", ...introForm }),
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

  function resetServiceForm() {
    setServiceForm(emptyServiceForm);
    setEditingServiceId(null);
    setShowServiceForm(false);
  }

  function resetPackageForm() {
    setPackageForm(emptyPackageForm);
    setEditingPackageId(null);
    setShowPackageForm(false);
  }

  function startEditService(item) {
    setEditingServiceId(item.id);
    setServiceForm({
      title: item.title || "",
      description: item.description || "",
      icon: item.icon || "mdi:web",
      visible: item.visible !== false,
    });
    setShowServiceForm(true);
    setSection("cards");
  }

  function startEditPackage(item) {
    setEditingPackageId(item.id);
    setPackageForm({
      name: item.name || "",
      subtitle: item.subtitle || "",
      price: item.price || "",
      features: (item.features || []).join("\n"),
      highlight: Boolean(item.highlight),
      visible: item.visible !== false,
    });
    setShowPackageForm(true);
    setSection("packages");
  }

  async function submitService(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: editingServiceId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "service",
          ...(editingServiceId && { id: editingServiceId }),
          ...serviceForm,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success(editingServiceId ? "Service updated" : "Service added");
      resetServiceForm();
      loadData();
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function submitPackage(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: editingPackageId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "package",
          ...(editingPackageId && { id: editingPackageId }),
          ...packageForm,
          features: packageForm.features.split("\n").map((f) => f.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success(editingPackageId ? "Package updated" : "Package added");
      resetPackageForm();
      loadData();
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleServiceField(id, field, value) {
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "service", id, [field]: value }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Update failed");
      loadData();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  async function togglePackageField(id, field, value) {
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "package", id, [field]: value }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Update failed");
      loadData();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  async function handleDelete(entity, id) {
    if (!confirm(`Delete this ${entity}?`)) return;
    try {
      const res = await fetch(`/api/services?entity=${entity}&id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
      toast.success("Deleted successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  if (loading) return <p className="text-neutral-500">Loading services...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Services</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize service cards, pricing packages, and page content
        </p>
      </div>

      <form onSubmit={saveIntro} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
        <h3 className="text-lg font-semibold">Page Content</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            value={introForm.title}
            onChange={(e) => setIntroForm({ ...introForm, title: e.target.value })}
            placeholder="Page title"
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
          />
          <textarea
            rows={2}
            value={introForm.subtitle}
            onChange={(e) => setIntroForm({ ...introForm, subtitle: e.target.value })}
            placeholder="Page subtitle"
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3 sm:col-span-2"
          />
          <input
            value={introForm.servicesSectionTitle}
            onChange={(e) => setIntroForm({ ...introForm, servicesSectionTitle: e.target.value })}
            placeholder="Services section title"
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
          />
          <input
            value={introForm.packagesSectionTitle}
            onChange={(e) => setIntroForm({ ...introForm, packagesSectionTitle: e.target.value })}
            placeholder="Packages section title"
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
          />
          <input
            value={introForm.packagesSectionSubtitle}
            onChange={(e) => setIntroForm({ ...introForm, packagesSectionSubtitle: e.target.value })}
            placeholder="Packages section subtitle"
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-semibold disabled:opacity-60"
        >
          Save Page Content
        </button>
      </form>

      <div className="flex flex-wrap gap-2 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 w-fit">
        {[
          { id: "cards", label: "Service Cards" },
          { id: "packages", label: "Pricing Packages" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSection(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              section === tab.id
                ? "bg-emerald-600 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {section === "cards" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                resetServiceForm();
                setShowServiceForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          {showServiceForm && (
            <form onSubmit={submitService} className="mb-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
              <h3 className="font-semibold">{editingServiceId ? "Edit Service" : "Add Service"}</h3>
              <input
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                placeholder="Service title"
                required
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
              />
              <textarea
                rows={3}
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Service description"
                required
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3"
              />
              <input
                value={serviceForm.icon}
                onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                placeholder="Iconify icon id (e.g. mdi:web)"
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={serviceForm.visible}
                  onChange={(e) => setServiceForm({ ...serviceForm, visible: e.target.checked })}
                />
                Visible on services page
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 font-semibold disabled:opacity-60">
                  {saving ? "Saving..." : editingServiceId ? "Update" : "Save"}
                </button>
                <button type="button" onClick={resetServiceForm} className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {(data?.services || []).map((item) => (
              <article key={item.id} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl text-indigo-500">
                      <Icon icon={item.icon || "mdi:web"} />
                    </span>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <VisibilityToggle
                    checked={item.visible !== false}
                    onChange={(v) => toggleServiceField(item.id, "visible", v)}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => startEditService(item)} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete("service", item.id)} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {section === "packages" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                resetPackageForm();
                setShowPackageForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Package
            </button>
          </div>

          {showPackageForm && (
            <form onSubmit={submitPackage} className="mb-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
              <h3 className="font-semibold">{editingPackageId ? "Edit Package" : "Add Package"}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  placeholder="Package name"
                  required
                  className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
                />
                <input
                  value={packageForm.subtitle}
                  onChange={(e) => setPackageForm({ ...packageForm, subtitle: e.target.value })}
                  placeholder="Subtitle"
                  className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5"
                />
                <input
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                  placeholder="Price (e.g. ₹15,000–₹25,000)"
                  className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 sm:col-span-2"
                />
              </div>
              <textarea
                rows={4}
                value={packageForm.features}
                onChange={(e) => setPackageForm({ ...packageForm, features: e.target.value })}
                placeholder="Features (one per line)"
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3"
              />
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={packageForm.highlight}
                    onChange={(e) => setPackageForm({ ...packageForm, highlight: e.target.checked })}
                  />
                  Mark as Most Popular
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={packageForm.visible}
                    onChange={(e) => setPackageForm({ ...packageForm, visible: e.target.checked })}
                  />
                  Visible on services page
                </label>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 font-semibold disabled:opacity-60">
                  {saving ? "Saving..." : editingPackageId ? "Update" : "Save"}
                </button>
                <button type="button" onClick={resetPackageForm} className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data?.packages || []).map((item) => (
              <article
                key={item.id}
                className={`rounded-2xl border p-5 ${
                  item.highlight
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-neutral-500">{item.subtitle}</p>
                    <p className="text-indigo-600 dark:text-indigo-300 font-bold mt-2">{item.price}</p>
                  </div>
                  <VisibilityToggle
                    checked={item.visible !== false}
                    onChange={(v) => togglePackageField(item.id, "visible", v)}
                  />
                </div>
                <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1 mb-4">
                  {(item.features || []).slice(0, 3).map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button onClick={() => startEditPackage(item)} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete("package", item.id)} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
