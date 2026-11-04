import { getSiteSettings } from "@/lib/settings";
import { getWritingEntries } from "@/lib/writing";

interface Hit {
  type: "Page" | "Book" | "Project" | "Writing";
  title: string;
  summary: string;
  href: string;
  external: boolean;
}

/** Lowercase, no accents, Turkish dotless i treated as i, so "uretim" finds "Üretim". */
const fold = (value: string) =>
  value
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const isExternal = (href: string) => /^https?:/i.test(href);

export async function GET(request: Request) {
  const query = fold(new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) ?? "");
  if (query.length < 2) return Response.json({ results: [] });

  const settings = await getSiteSettings();
  const writing = await getWritingEntries(settings);
  const terms = query.split(/\s+/).filter(Boolean);

  const candidates: (Hit & { haystack: string; title_: string })[] = [];
  const add = (hit: Hit, extra: string[] = []) =>
    candidates.push({ ...hit, title_: fold(hit.title), haystack: fold([hit.title, hit.summary, ...extra].join(" ")) });

  const pages = [
    ...settings.nav.links,
    { label: "Contact", href: "/contact" },
    ...(settings.footer.columns.flatMap((column) => column.links)),
  ];
  const seenPages = new Set<string>();
  for (const page of pages) {
    if (seenPages.has(page.href)) continue;
    seenPages.add(page.href);
    add({ type: "Page", title: page.label, summary: "", href: page.href, external: isExternal(page.href) });
  }

  for (const book of settings.books.items) {
    // A book without a review or link still shows up, and leads to the Books page.
    const href = book.review.trim() ? `/books/${book.id}` : book.href || "/books";
    add(
      { type: "Book", title: book.title, summary: [book.author, book.summary].filter(Boolean).join(" · "), href, external: isExternal(href) },
      [book.category, book.kicker, book.review]
    );
  }

  for (const project of settings.projects) {
    add(
      { type: "Project", title: project.title, summary: project.summary, href: project.href || "/projects", external: isExternal(project.href) },
      [project.type, ...project.tags]
    );
  }

  for (const entry of writing) {
    add({ type: "Writing", title: entry.title, summary: entry.summary, href: entry.href, external: entry.external });
  }

  const results = candidates
    .filter((c) => terms.every((term) => c.haystack.includes(term)))
    .map((c) => ({ c, score: terms.reduce((sum, term) => sum + (c.title_.includes(term) ? 3 : 1), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ c }): Hit => ({ type: c.type, title: c.title, summary: c.summary.slice(0, 160), href: c.href, external: c.external }));

  return Response.json({ results });
}
