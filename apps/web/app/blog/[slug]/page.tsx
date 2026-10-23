import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Markdown from "@/components/Markdown";
import { estimateReadTime, formatDate, getPost } from "@/lib/blog";

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

  return (
    <article>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-stone hover:text-navy transition-colors mb-12"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          All writing
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
      </div>
    </article>
  );
}
