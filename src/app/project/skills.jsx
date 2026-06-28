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
      <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-col-3 justify-center gap-4 text-neutral-900 dark:text-white">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-4 px-6 py-5 bg-neutral-900/5 dark:bg-white/5 backdrop-blur-md border border-neutral-300 dark:border-white/10 rounded-2xl hover:bg-cyan-600/10 dark:hover:bg-cyan-700/30 transition-all duration-300 shadow-md"
          >
            <span className="text-2xl">
              <Icon icon={skill.icon || "mdi:code-tags"} />
            </span>
            <div>
              <p className="text-lg font-bold">{skill.name}</p>
              <p className="text-base text-neutral-600 dark:text-neutral-300">{skill.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
