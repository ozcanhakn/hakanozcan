import { ArrowRight } from "lucide-react";
import Link from "next/link";

import ArticleCard from "@/components/ArticleCard";
import { formatDate } from "@/lib/blog";
import type { SiteSettings } from "@/lib/settings";
import type { WritingEntry } from "@/lib/writing";

export default function Writing({
  block,
  entries,
}: {
  block: SiteSettings["blocks"]["writing"];
  entries: WritingEntry[];
}) {
  const shown = entries.slice(0, block.count);
  if (shown.length === 0) return null;
  const [first, ...rest] = shown;

  return (
    <section className="border-b border-line">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            {block.eyebrow && (
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-brass mb-3">{block.eyebrow}</p>
            )}
            <h2 className="font-head text-4xl md:text-6xl font-extrabold leading-[1] tracking-tight text-ink">{block.title}</h2>
          </div>
          {block.linkLabel && (
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-navy transition-colors">
              {block.linkLabel}
              <ArrowRight size={15} strokeWidth={2.25} />
            </Link>
          )}
        </div>

        {first && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7">
              <ArticleCard
                large
                href={first.href}
                kicker={first.source}
                title={first.title}
                summary={first.summary}
                meta={formatDate(first.date)}
                image={first.thumbnail}
                external={first.external}
              />
            </div>
            {rest.length > 0 && (
              <div className="lg:col-span-5 -mt-8">
                {rest.map((entry) => (
                  <ArticleCard
                    key={entry.key}
                    layout="row"
                    href={entry.href}
                    kicker={entry.source}
                    title={entry.title}
                    summary={entry.summary}
                    meta={formatDate(entry.date)}
                    image={entry.thumbnail}
                    external={entry.external}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
