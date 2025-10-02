"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floatingnavbar";
import {TypewriterEffectSmooth } from "@/components/ui/typewritter";
import { BackgroundBeams } from "../components/ui/background";
import GridBackgroundDemo from "@/components/ui/Gridbg";
import { Button } from "@/components/ui/movingborder"; 
import { AnimatedTooltip } from "../components/ui/animatedtooltip";

export default function BackgroundBeamsDemo() {
  const navItems = [
    {
      name: "Projects",
      link: "#projects",
      
    },
    {
      name: "Skills",
      link: "#skills",
      
    },
    {
      name: "About",
      link: "#about",
 
    },
    {
      name: "Contact",
      link: "#contact",
      
    },
  ];
  const people = [
    {
      id: 1,
      name: "Pankaj Pratap Singh",
      designation: "Full-stack developer",
      image:"/image.png"
      },
 
  ];
    const items = [
      {
        id: 1,
        name: "Linkdin",
        link: "https://www.linkedin.com/in/pratap26pps",
        image: "/linkedin.png"  
      },
      {
        id: 2,
        name: "Github",
        link: "https://github.com/pratap26pps",
        image: "/github.png"  
      },
      {
        id: 3,
        name: "Gmail",
        link:"mailto:pankajpatna10321@gmail.com",
        image: "/gmail.png"  
      },
      {
        id: 4,
        name: "Resume",
        link: "https://drive.google.com/file/d/11l3UQr-2bmbP5wDAzmUQxmtjs7wryv8T/view?usp=drive_link",
        image: "/file.png"  
      },
    ];
    const words = [
      {      
        text: "web ",
        className: "text-white",

      },
      {      
        text: ".",
        className: "text-black",

      },
      {
        text: "developer",
        className: "text-blue-500 dark:text-blue-500",
      },
    ];
  return (
    <div className="overflow-x-hidden">
      {/* navbar animation  */}
     <FloatingNav navItems={navItems} />
      {/* Home Page */}
      <div className=" h-[100vh] w-full bg-black relative flex flex-col items-center justify-center antialiased">
    
      <div className="flex  lg:w-[80%] md:w-[100%] w-[90%] justify-between lg:scale-110 scale-90 text-white fixed z-50 top-10 lg:top-20 left-44 lg:left-1/2 -translate-x-1/2">
         <AnimatedTooltip items={people} />
          <div className="flex gap-7">   
          <AnimatedTooltip icons={items} />   
          </div>
      </div>
   
<div className="max-w-6xl  mx-auto p-4 mt-80 mb-56 md:mt-64 lg:mt-48 lg:mb-0">
  <div className="relative  w-full z-10 text-center">
    <h1 className="text-5xl lg:text-6xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 leading-tight">
      <p>Hi! I'm Pankaj,</p>
      <p>a Full Stack Developer.</p>
      <p>Here you'll learn about my journey as a</p>
    </h1>
    <div className="mt-2">
      <TypewriterEffectSmooth words={words} className="flex scale-200 lg:scale-100 justify-center" />
    </div>
  </div>

  <p className="text-neutral-500 text-center mt-4 mb-6 relative z-10">
    MDU - Rohtak, Haryana, India
  </p>

  <div className="flex lg:left-1/2 lg:-translate-x-1/4   cursor-pointer items-center justify-center">
   
      <Button className="cursor-pointer" borderRadius="1.75rem">
        Show my work
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