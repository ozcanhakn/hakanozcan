"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import SearchButton from "@/components/SearchButton";
import SmartLink from "@/components/SmartLink";
import type { SiteSettings } from "@/lib/settings";

interface Props {
  brand: SiteSettings["brand"];
  nav: SiteSettings["nav"];
}

/** A floating dark bar over the page, like Gates Notes: menu button, name, then the links. */
export default function Navbar({ brand, nav }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const isActive = (href: string) => href.startsWith("/") && !href.includes("#") && href !== "/" && pathname.startsWith(href);
  const hasCta = Boolean(nav.ctaLabel && nav.ctaHref);

  return (
    // The header has no height of its own, so the page starts at the very top and the bar floats over it.
    <header className="sticky top-0 z-[100] h-0">
      <div className="px-3 md:px-6 pt-3 md:pt-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-stretch h-14 rounded-xl bg-[#17181b]/95 backdrop-blur text-white shadow-lg shadow-black/10">
            <button
              className="md:hidden w-14 grid place-items-center border-r border-white/15"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </button>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex-1 md:flex-none md:px-6 grid md:block place-items-center md:content-center font-head text-[19px] font-extrabold tracking-tight whitespace-nowrap"
            >
              {brand.name}
            </Link>

            <nav className="hidden md:flex flex-1 items-center justify-end gap-8 px-6" aria-label="Main">
              {nav.links.map((link) => (
                <SmartLink
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`text-[15px] font-semibold transition-colors ${
                    isActive(link.href) ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </SmartLink>
              ))}
            </nav>

            {hasCta && (
              <SmartLink
                href={nav.ctaHref}
                className="hidden md:grid place-items-center m-2 px-5 rounded-lg bg-white text-ink text-sm font-bold hover:bg-white/85 transition-colors"
              >
                {nav.ctaLabel}
              </SmartLink>
            )}
            {/* One search button for every screen size: right edge on phones, beside Contact on larger screens. */}
            <SearchButton className="grid place-items-center w-14 md:w-10 md:my-2 md:mr-2 md:rounded-lg md:border md:border-white/25 text-white/85 hover:text-white md:hover:bg-white/10 transition-colors" />
          </div>

          {open && (
            <nav
              className="md:hidden mt-2 rounded-xl bg-[#17181b] text-white p-6 flex flex-col gap-1 shadow-xl"
              aria-label="Mobile"
            >
              {[...nav.links, ...(hasCta ? [{ label: nav.ctaLabel, href: nav.ctaHref }] : [])].map((link) => (
                <SmartLink
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-head text-3xl font-extrabold tracking-tight py-3 border-b border-white/10 last:border-0 hover:text-white/70 transition-colors"
                >
                  {link.label}
                </SmartLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
