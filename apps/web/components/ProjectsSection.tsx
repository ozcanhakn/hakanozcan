"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const projects = [
  {
    title: "Assistyl",
    description: "AI-Powered B2B Support Assistant",
    image: "/assistlydemo.png",
    tags: ["React", "NodeJs", "Sentry", "Clerk", "Convex", "AWS", "Turbo"],
    gradient: "from-blue-500 to-cyan-500",
    link: "#"
  },
  {
    title: "OrcaAI",
    description: "AI Orchestrator",
    image: "/orcaaiphoto.png",
    tags: ["Go", "Docker", "Prometheus", "Grafana", "Redis"],
    gradient: "from-purple-500 to-pink-500",
    link: "#"
  }
];

export default function Projects() {
  return (
    <section className="relative w-full py-40 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <h2 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 tracking-tighter opacity-90">
            PROJELER
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-32">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-16`}
    >
      {/* 3D Card */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full lg:w-3/5 relative aspect-video rounded-3xl bg-white/5 border border-white/10 cursor-pointer group perspective-1000"
      >
        <div
          style={{ transform: "translateZ(50px)" }}
          className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 -z-10`} />
      </motion.div>

      {/* Content */}
      <div className="w-full lg:w-2/5 space-y-8">
        <h3 className="text-5xl font-bold text-white">{project.title}</h3>
        <p className="text-xl text-gray-400 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={project.link}>
          <button className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-lg overflow-hidden">
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Projeyi İncele</span>
            <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
