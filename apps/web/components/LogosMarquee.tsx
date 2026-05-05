"use client";

import { motion } from "framer-motion";

const companies = [
  "HSBC",
  "VAIO",
  "TIDIO",
  "TIBC",
  "GANJA STATE UNIVERSITY",
  "HuququmVar",
  "Anilarinİzi",
  "ACQIB",
];

export default function LogosMarquee() {
  return (
    <div className="w-full bg-black border-t border-b border-white/10 py-8 overflow-hidden relative flex flex-col items-center">
      {/* Abstract Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mb-6 flex items-center gap-4">
         <div className="w-2 h-2 bg-white animate-pulse" />
         <span className="text-[10px] font-mono text-neutral-500 tracking-[0.4em] uppercase">STRATEGIC.DEPLOYMENTS</span>
         <div className="flex-1 h-[1px] bg-[linear-gradient(to_right,rgba(255,255,255,0.1),transparent)]" />
      </div>

      {/* Gradient Mask for Edges */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      <div className="relative z-10 flex overflow-hidden w-full">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Yavaş, akıcı bir animasyon
          }}
          className="flex whitespace-nowrap gap-16 md:gap-32 items-center px-10"
        >
          {/* Sonsuz döngü için diziyi iki kez renderlıyoruz */}
          {[...companies, ...companies].map((company, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default">
              <span className="text-xl md:text-2xl font-light tracking-[0.2em] text-neutral-600 group-hover:text-white transition-colors duration-500 uppercase">
                {company}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
