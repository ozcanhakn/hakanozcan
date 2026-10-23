"use client";

import { Github, Linkedin, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { siteConfig } from "@/content/site";

const navLinks = [
  { name: "About", path: "/#about" },
  { name: "Work", path: "/projects" },
  { name: "Writing", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-[100] bg-navy text-cream border-b border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center h-20 px-6 lg:px-8">
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {navLinks.slice(0, 3).map((link) => {
            const isActive = link.path !== "/#about" && pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                aria-current={isActive ? "page" : undefined}
                className={`text-[13px] font-medium tracking-wide transition-colors ${
                  isActive ? "text-brass-light" : "text-cream/75 hover:text-cream"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="col-start-1 md:col-start-2 font-display text-2xl md:text-[28px] tracking-[0.18em] uppercase whitespace-nowrap"
          onClick={() => setMobileMenuOpen(false)}
        >
          {siteConfig.name}
        </Link>

        <div className="hidden md:flex items-center justify-end gap-6">
          <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-cream/70 hover:text-cream transition-colors">
            <Github size={17} strokeWidth={1.5} />
          </a>
          <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-cream/70 hover:text-cream transition-colors">
            <Linkedin size={17} strokeWidth={1.5} />
          </a>
          <Link
            href="/contact"
            className="text-[13px] font-medium tracking-wide border border-brass-light/60 px-5 py-2 text-cream hover:bg-brass-light hover:text-navy transition-colors"
          >
            Contact
          </Link>
        </div>

        <button
          className="md:hidden justify-self-end col-start-3 text-cream p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-navy flex flex-col justify-center gap-6 px-8"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-5xl tracking-tight text-cream hover:text-brass-light transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
