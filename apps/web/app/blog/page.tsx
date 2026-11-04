import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import { siteConfig } from "@/content/site";
import { formatDate } from "@/lib/blog";
import { getSiteSettings } from "@/lib/settings";
import { getWritingEntries } from "@/lib/writing";

export const revalidate = 60;
export const metadata: Metadata = { title: "Writing" };

export default async function BlogPage() {
  // Site posts and Medium articles are merged in lib/writing.ts (hidden and duplicate ones removed).
  const entries = await getWritingEntries(await getSiteSettings());

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-5">Writing</p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1] text-ink mb-6">Writing</h1>
          <p className="text-[17px] leading-[1.75] text-stone">
            Essays on intelligence systems, forecasting, security and applied AI.
          </p>
        </div>

        {entries.length === 0 ? (
          <p className="text-stone border-t border-line pt-8">
            No articles to show yet.{" "}
            <a
              href={siteConfig.socials.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy underline underline-offset-4"
            >
              Read on Medium
            </a>
            .
          </p>
        ) : (
          <div className="border-b border-ink/20">
            {entries.map((entry) => (
              <ArticleCard
                key={entry.key}
                layout="row"
                href={entry.href}
                external={entry.external}
                kicker={entry.source}
                title={entry.title}
                summary={entry.summary}
                meta={formatDate(entry.date)}
                image={entry.thumbnail}
                placeholder={entry.title}
              />
            ))}
          </div>
        )}

        <p className="mt-10 text-sm text-stone">
          More on{" "}
          <a
            href={siteConfig.socials.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy underline underline-offset-4"
          >
            Medium
          </a>
          .
        </p>
      </div>
    </section>
  );
}
