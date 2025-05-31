'use client';

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { ThreeDCardDemo } from "@/app/project/card";

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack MERN e-commerce app with cart, wishlist, filtering, and authentication.",
    date: "May 2025",
  },
  {
    title: "Task Manager",
    description: "A Next.js productivity app with drag & drop, due dates, and team collaboration.",
    date: "March 2025",
  },
  {
    title: "Portfolio Website",
    description: "My animated personal portfolio built using React, Tailwind CSS, and Framer Motion.",
    date: "January 2025",
  },
  {
    title: "Blog CMS",
    description: "A full-featured content management system built with Sanity and Next.js.",
    date: "February 2025",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const SectionWrapper = ({
  title,
  children,
}) => (
  <section
    className="relative w-full min-h-screen snap-start py-20 bg-zinc-900 dark:bg-black text-white flex flex-col justify-center"
  >
    {/* Background grid */}
    <div
      className={cn(
        "absolute inset-0 z-0",
        "[background-size:110px_110px]",
        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
      )}
    />
    <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

    {/* Content */}
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="relative z-10 max-w-5xl mx-auto px-4 text-center"
    >
      <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent mb-10">
        {title}
      </h2>
      {children}
    </motion.div>
  </section>
);

export default function PortfolioPage() {
  return (
    <div>
      <SectionWrapper title="Project">
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.6 }}
              className="group h-96  rounded-xl border border-neutral-700  transition-transform duration-300 hover:scale-105 hover:border-neutral-500 bg-neutral-800"
            >
              <ThreeDCardDemo/>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="About Me">
        <p className="text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto">
          I’m a 3rd-year B.Tech student passionate about full-stack development. I love building modern web apps using MERN, Next.js, and Tailwind CSS. My focus is on creating user-friendly, performance-optimized, and scalable applications.
        </p>
      </SectionWrapper>

      <SectionWrapper title="Skills">
        <div className="flex flex-wrap justify-center gap-4 text-neutral-300">
          {[
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Next.js",
            "Redux",
            "Node.js",
            "MongoDB",
            "Tailwind CSS",
            "Git",
          ].map((skill, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-full bg-neutral-800 hover:bg-cyan-700 transition-colors duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="Contact Me">
        <div className="text-center">
          <p className="text-neutral-300 mb-4">Let's connect and build something great!</p>
          <a
            href="mailto:your.email@example.com"
            className="inline-block mt-4 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-500 transition"
          >
            Send Email
          </a>
          
        </div>
      </SectionWrapper>
    </div>
  );
}
