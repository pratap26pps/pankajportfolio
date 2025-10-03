"use client";
import { motion } from "framer-motion";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import { Icon } from "@iconify/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export function ThreeDCardDemo() {
  const projects = [
    {
      title: "Grida Neo Bharat",
      description:
        "EV servicing and accessories platform offering repair, battery sales with customer plans, admin-partner coordination and automated invoicing.",
      date: "June 2025",
      img: "gridaneo.png",
      icon: ["skill-icons:nextjs-dark", "skill-icons:tailwindcss-dark"],

      link: "https://www.gridaneobharat.com/",
    },
    {
      title: "E-commerce Platform",
      description:
        "Inspired by Flipkart/Amazon, the project lets one seller manage electronics and customers order via COD or online.",
      date: "May 2025",
      link: "https://embproto.vercel.app/",
      icon: ["skill-icons:nextjs-dark", "skill-icons:tailwindcss-dark"],
      img: "Screenshot.png",
    },
    {
      title: "TEN AI",
      description:
        "An AI-powered platform where users can interact with multiple AI agents via chat and voice calls to get informative, real-time answers to their queries and problems.",
      date: "March 2025",
      img: "Screenshot2.png",
      icon: [
        "skill-icons:react-dark",
        "simple-icons:express",
        "skill-icons:tailwindcss-dark",
      ],
      link: "https://github.com/anuragpardeshii/TEN-AI",
    },
    {
      title: "Edtech Perception",
      description:
        "A full-stack EdTech platform where instructors upload courses, students purchase and enroll, and an admin manages users, payments, and course content.",
      date: "January 2025",
      img: "Screenshot3.png",
      icon: [
        "skill-icons:react-dark",
        "logos:redux",
        "simple-icons:express",
        "skill-icons:tailwindcss-dark",
      ],

      link: "https://edtechperception.vercel.app/",
    },
 
  ];

  const openlinkhandler = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40">
      {projects.map((project, i) => (
        <motion.div
          key={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <CardContainer className="bg-gray-800">
            <CardBody className="hover-card lg:scale-90 md:scale-75 scale-[82%] -mt-32  bg-gray-500  border w-full sm:w-[30rem] h-auto rounded-xl p-6 dark:border-white/[0.2] border-black/[0.1]">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-white"
              >
                {project?.title}
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-amber-100 text-sm max-w-sm mt-2 "
              >
                {project?.description}
              </CardItem>
              <span className="flex gap-2 mt-2">
                {project.icon.map((iconName, index) => (
                  <Icon key={index} icon={iconName} className="text-2xl" />
                ))}
              </span>

              <CardItem
                translateZ="100"
                rotateX={20}
                rotateZ={-10}
                className="w-full mt-2"
              >
                <img
                  src={project?.img}
                  alt={project?.title}
                  className="h-60 w-full object-cover rounded-xl transition duration-300"
                />
              </CardItem>
              <div className="flex justify-between items-center mt-6">
                <CardItem
                  translateZ={20}
                  translateX={-40}
                  as="button"
                  className="px-4 py-2 rounded-xl  font-bold text-white"
                >
                  {project?.date}
                </CardItem>
                <CardItem
                  onClick={() => openlinkhandler(project?.link)}
                  translateZ={20}
                  translateX={40}
                  as="button"
                  className="px-4 py-2 cursor-pointer rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  live link
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </motion.div>
      ))}
    </div>
  );
}
