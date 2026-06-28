"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import JourneyIcon from "@/components/ui/JourneyIcon";
import { journeyIcons, journeyTabIcons } from "@/lib/journeyIcons";
import {
  journeyTabs,
  corptubeImages,
  corptubeAudience,
  freelanceProjects,
  softwareProjects,
} from "./journeyData";

function TreeNode({ icon, side, children, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = side === "left";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 24 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      className={cn("relative", className)}
    >
      {/* Mobile layout */}
      <div className="flex gap-4 md:hidden">
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <JourneyIcon src={icon.src} alt={icon.alt} size="md" />
          </motion.div>
          <div className="w-0.5 flex-1 mt-2 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-40" />
        </div>
        <div className="flex-1 pb-8">{children}</div>
      </div>

      {/* Desktop branching layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
        <div className={cn(isLeft ? "col-start-1" : "col-start-1")}>
          {isLeft ? children : null}
        </div>

        <div className="col-start-2 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <JourneyIcon src={icon.src} alt={icon.alt} size="lg" />
          </motion.div>
        </div>

        <div className={cn(isLeft ? "col-start-3" : "col-start-3")}>
          {!isLeft ? children : null}
        </div>
      </div>
    </motion.div>
  );
}

function HighlightLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function ImageCard({ src, caption, alt }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-video w-full">
        <Image src={src} alt={alt || caption} fill className="object-cover" sizes="(max-width:768px) 100vw, 480px" />
      </div>
      <p className="p-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{caption}</p>
    </div>
  );
}

export default function JourneyContent() {
  const [activeTab, setActiveTab] = useState("company");
  const sectionRefs = useRef({});

  useEffect(() => {
    const observers = journeyTabs.map(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveTab(id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0.1 }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  function scrollToSection(id) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(id);
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <svg width="0" height="0" aria-hidden>
        <defs>
          <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="fixed inset-0 z-0 [background-size:110px_110px] [background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="pt-28 md:pt-32">
          <Link
            href="/#about"
            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent"
          >
            My Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-neutral-600 dark:text-indigo-200/80 text-lg max-w-2xl"
          >
            A branching timeline of my company, freelance work, professional roles, and qualifications.
          </motion.p>
        </div>

        {/* Sticky tab nav */}
        <div className="sticky top-4 z-30 mt-10 mb-12">
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-lg">
            {journeyTabs.map(({ id, label }) => {
              const tabIcon = journeyTabIcons[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                    activeTab === id
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full overflow-hidden border flex items-center justify-center shrink-0",
                    activeTab === id ? "border-white/30 bg-white/10" : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  )}>
                    <Image src={tabIcon.src} alt={tabIcon.alt} width={20} height={20} className="w-full h-full object-contain p-0.5" />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Central tree trunk */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 opacity-40" />

          {/* 1. Company */}
          <section
            id="company"
            ref={(el) => { sectionRefs.current.company = el; }}
            className="scroll-mt-28 mb-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-3">
                Branch 1
              </span>
              <div className="flex items-center justify-center gap-3 mb-2">
                <JourneyIcon src={journeyIcons.corptube.src} alt={journeyIcons.corptube.alt} size="lg" />
                <h2 className="text-3xl md:text-4xl font-bold">Company — CorpTube</h2>
              </div>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                Co-Founder & CTO · CorpTube Solutions Pvt. Ltd.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 md:p-8 mb-10"
            >
              <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed text-lg">
                CorpTube is a next-generation professional networking and creator platform built for
                growth-minded people in India and beyond. It combines the best of social networking,
                skill sharing, learning, and earning — all in one place.
              </p>
              <div className="mt-6">
                <HighlightLink href="https://www.corptube.in/">Visit corptube.in</HighlightLink>
              </div>
            </motion.div>

            <div className="mb-10">
              <h3 className="text-xl font-bold mb-4 text-center">Who is CorpTube for?</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {corptubeAudience.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 hover:border-indigo-400/50 transition-colors"
                  >
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-300">{item.title}</h4>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-16 md:space-y-20">
              {corptubeImages.map((img, index) => (
                <TreeNode key={img.src} icon={journeyIcons.corptube} side={index % 2 === 0 ? "left" : "right"}>
                  <ImageCard src={img.src} caption={img.caption} />
                </TreeNode>
              ))}
            </div>
          </section>

          {/* 2. Freelance */}
          <section
            id="freelance"
            ref={(el) => { sectionRefs.current.freelance = el; }}
            className="scroll-mt-28 mb-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mb-3">
                Branch 2
              </span>
              <div className="flex items-center justify-center gap-3 mb-2">
                <JourneyIcon src={journeyIcons.upwork.src} alt={journeyIcons.upwork.alt} size="lg" />
                <h2 className="text-3xl md:text-4xl font-bold">Freelance Projects</h2>
              </div>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                Delivered across solar, EV, labour, and water purification industries
              </p>
            </motion.div>

            <div className="space-y-10">
              {freelanceProjects.map((project, index) => (
                <TreeNode key={project.name} icon={journeyIcons.upwork} side={index % 2 === 0 ? "right" : "left"}>
                  <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-lg font-bold">{project.name}</h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    {project.url && (
                      <div className="mt-4">
                        <HighlightLink href={project.url}>{project.url.replace(/^https?:\/\/(www\.)?/, "")}</HighlightLink>
                      </div>
                    )}
                  </div>
                </TreeNode>
              ))}
            </div>
          </section>

          {/* 3. Software Developer */}
          <section
            id="software"
            ref={(el) => { sectionRefs.current.software = el; }}
            className="scroll-mt-28 mb-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 mb-3">
                Branch 3
              </span>
              <div className="flex items-center justify-center gap-3 mb-2">
                <JourneyIcon src={journeyIcons.ruhil.src} alt={journeyIcons.ruhil.alt} size="lg" />
                <h2 className="text-3xl md:text-4xl font-bold">Software Developer</h2>
              </div>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                Ruhil Future Technologies — modern web & application development
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 md:p-8 mb-10 text-center"
            >
              <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
                Working on modern web and application development projects, building scalable platforms
                with Next.js, React, and Node.js for real-world education and hostel management solutions.
              </p>
            </motion.div>

            <div className="space-y-10">
              {softwareProjects.map((project, index) => (
                <TreeNode key={project.name} icon={journeyIcons.ruhil} side={index % 2 === 0 ? "left" : "right"}>
                  <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-cyan-950/30 dark:to-indigo-950/30 p-6 shadow-lg">
                    <h3 className="text-lg font-bold">{project.name}</h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-4">
                      <HighlightLink href={project.url}>{project.url.replace(/^https?:\/\/(www\.)?/, "")}</HighlightLink>
                    </div>
                  </div>
                </TreeNode>
              ))}
            </div>
          </section>

          {/* 4. Qualifications */}
          <section
            id="qualifications"
            ref={(el) => { sectionRefs.current.qualifications = el; }}
            className="scroll-mt-28 mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mb-3">
                Branch 4
              </span>
              <div className="flex items-center justify-center gap-3 mb-2">
                <JourneyIcon src={journeyIcons.mdu.src} alt={journeyIcons.mdu.alt} size="lg" />
                <h2 className="text-3xl md:text-4xl font-bold">Qualifications</h2>
              </div>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                Education and professional experience
              </p>
            </motion.div>

            <div className="space-y-10">
              <TreeNode icon={journeyIcons.mdu} side="left">
                <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-lg">
                  <div className="mb-3">
                    <JourneyIcon src={journeyIcons.mdu.src} alt={journeyIcons.mdu.alt} size="md" className="ring-0 shadow-none" />
                  </div>
                  <h3 className="text-lg font-bold">
                    Bachelor of Technology (B.Tech) in Electronics & Communication Engineering
                  </h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    Graduated from Maharshi Dayanand University (MDU), Rohtak — a State Government University
                    accredited with A+ grade by NAAC.
                  </p>
                </div>
              </TreeNode>

              <TreeNode icon={journeyIcons.ten} side="right">
                <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-lg">
                  <div className="mb-3">
                    <JourneyIcon src={journeyIcons.ten.src} alt={journeyIcons.ten.alt} size="md" className="ring-0 shadow-none" />
                  </div>
                  <h3 className="text-lg font-bold">Ex-Intern — The Entrepreneurship Network (TEN)</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    Gained real-world experience building scalable solutions and collaborating on live
                    startup projects during my internship at TEN.
                  </p>
                </div>
              </TreeNode>

              <TreeNode icon={journeyIcons.corptube} side="left">
                <div className="rounded-2xl border border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-6 shadow-lg">
                  <div className="mb-3">
                    <JourneyIcon src={journeyIcons.corptube.src} alt={journeyIcons.corptube.alt} size="md" className="ring-0 shadow-none" />
                  </div>
                  <h3 className="text-lg font-bold">Best Innovator Award — Startup Carnival 2026</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    Winner at MDU Startup Carnival for presenting the CorpTube Pitch Point, recognized by
                    the Center for Innovation, Incubation & Entrepreneurship (CIIE).
                  </p>
                </div>
              </TreeNode>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
