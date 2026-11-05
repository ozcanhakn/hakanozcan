"use client";

import { useState } from "react";

import { Card, LinksEditor, MediaListField, MoveButtons, SaveBar, TextField, moveItem } from "@/components/admin/fields";
import NavItemsEditor from "@/components/admin/NavItemsEditor";
import { labelClass, type Status } from "@/components/admin/ui";
import { DEFAULT_ACCENT, type SiteSettings } from "@/lib/settings";

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
}

export default function SiteTab({ settings, onSave }: Props) {
  const [brand, setBrand] = useState(settings.brand);
  const [nav, setNav] = useState(settings.nav);
  const [footer, setFooter] = useState(settings.footer);
  const [contact, setContact] = useState(settings.contact);
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    const error = await onSave({ ...settings, brand, nav, footer, contact });
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved. Every page updates within a minute." });
    setIsSaving(false);
  };

  const updateColumn = (index: number, patch: Partial<(typeof footer.columns)[number]>) =>
    setFooter((current) => ({ ...current, columns: current.columns.map((column, i) => (i === index ? { ...column, ...patch } : column)) }));

  return (
    <div className="max-w-3xl space-y-8">
      <Card title="Name and color">
        <TextField label="Site name (top left and footer)" value={brand.name} max={60} onChange={(name) => setBrand({ ...brand, name })} />
        <div>
          <span className={labelClass}>Accent color</span>
          <div className="flex items-center gap-4">
            <input
              type="color"
              aria-label="Accent color"
              value={brand.accent}
              onChange={(e) => setBrand({ ...brand, accent: e.target.value })}
              className="h-10 w-14 cursor-pointer border border-line bg-transparent p-0.5"
            />
            <code className="font-mono text-sm text-ink">{brand.accent}</code>
            <button type="button" onClick={() => setBrand({ ...brand, accent: DEFAULT_ACCENT })} className="text-xs text-stone underline underline-offset-4">
              Reset
            </button>
          </div>
          <p className="text-xs text-stone mt-2">Used for buttons, links, labels and the call-to-action band.</p>
        </div>
      </Card>

      <Card title="Top menu">
        <NavItemsEditor items={nav.links} onChange={(links) => setNav({ ...nav, links })} />
        <div className="grid md:grid-cols-2 gap-6">
          <TextField label="Button text (top right)" value={nav.ctaLabel} max={40} hint="Leave empty to hide the button." onChange={(ctaLabel) => setNav({ ...nav, ctaLabel })} />
          <TextField label="Button link" value={nav.ctaHref} max={500} onChange={(ctaHref) => setNav({ ...nav, ctaHref })} />
        </div>
      </Card>

      <Card title="Contact page background">
        <p className="text-xs text-stone">
          Pictures or MP4/WebM videos shown behind the contact form. The text sits on a light panel so it stays readable. Leave empty for the plain white page.
        </p>
        <MediaListField label="Background" value={contact.media} onChange={(media) => setContact({ media })} />
      </Card>

      <Card title="Footer">
        {footer.columns.map((column, index) => (
          <div key={index} className="border border-line bg-cream-deep/60 p-4 space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <TextField label="Column title" value={column.title} max={40} onChange={(title) => updateColumn(index, { title })} />
              </div>
              <MoveButtons
                index={index}
                length={footer.columns.length}
                onMove={(from, to) => setFooter((current) => ({ ...current, columns: moveItem(current.columns, from, to) }))}
              />
              <button
                type="button"
                onClick={() => setFooter((current) => ({ ...current, columns: current.columns.filter((_, i) => i !== index) }))}
                className="text-xs text-red-800 underline underline-offset-4 pb-2"
              >
                Remove
              </button>
            </div>
            <LinksEditor links={column.links} max={10} onChange={(links) => updateColumn(index, { links })} />
          </div>
        ))}
        {footer.columns.length < 4 && (
          <button
            type="button"
            onClick={() => setFooter((current) => ({ ...current, columns: [...current.columns, { title: "New column", links: [] }] }))}
            className="text-sm text-navy underline underline-offset-4"
          >
            Add a column
          </button>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          <TextField label="Small print" value={footer.note} max={200} onChange={(note) => setFooter({ ...footer, note })} />
          <TextField label="Contact email" value={footer.email} max={120} onChange={(email) => setFooter({ ...footer, email })} />
        </div>
      </Card>

      <SaveBar status={status} isSaving={isSaving} onSave={save} label="Save site settings" />
    </div>
  );
}
