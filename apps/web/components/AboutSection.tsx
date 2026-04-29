"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="relative w-full min-h-screen py-20 bg-black overflow-hidden flex flex-col lg:flex-row items-center border-t border-white/10">
      
      {/* Background Grid Pattern - Telemetry style */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Left: Minimalist Visual Representation (Data Node) */}
      <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen relative flex items-center justify-center -mt-10 lg:mt-0 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center border border-white/10 bg-white/[0.01] backdrop-blur-md"
        >
          {/* Abstract Data Nodes */}
          <div className="absolute inset-4 border border-white/5 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
          
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 border border-white/10 border-dashed rounded-full opacity-30" 
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border border-white/20 flex items-center justify-center bg-black shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="w-1.5 h-1.5 bg-white animate-pulse" />
            </div>
          </div>
          
          {/* Target Coordinates UI */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/40" />
          
          <div className="absolute bottom-2 left-2 text-[8px] font-mono tracking-widest text-neutral-600">SYS.NODE_X1</div>
        </motion.div>
      </div>

      {/* Right: Content */}
      <div className="w-full lg:w-1/2 px-6 lg:px-20 relative z-10 -mt-10 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-white/30" />
            <h2 className="text-xs md:text-sm font-mono text-neutral-400 tracking-[0.4em] uppercase">
              OPERATIONAL OVERVIEW
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-light text-white tracking-[0.1em] mb-10 uppercase">
            HAKKIMDA
          </h3>
          <p className="text-base md:text-lg text-neutral-400 leading-relaxed font-light mb-10 max-w-2xl border-l border-white/20 pl-6">
            Geniş bir teknoloji yelpazesinde uzmanlaşmış, veriden yapay zekaya, backend'den mobile uzanan kapsamlı bir mühendislik yetenek seti.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 text-neutral-300 text-sm md:text-base leading-relaxed font-light max-w-2xl"
        >
          <p>
            <span className="text-white font-semibold border-b border-white/20 pb-0.5">Veri Bilimi ve Yapay Zeka</span> disiplinlerindeki uzmanlığım, karmaşık verilerden anlamlı içgörüler çıkarmamı ve otonom sistemler tasarlamamı sağlıyor. <span className="text-white font-semibold border-b border-white/20 pb-0.5">Java Spring</span> ve <span className="text-white font-semibold border-b border-white/20 pb-0.5">Backend</span> mimarilerindeki derin tecrübemle, yüksek ölçeklenebilir ve güvenli kurumsal ağlar üretiyorum.
          </p>
          <p>
            <span className="text-white font-semibold border-b border-white/20 pb-0.5">Mobil Geliştirme</span> ve <span className="text-white font-semibold border-b border-white/20 pb-0.5">SaaS</span> projelerimle, kullanıcı deneyimini merkeze alan, hızlı yanıt veren veri odaklı arayüzler inşa ediyorum. Veritabanı optimizasyonundan bulut mimarilerine kadar, teknolojinin tüm katmanlarında operasyonel kararlılık sağlıyorum.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 mt-12 border-t border-white/10"
        >
          {[
            { label: "SOLUTIONS", value: "AI" },
            { label: "ARCHITECTURE", value: "SaaS" },
            { label: "FULLSTACK", value: "DEV" },
            { label: "SCIENCE", value: "DATA" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col border border-white/10 p-5 bg-black hover:bg-white/[0.03] transition-colors group cursor-default">
              <span className="text-2xl font-light text-white mb-2 group-hover:scale-105 origin-left transition-transform">{stat.value}</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
