import Link from "next/link";

import Markdown from "@/components/Markdown";
import SiteImage from "@/components/SiteImage";
import { bookTags, type Book } from "@/lib/settings";

/** A line holding only {{book:some-id}} becomes a book card. */
const EMBED = /^\{\{\s*book:([a-z0-9-]+)\s*\}\}\s*$/;

type Segment = { type: "text"; text: string } | { type: "book"; id: string };

export function splitBody(body: string): Segment[] {
  const segments: Segment[] = [];
  let buffer: string[] = [];
  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text) segments.push({ type: "text", text });
    buffer = [];
  };
  for (const line of body.split(/\r?\n/)) {
    const match = EMBED.exec(line.trim());
    if (match?.[1]) {
      flush();
      segments.push({ type: "book", id: match[1] });
    } else {
      buffer.push(line);
    }
  }
  flush();
  return segments;
}

function BookEmbed({ book }: { book: Book }) {
  const label = book.kicker || bookTags(book.category)[0];
  return (
    <Link
      href={`/books/${book.id}`}
      className="group not-prose my-10 flex gap-5 rounded-xl border border-line bg-cream-deep/50 p-4 sm:p-5 hover:border-navy/50 transition-colors"
    >
      <div className="relative h-36 w-24 sm:h-40 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-ink">
        {book.image ? (
          <SiteImage src={book.image} alt={book.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-end bg-gradient-to-br from-navy to-ink p-3">
            <span className="font-display text-sm leading-tight text-white/90 line-clamp-4">{book.title}</span>
          </div>
        )}
      </div>
      <div className="min-w-0 self-center">
        {label && <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-brass">{label}</p>}
        <p className="mt-1.5 font-display text-2xl leading-[1.12] text-ink group-hover:text-navy transition-colors">{book.title}</p>
        {book.author && <p className="mt-1 text-sm text-stone">by {book.author}</p>}
        {book.summary && <p className="mt-3 text-[15px] leading-[1.55] text-stone line-clamp-3">{book.summary}</p>}
      </div>
    </Link>
  );
}

/** The written body of a recommendation, with its book cards in place. */
export default function RecommendationBody({
  body,
  books,
  showMissing = false,
}: {
  body: string;
  books: Book[];
  /** In the admin preview, point out embeds whose book no longer exists. */
  showMissing?: boolean;
}) {
  return (
    <>
      {splitBody(body).map((segment, index) => {
        if (segment.type === "text") return <Markdown key={index}>{segment.text}</Markdown>;
        const book = books.find((item) => item.id === segment.id);
        if (book) return <BookEmbed key={index} book={book} />;
        return showMissing ? (
          <p key={index} className="my-6 rounded-lg border border-dashed border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            No book with the address “{segment.id}”.
          </p>
        ) : null;
      })}
    </>
  );
}
