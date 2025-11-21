"use client"

import { motion, useScroll } from "framer-motion"
import { useRef } from "react"

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  const experiences = [
    {
      year: "2020 - Günümüz",
      title: "Freelancer",
      role: "Fullstack & AI Developer",
      description: "Global müşteriler için ölçeklenebilir web uygulamaları ve yapay zeka çözümleri geliştiriyorum.",
      tech: ["Python", "React", "Node.js", "AWS", "Docker"],
      color: "from-cyan-500 to-blue-500"
    },
    {
      year: "2021 - 2023",
      title: "Ares Group",
      role: "Mobile Developer",
      description: "Yüksek performanslı mobil uygulamalar geliştirdim ve kullanıcı deneyimini optimize ettim.",
      tech: ["Kotlin", "Swift", "React Native"],
      color: "from-purple-500 to-pink-500"
    },
    {
      year: "2025",
      title: "FLO",
      role: "AI Developer",
      description: "Perakende sektöründe yapay zeka destekli tahminleme ve öneri sistemleri üzerine çalışıyorum.",
      tech: ["TensorFlow", "PyTorch", "BigQuery"],
      color: "from-amber-500 to-orange-500"
    },
  ]

  return (
    <section ref={containerRef} className="relative w-full py-40 px-6 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <h2 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 tracking-tighter opacity-90">
            DENEYİM
          </h2>
        </motion.div>

        <div className="relative">
          {/* Central Glowing Line */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-blue-600 origin-top shadow-[0_0_20px_rgba(0,255,255,0.5)] z-0"
          />

          <div className="space-y-32">
            {experiences.map((exp, index) => (
              <TimelineItem key={index} data={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ data, index }: { data: any, index: number }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`relative flex flex-col md:flex-row items-center ${isEven ? "md:flex-row-reverse" : ""} gap-10 md:gap-20`}
    >
      {/* Content Card */}
      <div className="flex-1 w-full pl-12 md:pl-0">
        <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-xl overflow-hidden">
          {/* Hover Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

          <div className="relative z-10">
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${data.color} text-white mb-4 shadow-lg`}>
              {data.year}
            </span>
            <h3 className="text-3xl font-bold text-white mb-1">{data.title}</h3>
            <p className="text-lg text-gray-400 mb-4">{data.role}</p>
            <p className="text-gray-300 leading-relaxed mb-6">{data.description}</p>

            <div className="flex flex-wrap gap-2">
              {data.tech.map((t: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-md bg-white/5 text-xs text-gray-400 border border-white/5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center Node */}
      <div className="absolute left-[11px] md:left-1/2 w-5 h-5 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-full h-full rounded-full bg-black border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]`}
        />
      </div>

      {/* Empty Space for alignment */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}
