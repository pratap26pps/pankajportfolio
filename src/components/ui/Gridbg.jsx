"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { ThreeDCardDemo } from "@/app/project/card";
import { BoxRevealDemo } from "@/app/project/about";
import { ShineBorderDemo } from "@/app/project/contact";
import { TestimonialsSection } from "@/app/project/testimonials";
import { SkillsSection } from "@/app/project/skills";
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
  <section id={id} className="relative w-full min-h-screen snap-start py-20 bg-zinc-100 dark:bg-zinc-900 text-neutral-900 dark:text-white flex flex-col justify-center transition-colors duration-300">
    {/* Background grid */}
    <div
      className={cn(
        "absolute inset-0 z-0",
        "[background-size:110px_110px]",
        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
      )}
    />
    <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

    {/* Content */}
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible" 
      viewport={{ once: false, amount: 0.3 }}
      className="relative z-10 max-w-5xl mx-auto px-4 text-center"
    >
      <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent -mt-16 mb-11">
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

      <SectionWrapper id="about" title="About My Journey">
        <BoxRevealDemo />
      </SectionWrapper>

      <SectionWrapper id="testimonials" title="Testimonials">
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 -mt-4">
          Endorsements from past clients
        </p>
        <TestimonialsSection />
      </SectionWrapper>

   <SectionWrapper id="skills" title="Skills">
        <SkillsSection />
   </SectionWrapper>

      <SectionWrapper id="contact" title="Contact Me">
        <div className="flex flex-col-reverse lg:flex-row -ml-12 lg:ml-0 justify-between">
          <ShineBorderDemo />
          <div className="mt-3  scale-90">
           <LottieWrapper/>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
