"use client";

import { ImageField, LinksEditor, MoveButtons, TextField, moveItem } from "@/components/admin/fields";
import { fieldClass } from "@/components/admin/ui";
import { navItem, type NavItem } from "@/lib/settings";

interface Props {
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
  max?: number;
}

/** The top menu: each entry has a text and an address, plus an optional panel that opens under the bar on hover. */
export default function NavItemsEditor({ items, onChange, max = 8 }: Props) {
  const update = (index: number, patch: Partial<NavItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-line bg-cream-deep/60 p-4 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[8rem]">
              <input aria-label="Menu text" placeholder="Text" maxLength={60} value={item.label} onChange={(e) => update(index, { label: e.target.value })} className={fieldClass} />
            </div>
            <div className="flex-[2] min-w-[12rem]">
              <input aria-label="Menu address" placeholder="/page or https://… (optional if it has a panel)" maxLength={500} value={item.href} onChange={(e) => update(index, { href: e.target.value })} className={fieldClass} />
            </div>
            <MoveButtons index={index} length={items.length} onMove={(from, to) => onChange(moveItem(items, from, to))} />
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="text-xs text-red-800 underline underline-offset-4 pb-2">
              Remove
            </button>
          </div>

          <details className="border-t border-line pt-3" open={item.children.length > 0 ? undefined : false}>
            <summary className="cursor-pointer text-sm text-navy select-none">
              Dropdown panel{item.children.length > 0 ? ` · ${item.children.length} sub-link${item.children.length === 1 ? "" : "s"}` : " (none)"}
            </summary>
            <div className="mt-4 space-y-5">
              <p className="text-xs text-stone">
                Add sub-links and a colored panel opens under the menu when someone points at “{item.label || "this item"}”. With no sub-links there is no panel.
              </p>
              <TextField
                label="Panel heading"
                value={item.panelTitle}
                max={80}
                placeholder={`Explore ${item.label.toLowerCase() || "…"}`}
                hint="Leave empty to use “Explore …”."
                onChange={(panelTitle) => update(index, { panelTitle })}
              />
              <div>
                <span className="block text-xs tracking-[0.2em] uppercase text-stone mb-2">Sub-links</span>
                <LinksEditor links={item.children} max={12} onChange={(children) => update(index, { children })} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <TextField label="Button text (optional)" value={item.buttonLabel} max={40} onChange={(buttonLabel) => update(index, { buttonLabel })} />
                <TextField label="Button link" value={item.buttonHref} max={500} onChange={(buttonHref) => update(index, { buttonHref })} />
              </div>
              <div className="space-y-4">
                <ImageField label="Picture card, on the right (optional)" value={item.cardImage} onChange={(cardImage) => update(index, { cardImage })} />
                <div className="grid md:grid-cols-2 gap-6">
                  <TextField label="Card text" value={item.cardTitle} max={80} onChange={(cardTitle) => update(index, { cardTitle })} />
                  <TextField label="Card link" value={item.cardHref} max={500} onChange={(cardHref) => update(index, { cardHref })} />
                </div>
              </div>
            </div>
          </details>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, navItem("", "")])} className="text-sm text-navy underline underline-offset-4">
          Add a menu item
        </button>
      )}
      <p className="text-xs text-stone">Items with no text, or with neither an address nor sub-links, are dropped when you save.</p>
    </div>
  );
}
