"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  content: string;
  created_at: string;
  read_time: string;
  category: string;
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogDetail({ params }: Props) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  
  // params'ı React.use() ile unwrap et
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Blog detayını çek
        const blogRes = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_API_URL}/rest/v1/blogs?slug=eq.${slug}&select=*`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );

        const blogData = await blogRes.json();
        
        if (!blogData || blogData.length === 0) {
          notFound();
        }

        const currentBlog = blogData[0];
        setBlog(currentBlog);

        // İlgili blogları çek (aynı kategoriden)
        const relatedRes = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_API_URL}/rest/v1/blogs?category=eq.${currentBlog.category}&slug=neq.${slug}&select=*&limit=3&order=created_at.desc`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );

        const relatedData = await relatedRes.json();
        setRelatedBlogs(Array.isArray(relatedData) ? relatedData : []);

      } catch (error) {
        console.error("Blog verisi çekilemedi:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  // İçerik formatlama fonksiyonu
  const formatContent = (content: string) => {
    // Markdown benzeri formatlamayı HTML'e çevir
    let formattedContent = content
      // Başlıkları
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-5 mb-2 text-gray-900">$1</h3>')
      
      // Kalın ve italik
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      
      // Listeler
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
      .replace(/(<li.*?>.*?<\/li>)/gims, '<ul class="list-disc ml-6 my-4">$1</ul>')
      
      // Tablolar
      .replace(/\| (.*?) \|/g, '<td class="px-4 py-2 border border-gray-300">$1</td>')
      .replace(/<td>(.*?)<\/td>\s*<td>(.*?)<\/td>/g, '<tr>$&</tr>')
      .replace(/<tr>.*?<\/tr>/gims, '<table class="min-w-full border-collapse border border-gray-300 my-6"><tbody>$&</tbody></table>')
      
      // Satır sonları
      .replace(/\n/g, '<br>')
      
      // Emojiler ve özel formatlar
      .replace(/🌳|📘|🌲|⚙️|🚫|🌍|🧩/g, '<span class="text-2xl mr-2">$&</span>');

    // Paragraf wrapper'ı ekle
    formattedContent = formattedContent
      .split('<br><br>')
      .map(paragraph => {
        if (paragraph.trim() && 
            !paragraph.includes('<h1') && 
            !paragraph.includes('<h2') && 
            !paragraph.includes('<h3') && 
            !paragraph.includes('<ul') && 
            !paragraph.includes('<table')) {
          return `<p class="mb-4 leading-relaxed">${paragraph}</p>`;
        }
        return paragraph;
      })
      .join('');

    return formattedContent;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Kategori */}
            <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              {blog.category}
            </span>
            
            {/* Başlık */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 leading-tight">
              {blog.title}
            </h1>
            
            {/* Özet */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              {blog.summary}
            </p>
            
            {/* Meta Bilgiler */}
            <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
              <span>{new Date(blog.created_at).toLocaleDateString("tr-TR", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span>•</span>
              <span>{blog.read_time || '3 min read'}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 -mt-8 mb-16"
      >
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      </motion.section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-lg max-w-none"
        >
          {/* Formatlanmış içerik */}
          <div 
            className="text-gray-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ 
              __html: formatContent(blog.content) 
            }}
          />
        </motion.article>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Bu yazıyı paylaş:</span>
            <div className="flex gap-4">
              <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-semibold text-center mb-12 text-gray-900"
            >
              İlgili Yazılar
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <motion.article
                  key={relatedBlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/blog/${relatedBlog.slug}`} className="block">
                    <div className="relative h-48">
                      <Image
                        src={relatedBlog.thumbnail}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {relatedBlog.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(relatedBlog.created_at).toLocaleDateString("tr-TR")}</span>
                        <span>{relatedBlog.read_time}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}