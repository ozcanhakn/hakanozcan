"use client"

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

// Deneyim verileri
const experiences = [
  {
    year: "2020 - CURRENT",
    title: "Freelancer",
    role: "FULLSTACK & AI DEVELOPER",
    description: "Global müşteriler için yüksek ölçeklenebilir web uygulamaları ve yapay zeka çözümleri geliştirme, sistem mimarisi kurulumu. (+120 proje)",
    tech: ["PYTHON", "REACT", "NODE.JS", "AWS", "DOCKER"],
  },
  {
    year: "2021 - 2023",
    title: "Ares Group",
    role: "MOBILE DEVELOPER",
    description: "Yüksek performanslı mobil uygulamalar geliştirilmesi, veri senkronizasyonu ve kullanıcı deneyiminin uçtan uca optimizasyonu.",
    tech: ["KOTLIN", "SWIFT", "REACT NATIVE"],
  },
  {
    year: "2025",
    title: "FLO",
    role: "AI DEVELOPER",
    description: "Perakende sektöründe yapay zeka destekli tahminleme (forecasting) ve otonom öneri sistemleri entegrasyonu.",
    tech: ["TENSORFLOW", "PYTORCH", "BIGQUERY"],
  },
];

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  return (
    <section ref={containerRef} className="relative w-full py-40 bg-black overflow-hidden border-t border-white/10">
      
      {/* Abstract Background - Radar/Telemetry Grid */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2)_50%,transparent_50%)] bg-[size:1px_10px]" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_50%,transparent_50%)] bg-[size:10px_1px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32 flex flex-col items-center"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-white/50" />
            <h2 className="text-xs font-mono text-neutral-400 tracking-[0.4em] uppercase">
              CAREER TIMELINE // SYSTEM LOGS
            </h2>
            <div className="w-8 h-[1px] bg-white/50" />
          </div>
          <h3 className="text-5xl md:text-7xl font-light text-white tracking-[0.1em] uppercase text-center">
            DENEYİM
          </h3>
        </motion.div>

        <div className="relative">
          {/* Base Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />

          {/* Animated Line */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white origin-top shadow-[0_0_10px_rgba(255,255,255,0.5)] z-0"
          />

          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <TimelineItem key={index} data={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ data, index }: { data: typeof experiences[0], index: number }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`relative flex flex-col md:flex-row items-center ${isEven ? "md:flex-row-reverse" : ""} gap-10 md:gap-20`}
    >
      {/* Content Card */}
      <div className="flex-1 w-full pl-12 md:pl-0">
        <div className="group relative p-8 bg-black border border-white/10 hover:border-white/30 transition-colors duration-500 overflow-hidden">
          
          {/* Subtle Grid on Hover */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500">
                DATE_RANGE:
              </span>
              <span className="text-xs font-mono tracking-[0.2em] text-white">
                {data.year}
              </span>
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-light text-white tracking-[0.05em] mb-2 uppercase">
              {data.title}
            </h3>
            <p className="text-xs font-mono tracking-widest text-neutral-400 mb-6 uppercase">
              ROLE: {data.role}
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed font-light mb-8 max-w-md">
              {data.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {data.tech.map((t: string, i: number) => (
                <span key={i} className="px-2 py-1 text-[10px] font-mono tracking-widest bg-white/[0.02] text-neutral-500 border border-white/5 group-hover:border-white/20 transition-colors">
                  [{t}]
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center Node (Cross/Target) */}
      <div className="absolute left-[20px] md:left-1/2 w-4 h-4 -translate-x-1/2 flex items-center justify-center z-10 bg-black">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full border border-white/50 flex items-center justify-center bg-black"
        >
          <div className="w-1 h-1 bg-white" />
        </motion.div>
      </div>

      {/* Empty Space for alignment */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}
