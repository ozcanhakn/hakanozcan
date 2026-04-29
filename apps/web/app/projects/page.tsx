"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tech: string;
  githubUrl?: string;
  category: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: "6",
    title: "THE ARCHITECT (INTRIA)",
    slug: "the-architect",
    description: "S&P 500 şirketleri için küresel olaylardan anlık finansal sinyal ve tedarik zinciri etki haritası üreten, graf tabanlı istihbarat sistemi.",
    image: "/intria1.PNG",
    tech: "[ONTOLOGY] [KNOWLEDGE GRAPH] [FINANCIAL INTELLIGENCE]",
    category: "ai",
    link: "https://intria.app"
  },
  {
    id: "7",
    title: "SERAPH MESSAGING",
    slug: "seraph-messaging",
    description: "Devlet destekli siber tehditlere (NSO/Pegasus) karşı tasarlanmış; Double Ratchet E2EE, Memory Hardening, Metadata Minimization ve Cryptographic Erase (Duress PIN) yeteneklerine sahip askeri düzey iletişim mimarisi.",
    image: "/SeraphMessagingLogo.png",
    tech: "[DOUBLE RATCHET] [SQLCIPHER] [HKDF] [ANTI-FORENSICS] [E2EE]",
    category: "backend",
    link: "https://github.com/ozcanhakn/Seraph-Messaging"
  },
  {
    id: "1",
    title: "Assistyl",
    slug: "assistyl",
    description: "AI destekli görev ve iş yönetim platformu. Müşteri hizmetleri otomasyonu.",
    image: "/assistlydemo.png",
    tech: "[REACT] [NEXT.JS] [CONVEX] [AWS]",
    category: "fullstack",
    link: "https://assistly-widget.vercel.app/"
  },
  {
    id: "8",
    title: "Huququmvar",
    slug: "huququmvar",
    description: "Proje detayları ve mimari özellikleri daha sonra eklenecektir.",
    image: "/huququmvarlogo.png",
    tech: "[PENDING_INTEGRATION]",
    category: "ai",
    link: "https://huququmvar.az"
  },
  {
    id: "2",
    title: "OrcaAI",
    slug: "orcaai",
    description: "Akıllı AI orkestrasyon platformu. Maliyet, hız ve kalite tabanlı dinamik yönlendirme.",
    image: "/orcaaiphoto.png",
    tech: "[GO] [PYTHON] [REDIS] [K8S]",
    category: "ai",
    link: "https://github.com/ozcanhakn/orcaai"
  },
  {
    id: "3",
    title: "LMS Backend",
    slug: "lms-backend",
    description: "RBAC ve denetim günlüğü özelliklerine sahip kurumsal Öğrenme Yönetim Sistemi mimarisi.",
    image: "/lmsbackend.png",
    tech: "[JAVA] [SPRING] [POSTGRESQL]",
    category: "backend",
    link: "https://github.com/ozcanhakn/lms-backend"
  },
  {
    id: "4",
    title: "RetailMind AI",
    slug: "retailmind-ai",
    description: "+50 farklı KPI sunabilen büyük veri analiz platformu.",
    image: "/retailmindaiphoto.png",
    tech: "[PYTHON] [NODE.JS] [DRIZZLE]",
    category: "fullstack",
    link: "https://github.com/ozcanhakn/retailmindai"
  },
  {
    id: "5",
    title: "Doktor Asistanı AI",
    slug: "doktor-asistani",
    description: "OpenAI GPT-4 destekli, API tabanlı akıllı medikal teşhis asistanı.",
    image: "/doktorassistantphoto.png",
    tech: "[PYTHON] [FASTAPI] [LANGCHAIN]",
    category: "ai",
    link: "#"
  },



  {
    id: "9",
    title: "Petfoodro",
    slug: "petfoodro",
    description: "Proje detayları ve mimari özellikleri daha sonra eklenecektir.",
    image: "/placeholder.png",
    tech: "[PENDING_INTEGRATION]",
    category: "fullstack",
    link: "https://petfoodro.vercel.app/"
  },
  {
    id: "10",
    title: "Sosyal Medya Otomasyonu",
    slug: "sosyal-medya-otomasyonu",
    description: "Proje detayları ve mimari özellikleri daha sonra eklenecektir.",
    image: "/placeholder.png",
    tech: "[PENDING_INTEGRATION]",
    category: "backend",
    link: "https://automation-olive-alpha.vercel.app/"
  },
  {
    id: "11",
    title: "GDU Scientific Journal",
    slug: "gdu-scientific-journal",
    description: "Ganja State University için uluslararası akademik standartlarda tasarlanmış, makale yayın ve hakem (peer-review) yönetim portalı.",
    image: "/placeholder.png",
    tech: "[REACT] [NEXT.JS] [TAILWIND] [POSTGRESQL]",
    category: "fullstack",
    link: "https://www.iskrayazilim.com/jurnal/en"
  }
];

const categories = [
  { id: "all", label: "ALL_SYSTEMS" },
  { id: "ai", label: "AI_ENGINES" },
  { id: "fullstack", label: "FULLSTACK" },
  { id: "backend", label: "CORE_BACKEND" }
];

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full bg-black border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden flex flex-col"
    >
      {/* Background Data Grid */}
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] transition-opacity duration-700 pointer-events-none z-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

      <Link href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full z-10">
        
        {/* Image Container */}
        <div className="relative h-64 border-b border-white/10 overflow-hidden bg-black/50">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700 scale-100 group-hover:scale-105"
          />
          {/* Radar Scanner Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          <div className={`absolute top-0 left-0 w-full h-[1px] bg-white/30 transition-transform duration-1000 ${isHovered ? 'translate-y-[250px]' : 'translate-y-0'} pointer-events-none`} />

          {/* Floating Category Badge */}
          <div className="absolute top-4 right-4 px-2 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white tracking-widest uppercase">
            {project.category}
          </div>
          
          {/* System ID Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={`w-2 h-2 ${isHovered ? 'bg-white animate-pulse' : 'bg-neutral-600'}`} />
            <span className="text-[10px] font-mono tracking-widest text-white uppercase">SYS_{project.id}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-8 flex flex-col flex-1 bg-black">
          <div className="mb-6 flex-1">
            <h3 className="text-2xl font-light text-white mb-4 tracking-[0.05em] uppercase group-hover:text-neutral-300 transition-colors">
              {project.title}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed font-light line-clamp-3">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Array */}
          <div className="pt-6 border-t border-white/5 group-hover:border-white/20 transition-colors">
            <span className="text-[10px] text-neutral-600 font-mono tracking-[0.2em] uppercase block mb-3">
              // MODULES
            </span>
            <p className="text-[10px] text-neutral-400 font-mono tracking-widest">
              {project.tech}
            </p>
          </div>

          {/* Action Icon / Arrow */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <div className="w-8 h-8 border border-white/30 text-white flex items-center justify-center bg-white/[0.05]">
              <ArrowUpRight size={16} strokeWidth={1} />
            </div>
          </div>
        </div>

      </Link>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <section className="min-h-screen w-full bg-black text-white py-32 px-6 lg:px-8 relative overflow-hidden border-t border-white/10">
      
      {/* Background Radar Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1)_50%,transparent_50%)] bg-[size:1px_10px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left mb-20 flex flex-col items-center md:items-start"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-white/50" />
            <h2 className="text-xs font-mono text-neutral-400 tracking-[0.4em] uppercase">
              SYSTEM ARCHIVE DIRECTORY
            </h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-[0.1em] text-white uppercase">
            PROJELER
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-2xl font-light border-l border-white/20 pl-6 text-left">
            Dijital dünyada iz bırakan, teknoloji ve tasarımın sınırlarını zorlayan operasyonel modüller ve kurumsal çözümler dizini.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center md:justify-start gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 border ${
                selectedCategory === category.id
                  ? "bg-white text-black border-white"
                  : "bg-black text-neutral-500 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 border border-white/5 bg-black mt-10">
            <div className="w-2 h-[1px] bg-neutral-600 mb-4" />
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              QUERY_RESULT_EMPTY // NO_SYSTEMS_FOUND
            </span>
          </div>
        )}
      </div>
    </section>
  );
}