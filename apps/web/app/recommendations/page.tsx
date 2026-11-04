import type { Metadata } from "next";

import ArticleCard from "@/components/ArticleCard";
import BooksSwitch from "@/components/BooksSwitch";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Recommendations" };

export default async function RecommendationsPage() {
  const { books } = await getSiteSettings();
  const list = books.recommendations
    .filter((item) => item.published)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-16 md:pt-40 md:pb-24">
        <header className="mb-10 max-w-3xl">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-brass mb-4">Books</p>
          <h1 className="font-head text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[1] tracking-tight text-ink mb-6">
            Recommendations
          </h1>
          <p className="text-[18px] leading-[1.65] text-stone">Reading lists and notes on the books worth your time.</p>
        </header>

        <BooksSwitch active="recommendations" />

        {list.length === 0 ? (
          <p className="text-stone border-t border-line pt-8">No recommendations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {list.map((item) => (
              <ArticleCard
                key={item.id}
                href={`/recommendations/${item.id}`}
                kicker="Recommendation"
                title={item.title}
                summary={item.summary}
                meta={new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                image={item.image}
                placeholder={item.title}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
