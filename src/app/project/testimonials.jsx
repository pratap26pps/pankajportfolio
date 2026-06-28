"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setItems(data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-neutral-500">Loading testimonials...</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400">
        Client testimonials will appear here soon.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 text-left">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 shadow-md transition-colors duration-300"
        >
          <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
            &ldquo;{item.quote}&rdquo;
          </p>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
              {item.name?.charAt(0) || "?"}
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {item.name}
                {item.title ? ` | ${item.title}` : ""}
              </p>
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span>{item.date}</span>
                {item.verified && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
