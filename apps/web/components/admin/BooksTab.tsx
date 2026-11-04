"use client";

import { useState } from "react";

import { Card, ImageField, Modal, SaveBar, TextField, Toggle } from "@/components/admin/fields";
import RecommendationsPanel from "@/components/admin/RecommendationsPanel";
import { areaClass, fieldClass, labelClass, primaryButton, type Status } from "@/components/admin/ui";
import { bookTags, type Book, type Recommendation, type SiteSettings } from "@/lib/settings";
import { slugify, uniqueId } from "@/lib/slug";

type Folder = "all" | "recommendations";

const emptyBook = (): Book => ({
  id: "", // a new book gets its page address from the title when it is saved
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

/** New books (empty id) get an address from their title; every address stays unique. */
function finalizeIds(books: Book[]): Book[] {
  const taken = new Set(books.filter((book) => book.id).map((book) => book.id));
  return books.map((book) => {
    if (book.id) return book;
    const id = uniqueId(slugify(book.title, "book"), taken);
    taken.add(id);
    return { ...book, id };
  });
}

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
}

export default function BooksTab({ settings, onSave }: Props) {
  const [page, setPage] = useState(settings.books.page);
  const [items, setItems] = useState<Book[]>(settings.books.items);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(settings.books.recommendations);
  const [folder, setFolder] = useState<Folder>("all");
  const [editing, setEditing] = useState<Book | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [pageStatus, setPageStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  /** Saves the books and recommendations together. Resolves to an error message, or null on success. */
  const persist = async (nextBooks: Book[], nextRecs: Recommendation[]): Promise<string | null> => {
    const finalized = finalizeIds(nextBooks);
    const error = await onSave({ ...settings, books: { page, items: finalized, recommendations: nextRecs } });
    if (!error) {
      setItems(finalized);
      setRecommendations(nextRecs);
    }
    return error;
  };

  const needle = search.trim().toLowerCase();
  const visible = needle
    ? items.filter((book) => [book.title, book.author, book.category, book.kicker].join(" ").toLowerCase().includes(needle))
    : items;

  const openEditor = (book: Book) => {
    setModalError("");
    setEditing({ ...book });
  };

  const saveBook = async () => {
    if (!editing) return;
    if (!editing.title.trim()) return setModalError("Give the book a title.");
    setIsSaving(true);
    setModalError("");
    const exists = Boolean(editing.id) && items.some((book) => book.id === editing.id);
    const error = await persist(exists ? items.map((book) => (book.id === editing.id ? editing : book)) : [...items, editing], recommendations);
    setIsSaving(false);
    if (error) return setModalError(error);
    setStatus({ kind: "ok", text: `“${editing.title.trim()}” saved. The site updates within a minute.` });
    setEditing(null);
  };

  const removeBook = async () => {
    if (!editing?.id || !window.confirm(`Delete “${editing.title}”?`)) return;
    setIsSaving(true);
    const error = await persist(items.filter((book) => book.id !== editing.id), recommendations);
    setIsSaving(false);
    if (error) return setModalError(error);
    setStatus({ kind: "ok", text: "Book deleted." });
    setEditing(null);
  };

  /** Swaps a book with the one next to it. */
  const move = async (index: number, direction: -1 | 1) => {
    const next = [...items];
    const other = index + direction;
    if (other < 0 || other >= next.length) return;
    [next[index], next[other]] = [next[other]!, next[index]!];
    const error = await persist(next, recommendations);
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Order saved." });
  };

  const savePage = async () => {
    const error = await onSave({ ...settings, books: { page, items, recommendations } });
    setPageStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved." });
  };

  const patch = (change: Partial<Book>) => setEditing((current) => (current ? { ...current, ...change } : current));
  const isNew = editing !== null && !(editing.id && items.some((book) => book.id === editing.id));

  const folderButton = (id: Folder, label: string, count: number) => {
    const on = folder === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setFolder(id)}
        aria-current={on ? "true" : undefined}
        className={`shrink-0 lg:w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors ${
          on ? "bg-navy text-white" : "text-ink hover:bg-cream-deep"
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span aria-hidden>{on ? "📂" : "📁"}</span>
          <span className="truncate">{label}</span>
        </span>
        <span className={`text-xs tabular-nums ${on ? "text-white/80" : "text-stone"}`}>{count}</span>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
        {/* The two folders */}
        <aside className="lg:sticky lg:top-24" aria-label="Folders">
          <p className="hidden lg:block text-xs tracking-[0.2em] uppercase text-stone mb-3">Folders</p>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {folderButton("all", "All books", items.length)}
            {folderButton("recommendations", "Recommendations", recommendations.length)}
          </nav>
        </aside>

        <section className="min-w-0">
          {folder === "recommendations" ? (
            <RecommendationsPanel
              recommendations={recommendations}
              books={items}
              onSave={(next) => persist(items, next)}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h2 className="font-display text-3xl text-ink mr-auto">
                  {needle ? `Results for “${search.trim()}”` : "All books"}
                  <span className="ml-3 text-base font-sans font-normal text-stone">
                    {visible.length} {visible.length === 1 ? "book" : "books"}
                  </span>
                </h2>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search books…"
                  aria-label="Search books"
                  className={`${fieldClass} !w-56`}
                />
                <button type="button" onClick={() => openEditor(emptyBook())} className={primaryButton}>
                  + Add book
                </button>
              </div>

              {status && (
                <p role="status" className={`text-sm mb-5 ${status.kind === "ok" ? "text-navy" : "text-red-800"}`}>
                  {status.text}
                </p>
              )}

              {items.length === 0 ? (
                <p className="border border-dashed border-line rounded-xl p-10 text-center text-stone">
                  No books yet. Press “Add book” to add the first one.
                </p>
              ) : visible.length === 0 ? (
                <p className="text-sm text-stone">Nothing here.</p>
              ) : (
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {visible.map((book) => {
                    const index = items.indexOf(book);
                    const tags = bookTags(book.category);
                    return (
                      <li key={book.id} className="flex flex-col border border-line rounded-xl p-4 hover:border-navy/60 transition-colors">
                        <button type="button" onClick={() => openEditor(book)} className="flex gap-4 text-left group flex-1">
                          {book.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={book.image} alt="" className="h-28 w-20 shrink-0 rounded-md object-cover border border-line" />
                          ) : (
                            <span className="h-28 w-20 shrink-0 rounded-md border border-dashed border-line bg-cream-deep" />
                          )}
                          <span className="min-w-0">
                            <span className="block font-display text-xl leading-snug text-ink group-hover:text-navy">{book.title}</span>
                            <span className="block text-sm text-stone mt-0.5">{book.author || "No author"}</span>
                            <span className="flex flex-wrap gap-2 mt-2 text-[11px] font-semibold">
                              {book.featured && <span className="rounded-full bg-brass/10 text-brass px-2 py-0.5">★ Featured</span>}
                              <span className={`rounded-full px-2 py-0.5 ${book.review.trim() ? "bg-navy/10 text-navy" : "bg-cream-deep text-stone"}`}>
                                {book.review.trim() ? "Review written" : "No review yet"}
                              </span>
                            </span>
                            {tags.length > 0 && (
                              <span className="block mt-2 text-xs text-stone line-clamp-2">{tags.join(" · ")}</span>
                            )}
                          </span>
                        </button>
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-line text-xs">
                          <button type="button" onClick={() => openEditor(book)} className="text-navy font-semibold underline underline-offset-4">
                            Edit
                          </button>
                          <a href={`/books/${book.id}`} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-ink underline underline-offset-4 ml-2">
                            View page
                          </a>
                          {!needle && (
                            <span className="ml-auto flex gap-1">
                              <button
                                type="button"
                                aria-label="Move up"
                                disabled={index === 0}
                                onClick={() => void move(index, -1)}
                                className="px-2 py-1 border border-line hover:border-navy disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                aria-label="Move down"
                                disabled={index === items.length - 1}
                                onClick={() => void move(index, 1)}
                                className="px-2 py-1 border border-line hover:border-navy disabled:opacity-30"
                              >
                                ↓
                              </button>
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </div>

      <div className="max-w-3xl">
        <Card title="Books page text">
          <TextField label="Page title" value={page.title} max={120} onChange={(title) => setPage({ ...page, title })} />
          <TextField label="Introduction" rows={2} value={page.intro} max={400} onChange={(intro) => setPage({ ...page, intro })} />
          <p className="text-xs text-stone">
            Whether the Books section appears on the home page, and how many books it shows, is set in the Home page tab.
          </p>
          <SaveBar status={pageStatus} isSaving={false} onSave={savePage} label="Save page text" />
        </Card>
      </div>

      {editing && (
        <Modal
          title={isNew ? "Add a book" : "Edit book"}
          onClose={() => !isSaving && setEditing(null)}
          footer={
            <>
              <button type="button" onClick={saveBook} disabled={isSaving} className={primaryButton}>
                {isSaving ? "Saving..." : isNew ? "Add book" : "Save changes"}
              </button>
              <button type="button" onClick={() => setEditing(null)} disabled={isSaving} className="text-sm text-stone hover:text-ink underline underline-offset-4">
                Cancel
              </button>
              {modalError && <span role="alert" className="text-sm text-red-800">{modalError}</span>}
              {!isNew && (
                <button type="button" onClick={removeBook} disabled={isSaving} className="ml-auto text-sm text-red-800 underline underline-offset-4">
                  Delete
                </button>
              )}
            </>
          }
        >
          <div className="grid md:grid-cols-2 gap-6">
            <TextField autoFocus label="Title" value={editing.title} max={160} onChange={(title) => patch({ title })} />
            <TextField label="Author" value={editing.author} max={120} onChange={(author) => patch({ author })} />
            <TextField
              label="Categories"
              value={editing.category}
              max={200}
              placeholder="Psychology, Philosophy"
              hint="Separate with commas. Used for the small label on cards and for “More like this”; not shown as filters."
              onChange={(category) => patch({ category })}
            />
            <TextField
              label="Label above the title"
              value={editing.kicker}
              max={60}
              placeholder="A short hook"
              onChange={(kicker) => patch({ kicker })}
            />
          </div>
          <TextField label="Short summary" rows={2} value={editing.summary} max={400} onChange={(summary) => patch({ summary })} />
          <ImageField label="Cover or photo" value={editing.image} onChange={(image) => patch({ image })} />

          <details open={Boolean(editing.review.trim())} className="border border-line rounded-lg">
            <summary className="px-4 py-3 cursor-pointer select-none text-sm font-semibold text-ink">
              Full review (Markdown, optional)
            </summary>
            <div className="p-4 border-t border-line">
              <label className="block">
                <span className={labelClass}>Visitors read this on the book’s page</span>
                <textarea
                  rows={10}
                  value={editing.review}
                  maxLength={50000}
                  onChange={(e) => patch({ review: e.target.value })}
                  placeholder={"Write your notes. **Bold**, *italic*, ## headings and [links](https://example.com) work."}
                  className={`${areaClass} font-mono text-[14px]`}
                />
              </label>
            </div>
          </details>

          <TextField label="“Get the book” link (optional)" value={editing.href} max={500} placeholder="https://…" onChange={(href) => patch({ href })} />
          <Toggle label="Featured (shown first)" checked={editing.featured} onChange={(featured) => patch({ featured })} />
        </Modal>
      )}
    </div>
  );
}
