"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tech: string;
  githubUrl?: string;
  category: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Assistyl",
    slug: "assistyl",
    description: "AI destekli görev ve iş yönetim uygulaması.",
    image: "/assistlydemo.png",
    tech: "React • Next.js • Tailwind • Clerk • Convex • Sentry • AWS • Turbo • Vercel",
    githubUrl: "https://github.com/ozcanhakn/assistly",
    category: "fullstack"
  },
  {
    id: "2",
    title: "OrcaAI",
    slug: "orcaai",
    description: "AI isteklerini maliyet, hız ve kaliteye göre en uygun sağlayıcıya yönlendiren akıllı AI orkestrasyon platformu.",
    image: "/orcaaiphoto.png",
    tech: "GO • Python • Node.js • PostgreSQL • Redis • Docker • Kubernetes",
    githubUrl: "https://github.com/ozcanhakn/orcaai",
    category: "ai"
  },
  {
    id: "3",
    title: "LMS Backend",
    slug: "lms-backend",
    description: "Spring Boot ile geliştirilmiş, RBAC ve denetim günlüğü özelliklerine sahip kurumsal düzeyde Öğrenme Yönetim Sistemi backend'i.",
    image: "/lmsbackend.png",
    tech: "Java • Spring Boot • PostgreSQL • Docker • Redis • RBAC • JWT • Maven",
    githubUrl: "https://github.com/ozcanhakn/lms-backend",
    category: "backend"
  },
  {
    id: "4",
    title: "RetailMind AI",
    slug: "retailmind-ai",
    description: "Dosya & Entegrasyon sayesinde, +50 farklı KPI ve istatistik sunabilen bir veri analiz platformu.",
    image: "/retailmindaiphoto.png",
    tech: "Python • Node.js • DrizzleORM • Typescript",
    githubUrl: "https://github.com/ozcanhakn/retailmind-ai",
    category: "fullstack"
  },
  {
    id: "5",
    title: "Doktor Asistanı AI",
    slug: "doktor-asistani",
    description: "OpenAI GPT-4 destekli, terminal ve API üzerinden sağlık sorunlarına yanıt veren akıllı doktor asistanı.",
    image: "/doktorassistantphoto.png",
    tech: "Python • FastAPI • LangChain • OpenAI GPT-4 • dotenv",
    githubUrl: "https://github.com/ozcanhakn/doktorassistant",
    category: "ai"
  },
  {
    id: "6",
    title: "Intria",
    slug: "intria",
    description:
      "Gerçek zamanlı makroekonomik verileri, piyasa göstergelerini ve yapay zekâ yorumlarını tek bir analiz panelinde birleştiren gelişmiş karar destek platformu.",
    image: "/intriaphoto.png",
    tech:
      "Next.js 15 • TypeScript • Tailwind • shadcn/ui • Convex • TurboRepo • OpenAI API • SWR • Finance APIs • Vercel",
    githubUrl: "https://github.com/ozcanhakn/intria",
    category: "fullstack"
  }
];

const categories = [
  { id: "all", label: "Tümü" },
  { id: "ai", label: "AI Projeleri" },
  { id: "fullstack", label: "Full Stack" },
  { id: "backend", label: "Backend Sistemleri" }
];

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full"
    >
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <div className="relative h-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-white/20 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Floating Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-xs font-medium text-white">
              {project.category.toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500 font-mono">
                {project.tech}
              </p>
            </div>

            {/* Action Icon */}
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                <ArrowUpRight size={20} />
              </div>
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
    <section className="min-h-screen w-full bg-black text-white py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 tracking-tighter">
            PROJELER
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Dijital dünyada iz bırakan, teknoloji ve tasarımın sınırlarını zorlayan çalışmalarım.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${selectedCategory === category.id
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
                }`}
            >
              {category.label.toUpperCase()}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Bu kategoride henüz proje bulunmuyor.</p>
          </div>
        )}
      </div>
    </section>
  );
}