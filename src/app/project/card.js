"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import { Icon } from "@iconify/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function projectImageSrc(img) {
  if (!img) return "";
  if (/^https?:\/\//.test(img)) return img;
  return img.startsWith("/") ? img : `/${img}`;
}

export function ThreeDCardDemo() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setProjects(data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openlinkhandler = (link) => {
    window.open(link, "_blank");
  };

  if (loading) {
    return <p className="text-neutral-500 dark:text-neutral-400">Loading projects...</p>;
  }

  if (projects.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400">
        Projects will appear here once added from the admin dashboard.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-40 w-full">
      {projects.map((project, i) => (
        <motion.div
          key={project.id || i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: "-40px 0px" }}
          variants={fadeInUp}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          className="w-full flex justify-center"
        >
          <CardContainer className="bg-gray-800 w-full py-8 sm:py-12 lg:py-20">
            <CardBody className="hover-card w-full max-w-md mx-auto md:max-w-none md:scale-75 lg:scale-90 md:-mt-12 lg:-mt-32 bg-gray-500 border h-auto rounded-xl p-4 sm:p-6 dark:border-white/[0.2] border-black/[0.1] sm:w-[30rem]">
              <CardItem translateZ="50" className="text-xl font-bold text-white">
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
                {(project.icon || []).map((iconName, index) => (
                  <Icon key={index} icon={iconName} className="text-2xl" />
                ))}
              </span>

              <CardItem translateZ="100" rotateX={20} rotateZ={-10} className="w-full mt-2">
                <img
                  src={projectImageSrc(project?.img)}
                  alt={project?.title}
                  className="h-60 w-full object-cover rounded-xl transition duration-300"
                />
              </CardItem>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6">
                <CardItem
                  translateZ={20}
                  translateX={0}
                  as="button"
                  className="px-4 py-2 rounded-xl font-bold text-white"
                >
                  {project?.date}
                </CardItem>
                <CardItem
                  onClick={() => openlinkhandler(project?.link)}
                  translateZ={20}
                  translateX={0}
                  as="button"
                  className="px-4 py-2 cursor-pointer rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold min-h-[44px]"
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
