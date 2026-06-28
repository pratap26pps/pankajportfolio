"use client";
import Link from "next/link";
import Image from "next/image";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { journeyIcons } from "@/lib/journeyIcons";

const highlights = [
  {
    ...journeyIcons.corptube,
    title: "Co-Founder & CTO – CorpTube Solutions Pvt. Ltd.",
    body: "Winner of the Best Innovator Award at Startup Carnival 2026 for presenting the CorpTube Pitch Point.",
  },
  {
    ...journeyIcons.ruhil,
    title: "Software Developer – Ruhil Future Technologies",
    body: (
      <>
        Working on modern web and application development projects, including{" "}
        <span className="font-semibold text-[#c4b5fd]">Gyansetu One World</span> and{" "}
        <span className="font-semibold text-[#c4b5fd]">HostelSetu</span>.
      </>
    ),
  },
  {
    ...journeyIcons.upwork,
    title: "Freelance Projects & Product Development",
    body: "Successfully developed and delivered multiple projects across various industries:",
    bullets: [
      "Capital Solar Energy – Platform for solar panel and renewable energy services.",
      "Gridaneo Bharat – EV service and maintenance platform.",
      "Shrami App – Digital Labour Chowk platform connecting workers and employers.",
      "RO Technical Xperts – Water purification products and services platform.",
    ],
  },
  {
    ...journeyIcons.ten,
    title: "Ex-Intern – The Entrepreneurship Network (TEN)",
  },
  {
    ...journeyIcons.mdu,
    title: "Bachelor of Technology (B.Tech) in Electronics & Communication Engineering",
    body: "Graduated from Maharshi Dayanand University (MDU), Rohtak, a State Government University.",
  },
];

export function BoxRevealDemo() {
  return (
    <NeonGradientCard className="w-full scale-95 max-w-5xl mx-auto rounded-3xl shadow-xl">
      <div className="bg-white dark:bg-black p-6 md:p-8 transition-colors duration-300">
        <BoxReveal boxColor={"#7c3aed"} duration={0.5}>
          <ol className="mt-8 text-left text-neutral-700 dark:text-indigo-100 text-sm md:text-base leading-relaxed max-w-3xl mx-auto space-y-6 list-none">
            {highlights.map((item, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border border-[#7c3aed]/30 bg-white dark:bg-neutral-900 flex items-center justify-center mt-0.5">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={36}
                    height={36}
                    className="w-full h-full object-contain p-0.5"
                  />
                </span>
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                  {item.body && <p>{item.body}</p>}
                  {item.bullets && (
                    <ul className="space-y-1.5 pl-1">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 text-neutral-600 dark:text-indigo-200/90">
                          <span className="text-[#c4b5fd] mt-1.5">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </BoxReveal>

        <BoxReveal boxColor={"#7c3aed"} duration={0.5}>
          <div className="flex justify-center mt-10">
            <Link href="/about/journey">
              <button className="bg-neutral-900/5 dark:bg-white/10 cursor-pointer backdrop-blur-md text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/20 px-6 py-3 rounded-full text-sm font-semibold hover:bg-neutral-900/10 dark:hover:bg-white/20 transition-all duration-300">
                View More
              </button>
            </Link>
          </div>
        </BoxReveal>
      </div>
    </NeonGradientCard>
  );
}
