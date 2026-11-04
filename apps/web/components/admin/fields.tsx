"use client";

import { useEffect, useRef, useState } from "react";

import { areaClass, fieldClass, labelClass, primaryButton, type Status } from "@/components/admin/ui";
import SiteImage from "@/components/SiteImage";
import type { NavLink } from "@/lib/settings";

interface TextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max?: number;
  rows?: number;
  hint?: string;
  placeholder?: string;
  /** id of a <datalist> that offers suggestions while typing. */
  list?: string;
  autoFocus?: boolean;
}

export function TextField({ label, value, onChange, max, rows, hint, placeholder, list, autoFocus }: TextProps) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {rows ? (
        <textarea rows={rows} maxLength={max} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={areaClass} />
      ) : (
        <input
          maxLength={max}
          value={value}
          list={list}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
        />
      )}
      {hint && <span className="block text-xs text-stone mt-1">{hint}</span>}
    </label>
  );
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-navy" />
      <span className="text-sm text-ink">
        {label}
        {hint && <span className="block text-xs text-stone mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

/** A web address field with an upload button: the uploaded image is stored in Supabase Storage. */
export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      // Step 1: ask the server for a signed address. Step 2: send the file straight to storage.
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: file.type, size: file.size }),
      });
      if (res.status === 401) return window.location.reload();
      const data = (await res.json().catch(() => null)) as { uploadUrl?: string; url?: string; error?: string } | null;
      if (!res.ok || !data?.url || !data.uploadUrl) {
        setError(data?.error ?? "The file could not be uploaded.");
        return;
      }
      const sent = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!sent.ok) setError("The file could not be uploaded.");
      else onChange(data.url);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex items-start gap-4">
        {value ? (
          <SiteImage src={value} className="h-16 w-24 shrink-0 object-cover border border-line bg-cream-deep" />
        ) : (
          <div className="h-16 w-24 shrink-0 border border-dashed border-line bg-cream-deep" />
        )}
        <div className="flex-1 min-w-0">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or upload an image or video"
            className={fieldClass}
            aria-label={`${label} address`}
          />
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <button type="button" disabled={busy} onClick={() => input.current?.click()} className="text-navy underline underline-offset-4 disabled:opacity-50">
              {busy ? "Uploading..." : "Upload image or video"}
            </button>
            <span className="text-stone">Images up to 10 MB; MP4 or WebM video up to 40 MB (plays silently on a loop).</span>
            {value && (
              <button type="button" onClick={() => onChange("")} className="text-red-800 underline underline-offset-4">
                Remove
              </button>
            )}
            {error && <span role="alert" className="text-red-800">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MoveButtons({ index, length, onMove }: { index: number; length: number; onMove: (from: number, to: number) => void }) {
  const base = "px-2 py-1 border border-line text-xs text-ink hover:border-navy disabled:opacity-30 disabled:hover:border-line";
  return (
    <span className="inline-flex gap-1">
      <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)} className={base}>↑</button>
      <button type="button" aria-label="Move down" disabled={index === length - 1} onClick={() => onMove(index, index + 1)} className={base}>↓</button>
    </span>
  );
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

export function LinksEditor({ links, onChange, max = 8 }: { links: NavLink[]; onChange: (links: NavLink[]) => void; max?: number }) {
  const update = (index: number, patch: Partial<NavLink>) =>
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[8rem]">
            <input aria-label="Link text" placeholder="Text" maxLength={60} value={link.label} onChange={(e) => update(index, { label: e.target.value })} className={fieldClass} />
          </div>
          <div className="flex-[2] min-w-[12rem]">
            <input aria-label="Link address" placeholder="/page or https://…" maxLength={500} value={link.href} onChange={(e) => update(index, { href: e.target.value })} className={fieldClass} />
          </div>
          <MoveButtons index={index} length={links.length} onMove={(from, to) => onChange(moveItem(links, from, to))} />
          <button type="button" onClick={() => onChange(links.filter((_, i) => i !== index))} className="text-xs text-red-800 underline underline-offset-4 pb-2">
            Remove
          </button>
        </div>
      ))}
      {links.length < max && (
        <button type="button" onClick={() => onChange([...links, { label: "", href: "" }])} className="text-sm text-navy underline underline-offset-4">
          Add a link
        </button>
      )}
    </div>
  );
}

export function SaveBar({ status, isSaving, onSave, label }: { status: Status; isSaving: boolean; onSave: () => void; label: string }) {
  return (
    <div className="sticky bottom-0 -mx-2 px-2 py-4 bg-white/95 backdrop-blur border-t border-line flex flex-wrap items-center gap-6">
      <button type="button" onClick={onSave} disabled={isSaving} className={primaryButton}>
        {isSaving ? "Saving..." : label}
      </button>
      {status && (
        <p role="status" className={`text-sm ${status.kind === "ok" ? "text-navy" : "text-red-800"}`}>
          {status.text}
        </p>
      )}
    </div>
  );
}

/** A popup window. Closes with Esc, the X, or a click on the dark area behind it. */
export function Modal({
  title,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** A wider window, for longer writing. */
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[400] bg-black/55 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className={`w-full ${wide ? "max-w-4xl" : "max-w-2xl"} my-auto bg-white rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]`}>
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-line">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-stone hover:text-ink text-2xl leading-none px-2">
            ×
          </button>
        </div>
        <div className="px-6 py-6 overflow-y-auto space-y-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-line flex flex-wrap items-center gap-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Card({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="border border-line p-5 md:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
