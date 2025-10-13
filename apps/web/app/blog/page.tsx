"use client";

import { motion } from "framer-motion";
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

  return (
    <section className="w-full bg-white text-[#1F1F1F] py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-7xl font-semibold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Teknoloji, yazılım geliştirme ve yapay zeka hakkındaki düşüncelerim, deneyimlerim ve öğrendiklerim.
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
              onClick={() => setSelectedCategory(category.id)}
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

        {/* Blog Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBlogs.map((blog) => (
              <motion.article
                key={blog.id}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <Link href={`/blog/${blog.slug}`} className="block">
                  {/* Blog Görseli */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Kategori Etiketi */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Blog İçerik */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                        {blog.summary}
                      </p>
                    </div>

                    {/* Meta Bilgiler */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <span>{new Date(blog.created_at).toLocaleDateString("tr-TR")}</span>
                      <span>{blog.read_time || "3 min read"}</span>
                    </div>
                  </div>

                  {/* Hover Efekti */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-3xl transition-all duration-500 pointer-events-none" />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Boş State */}
        {!isLoading && filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz blog yazısı bulunmuyor
            </h3>
            <p className="text-gray-600">
              {selectedCategory === "all" 
                ? "Yakında yeni yazılar eklenecek."
                : "Bu kategoride henüz yazı bulunmuyor."
              }
            </p>
          </motion.div>
        )}

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-12 border-t border-gray-100"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Yeni Yazılardan Haberdar Olun
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Yeni blog yazıları yayınlandığında e-posta ile bilgi almak ister misiniz?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-300 outline-none"
            />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap">
              Abone Ol
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}