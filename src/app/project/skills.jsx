"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export function SkillsSection() {
  const [sectionTitle, setSectionTitle] = useState("Technologies I've Worked With");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setSectionTitle(json.data.sectionTitle || "Technologies I've Worked With");
          setSkills(json.data.skills || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-neutral-500 dark:text-neutral-400">Loading skills...</p>;
  }

  if (skills.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400">
        Skills will appear here once added from the admin dashboard.
      </p>
    );
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        {sectionTitle}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-neutral-900 dark:text-white">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 px-3 sm:px-5 py-4 sm:py-5 min-w-0 bg-neutral-900/5 dark:bg-white/5 backdrop-blur-md border border-neutral-300 dark:border-white/10 rounded-2xl hover:bg-cyan-600/10 dark:hover:bg-cyan-700/30 transition-all duration-300 shadow-md text-left"
          >
            <span className="text-xl sm:text-2xl shrink-0">
              <Icon icon={skill.icon || "mdi:code-tags"} />
            </span>
            <div className="min-w-0">
              <p className="text-sm sm:text-lg font-bold break-words">{skill.name}</p>
              <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-300 break-words">{skill.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
