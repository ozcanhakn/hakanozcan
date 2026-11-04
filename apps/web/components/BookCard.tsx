import ArticleCard from "@/components/ArticleCard";
import type { Book } from "@/lib/settings";

/** A book opens its on-site review when it has one, otherwise the link saved with it. */
export function bookHref(book: Book): string {
  return book.review.trim() ? `/books/${book.id}` : book.href;
}

export default function BookCard({ book, layout, large }: { book: Book; layout?: "feature" | "row"; large?: boolean }) {
  const href = bookHref(book);
  const inner = (
    <ArticleCard
      href={href || "#"}
      kicker={book.kicker || book.category}
      title={book.title}
      summary={book.summary}
      meta={book.author ? `by ${book.author}` : undefined}
      image={book.image}
      placeholder={book.title}
      external={/^https?:/i.test(href)}
      layout={layout}
      large={large}
    />
  );

  // A book with neither a review nor a link has nowhere to go, so it is shown without a link.
  return href ? inner : <div className="pointer-events-none">{inner}</div>;
}
