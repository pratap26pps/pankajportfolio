"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious();

      if (scrollYProgress.get() < 0) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "lg:flex md:flex max-w-fit hidden sm:block fixed top-8 inset-x-0 mx-auto backdrop-blur-md bg-black/80 border border-neutral-800 rounded-xl shadow-2xl z-[5000] px-6 py-3 items-center justify-center gap-2",
          className
        )}>
        
        {/* Brand Name / Logo Space */}
        <div className="hidden lg:flex items-center mr-6 pr-6 border-r border-neutral-800">
          <a 
            href="#top"
            className="cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              PPS
            </span>
          </a>
        </div>

        {/* Navigation Items */}
        <div className="flex gap-2 relative">
          {navItems.map((navItem, idx) => (
            <a
              key={`link=${idx}`}
              href={navItem.link}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-5 py-2 text-neutral-400 hover:text-white font-medium text-sm tracking-wide transition-colors duration-300 z-10">
              
              {/* Animated Background */}
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.2 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30"
                />
              )}
              
              {/* Text */}
              <span className="relative z-10">{navItem.name}</span>
            </a>
          ))}
        </div>

        {/* Decorative Accent Line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </motion.div>
      
    </AnimatePresence>
  );
};