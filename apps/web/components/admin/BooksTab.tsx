"use client";

import { useState } from "react";

import { Card, ImageField, MoveButtons, SaveBar, TextField, Toggle, moveItem } from "@/components/admin/fields";
import { areaClass, labelClass, type Status } from "@/components/admin/ui";
import type { Book, SiteSettings } from "@/lib/settings";

const TURKISH: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[çğıöşü]/g, (c) => TURKISH[c] ?? c)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `book-${Date.now().toString(36)}`
  );
}

const emptyBook = (): Book => ({
  id: `book-${Date.now().toString(36)}`,
  title: "",
  author: "",
  kicker: "",
  category: "",
  summary: "",
  image: "",
  review: "",
  href: "",
  featured: false,
});

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
}

export default function BooksTab({ settings, onSave }: Props) {
  const [page, setPage] = useState(settings.books.page);
  const [items, setItems] = useState<Book[]>(settings.books.items);
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  const update = (index: number, patch: Partial<Book>) =>
    setItems((current) => current.map((book, i) => (i === index ? { ...book, ...patch } : book)));

  const save = async () => {
    setIsSaving(true);
    // The address of a review page comes from the title, kept unique so two books never share one.
    const seen = new Set<string>();
    const next = items.map((book) => {
      let id = book.id.startsWith("book-") && book.title ? slugify(book.title) : book.id;
      while (seen.has(id)) id = `${id}-2`;
      seen.add(id);
      return { ...book, id };
    });
    const error = await onSave({ ...settings, books: { page, items: next } });
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved. The Books page and home page update within a minute." });
    if (!error) setItems(next);
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card title="Books page">
        <TextField label="Page title" value={page.title} max={120} onChange={(title) => setPage({ ...page, title })} />
        <TextField label="Introduction" rows={2} value={page.intro} max={400} onChange={(intro) => setPage({ ...page, intro })} />
        <p className="text-xs text-stone">
          Whether the Books section appears on the home page, and how many books it shows, is set in the Home page tab.
        </p>
      </Card>

      <p className="text-[15px] leading-relaxed text-stone">
        The first three books below are examples. Replace or delete them. Books without a title are dropped when you save.
        If a book has a review, its card opens a review page on your site; otherwise it opens the link you give.
      </p>

      {items.map((book, index) => (
        <Card
          key={book.id}
          title={book.title || "New book"}
          aside={
            <span className="flex items-center gap-4">
              <MoveButtons index={index} length={items.length} onMove={(from, to) => setItems((current) => moveItem(current, from, to))} />
              <button
                type="button"
                onClick={() => window.confirm("Remove this book?") && setItems((current) => current.filter((_, i) => i !== index))}
                className="text-xs text-red-800 underline underline-offset-4"
              >
                Remove
              </button>
            </span>
          }
        >
          <div className="grid md:grid-cols-2 gap-6">
            <TextField label="Title" value={book.title} max={160} onChange={(title) => update(index, { title })} />
            <TextField label="Author" value={book.author} max={120} onChange={(author) => update(index, { author })} />
            <TextField
              label="Label above the title"
              value={book.kicker}
              max={60}
              placeholder="A short hook, like “Permit pending”"
              onChange={(kicker) => update(index, { kicker })}
            />
            <TextField
              label="Category"
              value={book.category}
              max={40}
              placeholder="Science, History…"
              hint="Books with the same category are grouped on the Books page."
              onChange={(category) => update(index, { category })}
            />
          </div>
          <TextField label="Short summary" rows={2} value={book.summary} max={400} onChange={(summary) => update(index, { summary })} />
          <ImageField label="Cover or photo" value={book.image} onChange={(image) => update(index, { image })} />
          <label className="block">
            <span className={labelClass}>Full review (Markdown, optional)</span>
            <textarea
              rows={8}
              value={book.review}
              maxLength={50000}
              onChange={(e) => update(index, { review: e.target.value })}
              placeholder={"Write your review. **Bold**, *italic*, ## headings and [links](https://example.com) work."}
              className={`${areaClass} font-mono text-[14px]`}
            />
          </label>
          <TextField label="Link to the book or review" value={book.href} max={500} placeholder="https://…" onChange={(href) => update(index, { href })} />
          <Toggle label="Featured (shown first)" checked={book.featured} onChange={(featured) => update(index, { featured })} />
        </Card>
      ))}

      {items.length < 200 && (
        <button type="button" onClick={() => setItems((current) => [...current, emptyBook()])} className="text-sm text-navy underline underline-offset-4">
          Add a book
        </button>
      )}

      <SaveBar status={status} isSaving={isSaving} onSave={save} label="Save books" />
    </div>
  );
}
