"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Proje verileri
const projects = [
  {
    title: "THE ARCHITECT (INTRIA)",
    type: "GRAPH-BASED INTELLIGENCE",
    status: "DEPLOYED",
    description: "S&P 500 şirketleri için global olaylardan (jeopolitik, makro, lojistik) finansal sinyal üreten, Neo4j ve WebGL destekli graf tabanlı istihbarat ve etki analiz sistemi.",
    image: "/intria1.PNG",
    tags: ["ONTOLOGY", "KNOWLEDGE GRAPH", "FINANCIAL INTELLIGENCE"],
    link: "https://intria.app"
  },
  {
    title: "SERAPH MESSAGING",
    type: "ANTI-FORENSICS COMM PROTOCOL",
    status: "OPERATIONAL",
    description: "Devlet destekli siber tehditlere (NSO/Pegasus) karşı tasarlanmış; Double Ratchet E2EE, Memory Hardening, Metadata Minimization ve Cryptographic Erase (Duress PIN) yeteneklerine sahip askeri düzey iletişim mimarisi.",
    image: "/SeraphMessagingLogo.png",
    tags: ["DOUBLE RATCHET", "SQLCIPHER", "HKDF", "ANTI-FORENSICS", "E2EE"],
    link: "https://github.com/ozcanhakn/Seraph-Messaging"
  }
];

// Palantir-Style Data Row (Card)
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const isEven = index % 2 === 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-stretch border border-white/10 bg-black group transition-colors duration-500 hover:border-white/30 relative overflow-hidden`}
    >
      {/* Background Grid Pattern on hover */}
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`} />

      {/* Image Data View */}
      <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[400px] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden bg-black/50">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-top opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 scale-100 group-hover:scale-105"
        />
        {/* Radar Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-white/30 transition-transform duration-1000 ${isHovered ? 'translate-y-[400px]' : 'translate-y-0'} pointer-events-none`} />
        
        {/* HUD Elements */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="w-2 h-2 bg-white animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-white uppercase">{project.title}_SYS</span>
        </div>
      </div>

      {/* Telemetry / Content View */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between relative z-10 bg-black/80 backdrop-blur-sm">
        
        {/* Meta Header */}
        <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-3xl lg:text-4xl font-light tracking-[0.1em] text-white uppercase mb-2">
              {project.title}
            </h3>
            <span className="text-[10px] text-neutral-500 font-mono tracking-[0.3em] uppercase">
              TYPE: {project.type}
            </span>
          </div>
          <div className="flex items-center gap-2 border border-white/20 px-3 py-1 bg-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-neutral-300">
              {project.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <p className="text-sm lg:text-base text-neutral-400 font-light leading-relaxed max-w-lg">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Array */}
        <div className="mb-10">
          <span className="text-[10px] text-neutral-600 font-mono tracking-[0.2em] uppercase block mb-3">
            // INTEGRATED_MODULES
          </span>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 text-[10px] font-mono tracking-widest bg-white/[0.03] text-neutral-400 border border-white/10 transition-colors group-hover:border-white/30 group-hover:text-white"
              >
                [{tag}]
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div>
          <Link href={project.link} target="_blank" rel="noopener noreferrer">
            <button className="relative w-full sm:w-auto px-8 py-3 bg-white/5 border border-white/20 text-white text-xs font-mono tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 group/btn overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-4">
                INITIATE PROTOCOL
                <span className="group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section className="relative w-full py-40 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col items-center md:items-start"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-white/50" />
            <h2 className="text-xs font-mono text-neutral-400 tracking-[0.4em] uppercase">
              DEPLOYED SYSTEMS
            </h2>
          </div>
          <h3 className="text-5xl md:text-7xl font-light text-white tracking-[0.1em] uppercase">
            PROJELER
          </h3>
        </motion.div>

        <div className="flex flex-col gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
