"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Hakkımda", path: "/" },
    { name: "Projeler", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "İletişim", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
        ? "bg-black/50 backdrop-blur-xl border-b border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        : "bg-transparent backdrop-blur-none"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 z-10">
          <div className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.2)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-orange-400 transition-colors duration-300">
              <path d="M4 4V20M20 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="4" cy="4" r="2" fill="currentColor" className="animate-pulse" />
              <circle cx="20" cy="20" r="2" fill="currentColor" className="animate-pulse" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.2em] text-white group-hover:text-orange-400 transition-colors duration-300">
              M. HAKAN
            </span>
            <span className="text-[10px] font-medium tracking-[0.3em] text-gray-500 group-hover:text-orange-300 transition-colors duration-300">
              ÖZCAN
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <MagneticLink
              key={link.path}
              href={link.path}
              isActive={pathname === link.path}
            >
              {link.name}
            </MagneticLink>
          ))}
        </div>

        {/* Mobile Menu Button (Placeholder for now) */}
        <div className="md:hidden">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function MagneticLink({ children, href, isActive }: { children: React.ReactNode; href: string; isActive: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      style={{ position: "relative" }}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      <Link
        ref={ref}
        href={href}
        className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 block ${isActive ? "text-white" : "text-gray-400 hover:text-orange-400"
          }`}
      >
        {isActive && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full -z-10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        {children}
      </Link>
    </motion.div>
  );
}