"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  created_at: string;
  read_time: string;
  category: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: "all", label: "Tümü" },
    { id: "ai", label: "Yapay Zeka" },
    { id: "web", label: "Web Geliştirme" },
    { id: "backend", label: "Backend" },
    { id: "mobile", label: "Mobil" }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_API_URL}/rest/v1/blogs?select=*&order=created_at.desc`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Blog verisi çekilemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = selectedCategory === "all"
    ? blogs
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <section className="min-h-screen w-full bg-black text-white py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 tracking-tighter">
            BLOG
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Teknoloji, yazılım ve gelecek üzerine düşüncelerim.
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

        {/* Blog Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBlogs.map((blog, index) => (
              <motion.article
                layout
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col h-full"
              >
                <Link href={`/blog/${blog.slug}`} className="block h-full">
                  <div className="relative h-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-white/20 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] flex flex-col">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-xs font-medium text-white flex items-center gap-2">
                          <Tag size={12} />
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(blog.created_at).toLocaleDateString("tr-TR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {blog.read_time || "3 min read"}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                        {blog.summary}
                      </p>

                      <div className="flex items-center text-sm font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                        DEVAMINI OKU <ArrowRight size={16} className="ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBlogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Bu kategoride henüz yazı bulunmuyor.</p>
          </div>
        )}

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 p-12 rounded-3xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 backdrop-blur-md text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

          <h3 className="text-3xl font-bold text-white mb-4">
            Bültene Abone Olun
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            En yeni makaleler ve teknoloji trendlerinden haberdar olmak için e-posta listeme katılın.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto relative z-10">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 rounded-full bg-black/50 border border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 outline-none placeholder:text-gray-600"
            />
            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors duration-300">
              Abone Ol
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}