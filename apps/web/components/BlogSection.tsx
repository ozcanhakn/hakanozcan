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
    <section className="w-full bg-[#FFFFFF] text-[#1F1F1F] py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-semibold mb-12 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">

        </h2>

        {displayedBlogs.length > 0 ? (
          <motion.div
            className="flex gap-6 justify-center flex-wrap"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {displayedBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="w-[350px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full h-52 rounded-t-2xl overflow-hidden">
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.summary}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(blog.created_at).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Blog yazıları yükleniyor...</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="text-gray-800 underline hover:text-black transition-colors"
          >
            Tüm Yazılar →
          </Link>
        </div>
      </div>
    </section>
  );
}