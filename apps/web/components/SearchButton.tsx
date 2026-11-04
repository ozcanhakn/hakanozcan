"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Hit {
  type: "Page" | "Book" | "Recommendation" | "Project" | "Writing";
  title: string;
  summary: string;
  href: string;
  external: boolean;
}

/** A search button that opens a site-wide search over pages, books, projects and writing. */
export default function SearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  // Close when the page changes, and let Ctrl/Cmd+K or "/" open the search from anywhere.
  useEffect(() => close(), [pathname, close]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((event.target as HTMLElement)?.tagName ?? "");
      if ((event.key === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  // Search as you type, a moment after the last key press. Older answers are ignored.
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    let current = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = (await res.json()) as { results?: Hit[] };
        if (current) {
          setResults(data.results ?? []);
          setActive(0);
        }
      } catch {
        if (current) setResults([]);
      } finally {
        if (current) setLoading(false);
      }
    }, 200);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [query]);

  const go = (hit: Hit) => {
    if (hit.external) window.open(hit.href, "_blank", "noopener,noreferrer");
    else router.push(hit.href);
    close();
  };

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      go(results[active]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        className={className ?? "grid place-items-center w-11 h-full text-white/80 hover:text-white transition-colors"}
      >
        <Search size={19} strokeWidth={1.9} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[300] bg-black/55 backdrop-blur-sm px-4 pt-[8vh]"
          onMouseDown={(event) => event.target === event.currentTarget && close()}
        >
          <div role="dialog" aria-modal="true" aria-label="Search" className="max-w-2xl mx-auto rounded-2xl bg-white text-ink shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 border-b border-line">
              <Search size={20} strokeWidth={1.9} className="text-stone shrink-0" />
              <input
                ref={input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search books, projects, writing…"
                aria-label="Search"
                className="flex-1 h-16 bg-transparent text-[18px] outline-none placeholder:text-stone/60"
              />
              <button type="button" onClick={close} aria-label="Close search" className="text-stone hover:text-ink p-1">
                <X size={20} strokeWidth={1.9} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <p className="px-5 py-8 text-sm text-stone">Type at least two letters.</p>
              ) : results.length === 0 ? (
                <p className="px-5 py-8 text-sm text-stone">{loading ? "Searching…" : `Nothing found for “${query.trim()}”.`}</p>
              ) : (
                <ul role="listbox">
                  {results.map((hit, index) => (
                    <li key={`${hit.type}-${hit.href}-${hit.title}`} role="option" aria-selected={index === active}>
                      <button
                        type="button"
                        onClick={() => go(hit)}
                        onMouseEnter={() => setActive(index)}
                        className={`w-full text-left px-5 py-4 border-b border-line last:border-0 ${index === active ? "bg-cream-deep" : ""}`}
                      >
                        <span className="flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] uppercase text-brass">
                          {hit.type}
                          {hit.external && <ArrowUpRight size={12} strokeWidth={2.5} />}
                        </span>
                        <span className="block mt-1 font-display text-xl leading-snug">{hit.title}</span>
                        {hit.summary && <span className="block mt-1 text-sm text-stone line-clamp-2">{hit.summary}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
