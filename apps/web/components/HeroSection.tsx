"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import ThreeScene from "./ThreeScene"

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none z-0" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Hakan ÖZCAN
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <p className="text-xl md:text-3xl text-gray-300 mb-12 font-light tracking-wide max-w-2xl mx-auto drop-shadow-lg">
            AI & Fullstack Developer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link href="/contact">
            <button className="px-8 py-4 rounded-full bg-white text-black font-medium text-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              İletişime Geç
            </button>
          </Link>

          <Link href="/projects">
            <button className="px-8 py-4 rounded-full border border-white/20 text-white font-medium text-lg hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Projelerimi Gör
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
