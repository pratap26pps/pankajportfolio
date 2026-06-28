"use client";
import React from "react";
import Link from "next/link";
import {TypewriterEffectSmooth } from "@/components/ui/typewritter";
import { BackgroundBeams } from "../components/ui/background";
import GridBackgroundDemo from "@/components/ui/Gridbg";
import { Button } from "@/components/ui/movingborder"; 

export default function BackgroundBeamsDemo() {
    const words = [
      {      
        text: "Innovator at ",
        className: "text-neutral-900 dark:text-white",

      },
      {      
        text: " .",
        className: "text-neutral-400 dark:text-black",

      },
      {
        text: " CorpTube Solutions Pvt. Ltd.",
        className: "text-blue-600 dark:text-blue-500",
      },
    ];
  return (
    <div className="overflow-x-hidden">
      {/* Home Page */}
      <div className=" h-[100vh] w-full bg-neutral-50 dark:bg-black relative flex flex-col items-center justify-center antialiased transition-colors duration-300">
    
<div className="relative z-20 max-w-6xl mx-auto p-4 mt-80 mb-56 md:mt-64 lg:mt-48 lg:mb-0">
  <div className="relative  w-full z-10 text-center">
    <h1 className="text-5xl lg:text-6xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-600 leading-tight">
      <p>Hi! I'm Pankaj,</p>
      <p>a Full Stack Developer.</p>
      <p>Here you'll learn about my journey as a</p>
    </h1>
    <div className="mt-2 pointer-events-none">
      <TypewriterEffectSmooth words={words} className="flex scale-200 lg:scale-100 justify-center" />
    </div>
  </div>

  <p className="text-neutral-500 text-center mt-4 mb-6 relative z-10">
    MDU - Rohtak, Haryana, India
  </p>

  <div className="relative z-20 flex w-full justify-center">
      <Button
        as={Link}
        href="/about/journey"
        containerClassName="cursor-pointer"
        className="cursor-pointer px-2"
        borderRadius="1.75rem"
      >
        Explore My Journey
      </Button>
  </div>

 
</div>



        <BackgroundBeams/>
      </div>

      {/* every Section */}
      <div  className="overflow-x-hidden">
     <GridBackgroundDemo/>

      </div>
    </div>
  );
}