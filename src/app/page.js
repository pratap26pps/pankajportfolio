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
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
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
    <div>
      {/* navbar animation  */}
     <FloatingNav navItems={navItems} />
      {/* Home Page */}
      <div className="lg:h-[40rem] w-full bg-black relative flex flex-col items-center justify-center antialiased">
    
      <div className="flex w-[80%]  justify-between scale-110  text-white fixed z-50 -mt-[176%] md:-mt-[45%] lg:-mt-[34%] ">
         <AnimatedTooltip items={people} />
          <div className="flex gap-7">   
          <AnimatedTooltip icons={items} />   
          </div>
      </div>
   
        <div className="max-w-6xl mt-48 lg:mt-12 mx-auto p-4">
          <div className="relative  z-10 text-6xl   bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          <p>Hi! I'm Pankaj,</p> 
          <p>a Full Stack Developer.</p>  
          <p>here you'll learn about my journey as a</p> 
          <TypewriterEffectSmooth words={words} className='flex justify-center'/>
          </div>
         
      
          <p className="text-neutral-500 max-w-lg mx-auto my-2  text-center relative z-10">
           Mdu-Rohtak Haryana, India
          </p>
       <div className="ml-28 cursor-pointer lg:ml-0 md:ml-96">
         <a href="#projects" >
        <Button className="cursor-pointer"  borderRadius="1.75rem">
         Show my work
        </Button>
         </a>
 
       </div>
     
        </div>
        <BackgroundBeams/>
      </div>

      {/* every Section */}
      <div className="">
     <GridBackgroundDemo/>

      </div>
    </div>
  );
}
