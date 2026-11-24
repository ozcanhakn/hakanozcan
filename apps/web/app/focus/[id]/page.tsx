import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleCard from "@/components/ArticleCard";
import SmartLink from "@/components/SmartLink";
import { formatDate, getPosts } from "@/lib/blog";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

async function findArea(id: string) {
  const settings = await getSiteSettings();
  return settings.blocks.focus.items.find((item) => item.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await findArea((await params).id);
  return area ? { title: area.title, description: area.body.slice(0, 200) } : { title: "Not found" };
}

/** One home page section (Research & Publications, ...) with the posts filed under it. */
export default async function FocusPage({ params }: Props) {
  const { id } = await params;
  const area = await findArea(id);
  if (!area) notFound();

  const posts = (await getPosts()).filter((post) => post.area === area.id);

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mb-14 max-w-3xl">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-5">Focus</p>
          <h1 className="font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-[1] text-ink mb-6">{area.title}</h1>
          {area.body && <p className="text-[18px] leading-[1.7] text-stone">{area.body}</p>}
          {area.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {area.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-3 py-1 text-[13px] font-semibold text-ink">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-stone border-t border-line pt-8">Nothing has been published here yet.</p>
        ) : (
          <div className="border-b border-ink/20">
            {posts.map((post) => (
              <ArticleCard
                key={post.id}
                layout="row"
                href={`/blog/${post.slug}`}
                kicker={post.source_url ? "Also published elsewhere" : area.title}
                title={post.title}
                summary={post.summary}
                meta={formatDate(post.created_at)}
                image={post.thumbnail}
                placeholder={post.title}
              />
            ))}
          </div>
        )}

        <p className="mt-10 text-sm text-stone">
          A question, or a collaboration in mind?{" "}
          <SmartLink href="/contact" className="text-navy underline underline-offset-4">
            Get in touch
          </SmartLink>
          .
        </p>
      </div>
    </section>
  );
}
