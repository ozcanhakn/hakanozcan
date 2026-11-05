"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import SearchButton from "@/components/SearchButton";
import SiteImage from "@/components/SiteImage";
import SmartLink from "@/components/SmartLink";
import type { NavItem, SiteSettings } from "@/lib/settings";

interface Props {
  brand: SiteSettings["brand"];
  nav: SiteSettings["nav"];
}

const linkClass = "text-[15px] font-semibold transition-colors";

/** A floating dark bar over the page, like Gates Notes: menu button, name, then the links. Links with sub-links open a panel. */
export default function Navbar({ brand, nav }: Props) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Moving to another page closes everything.
  useEffect(() => {
    setPanel(null);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openPanel = (index: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanel(index);
  };
  // A short delay so the pointer can cross the gap between the bar and the panel.
  const closePanel = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 140);
  };

  const isActive = (href: string) => href.startsWith("/") && !href.includes("#") && href !== "/" && pathname.startsWith(href);
  const hasCta = Boolean(nav.ctaLabel && nav.ctaHref);
  const current: NavItem | undefined = panel === null ? undefined : nav.links[panel];

  return (
    // The header has no height of its own, so the page starts at the very top and the bar floats over it.
    <header className="sticky top-0 z-[100] h-0">
      <div className="px-3 md:px-6 pt-3 md:pt-4">
        <div className="relative max-w-6xl mx-auto" onMouseLeave={closePanel} onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}>
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

            <nav className="hidden md:flex flex-1 items-stretch justify-end gap-8 px-6" aria-label="Main">
              {nav.links.map((link, index) => {
                const hasPanel = link.children.length > 0;
                const showing = panel === index;
                const active = isActive(link.href);
                const cls = `${linkClass} relative flex items-center ${
                  active || showing ? "text-white" : "text-white/70 hover:text-white"
                }`;
                const underline = (
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-2 h-0.5 bg-white transition-opacity ${showing ? "opacity-100" : "opacity-0"}`}
                  />
                );
                return (
                  <div
                    key={`${link.label}-${link.href}-${index}`}
                    className="flex items-stretch"
                    onMouseEnter={() => (hasPanel ? openPanel(index) : setPanel(null))}
                  >
                    {link.href ? (
                      <SmartLink
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        aria-haspopup={hasPanel ? "true" : undefined}
                        aria-expanded={hasPanel ? showing : undefined}
                        onFocus={() => (hasPanel ? openPanel(index) : setPanel(null))}
                        className={cls}
                      >
                        {link.label}
                        {underline}
                      </SmartLink>
                    ) : (
                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={showing}
                        onClick={() => setPanel(showing ? null : index)}
                        onFocus={() => openPanel(index)}
                        className={cls}
                      >
                        {link.label}
                        {underline}
                      </button>
                    )}
                  </div>
                );
              })}
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

          {/* The panel under the bar. Its top padding bridges the gap so the pointer never leaves the menu area. */}
          {current && current.children.length > 0 && (
            <div className="hidden md:block absolute left-0 right-0 top-full pt-2" onMouseEnter={() => openPanel(panel!)}>
              <div
                className="rounded-xl border border-white/70 shadow-2xl shadow-black/15 backdrop-blur-xl p-8 lg:p-10 grid grid-cols-12 gap-8 text-ink"
                style={{
                  // The accent color, softened, over frosted white.
                  background:
                    "linear-gradient(color-mix(in srgb, var(--site-accent, #0b6e99) 18%, transparent), color-mix(in srgb, var(--site-accent, #0b6e99) 10%, transparent)), rgba(255,255,255,0.86)",
                }}
              >
                <div className={current.cardImage || current.cardTitle ? "col-span-7" : "col-span-12"}>
                  <p className="font-head text-2xl font-bold tracking-tight">{current.panelTitle || `Explore ${current.label.toLowerCase()}`}</p>
                  <div className="mt-4 mb-6 h-px w-14 bg-ink/25" />
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
                    {current.children.map((child, i) => (
                      <li key={`${child.label}-${i}`}>
                        <SmartLink
                          href={child.href}
                          onClick={() => setPanel(null)}
                          className="font-head text-xl font-bold leading-snug text-ink hover:text-[var(--site-accent,#0b6e99)] transition-colors"
                        >
                          {child.label}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                  {current.buttonLabel && current.buttonHref && (
                    <SmartLink
                      href={current.buttonHref}
                      onClick={() => setPanel(null)}
                      className="mt-8 inline-block rounded-lg bg-[#17181b] text-white px-5 py-3 text-sm font-bold hover:bg-black transition-colors"
                    >
                      {current.buttonLabel}
                    </SmartLink>
                  )}
                </div>

                {(current.cardImage || current.cardTitle) && (
                  <div className="col-span-5">
                    {(() => {
                      const card = (
                        <>
                          {current.cardImage ? (
                            <SiteImage src={current.cardImage} className="absolute inset-0 h-full w-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#17181b] to-[var(--site-accent,#0b6e99)]" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          {current.cardTitle && (
                            <p className="absolute inset-x-0 bottom-0 p-5 font-head text-2xl font-extrabold leading-tight tracking-tight text-white">
                              {current.cardTitle}
                            </p>
                          )}
                        </>
                      );
                      const cardClass = "relative block aspect-[16/10] overflow-hidden rounded-lg bg-ink";
                      return current.cardHref ? (
                        <SmartLink href={current.cardHref} onClick={() => setPanel(null)} className={cardClass}>
                          {card}
                        </SmartLink>
                      ) : (
                        <div className={cardClass}>{card}</div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {open && (
            <nav
              className="md:hidden mt-2 rounded-xl bg-[#17181b] text-white p-6 flex flex-col gap-1 shadow-xl max-h-[80vh] overflow-y-auto"
              aria-label="Mobile"
            >
              {[...nav.links, ...(hasCta ? [{ label: nav.ctaLabel, href: nav.ctaHref, children: [] as NavItem["children"] }] : [])].map((link, index) => (
                <div key={`${link.label}-${link.href}-${index}`} className="border-b border-white/10 last:border-0 py-3">
                  {link.href ? (
                    <SmartLink
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-head text-3xl font-extrabold tracking-tight hover:text-white/70 transition-colors"
                    >
                      {link.label}
                    </SmartLink>
                  ) : (
                    <p className="font-head text-3xl font-extrabold tracking-tight">{link.label}</p>
                  )}
                  {link.children.length > 0 && (
                    <ul className="mt-3 ml-1 flex flex-col gap-2 border-l border-white/20 pl-4">
                      {link.children.map((child, i) => (
                        <li key={`${child.label}-${i}`}>
                          <SmartLink
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="text-lg font-semibold text-white/75 hover:text-white transition-colors"
                          >
                            {child.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
