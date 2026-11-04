import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Markdown from "@/components/Markdown";
import SiteImage from "@/components/SiteImage";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

async function findBook(id: string) {
  const { books } = await getSiteSettings();
  return books.items.find((book) => book.id === id && book.review.trim());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await findBook((await params).id);
  return book ? { title: book.title, description: book.summary } : { title: "Not found" };
}

export default async function BookReview({ params }: Props) {
  const book = await findBook((await params).id);
  if (!book) notFound();

  return (
    <article>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-32 pb-16 md:pt-40 md:pb-24">
        <Link href="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-navy transition-colors mb-10">
          <ArrowLeft size={15} strokeWidth={2} />
          All books
        </Link>

        <header className="mb-10">
          {(book.kicker || book.category) && (
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink mb-4">{book.kicker || book.category}</p>
          )}
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-ink mb-5">{book.title}</h1>
          {book.author && <p className="text-lg text-stone">by {book.author}</p>}
          {book.summary && <p className="mt-6 text-[20px] leading-[1.55] text-ink/80">{book.summary}</p>}
        </header>

        {book.image && <SiteImage src={book.image} alt={book.title} className="w-full rounded-xl mb-12" />}

        <Markdown>{book.review}</Markdown>

        {book.href && (
          <a
            href={book.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy underline underline-offset-[6px] decoration-navy/30 hover:decoration-navy"
          >
            Get the book
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        )}
      </div>
    </article>
  );
}
