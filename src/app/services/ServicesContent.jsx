"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function ServicesContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white flex items-center justify-center">
        <p className="text-neutral-500">Loading services...</p>
      </main>
    );
  }

  const services = data?.services || [];
  const packages = data?.packages || [];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div
        className="absolute inset-0 z-0 [background-size:110px_110px] [background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 md:pt-32 md:pb-24">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-300 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
          {data?.intro?.title || "Services I Offer"}
        </h1>
        <p className="mt-4 text-neutral-600 dark:text-indigo-200/80 text-lg max-w-2xl">
          {data?.intro?.subtitle || "End-to-end development solutions for startups, businesses, and entrepreneurs."}
        </p>

        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {data?.servicesSectionTitle || "What I Build"}
          </h2>
          {services.length === 0 ? (
            <p className="text-neutral-500">Services coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 hover:border-indigo-400/50 transition-all duration-300"
                >
                  <span className="inline-flex text-indigo-600 dark:text-indigo-400 text-3xl">
                    <Icon icon={service.icon || "mdi:web"} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{service.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {data?.packagesSectionTitle || "Service Packages"}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            {data?.packagesSectionSubtitle || "Flexible pricing based on project scope and requirements."}
          </p>
          {packages.length === 0 ? (
            <p className="text-neutral-500">Packages coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border p-6 flex flex-col ${
                    pkg.highlight
                      ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 shadow-lg scale-[1.02]"
                      : "border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-white/5"
                  }`}
                >
                  {pkg.highlight && (
                    <span className="self-start text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300 mb-3">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mt-1">{pkg.subtitle}</p>
                  <p className="mt-4 text-2xl font-extrabold text-indigo-600 dark:text-indigo-300">
                    {pkg.price}
                  </p>
                  <ul className="mt-6 space-y-2 flex-1">
                    {(pkg.features || []).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/#contact"
                    className="mt-6 inline-flex justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity"
                  >
                    Get a Quote
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
