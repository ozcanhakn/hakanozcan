"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";

// Proje veritabanı
interface ProjectDetail {
    id: string;
    title: string;
    slug: string;
    tagline: string;
    description: string;
    longDescription: string;
    images: string[];
    techStack: {
        category: string;
        technologies: string[];
    }[];
    features: string[];
    githubUrl?: string;
    liveUrl?: string;
    gradient: string;
}

// Proje verileri
const projectsData: Record<string, ProjectDetail> = {
    intria: {
        id: "6",
        title: "INTRIA",
        slug: "intria",
        tagline: "🏦 Risk Intelligence Platform",
        description:
            "Bloomberg Terminal seviyesinde tasarlanmış, yapay zeka destekli kapsamlı bir finansal risk istihbarat platformu.",
        longDescription: `INTRIA, profesyonel yatırımcılar için tasarlanmış, Bloomberg Terminal seviyesinde bir risk istihbarat platformudur. 
    
    Kripto paralar, hisse senetleri, emtialar ve döviz kurları için gerçek zamanlı piyasa verileri, AI tabanlı risk analizi, sentiment analizi ve portföy takibi sunar.
    
    Platform, SEC dosyalamalarından Twitter influencer'larına, Reddit WSB'den Whale Alert'e kadar geniş bir veri kaynağı yelpazesinde sentiment analizi yapar. FinBERT modeli ile ML tabanlı duygu analizi gerçekleştirir.
    
    VALAR AI Asistanı ile GPT-4 tabanlı portföy analizi, risk değerlendirmesi ve kişiselleştirilmiş yatırım önerileri sunar.`,
        images: ["/intria1.PNG", "/intria2.PNG", "/intria3.PNG"],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    "Next.js 14",
                    "React 18",
                    "TailwindCSS",
                    "Framer Motion",
                ],
            },
            {
                category: "Backend",
                technologies: ["Convex (Serverless Database & Functions)"],
            },
            {
                category: "Kimlik Doğrulama",
                technologies: ["Clerk"],
            },
            {
                category: "Ödeme Sistemi",
                technologies: ["Paddle"],
            },
            {
                category: "AI/ML",
                technologies: ["OpenAI GPT-4", "FinBERT Sentiment Analizi"],
            },
            {
                category: "Cache & Monitoring",
                technologies: ["Redis (Upstash)", "Sentry"],
            },
            {
                category: "Test",
                technologies: ["Vitest", "React Testing Library", "Playwright"],
            },
        ],
        features: [
            "4 Varlık Sınıfı: Kripto, Hisse, Emtia, Döviz",
            "AI Destekli Analiz: GPT-4, FinBERT",
            "Gerçek Zamanlı Veri: Binance WS, CoinGecko, Yahoo",
            "Çoklu Sentiment Kaynağı: SEC, Reddit, Twitter, News",
            "Bloomberg Terminal teması ile premium UX",
            "XSS, CSRF, Rate Limiting, Encryption güvenlik önlemleri",
            "Paddle entegrasyonu ile abonelik sistemi",
            "Convex serverless backend ile scalable mimari",
            "VALAR AI ile portföy analizi ve risk değerlendirmesi",
            "Monte Carlo simülasyonları ve stres testleri",
            "Whale takibi ve insider trading analizi",
            "Akıllı uyarı sistemi (Telegram, Email)",
        ],
        githubUrl: "https://github.com/ozcanhakn/intria",
        liveUrl: "https://intria-web.vercel.app/",
        gradient: "from-amber-500 to-orange-500",
    },
    // Diğer projeler buraya eklenebilir
    assistyl: {
        id: "1",
        title: "Assistyl",
        slug: "assistyl",
        tagline: "🤖 AI-Powered B2B Support Assistant",
        description: "AI destekli görev ve iş yönetim uygulaması.",
        longDescription:
            "Assistyl, B2B şirketler için geliştirilmiş yapay zeka destekli bir destek asistanıdır. Müşteri sorularını otomatik olarak yanıtlar, görevleri organize eder ve iş akışlarını optimize eder.",
        images: ["/assistlydemo.png"],
        techStack: [
            {
                category: "Frontend",
                technologies: ["React", "Next.js", "Tailwind"],
            },
            {
                category: "Backend",
                technologies: ["Node.js", "Convex"],
            },
            {
                category: "DevOps",
                technologies: ["AWS", "Turbo", "Vercel"],
            },
            {
                category: "Auth & Monitoring",
                technologies: ["Clerk", "Sentry"],
            },
        ],
        features: [
            "AI destekli müşteri desteği",
            "Görev yönetimi ve takibi",
            "İş akışı otomasyonu",
            "Gerçek zamanlı bildirimler",
        ],
        githubUrl: "https://github.com/ozcanhakn/assistly",
        gradient: "from-blue-500 to-cyan-500",
    },
    orcaai: {
        id: "2",
        title: "OrcaAI",
        slug: "orcaai",
        tagline: "🐋 AI Orchestrator",
        description:
            "AI isteklerini maliyet, hız ve kaliteye göre en uygun sağlayıcıya yönlendiren akıllı AI orkestrasyon platformu.",
        longDescription:
            "OrcaAI, farklı AI sağlayıcılarını (OpenAI, Anthropic, Google vb.) tek bir API arkasında birleştiren ve istekleri maliyet, hız ve kalite kriterlerine göre en uygun sağlayıcıya yönlendiren bir orkestrasyon platformudur.",
        images: ["/orcaaiphoto.png"],
        techStack: [
            {
                category: "Backend",
                technologies: ["Go", "Python", "Node.js"],
            },
            {
                category: "Database",
                technologies: ["PostgreSQL", "Redis"],
            },
            {
                category: "DevOps",
                technologies: ["Docker", "Kubernetes", "Prometheus", "Grafana"],
            },
        ],
        features: [
            "Çoklu AI sağlayıcı desteği",
            "Akıllı yönlendirme algoritması",
            "Maliyet optimizasyonu",
            "Performans izleme ve raporlama",
        ],
        githubUrl: "https://github.com/ozcanhakn/orcaai",
        gradient: "from-purple-500 to-pink-500",
    },
    "lms-backend": {
        id: "3",
        title: "LMS Backend",
        slug: "lms-backend",
        tagline: "📚 Enterprise Learning Management System",
        description:
            "Spring Boot ile geliştirilmiş, RBAC ve denetim günlüğü özelliklerine sahip kurumsal düzeyde Öğrenme Yönetim Sistemi backend'i.",
        longDescription:
            "Kurumsal düzeyde bir Öğrenme Yönetim Sistemi backend'i. Spring Boot ile geliştirilmiş olup, RBAC (Role-Based Access Control) ve kapsamlı denetim günlüğü özelliklerine sahiptir.",
        images: ["/lmsbackend.png"],
        techStack: [
            {
                category: "Backend",
                technologies: ["Java", "Spring Boot", "Maven"],
            },
            {
                category: "Database",
                technologies: ["PostgreSQL", "Redis"],
            },
            {
                category: "Security",
                technologies: ["JWT", "RBAC"],
            },
            {
                category: "DevOps",
                technologies: ["Docker"],
            },
        ],
        features: [
            "Rol tabanlı erişim kontrolü (RBAC)",
            "Kapsamlı denetim günlüğü",
            "JWT tabanlı kimlik doğrulama",
            "Kurs ve içerik yönetimi",
        ],
        githubUrl: "https://github.com/ozcanhakn/lms-backend",
        gradient: "from-green-500 to-emerald-500",
    },
    "retailmind-ai": {
        id: "4",
        title: "RetailMind AI",
        slug: "retailmind-ai",
        tagline: "📊 Retail Data Analytics Platform",
        description:
            "Dosya & Entegrasyon sayesinde, +50 farklı KPI ve istatistik sunabilen bir veri analiz platformu.",
        longDescription:
            "RetailMind AI, perakende sektörü için geliştirilmiş bir veri analiz platformudur. 50'den fazla farklı KPI ve istatistik sunarak işletmelerin veriye dayalı kararlar almasını sağlar.",
        images: ["/retailmindaiphoto.png"],
        techStack: [
            {
                category: "Backend",
                technologies: ["Python", "Node.js"],
            },
            {
                category: "Database",
                technologies: ["DrizzleORM", "TypeScript"],
            },
        ],
        features: [
            "50+ farklı KPI ve metrik",
            "Çoklu veri kaynağı entegrasyonu",
            "Otomatik raporlama",
            "Görselleştirme dashboard'ları",
        ],
        githubUrl: "https://github.com/ozcanhakn/retailmind-ai",
        gradient: "from-teal-500 to-cyan-500",
    },
    "doktor-asistani": {
        id: "5",
        title: "Doktor Asistanı AI",
        slug: "doktor-asistani",
        tagline: "🏥 AI-Powered Health Assistant",
        description:
            "OpenAI GPT-4 destekli, terminal ve API üzerinden sağlık sorunlarına yanıt veren akıllı doktor asistanı.",
        longDescription:
            "Doktor Asistanı AI, OpenAI GPT-4 altyapısını kullanarak sağlık sorunlarına yanıt veren bir yapay zeka asistanıdır. Terminal ve API üzerinden erişilebilir.",
        images: ["/doktorassistantphoto.png"],
        techStack: [
            {
                category: "Backend",
                technologies: ["Python", "FastAPI"],
            },
            {
                category: "AI/ML",
                technologies: ["OpenAI GPT-4", "LangChain"],
            },
            {
                category: "Other",
                technologies: ["dotenv"],
            },
        ],
        features: [
            "GPT-4 destekli yanıtlar",
            "Terminal ve API erişimi",
            "Sağlık bilgisi arama",
            "Semptom analizi",
        ],
        githubUrl: "https://github.com/ozcanhakn/doktorassistant",
        gradient: "from-red-500 to-rose-500",
    },
};

export default function ProjectDetail() {
    const params = useParams();
    const slug = params.slug as string;
    const [activeImage, setActiveImage] = useState(0);

    // Projeyi bul
    const project = projectsData[slug];

    // Proje bulunamadıysa 404
    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                {/* Background Glow */}
                <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br ${project.gradient} opacity-20 blur-[120px] pointer-events-none`}
                />

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft
                                size={20}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            <span>Tüm Projeler</span>
                        </Link>
                    </motion.div>

                    {/* Title & Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12"
                    >
                        <span
                            className={`inline-block bg-gradient-to-r ${project.gradient} text-white px-4 py-2 rounded-full text-sm font-medium mb-4`}
                        >
                            {project.tagline}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {project.title}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
                            {project.description}
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-4 mb-16"
                    >
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                            >
                                <Github size={20} />
                                <span>GitHub'da İncele</span>
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all duration-300"
                            >
                                <ArrowUpRight size={20} />
                                <span>Canlı Demo</span>
                            </a>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Image Gallery */}
            <section className="px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        {/* Ana Görsel */}
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-4">
                            <Image
                                src={project.images[activeImage] ?? project.images[0] ?? "/placeholder.png"}
                                alt={`${project.title} - Görsel ${activeImage + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Thumbnail Grid - Sadece birden fazla görsel varsa göster */}
                        {project.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {project.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === index
                                            ? "border-white/60 ring-2 ring-white/20"
                                            : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${project.title} - Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Description */}
            <section className="px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-white">
                            Proje Hakkında
                        </h2>
                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                                {project.longDescription}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="px-6 py-16 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-12 text-white">
                            Teknoloji Stack&apos;i
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.techStack.map((stack, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300"
                                >
                                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                                        {stack.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {stack.technologies.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className={`px-3 py-1.5 text-sm rounded-full bg-gradient-to-r ${project.gradient} bg-opacity-10 text-white font-medium`}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-12 text-white">
                            Öne Çıkan Özellikler
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                                >
                                    <CheckCircle2
                                        className={`w-6 h-6 flex-shrink-0 bg-gradient-to-r ${project.gradient} rounded-full p-0.5`}
                                    />
                                    <span className="text-gray-300">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Back to Projects */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 group"
                        >
                            <ArrowLeft
                                size={20}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            <span>Tüm Projelere Dön</span>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
