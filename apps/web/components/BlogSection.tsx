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

function BlogCard({ blog, index, isLarge }: { blog: Blog; index: number; isLarge: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative ${isLarge ? "md:col-span-8 md:row-span-2" : "md:col-span-4"} bg-black border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col h-full min-h-[300px] lg:min-h-[400px]`}
    >
      <Link href={`/blog/${blog.slug}`} className="flex flex-col h-full w-full">
        {/* Abstract Data Grid Pattern on Hover */}
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] transition-opacity duration-700 pointer-events-none z-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Thumbnail View */}
        <div className="relative w-full h-1/2 min-h-[200px] border-b border-white/10 overflow-hidden bg-black/50 z-10">
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105"
          />
          {/* Top HUD */}
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
            <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest text-white uppercase">
              {blog.category || "INTELLIGENCE"}
            </span>
            <div className={`w-2 h-2 rounded-none transition-colors duration-500 ${isHovered ? 'bg-white animate-pulse' : 'bg-neutral-600'}`} />
          </div>
          {/* Scanning Line Effect */}
          <div className={`absolute top-0 left-0 w-full h-[1px] bg-white/20 transition-transform duration-1000 ${isHovered ? 'translate-y-[200px]' : 'translate-y-0'} pointer-events-none`} />
        </div>

        {/* Content Data */}
        <div className="flex flex-col flex-1 p-6 lg:p-8 bg-black z-10">
          <div className="mb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
              LOG_DATE: {new Date(blog.created_at).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
            </span>
          </div>

          <h3 className={`font-light text-white tracking-[0.05em] uppercase mb-4 group-hover:text-neutral-300 transition-colors ${isLarge ? "text-2xl lg:text-4xl" : "text-xl lg:text-2xl"}`}>
            {blog.title}
          </h3>

          {isLarge && (
            <p className="text-neutral-400 text-sm lg:text-base font-light line-clamp-2 max-w-2xl mt-auto">
              {blog.summary}
            </p>
          )}

          <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5 group-hover:border-white/20 transition-colors">
            <span className="text-[10px] font-mono tracking-widest text-neutral-600 group-hover:text-white transition-colors">
              READ_ANALYSIS
            </span>
            <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!apiUrl || !anonKey) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${apiUrl}/rest/v1/blogs?select=*&order=created_at.desc&limit=3`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const displayedBlogs = blogs.slice(0, 3);

  return (
    <section className="relative w-full py-40 px-6 lg:px-8 bg-black border-t border-white/10 overflow-hidden">
      
      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-white/50" />
              <h2 className="text-xs font-mono text-neutral-400 tracking-[0.4em] uppercase">
                INTELLIGENCE BRIEFS
              </h2>
            </div>
            <h3 className="text-5xl md:text-7xl font-light text-white tracking-[0.1em] uppercase">
              BLOG
            </h3>
            <p className="text-neutral-500 text-sm md:text-base font-light mt-6 max-w-md">
              Teknoloji, mühendislik mimarileri ve veri bilimi üzerine analiz raporları.
            </p>
          </div>

          <Link href="/blog">
            <button className="group px-6 py-3 border border-white/20 bg-white/[0.02] text-xs font-mono tracking-[0.3em] text-neutral-300 uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-4">
              <span>VIEW ALL LOGS</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 border border-white/5 bg-black">
            <div className="w-2 h-2 bg-white animate-pulse mb-4" />
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              FETCHING_DATA...
            </span>
          </div>
        ) : displayedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {displayedBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} isLarge={index === 0} />
            ))}
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-32 border border-red-500/10 bg-red-500/[0.02]">
            <span className="text-xs font-mono tracking-widest text-red-500/50 uppercase mb-2">
              SYS.ERROR: CONNECTION_REFUSED
            </span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-600">
              Veri ağlarına erişilemedi.
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-white/5 bg-black">
            <div className="w-2 h-[1px] bg-neutral-600 mb-4" />
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              DATABASE_EMPTY // NO_LOGS_FOUND
            </span>
          </div>
        )}
      </div>
    </section>
  );
}