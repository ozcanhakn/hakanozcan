"use client";

import { useMemo, useRef, useState } from "react";

import { ImageField, Modal, TextField, Toggle } from "@/components/admin/fields";
import { areaClass, labelClass, primaryButton, type Status } from "@/components/admin/ui";
import RecommendationBody from "@/components/RecommendationBody";
import type { Book, Recommendation } from "@/lib/settings";
import { slugify, uniqueId } from "@/lib/slug";

const emptyRecommendation = (): Recommendation => ({
  id: "", // a new one gets its page address from the title when it is saved
  title: "",
  summary: "",
  image: "",
  body: "",
  published: true,
  date: new Date().toISOString(),
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

interface Props {
  recommendations: Recommendation[];
  books: Book[];
  /** Saves the whole list. Resolves to an error message, or null on success. */
  onSave: (next: Recommendation[]) => Promise<string | null>;
}

export default function RecommendationsPanel({ recommendations, books, onSave }: Props) {
  const [editing, setEditing] = useState<Recommendation | null>(null);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [modalError, setModalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const area = useRef<HTMLTextAreaElement>(null);

  const sorted = useMemo(() => [...recommendations].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)), [recommendations]);
  const isNew = editing !== null && !(editing.id && recommendations.some((item) => item.id === editing.id));

  const open = (item: Recommendation) => {
    setModalError("");
    setPreview(false);
    setBookSearch("");
    setEditing({ ...item });
  };

  const patch = (change: Partial<Recommendation>) => setEditing((current) => (current ? { ...current, ...change } : current));

  const finalize = (list: Recommendation[]) => {
    const taken = new Set(list.filter((item) => item.id).map((item) => item.id));
    return list.map((item) => {
      if (item.id) return item;
      const id = uniqueId(slugify(item.title, "recommendation"), taken);
      taken.add(id);
      return { ...item, id };
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) return setModalError("Give it a title.");
    setIsSaving(true);
    setModalError("");
    const next = isNew ? [...recommendations, editing] : recommendations.map((item) => (item.id === editing.id ? editing : item));
    const error = await onSave(finalize(next));
    setIsSaving(false);
    if (error) return setModalError(error);
    setStatus({
      kind: "ok",
      text: editing.published ? `“${editing.title.trim()}” saved. The site updates within a minute.` : "Saved as a draft: it is not visible on the site.",
    });
    setEditing(null);
  };

  const remove = async () => {
    if (!editing?.id || !window.confirm(`Delete “${editing.title}”?`)) return;
    setIsSaving(true);
    const error = await onSave(recommendations.filter((item) => item.id !== editing.id));
    setIsSaving(false);
    if (error) return setModalError(error);
    setStatus({ kind: "ok", text: "Recommendation deleted." });
    setEditing(null);
  };

  /** Puts {{book:id}} on its own line where the cursor is. */
  const insertBook = (id: string) => {
    if (!editing || !id) return;
    const text = editing.body;
    const at = area.current?.selectionStart ?? text.length;
    const before = text.slice(0, at);
    const after = text.slice(at);
    const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    const tail = after && !after.startsWith("\n\n") ? (after.startsWith("\n") ? "\n" : "\n\n") : "\n";
    const token = `{{book:${id}}}`;
    patch({ body: `${before}${lead}${token}${tail}${after}` });
    setBookSearch("");
    // Put the cursor after the inserted card once the text has updated.
    requestAnimationFrame(() => {
      const position = (before + lead + token + tail).length;
      area.current?.focus();
      area.current?.setSelectionRange(position, position);
    });
  };

  const matches = books.filter((book) => {
    const needle = bookSearch.trim().toLowerCase();
    return !needle || `${book.title} ${book.author}`.toLowerCase().includes(needle);
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h2 className="font-display text-3xl text-ink mr-auto">
          Recommendations
          <span className="ml-3 text-base font-sans font-normal text-stone">
            {sorted.length} {sorted.length === 1 ? "piece" : "pieces"}
          </span>
        </h2>
        <button type="button" onClick={() => open(emptyRecommendation())} className={primaryButton}>
          + New recommendation
        </button>
      </div>

      <p className="text-[15px] leading-relaxed text-stone mb-6 max-w-2xl">
        Write reading lists and notes like an article, and drop your books into the text as cards. Visitors find them
        on the Books page and at <code className="font-mono text-sm">/recommendations</code>.
      </p>

      {status && (
        <p role="status" className={`text-sm mb-5 ${status.kind === "ok" ? "text-navy" : "text-red-800"}`}>
          {status.text}
        </p>
      )}

      {sorted.length === 0 ? (
        <p className="border border-dashed border-line rounded-xl p-10 text-center text-stone">
          Nothing here yet. Press “New recommendation” to write the first one.
        </p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <li key={item.id} className="flex items-center gap-4 border border-line rounded-xl p-4 hover:border-navy/60 transition-colors">
              <button type="button" onClick={() => open(item)} className="flex flex-1 min-w-0 items-center gap-4 text-left group">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-16 w-24 shrink-0 rounded-md object-cover border border-line" />
                ) : (
                  <span className="h-16 w-24 shrink-0 rounded-md border border-dashed border-line bg-cream-deep" />
                )}
                <span className="min-w-0">
                  <span className="block font-display text-xl leading-snug text-ink group-hover:text-navy truncate">{item.title}</span>
                  <span className="flex flex-wrap gap-2 mt-1 text-[11px] font-semibold">
                    <span className={`rounded-full px-2 py-0.5 ${item.published ? "bg-navy/10 text-navy" : "bg-brass/10 text-brass"}`}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                    <span className="rounded-full bg-cream-deep text-stone px-2 py-0.5">{formatDate(item.date)}</span>
                    <span className="rounded-full bg-cream-deep text-stone px-2 py-0.5">
                      {(item.body.match(/\{\{\s*book:/g) ?? []).length} books
                    </span>
                  </span>
                </span>
              </button>
              <span className="flex items-center gap-4 text-xs shrink-0">
                <button type="button" onClick={() => open(item)} className="text-navy font-semibold underline underline-offset-4">
                  Edit
                </button>
                {item.published && (
                  <a href={`/recommendations/${item.id}`} target="_blank" rel="noopener noreferrer" className="text-stone hover:text-ink underline underline-offset-4">
                    View page
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Modal
          wide
          title={isNew ? "New recommendation" : "Edit recommendation"}
          onClose={() => !isSaving && setEditing(null)}
          footer={
            <>
              <button type="button" onClick={save} disabled={isSaving} className={primaryButton}>
                {isSaving ? "Saving..." : isNew ? "Save" : "Save changes"}
              </button>
              <button type="button" onClick={() => setEditing(null)} disabled={isSaving} className="text-sm text-stone hover:text-ink underline underline-offset-4">
                Cancel
              </button>
              {modalError && <span role="alert" className="text-sm text-red-800">{modalError}</span>}
              {!isNew && (
                <button type="button" onClick={remove} disabled={isSaving} className="ml-auto text-sm text-red-800 underline underline-offset-4">
                  Delete
                </button>
              )}
            </>
          }
        >
          <TextField autoFocus label="Title" value={editing.title} max={160} placeholder="5 memoirs that shaped my thinking" onChange={(title) => patch({ title })} />
          <TextField label="Short summary" rows={2} value={editing.summary} max={400} onChange={(summary) => patch({ summary })} />
          <div className="grid md:grid-cols-[1fr_12rem] gap-6 items-start">
            <ImageField label="Cover image" value={editing.image} onChange={(image) => patch({ image })} />
            <label className="block">
              <span className={labelClass}>Date</span>
              <input
                type="date"
                value={editing.date.slice(0, 10)}
                onChange={(e) => e.target.value && patch({ date: `${e.target.value}T12:00:00.000Z` })}
                className="w-full bg-transparent border-b border-ink/30 focus:border-navy py-2.5 text-[17px] text-ink outline-none"
              />
            </label>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
              <span className={labelClass}>Text (Markdown)</span>
              <div className="flex gap-4 text-xs tracking-[0.15em] uppercase">
                <button type="button" onClick={() => setPreview(false)} className={!preview ? "text-navy underline underline-offset-4" : "text-stone"}>
                  Write
                </button>
                <button type="button" onClick={() => setPreview(true)} className={preview ? "text-navy underline underline-offset-4" : "text-stone"}>
                  Preview
                </button>
              </div>
            </div>

            {preview ? (
              <div className="min-h-[24rem] border border-line bg-white p-6">
                {editing.body.trim() ? (
                  <RecommendationBody body={editing.body} books={books} showMissing />
                ) : (
                  <p className="text-stone">Nothing to preview.</p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-3 rounded-lg border border-line bg-cream-deep/60 p-3">
                  <p className="text-xs font-semibold text-ink mb-2">Add a book card at the cursor</p>
                  <div className="flex flex-wrap gap-3">
                    <input
                      type="search"
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      placeholder={`Find among ${books.length} books…`}
                      aria-label="Find a book to add"
                      className="flex-1 min-w-[10rem] bg-white border border-line rounded-md px-3 py-2 text-sm outline-none focus:border-navy"
                    />
                  </div>
                  {books.length === 0 ? (
                    <p className="mt-2 text-xs text-stone">Add books in “All books” first.</p>
                  ) : (
                    <ul className="mt-2 max-h-40 overflow-y-auto divide-y divide-line rounded-md border border-line bg-white">
                      {matches.length === 0 && <li className="px-3 py-2 text-sm text-stone">No book matches.</li>}
                      {matches.map((book) => (
                        <li key={book.id}>
                          <button
                            type="button"
                            onClick={() => insertBook(book.id)}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-cream-deep"
                          >
                            <span className="truncate">
                              <span className="font-semibold text-ink">{book.title}</span>
                              {book.author && <span className="text-stone"> · {book.author}</span>}
                            </span>
                            <span className="shrink-0 text-xs text-navy font-semibold">+ Insert</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <textarea
                  ref={area}
                  rows={16}
                  value={editing.body}
                  maxLength={60000}
                  onChange={(e) => patch({ body: e.target.value })}
                  placeholder={"Write your recommendation. **Bold**, *italic*, ## headings and [links](https://example.com) work.\n\nA line like {{book:book-address}} shows that book as a card. Use the list above to insert one."}
                  className={`${areaClass} font-mono text-[14px] p-4`}
                />
              </>
            )}
          </div>

          <Toggle
            label="Visible on the site"
            hint="Untick to keep it as a draft that only you can see here."
            checked={editing.published}
            onChange={(published) => patch({ published })}
          />
        </Modal>
      )}
    </div>
  );
}
