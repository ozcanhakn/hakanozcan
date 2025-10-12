"use client"

import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center bg-[#000000] pt-32 pb-0"
    >
      {/* Üstte yazılar */}
      <div className="max-w-2xl px-6">
        <h1 className="text-4xl font-semibold text-[#F5F5F7] mb-4">
          Merhaba, ben Hakan ÖZCAN
        </h1>
        <p className="text-[#F5F5F7]/80 mb-8">
          AI & Fullstack Developer
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link href="/contact">
            <button className="px-6 py-3 rounded-md transition-all duration-300 border border-blue-500 text-[#F5F5F7] hover:bg-blue-500 hover:text-white">
              İletişime Geç
            </button>
          </Link>

          <Link href="/projects">
            <button className="px-6 py-3 rounded-md transition-all duration-300 bg-blue-500 text-white hover:bg-transparent hover:border-blue-500 hover:text-[#F5F5F7] border border-transparent">
              Projelerimi Gör
            </button>
          </Link>
        </div>
      </div>

      {/* Fotoğraf kısmı */}
      <div className="w-full flex justify-center">
        <Image
          src="/test-1.jpg" 
          alt="Hero görseli"
          width={1200}
          height={600}
          className="object-cover w-full max-h-[400px]"
        />
      </div>
    </section>
  )
}
