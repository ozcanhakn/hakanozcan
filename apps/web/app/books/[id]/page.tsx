import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BookCard from "@/components/BookCard";
import Markdown from "@/components/Markdown";
import SiteImage from "@/components/SiteImage";
import { bookTags, getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

async function findBook(id: string) {
  const { books } = await getSiteSettings();
  const book = books.items.find((item) => item.id === id);
  // More books that share a category, to keep readers browsing.
  const tags = book ? bookTags(book.category).map((tag) => tag.toLowerCase()) : [];
  const related = book
    ? books.items
        .filter((item) => item.id !== book.id && bookTags(item.category).some((tag) => tags.includes(tag.toLowerCase())))
        .slice(0, 2)
    : [];
  return { book, related };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book } = await findBook((await params).id);
  return book ? { title: book.title, description: book.summary } : { title: "Not found" };
}

export default async function BookPage({ params }: Props) {
  const { book, related } = await findBook((await params).id);
  if (!book) notFound();

  const hasReview = book.review.trim().length > 0;

  return (
    <article>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-32 pb-16 md:pt-40 md:pb-24">
        <Link href="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-navy transition-colors mb-10">
          <ArrowLeft size={15} strokeWidth={2} />
          All books
        </Link>

        <header className="mb-10">
          {(book.kicker || book.category) && (
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink mb-4">
              {book.kicker || bookTags(book.category).join(" · ")}
            </p>
          )}
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-ink mb-5">{book.title}</h1>
          {book.author && <p className="text-lg text-stone">by {book.author}</p>}
          {book.summary && <p className="mt-6 text-[20px] leading-[1.55] text-ink/80">{book.summary}</p>}
        </header>

        {book.image && <SiteImage src={book.image} alt={book.title} className="w-full rounded-xl mb-12" />}

        {hasReview ? (
          <Markdown>{book.review}</Markdown>
        ) : (
          <p className="border-t border-line pt-8 text-stone">My notes on this book are coming soon.</p>
        )}

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

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 md:py-20">
            <h2 className="font-head text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-10">More like this</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {related.map((item) => (
                <BookCard key={item.id} book={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
