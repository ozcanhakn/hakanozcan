"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Code2, Cpu, Database, Github, Linkedin, Sparkles, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ThreeScene from "./ThreeScene";

// Typing efekti için roller
const roles = [
  "AI Developer",
  "Fullstack Engineer",
  "Data Scientist",
  "Problem Solver",
  "SaaS Architect",
];

// Typing Hook - optimize edilmiş
function useTypingEffect(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    if (!currentWord) return;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return currentText;
}

// Stats verisi
const stats = [
  { value: "5+", label: "Yıl Deneyim", icon: Code2 },
  { value: "20+", label: "Proje", icon: Cpu },
  { value: "10+", label: "Teknoloji", icon: Database },
];

// Sosyal medya linkleri
const socialLinks = [
  { icon: Github, href: "https://github.com/ozcanhakn", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/ozcanhakn", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/ozcanhakn", label: "Twitter" },
];

// 3D Tilt Card Hook
function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

export default function HeroSection() {
  const typedText = useTypingEffect(roles, 80, 40, 2500);
  const avatarTilt = use3DTilt();

  const scrollToContent = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.12),transparent_70%)] pointer-events-none z-[1]" />

      {/* Floating Status Badge - Moved to right side */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-24 right-6 md:right-12 z-20"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-white/80">Open for Projects</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Left Side - Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 max-w-2xl"
          >
            {/* Transparent Container - No Blur */}
            <div className="relative p-8 md:p-10 rounded-3xl bg-black/10 border border-white/5 shadow-[0_0_60px_rgba(251,146,60,0.1)]">

              {/* Subtler glow effect - Orange/Cyan */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 via-transparent to-cyan-500/10 rounded-3xl blur-2xl opacity-60" />

              <div className="relative">
                {/* Sparkle Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-6"
                >
                  <Sparkles size={14} className="text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">Full-Stack Developer</span>
                </motion.div>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-5xl md:text-7xl font-bold mb-2"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 tracking-tight">
                    Münür Hakan
                  </span>
                </motion.h1>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-5xl md:text-7xl font-bold mb-6"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 tracking-tight">
                    ÖZCAN
                  </span>
                </motion.h1>

                {/* Typing Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-10 mb-8"
                >
                  <p className="text-xl md:text-2xl text-gray-400 font-light">
                    <span className="text-white font-medium">{typedText}</span>
                    <span className="animate-pulse text-purple-400 ml-1">|</span>
                  </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="grid grid-cols-3 gap-4 mb-8"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all duration-300 group"
                    >
                      <stat.icon size={20} className="text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                  <Link href="/contact" className="flex-1">
                    <button className="w-full group relative px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,146,60,0.5)] hover:scale-[1.02]">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        İletişime Geç
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>

                  <Link href="/projects" className="flex-1">
                    <button className="w-full px-6 py-4 rounded-2xl border border-white/20 text-white font-semibold text-lg hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02]">
                      Projelerimi Gör
                    </button>
                  </Link>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="flex gap-3"
                >
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-orange-500/20 hover:border-orange-500/50 hover:scale-110 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - 3D Avatar Card */}
          <motion.div
            ref={avatarTilt.ref}
            onMouseMove={avatarTilt.handleMouseMove}
            onMouseLeave={avatarTilt.handleMouseLeave}
            style={{
              rotateX: avatarTilt.rotateX,
              rotateY: avatarTilt.rotateY,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative flex-shrink-0 cursor-pointer perspective-1000"
          >
            {/* Outer Glow - Orange/Cyan */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full blur-3xl opacity-30 scale-125 animate-pulse" />

            {/* Avatar Container with Orbit Rings */}
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
              style={{ transform: "translateZ(50px)" }}
            >
              {/* Orbit Ring 1 - Yatay - Parlak Siyah */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] rounded-full border-2 border-slate-700/80 shadow-[0_0_10px_rgba(51,65,85,0.5)]"
                style={{ transform: "rotateX(70deg)" }}
              >
                {/* Orbit Point */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_15px_#f97316]" />
              </motion.div>

              {/* Orbit Ring 2 - Eğik - Parlak Siyah */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-30px] rounded-full border-2 border-gray-800/90 shadow-[0_0_12px_rgba(31,41,55,0.6)]"
                style={{ transform: "rotateX(70deg) rotateY(30deg)" }}
              >
                {/* Orbit Point */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
              </motion.div>

              {/* Orbit Ring 3 - Dikey - Parlak Siyah */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-15px] rounded-full border border-zinc-700/70 shadow-[0_0_8px_rgba(63,63,70,0.4)]"
                style={{ transform: "rotateX(70deg) rotateY(-40deg)" }}
              >
                {/* Orbit Point */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
              </motion.div>

              {/* Inner Gradient Ring - Metalik Siyah */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 via-slate-900 to-zinc-800 p-1 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <div className="w-full h-full rounded-full bg-black" />
              </div>

              {/* Pulse Ring Effect - Koyu */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-5px] rounded-full border-2 border-slate-600/50"
              />

              {/* Inner Border */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/10 to-transparent p-[2px]">
                <div className="w-full h-full rounded-full bg-black" />
              </div>

              {/* Avatar Image */}
              <div className="absolute inset-4 rounded-full overflow-hidden">
                <Image
                  src="/myavatar.png"
                  alt="Münür Hakan Özcan"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent" />
              </div>

              {/* Floating Labels - New Colors */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(80px)" }}
                className="absolute -top-2 -right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-bold shadow-lg shadow-orange-500/30"
              >
                ✨ AI Expert
              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(60px)" }}
                className="absolute -bottom-2 -left-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/30"
              >
                🚀 Fullstack
              </motion.div>

              <motion.div
                animate={{ x: [8, -8, 8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(70px)" }}
                className="absolute top-1/2 -right-6 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg shadow-green-500/30"
              >
                💻 SaaS
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-xs uppercase tracking-[0.3em] group-hover:text-orange-400 transition-colors">Keşfet</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 rounded-full border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </section>
  );
}
