"use client";

import { useState } from "react";

import { Card, ImageField, MediaListField, MoveButtons, SaveBar, TextField, Toggle, moveItem } from "@/components/admin/fields";
import { labelClass, type Status } from "@/components/admin/ui";
import type { BlockId, SiteSettings } from "@/lib/settings";

const BLOCK_LABELS: Record<BlockId, { name: string; hint: string }> = {
  tiles: { name: "Topic cards", hint: "Large image cards, like “Explore work” on Gates Notes." },
  books: { name: "Books", hint: "Your latest or featured books. Add them in the Books tab." },
  writing: { name: "Latest writing", hint: "Newest site posts and Medium articles." },
  project: { name: "Featured projects", hint: "Projects marked as featured in the Projects tab." },
  quote: { name: "Quote", hint: "A large centered statement." },
  cta: { name: "Call to action", hint: "The colored band that invites people to get in touch." },
};

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
}

/** “Show the banner text while this background plays”. Unchecked backgrounds play with the text faded out. */
function HeroTextToggle({ src, hidden, onChange }: { src: string; hidden: string[]; onChange: (next: string[]) => void }) {
  const shown = !hidden.includes(src);
  return (
    <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
      <input
        type="checkbox"
        checked={shown}
        onChange={(e) => onChange(e.target.checked ? hidden.filter((item) => item !== src) : [...hidden, src])}
        className="h-4 w-4 accent-[var(--color-navy,#0b6e99)]"
      />
      Show the headline and buttons while this background plays
    </label>
  );
}

export default function HomeTab({ settings, onSave }: Props) {
  const [hero, setHero] = useState(settings.hero);
  const [order, setOrder] = useState(settings.order);
  const [blocks, setBlocks] = useState(settings.blocks);
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  const patchHero = (patch: Partial<typeof hero>) => setHero((current) => ({ ...current, ...patch }));
  const patchBlock = <K extends BlockId>(key: K, patch: Partial<SiteSettings["blocks"][K]>) =>
    setBlocks((current) => ({ ...current, [key]: { ...current[key], ...patch } }) as SiteSettings["blocks"]);

  const save = async () => {
    setIsSaving(true);
    const error = await onSave({ ...settings, hero, order, blocks });
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved. The home page updates within a minute." });
    setIsSaving(false);
  };

  /** When a background's address changes, its “text hidden” choice follows it. */
  const renameHidden = (from: string, to: string) => {
    if (!from || from === to || !hero.textHidden.includes(from)) return hero.textHidden;
    const rest = hero.textHidden.filter((item) => item !== from);
    return to ? [...rest, to] : rest;
  };

  const updateTile = (index: number, patch: Partial<(typeof blocks.tiles.items)[number]>) =>
    patchBlock("tiles", { items: blocks.tiles.items.map((tile, i) => (i === index ? { ...tile, ...patch } : tile)) });

  const fields: Record<BlockId, React.ReactNode> = {
    tiles: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-6">
          <TextField label="Small label" value={blocks.tiles.eyebrow} max={60} onChange={(eyebrow) => patchBlock("tiles", { eyebrow })} />
          <TextField label="Heading" value={blocks.tiles.title} max={120} onChange={(title) => patchBlock("tiles", { title })} />
        </div>
        <TextField label="Introduction" rows={3} value={blocks.tiles.intro} max={600} onChange={(intro) => patchBlock("tiles", { intro })} />

        <div className="grid md:grid-cols-2 gap-6">
          <label className="block">
            <span className="block text-xs tracking-[0.2em] uppercase text-stone mb-1">Columns (wide screens)</span>
            <select
              value={blocks.tiles.columns}
              onChange={(e) => patchBlock("tiles", { columns: Number(e.target.value) })}
              className="w-full bg-transparent border-b border-ink/30 py-2.5 text-[17px] text-ink outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs tracking-[0.2em] uppercase text-stone mb-1">Rows</span>
            <select
              value={blocks.tiles.rows}
              onChange={(e) => patchBlock("tiles", { rows: Number(e.target.value) })}
              className="w-full bg-transparent border-b border-ink/30 py-2.5 text-[17px] text-ink outline-none"
            >
              <option value={0}>Automatic (show every card)</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs text-stone">
          {blocks.tiles.rows > 0
            ? `The grid shows up to ${blocks.tiles.columns * blocks.tiles.rows} cards (${blocks.tiles.columns} × ${blocks.tiles.rows}); the first ones in the list, in order. You have ${blocks.tiles.items.length}.`
            : `${blocks.tiles.columns} per row; new rows are added as needed for your ${blocks.tiles.items.length} cards.`}{" "}
          Phones always show one card per row.
        </p>

        <div className="space-y-4">
          {blocks.tiles.items.map((tile, index) => (
            <div key={index} className="border border-line bg-cream-deep/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-brass">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex items-center gap-4">
                  <MoveButtons
                    index={index}
                    length={blocks.tiles.items.length}
                    onMove={(from, to) => patchBlock("tiles", { items: moveItem(blocks.tiles.items, from, to) })}
                  />
                  <button
                    type="button"
                    onClick={() => patchBlock("tiles", { items: blocks.tiles.items.filter((_, i) => i !== index) })}
                    className="text-xs text-red-800 underline underline-offset-4"
                  >
                    Remove
                  </button>
                </span>
              </div>
              <TextField label="Title" value={tile.title} max={80} onChange={(title) => updateTile(index, { title })} />
              <TextField label="Text" rows={2} value={tile.body} max={400} onChange={(body) => updateTile(index, { body })} />
              <ImageField label="Image" value={tile.image} onChange={(image) => updateTile(index, { image })} />
              <TextField label="Link (optional)" value={tile.href} max={500} placeholder="/projects" onChange={(href) => updateTile(index, { href })} />
            </div>
          ))}
          {blocks.tiles.items.length < 24 && (
            <button
              type="button"
              onClick={() => patchBlock("tiles", { items: [...blocks.tiles.items, { title: "", body: "", image: "", href: "" }] })}
              className="text-sm text-navy underline underline-offset-4"
            >
              Add a card
            </button>
          )}
          <p className="text-xs text-stone">Cards with an empty title are dropped when you save.</p>
        </div>
      </div>
    ),
    books: (
      <div className="grid md:grid-cols-2 gap-6">
        <TextField label="Small label" value={blocks.books.eyebrow} max={60} onChange={(eyebrow) => patchBlock("books", { eyebrow })} />
        <TextField label="Heading" value={blocks.books.title} max={120} onChange={(title) => patchBlock("books", { title })} />
        <TextField label="“All books” link text" value={blocks.books.linkLabel} max={40} onChange={(linkLabel) => patchBlock("books", { linkLabel })} />
        <label className="block">
          <span className="block text-xs tracking-[0.2em] uppercase text-stone mb-1">How many books</span>
          <select
            value={blocks.books.count}
            onChange={(e) => patchBlock("books", { count: Number(e.target.value) })}
            className="w-full bg-transparent border-b border-ink/30 py-2.5 text-[17px] text-ink outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    ),
    writing: (
      <div className="grid md:grid-cols-2 gap-6">
        <TextField label="Small label" value={blocks.writing.eyebrow} max={60} onChange={(eyebrow) => patchBlock("writing", { eyebrow })} />
        <TextField label="Heading" value={blocks.writing.title} max={120} onChange={(title) => patchBlock("writing", { title })} />
        <TextField label="“All writing” link text" value={blocks.writing.linkLabel} max={40} onChange={(linkLabel) => patchBlock("writing", { linkLabel })} />
        <label className="block">
          <span className="block text-xs tracking-[0.2em] uppercase text-stone mb-1">How many articles</span>
          <select
            value={blocks.writing.count}
            onChange={(e) => patchBlock("writing", { count: Number(e.target.value) })}
            className="w-full bg-transparent border-b border-ink/30 py-2.5 text-[17px] text-ink outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    ),
    project: (
      <div className="grid md:grid-cols-2 gap-6">
        <TextField label="Small label" value={blocks.project.eyebrow} max={60} onChange={(eyebrow) => patchBlock("project", { eyebrow })} />
        <TextField label="Heading" value={blocks.project.title} max={120} onChange={(title) => patchBlock("project", { title })} />
      </div>
    ),
    quote: (
      <div className="space-y-5">
        <TextField label="Quote" rows={3} value={blocks.quote.text} max={400} onChange={(text) => patchBlock("quote", { text })} />
        <TextField label="Signed by" value={blocks.quote.author} max={80} onChange={(author) => patchBlock("quote", { author })} />
      </div>
    ),
    cta: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-6">
          <TextField label="Small label" value={blocks.cta.eyebrow} max={60} onChange={(eyebrow) => patchBlock("cta", { eyebrow })} />
          <TextField label="Heading" value={blocks.cta.heading} max={160} onChange={(heading) => patchBlock("cta", { heading })} />
        </div>
        <TextField label="Text" rows={2} value={blocks.cta.body} max={400} onChange={(body) => patchBlock("cta", { body })} />
        <div className="grid md:grid-cols-2 gap-6">
          <TextField label="Button text" value={blocks.cta.buttonLabel} max={40} onChange={(buttonLabel) => patchBlock("cta", { buttonLabel })} />
          <TextField label="Button link" value={blocks.cta.buttonHref} max={500} onChange={(buttonHref) => patchBlock("cta", { buttonHref })} />
        </div>
        <div>
          <span className={labelClass}>Background (optional)</span>
          <p className="text-xs text-stone mb-3">
            Pictures or MP4/WebM videos shown behind the text, which stays on top without a panel. Leave empty to keep the plain colored band.
          </p>
          <MediaListField label="Background" value={blocks.cta.media} onChange={(media) => patchBlock("cta", { media })} />
        </div>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl space-y-8">
      <Card title="Top banner">
        <ImageField
          label="Background (image or video)"
          value={hero.image}
          onChange={(image) => patchHero({ image, textHidden: renameHidden(hero.image, image) })}
        />
        <p className="text-xs text-stone -mt-2">
          A wide photo or a short MP4/WebM clip works best. Without one the banner uses your accent color.
        </p>
        {hero.image && <HeroTextToggle src={hero.image} hidden={hero.textHidden} onChange={(textHidden) => patchHero({ textHidden })} />}
        {hero.moreMedia.map((src, index) => (
          <div key={index} className="border-l-2 border-line pl-4 space-y-3">
            <ImageField
              label={`Background ${index + 2}`}
              value={src}
              onChange={(value) =>
                patchHero({
                  moreMedia: hero.moreMedia.map((item, i) => (i === index ? value : item)),
                  textHidden: renameHidden(src, value),
                })
              }
            />
            {src && <HeroTextToggle src={src} hidden={hero.textHidden} onChange={(textHidden) => patchHero({ textHidden })} />}
            <button
              type="button"
              onClick={() =>
                patchHero({
                  moreMedia: hero.moreMedia.filter((_, i) => i !== index),
                  textHidden: hero.textHidden.filter((item) => item !== src || hero.image === src || hero.moreMedia.some((other, i) => i !== index && other === src)),
                })
              }
              className="text-xs text-red-800 underline underline-offset-4"
            >
              Remove background {index + 2}
            </button>
          </div>
        ))}
        {hero.image && hero.moreMedia.length < 9 && (
          <button
            type="button"
            onClick={() => patchHero({ moreMedia: [...hero.moreMedia, ""] })}
            className="text-sm text-navy underline underline-offset-4"
          >
            + Add another background
          </button>
        )}
        {hero.moreMedia.length > 0 && (
          <p className="text-xs text-stone">
            The backgrounds play one after another with a fade: a video plays to its end, a picture stays for 6 seconds. Empty ones are skipped when you save.
          </p>
        )}
        <TextField label="Small label" value={hero.eyebrow} max={60} onChange={(eyebrow) => patchHero({ eyebrow })} />
        <TextField label="Headline" rows={2} value={hero.headline} max={200} onChange={(headline) => patchHero({ headline })} />
        <TextField label="Introduction" rows={3} value={hero.subheadline} max={600} onChange={(subheadline) => patchHero({ subheadline })} />
        <div className="grid md:grid-cols-2 gap-6">
          <TextField label="First button text" value={hero.ctaLabel} max={40} onChange={(ctaLabel) => patchHero({ ctaLabel })} />
          <TextField label="First button link" value={hero.ctaHref} max={500} onChange={(ctaHref) => patchHero({ ctaHref })} />
          <TextField label="Second button text" value={hero.secondaryLabel} max={40} onChange={(secondaryLabel) => patchHero({ secondaryLabel })} />
          <TextField label="Second button link" value={hero.secondaryHref} max={500} onChange={(secondaryHref) => patchHero({ secondaryHref })} />
        </div>
      </Card>

      <div>
        <h2 className="font-display text-2xl text-ink mb-1">Sections under the banner</h2>
        <p className="text-sm text-stone mb-5">Use the arrows to reorder them and the checkbox to show or hide each one.</p>
        <div className="space-y-4">
          {order.map((id, index) => (
            <details key={id} className="border border-line" open={index === 0 ? false : undefined}>
              <summary className="flex flex-wrap items-center justify-between gap-4 p-4 cursor-pointer select-none">
                <span>
                  <span className="block font-display text-xl text-ink">{BLOCK_LABELS[id].name}</span>
                  <span className="block text-xs text-stone mt-0.5">{BLOCK_LABELS[id].hint}</span>
                </span>
                <span className="flex items-center gap-5" onClick={(e) => e.stopPropagation()}>
                  <Toggle
                    label="Shown"
                    checked={blocks[id].enabled}
                    onChange={(enabled) => patchBlock(id, { enabled } as Partial<SiteSettings["blocks"][typeof id]>)}
                  />
                  <MoveButtons index={index} length={order.length} onMove={(from, to) => setOrder((current) => moveItem(current, from, to))} />
                </span>
              </summary>
              <div className="p-5 border-t border-line">{fields[id]}</div>
            </details>
          ))}
        </div>
      </div>

      <SaveBar status={status} isSaving={isSaving} onSave={save} label="Save home page" />
    </div>
  );
}
