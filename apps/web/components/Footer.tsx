import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import BackgroundMedia from "@/components/BackgroundMedia";
import SmartLink from "@/components/SmartLink";
import type { SiteSettings } from "@/lib/settings";

/** True for colors light enough that white text would be hard to read. */
function isLight(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear((n >> 16) & 255) + 0.7152 * linear((n >> 8) & 255) + 0.0722 * linear(n & 255) > 0.4;
}

export default function Footer({ brand, footer }: Pick<SiteSettings, "brand" | "footer">) {
  const { color, media, shade } = footer.background;
  const hasMedia = media.length > 0;
  // Text turns dark only on a plain light color; over a picture or video it stays white (the shade keeps it readable).
  const dark = !hasMedia && color !== "" && isLight(color);
  const text = dark ? "text-ink" : "text-white";
  const soft = dark ? "text-ink/70 hover:text-ink" : "text-white/75 hover:text-white";
  const faint = dark ? "text-ink/60" : "text-white/55";
  const rule = dark ? "border-ink/15" : "border-white/15";

  return (
    <footer
      className={`relative isolate overflow-hidden ${text} ${color || hasMedia ? "" : "bg-ink"}`}
      style={color ? { backgroundColor: color } : hasMedia ? { backgroundColor: "#17181b" } : undefined}
    >
      {hasMedia && (
        <>
          <BackgroundMedia sources={media} />
          <div className="absolute inset-0 -z-10 bg-black" style={{ opacity: shade / 100 }} />
        </>
      )}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b ${rule}`}>
          <div className="md:col-span-5">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              {brand.name}
            </Link>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-10">
            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className={`text-xs font-semibold tracking-[0.2em] uppercase mb-5 ${dark ? "text-ink/55" : "text-brass-light"}`}>{column.title}</p>
                <ul className="space-y-3 text-[15px]">
                  {column.links.map((link) => {
                    const external = /^https?:/i.test(link.href);
                    return (
                      <li key={`${link.label}-${link.href}`}>
                        <SmartLink href={link.href} className={`inline-flex items-center gap-1 transition-colors ${soft}`}>
                          {link.label}
                          {external && <ArrowUpRight size={12} />}
                        </SmartLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className={`pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs tracking-wide ${faint}`}>
          <p>{footer.note}</p>
          {footer.email && (
            <a href={`mailto:${footer.email}`} className={`transition-colors ${dark ? "hover:text-ink" : "hover:text-white"}`}>
              {footer.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
