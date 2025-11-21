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
  category?: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_API_URL}/rest/v1/blogs?select=*&order=created_at.desc&limit=3`,
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
      }
    };
    fetchBlogs();
  }, []);

  // Sadece ilk 3 blogu göster
  const displayedBlogs = blogs.slice(0, 3);

  return (
    <section className="relative w-full py-40 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10"
        >
          <div>
            <h2 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 tracking-tighter opacity-90">
              BLOG
            </h2>
            <p className="text-gray-400 text-xl mt-4 max-w-md">
              Teknoloji, tasarım ve gelecek üzerine düşünceler.
            </p>
          </div>

          <Link href="/blog">
            <button className="group flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors">
              Tüm Yazıları Gör
              <span className="block w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
            </button>
          </Link>
        </motion.div>

        {displayedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {displayedBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`group relative ${index === 0 ? "md:col-span-8 md:row-span-2" : "md:col-span-4"
                  }`}
              >
                <Link href={`/blog/${blog.slug}`} className="block h-full">
                  <div className="relative w-full h-full min-h-[300px] rounded-3xl overflow-hidden">
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-black">
                          {blog.category || "Teknoloji"}
                        </span>
                        <span className="text-xs text-gray-300 font-medium">
                          {new Date(blog.created_at).toLocaleDateString("tr-TR", { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <h3 className={`font-bold text-white mb-2 group-hover:underline decoration-2 underline-offset-4 ${index === 0 ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"}`}>
                        {blog.title}
                      </h3>

                      {index === 0 && (
                        <p className="text-gray-300 text-lg line-clamp-2 max-w-2xl">
                          {blog.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Blog yazıları yükleniyor...</p>
          </div>
        )}
      </div>
    </section>
  );
}