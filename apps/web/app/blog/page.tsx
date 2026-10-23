import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/content/site";
import { formatDate, getPosts } from "@/lib/blog";
import { getMediumPosts } from "@/lib/medium";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Writing" };

interface Entry {
  key: string;
  title: string;
  summary: string;
  date: string;
  href: string;
  external: boolean;
  source: string;
}

const normalize = (title: string) => title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

export default async function BlogPage() {
  const [mediumAll, notes, settings] = await Promise.all([getMediumPosts(), getPosts(), getSiteSettings()]);

  // A post that exists both on the site and on Medium is listed once, as the on-site version.
  const onSite = new Set(notes.map((post) => normalize(post.title)));
  const hidden = new Set(settings.hiddenMedium);
  const medium = mediumAll.filter((post) => !onSite.has(normalize(post.title)) && !hidden.has(post.href));

  const entries: Entry[] = [
    ...notes.map((post) => ({
      key: `note-${post.id}`,
      title: post.title,
      summary: post.summary,
      date: post.created_at,
      href: `/blog/${post.slug}`,
      external: false,
      source: "Notes",
    })),
    ...medium.map((post) => ({
      key: post.href,
      title: post.title,
      summary: post.summary,
      date: post.date,
      href: post.href,
      external: true,
      source: "Medium",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
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
          <ul className="border-b border-line">
            {entries.map((entry) => {
              const body = (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-3 py-8 md:py-10">
                  <p className="md:col-span-2 text-sm text-stone pt-1.5">{formatDate(entry.date)}</p>
                  <div className="md:col-span-8">
                    <h2 className="font-display text-3xl md:text-[34px] leading-[1.12] text-ink group-hover:text-navy transition-colors mb-3">
                      {entry.title}
                    </h2>
                    {entry.summary && (
                      <p className="text-[16px] leading-[1.7] text-stone max-w-2xl">{entry.summary}</p>
                    )}
                  </div>
                  <p className="md:col-span-2 md:text-right text-xs font-medium tracking-[0.18em] uppercase text-brass pt-2 flex md:justify-end items-start gap-1">
                    {entry.source}
                    {entry.external && <ArrowUpRight size={14} strokeWidth={1.75} />}
                  </p>
                </div>
              );

              return (
                <li key={entry.key} className="group border-t border-line">
                  {entry.external ? (
                    <a href={entry.href} target="_blank" rel="noopener noreferrer" className="block">
                      {body}
                    </a>
                  ) : (
                    <Link href={entry.href} className="block">
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
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
