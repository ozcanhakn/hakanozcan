import type { Metadata } from "next";
import Link from "next/link";

import BookCard from "@/components/BookCard";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Books" };

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function BooksPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const { books } = await getSiteSettings();

  const categories = [...new Set(books.items.map((book) => book.category).filter(Boolean))];
  const active = category && categories.includes(category) ? category : null;
  // Featured books first, then in the order they were added (copied, so shared settings are not reordered).
  const visible = [...(active ? books.items.filter((book) => book.category === active) : books.items)].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );

  const pill = (isActive: boolean) =>
    `inline-block px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
      isActive ? "bg-ink text-white border-ink" : "border-ink/25 text-ink hover:border-ink"
    }`;

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-16 md:pt-40 md:pb-24">
        <header className="mb-12 max-w-3xl">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-brass mb-4">Books</p>
          <h1 className="font-head text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[1] tracking-tight text-ink mb-6">
            {books.page.title}
          </h1>
          {books.page.intro && <p className="text-[18px] leading-[1.65] text-stone">{books.page.intro}</p>}
        </header>

        {categories.length > 0 && (
          <nav aria-label="Book categories" className="flex flex-wrap gap-2 mb-12">
            <Link href="/books" className={pill(!active)}>
              All books
            </Link>
            {categories.map((name) => (
              <Link key={name} href={`/books?category=${encodeURIComponent(name)}`} className={pill(active === name)}>
                {name}
              </Link>
            ))}
          </nav>
        )}

        {visible.length === 0 ? (
          <p className="text-stone border-t border-line pt-8">No books to show yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {visible.map((book, index) => (
              <div key={book.id} className={index === 0 && !active ? "md:col-span-2" : ""}>
                <BookCard book={book} large={index === 0 && !active} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
