"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function CertificationsContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/certifications")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center">
        <p className="text-neutral-500">Loading certifications...</p>
      </main>
    );
  }

  const certs = data?.certifications || [];

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
          {data?.pageTitle || "Certifications"}
        </h1>
        <p className="mt-4 text-neutral-600 dark:text-indigo-200/80 text-lg max-w-2xl">
          {data?.pageSubtitle || "Academic approvals, internships, and professional certificates."}
        </p>

        {certs.length === 0 ? (
          <p className="mt-12 text-neutral-500">Certifications will appear here soon.</p>
        ) : (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => setSelected(cert)}
                className="text-left rounded-2xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md overflow-hidden hover:border-indigo-400/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-48 bg-neutral-100 dark:bg-neutral-950">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                    {cert.category}
                  </span>
                  <h3 className="mt-1 font-bold text-base leading-snug">{cert.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{cert.issuer}</p>
                  <p className="text-sm text-neutral-400">{cert.date}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="relative w-full min-h-[300px] bg-neutral-100 dark:bg-neutral-950">
              <Image
                src={selected.image}
                alt={selected.title}
                width={900}
                height={700}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                {selected.category}
              </span>
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <p className="text-neutral-500">{selected.issuer} · {selected.date}</p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{selected.description}</p>
              {selected.verifyLink && (
                <a
                  href={selected.verifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:underline"
                >
                  Verify Certificate <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
