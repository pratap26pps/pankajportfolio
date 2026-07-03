"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminTestimonials from "./AdminTestimonials";
import AdminProjects from "./AdminProjects";
import AdminServices from "./AdminServices";
import AdminSkills from "./AdminSkills";
import AdminCertifications from "./AdminCertifications";
import { adminFetch, clearAdminToken } from "@/lib/adminFetch";

const tabs = [
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");

  async function handleLogout() {
    await adminFetch("/api/auth/logout", { method: "POST" });
    clearAdminToken();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline">
              ← Back to Portfolio
            </Link>
            <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage portfolio projects, testimonials, services, skills, and certifications
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm self-start"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "projects" && <AdminProjects />}
        {activeTab === "testimonials" && <AdminTestimonials />}
        {activeTab === "services" && <AdminServices />}
        {activeTab === "skills" && <AdminSkills />}
        {activeTab === "certifications" && <AdminCertifications />}
      </div>
    </main>
  );
}
