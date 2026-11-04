import ArticleCard from "@/components/ArticleCard";
import { bookTags, type Book } from "@/lib/settings";

/** Every book has its own page: /books/<id>. */
export function bookHref(book: Book): string {
  return `/books/${book.id}`;
}

export default function BookCard({ book, layout, large }: { book: Book; layout?: "feature" | "row"; large?: boolean }) {
  return (
    <ArticleCard
      href={bookHref(book)}
      kicker={book.kicker || bookTags(book.category)[0]}
      title={book.title}
      summary={book.summary}
      meta={book.author ? `by ${book.author}` : undefined}
      image={book.image}
      placeholder={book.title}
      layout={layout}
      large={large}
    />
  );
}
