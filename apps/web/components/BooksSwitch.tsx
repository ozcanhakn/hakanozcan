import Link from "next/link";

/** The two buttons under the Books heading. Categories typed in the admin are not shown here. */
export default function BooksSwitch({ active }: { active: "books" | "recommendations" }) {
  const pill = (isActive: boolean) =>
    `inline-block px-5 py-2.5 text-sm font-semibold rounded-full border transition-colors ${
      isActive ? "bg-ink text-white border-ink" : "border-ink/25 text-ink hover:border-ink"
    }`;

  return (
    <nav aria-label="Books sections" className="flex flex-wrap gap-2 mb-12">
      <Link href="/books" aria-current={active === "books" ? "page" : undefined} className={pill(active === "books")}>
        All books
      </Link>
      <Link
        href="/recommendations"
        aria-current={active === "recommendations" ? "page" : undefined}
        className={pill(active === "recommendations")}
      >
        Recommendations
      </Link>
    </nav>
  );
}
