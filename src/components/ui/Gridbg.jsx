"use client";

import { Icon } from '@iconify/react'; 
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { ThreeDCardDemo } from "@/app/project/card";
import { BoxRevealDemo } from "@/app/project/about";
import { ShineBorderDemo } from "@/app/project/contact";
// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const LottieWrapper = dynamic(() => import("@/app/project/lottiwrapper"), {
  ssr: false,
});

const SectionWrapper = ({ id, title, children }) => (
  <section id={id} className="relative w-full min-h-screen snap-start py-20 bg-zinc-900 dark:bg-black text-white flex flex-col justify-center">
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
      <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent -mt-16 mb-11">
        {title}
      </h2>
      {children}
    </motion.div>
  </section>
);

export default function PortfolioPage() {
  return (
    <div>
      <SectionWrapper  id="projects" title="Project">
        <div>
          <ThreeDCardDemo />
        </div>
      </SectionWrapper>

      <SectionWrapper id="about" title="About Me">
        <BoxRevealDemo />
      </SectionWrapper>

   <SectionWrapper id="skills" title="Skills">
  <h1 className="text-center text-2xl font-bold text-white mb-6">
    Technologies I&apos;ve Worked With
  </h1>
  <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-col-3 justify-center gap-4 text-white">
    {[
      { name: "HTML", icon: "vscode-icons:file-type-html", desc: "Markup Language" },
      { name: "CSS", icon: "vscode-icons:file-type-css", desc: "Style Sheets" },
      { name: "JavaScript", icon: "logos:javascript", desc: "Scripting Language" },
      { name: "React", icon: "skill-icons:react-dark", desc: "JS Framework" },
      { name: "Next.js", icon: "skill-icons:nextjs-dark", desc: "React Framework" },
      { name: "Redux", icon: "logos:redux", desc: "State Manager" },
      { name: "Node.js", icon: "logos:nodejs-icon", desc: "Backend Runtime" },
      { name: "MongoDB", icon: "devicon:mongodb", desc: "NoSQL DB" },
      { name: "Express.js", icon: "simple-icons:express", desc: "Backend Framework" },
      { name: "Tailwind CSS", icon: "skill-icons:tailwindcss-dark", desc: "Utility-first CSS" },
      { name: "Git", icon: "logos:git-icon", desc: "Version Control" },
    ].map((skill, idx) => (
      <div
      key={idx}
      className="flex items-center gap-4 px-6 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-cyan-700/30 transition-all duration-300 shadow-md"
    >
      <span className="text-4xl"> 
        <Icon icon={skill.icon} />
      </span>
      <div>
        <p className="text-lg font-bold">{skill.name}</p>
        <p className="text-base text-neutral-300">{skill.desc}</p>
      </div>
    </div>
    
    ))}
  </div>
   </SectionWrapper>

      <SectionWrapper id="contact" title="Contact Me">
        <div className="flex flex-col-reverse lg:flex-row -ml-12 lg:ml-0 justify-between">
          <ShineBorderDemo />
          <div className="mt-3 scale-95">
           <LottieWrapper/>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
