"use client";

import { AnimatePresence, motion } from "framer-motion";
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

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
    
    if (isInitial) {
      setIsInitial(false);
    }
  }, [selectedCategory, isInitial]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
    }
  };

  const handleGithubClick = (e: React.MouseEvent, url?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section className="w-full bg-white text-[#1F1F1F] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-7xl font-semibold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Projeler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Modern teknolojilerle geliştirdiğim, kullanıcı deneyimini ön planda tutan özenle tasarlanmış projeler.
          </p>
        </motion.div>

        {/* Kategori Filtreleri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Proje Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Proje Görseli */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* GitHub Butonu */}
                  {project.githubUrl && (
                    <button
                      onClick={(e) => handleGithubClick(e, project.githubUrl)}
                      className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Kodları Gör
                      </span>
                    </button>
                  )}
                </div>

                {/* Proje İçerik */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {project.description}
                    </p>
                  </div>

                  {/* Teknoloji Stack */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      {project.tech}
                    </p>
                  </div>

                  {/* Detay Link */}
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 mt-4 text-gray-900 font-medium hover:text-gray-700 transition-colors duration-300 group/link text-sm"
                  >
                    <span>Detayları Gör</span>
                    <svg 
                      className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Hover Efekti */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-3xl transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Boş State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">
              Bu kategoride henüz proje bulunmuyor.
            </p>
          </motion.div>
        )}

        {/* Footer Not */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-8 border-t border-gray-100"
        >
          <p className="text-gray-500 text-lg">
            Daha fazla proje için{" "}
            <Link href="/github" className="text-gray-900 underline hover:text-gray-700 transition-colors">
              GitHub profilimi
            </Link>{" "}
            ziyaret edebilirsiniz.
          </p>
        </motion.div>
      </div>
    </section>
  );
}