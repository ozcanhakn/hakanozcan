import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import SmartLink from "@/components/SmartLink";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ brand, footer }: Pick<SiteSettings, "brand" | "footer">) {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/15">
          <div className="md:col-span-5">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              {brand.name}
            </Link>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-10">
            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brass-light mb-5">{column.title}</p>
                <ul className="space-y-3 text-[15px]">
                  {column.links.map((link) => {
                    const external = /^https?:/i.test(link.href);
                    return (
                      <li key={`${link.label}-${link.href}`}>
                        <SmartLink
                          href={link.href}
                          className="inline-flex items-center gap-1 text-white/75 hover:text-white transition-colors"
                        >
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

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs tracking-wide text-white/55">
          <p>{footer.note}</p>
          {footer.email && (
            <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">
              {footer.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
