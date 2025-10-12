"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#181818]/60 backdrop-blur-md"
          : "bg-[#181818]"
      }`}
    >
      <div className="relative flex items-center h-12 px-6">
        {/* Sol: Logo + İsim */}
        <div className="flex items-center gap-2 z-10">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          <p style={{ color: "#D1D1D1" }} className="text-sm font-medium">
            Hakan ÖZCAN
          </p>
        </div>

        {/* Orta: Menü */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
          <Link
            href="/main"
            className="text-sm transition-colors duration-200"
            style={{ color: "#D1D1D1" }}
          >
            <span className="hover:text-white">Hakkımda</span>
          </Link>
          <Link
            href="/projects"
            className="text-sm transition-colors duration-200"
            style={{ color: "#D1D1D1" }}
          >
            <span className="hover:text-white">Projeler</span>
          </Link>
          <Link
            href="/blog"
            className="text-sm transition-colors duration-200"
            style={{ color: "#D1D1D1" }}
          >
            <span className="hover:text-white">Blog</span>
          </Link>
          <Link
            href="/"
            className="text-sm transition-colors duration-200"
            style={{ color: "#D1D1D1" }}
          >
            <span className="hover:text-white">İletişim</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
