import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import RecommendationBody from "@/components/RecommendationBody";
import SiteImage from "@/components/SiteImage";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function find(slug: string) {
  const { books } = await getSiteSettings();
  // Drafts are not public.
  const item = books.recommendations.find((entry) => entry.id === slug && entry.published);
  return { item, books: books.items };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item } = await find((await params).slug);
  return item ? { title: item.title, description: item.summary } : { title: "Not found" };
}

export default async function RecommendationPage({ params }: Props) {
  const { item, books } = await find((await params).slug);
  if (!item) notFound();

  return (
    <article>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-32 pb-16 md:pt-40 md:pb-24">
        <Link href="/recommendations" className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-navy transition-colors mb-10">
          <ArrowLeft size={15} strokeWidth={2} />
          All recommendations
        </Link>

        <header className="mb-10">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink mb-4">
            Recommendation · {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-ink mb-5">{item.title}</h1>
          {item.summary && <p className="text-[20px] leading-[1.55] text-ink/80">{item.summary}</p>}
        </header>

        {item.image && <SiteImage src={item.image} alt={item.title} className="w-full rounded-xl mb-12" />}

        <RecommendationBody body={item.body} books={books} />
      </div>
    </article>
  );
}
