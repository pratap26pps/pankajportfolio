"use client";
import Link from "next/link";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
export function BoxRevealDemo() {
  return (
    <NeonGradientCard className="w-full scale-95 max-w-5xl mx-auto rounded-3xl shadow-xl">
        <div className="bg-black p-2">
    <BoxReveal boxColor={"#7c3aed"} duration={0.5}>
        <h1 className="text-[2rem] md:text-[2.5rem] font-extrabold text-gray-400 text-center leading-tight">
          Crafting Code & Ideas - <span className="text-[#7c3aed]">It's Me</span>
        </h1>
      </BoxReveal>

      <BoxReveal boxColor={"#7c3aed"} duration={0.5}>
        <h2 className="mt-2 text-lg md:text-xl text-center text-indigo-200 font-medium">
          Full-Stack Developer | Ex-Intern @ TEN (The Entrepreneurship Network)
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#7c3aed"} duration={0.5}>
        <div className="mt-8 text-indigo-100 text-base md:text-lg leading-relaxed max-w-3xl mx-auto space-y-4">
          <p>
            I’m a Final-year B.Tech student deeply passionate about building powerful, modern web applications.
            I love working with:
            <span className="font-semibold text-[#c4b5fd]"> MERN</span>,
            <span className="font-semibold text-[#c4b5fd]"> Next.js</span>,
            <span className="font-semibold text-[#c4b5fd]"> Tailwind CSS</span>, and
            have also done some
            <span className="font-semibold text-[#c4b5fd]"> freelance work</span>.
          </p>
          <p>
            As an ex-intern at TEN, I gained real-world experience building scalable solutions and collaborating on live projects.
          </p>
          <p>
            I focus on writing clean, efficient code and crafting user experiences that are fast, accessible, and beautiful.
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#7c3aed"} duration={0.5}>
        <div className="flex justify-center mt-12">
            <Link href="#projects">
          
          <button className="bg-white/10 cursor-pointer backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/20 transition-all duration-300">
            Check Out My Work
          </button>
            </Link>
        </div>
      </BoxReveal>
        </div>
  
    </NeonGradientCard>
  );
}
