"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "HAKKIMDA", path: "/" },
  { name: "PROJELER", path: "/projects" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobil menü açıkken arkadaki body'nin scroll olmasını engelle
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-500 border-b ${
          scrolled || mobileMenuOpen
            ? "bg-black/80 backdrop-blur-md border-white/10"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6 lg:px-8">
          
          {/* LOGO */}
          <Link href="/" className="group flex flex-col z-10" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-sm group-hover:scale-150 transition-transform duration-500" />
              <span className="text-sm font-semibold tracking-[0.25em] text-white transition-opacity duration-300">
                M. HAKAN ÖZCAN
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative group text-xs font-medium tracking-[0.2em] text-neutral-400 hover:text-white transition-colors duration-300 py-2"
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-white/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive ? 'hidden' : 'block'}`} />
                </Link>
              );
            })}
          </div>

          {/* CTA BUTTON (Desktop) */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="text-xs font-semibold tracking-[0.2em] text-white border border-white/20 px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-500"
            >
              İLETİŞİM
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden z-10 text-white p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center px-6"
          >
            <div className="flex flex-col items-center gap-8 w-full max-w-md">
              {[...navLinks, { name: "İLETİŞİM", path: "/contact" }].map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="w-full text-center overflow-hidden"
                >
                  <Link
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative inline-block text-2xl font-light tracking-[0.2em] text-neutral-300 hover:text-white transition-colors duration-300 py-2 group"
                  >
                    {link.name}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-12 text-center"
            >
              <div className="text-[10px] font-mono tracking-[0.3em] text-neutral-600">
                SYSTEM.ONLINE // MHO.INC
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}