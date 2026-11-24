import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Markdown from "@/components/Markdown";
import { estimateReadTime, formatDate, getPost, sourceHost } from "@/lib/blog";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.summary };
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // A post filed under a home page section links back to that section's page.
  const area = post.area ? (await getSiteSettings()).blocks.focus.items.find((item) => item.id === post.area) : undefined;
  const source = post.source_url && /^https?:\/\//i.test(post.source_url) ? post.source_url : "";

  return (
    <article>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <Link
          href={area ? `/focus/${area.id}` : "/blog"}
          className="inline-flex items-center gap-2 text-sm text-stone hover:text-navy transition-colors mb-12"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          {area ? area.title : "All writing"}
        </Link>

        <header className="mb-12">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-5">
            {[formatDate(post.created_at), estimateReadTime(post.content ?? "")].join("  ·  ")}
          </p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-ink mb-6">
            {post.title}
          </h1>
          <p className="font-display italic text-2xl leading-[1.35] text-stone">{post.summary}</p>
        </header>

        {post.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.thumbnail} alt="" className="w-full mb-12 border border-line" />
        )}

        <Markdown>{post.content ?? ""}</Markdown>

        {source && (
          <p className="mt-14 border-t border-line pt-6 text-[15px] text-stone">
            Also published on{" "}
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-4 hover:text-navy"
            >
              {sourceHost(source) || "the original"}
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </p>
        )}
      </div>
    </article>
  );
}
