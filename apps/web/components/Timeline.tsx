"use client"

import { motion } from "framer-motion"

export default function ExperienceSection() {
  const experiences = [
    {
      year: "2020 - Günümüz",
      title: "Freelancer",
      description: "Fullstack & AI Developer",
      tech: "Python, React, Node.js, Tailwind, JS, AWS, Docker, Redis, Spring Boot",
    },
    {
      year: "2021 - 2023",
      title: "Ares Group",
      description: "Mobile Developer",
      tech: "Java, Kotlin, Swift, HTML, CSS, JavaScript",
    },
    {
      year: "2025",
      title: "FLO Perakende & Mağazacılık",
      description: "AI Developer",
      tech: "Python, Tensorflow, NLP, ML, React, Node.js, MongoDB",
    },
  ]

  return (
    <section className="bg-[#FFFFFF] text-[#1F1F1F] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-4xl font-bold mb-16 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        Deneyim
        </h2>

        <div className="relative border-l border-gray-300 ml-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="mb-12 ml-6 relative"
            >
              {/* Nokta */}
              <div className="absolute -left-3 top-2 w-5 h-5 bg-gradient-to-r from-gray-900 to-gray-600 rounded-full border-4 border-[#F5F5F7]" />

              {/* Kart */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                <p className="text-sm font-medium text-gray-500">{exp.year}</p>
                <h3 className="text-xl font-semibold mt-2">{exp.title}</h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{exp.description}</p>
                <p className="text-xs text-gray-500 mt-3 italic">{exp.tech}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
