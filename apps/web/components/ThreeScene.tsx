"use client";

import { motion } from "framer-motion";

export default function ThreeScene() {
    return (
        <div className="w-full h-full absolute inset-0 bg-[#050505] overflow-hidden flex items-center justify-center pointer-events-none">

            {/* 1. Koyu Zemin ve Çok Hafif Radial Aydınlatma */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,rgba(0,0,0,1)_80%)] z-0" />

            {/* 2. SVG tabanlı Fractal Noise */}
            <div className="absolute inset-0 z-0 opacity-40">
                <svg viewBox="0 0 100% 100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <filter id="noiseFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="3"
                            stitchTiles="stitch"
                        />
                        <feColorMatrix
                            type="matrix"
                            values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* 3. Dev Işık Hüzmeleri (Aurora / Fluid Light) */}
            <div className="absolute inset-0 z-10 blur-[120px] opacity-80 mix-blend-lighten">

                {/* Sol Üst - Amber Işık */}
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/30"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Sağ Alt - Çok Koyu Kırmızı/Kurşuni Işık */}
                <motion.div
                    className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-700/30"
                    animate={{
                        x: [0, -150, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                {/* Merkez - Zeka Çekirdeği Pırıltısı */}
                <motion.div
                    className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-orange-500/20"
                    animate={{
                        scale: [0.8, 1.1, 0.8],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Subliminal Veri İmzası (Gizem Unsurları) */}
            <div className="absolute top-10 right-10 flex flex-col items-end gap-1 text-[10px] text-orange-500/40 font-mono tracking-[0.3em] font-medium uppercase font-bold z-30">
                <span>SYS // KNOWLEDGE.GRAPH</span>
                <span>TOPOLOGY: 41.0124°N, 28.9744°E</span>
                <span>PULSE_RATE: SECURE</span>
            </div>

            {/* Sinematik Vignette (Köşeleri Karartma - Ortayı Öne Çıkarma) */}
            <div className="absolute inset-0 z-20 pointer-events-none" style={{
                background: "radial-gradient(circle at center, transparent 20%, rgba(5,5,5,1) 100%)"
            }} />
        </div>
    );
}
