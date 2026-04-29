"use client";

import MuxPlayer from "@mux/mux-player-react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
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

const roles = [
  "INTELLIGENCE SYSTEMS",
  "ONTOLOGY & KNOWLEDGE GRAPH",
  "AI ENGINEER",
  "FINANCIAL INTELLIGENCE",
];

export default function HeroSection() {
  const typedText = useTypingEffect(roles, 80, 40, 2500);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <style>{`
          mux-player {
            width: 100%;
            height: 100%;
            --media-object-fit: cover;
            --media-object-position: center;
          }
        `}</style>
        <MuxPlayer
          playbackId="tdD00GBlCMFTBK64qYshK4rzygHU02SsO02PcmEjhPNjcQ"
          autoPlay="muted"
          loop
          muted
          playsInline
        />
      </div>

      {/* Gradient Overlays for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4),rgba(0,0,0,0.9)_80%)] pointer-events-none z-[1]" />

      {/* Main Content - Minimalist typography */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 text-center mt-[-5vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.25em] mb-4 text-white uppercase">
            M. HAKAN <span className="font-semibold text-neutral-400">ÖZCAN</span>
          </h1>

          <div className="h-10 mt-2 flex items-center justify-center">
            <p className="text-sm md:text-lg lg:text-xl text-neutral-400 font-mono tracking-[0.15em] uppercase">
              {typedText}
              <span className="animate-pulse text-white ml-1 font-bold">_</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-neutral-500 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-light text-neutral-500 group-hover:text-neutral-300 transition-colors">
          SYSTEM INIT
        </span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} strokeWidth={1} className="text-neutral-400 group-hover:text-white transition-opacity" />
        </motion.div>
      </motion.button>
    </section>
  );
}
