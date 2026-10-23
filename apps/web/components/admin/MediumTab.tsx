"use client";

import { useEffect, useState } from "react";

import { primaryButton, type Status } from "@/components/admin/ui";
import type { MediumPost } from "@/lib/medium";
import type { SiteSettings } from "@/lib/settings";

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
  onUnauthorized: () => void;
}

export default function MediumTab({ settings, onSave, onUnauthorized }: Props) {
  const [posts, setPosts] = useState<MediumPost[] | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set(settings.hiddenMedium));
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/medium");
      if (res.status === 401) return onUnauthorized();
      const data = (await res.json().catch(() => null)) as { posts?: MediumPost[] } | null;
      setPosts(data?.posts ?? []);
    })();
  }, [onUnauthorized]);

  const toggle = (href: string) =>
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });

  const save = async () => {
    setIsSaving(true);
    const error = await onSave({ ...settings, hiddenMedium: [...hidden] });
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved. The Writing page updates within a minute." });
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <p className="text-[15px] leading-relaxed text-stone mb-8">
        These articles come from your Medium profile automatically. Untick any you do not want listed on the Writing page.
        A Medium article that is also saved as an on-site post is shown once, as the on-site post.
      </p>

      {posts === null ? (
        <p className="text-sm text-stone">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-stone">No Medium articles could be loaded.</p>
      ) : (
        <ul className="border-b border-line mb-8">
          {posts.map((post) => (
            <li key={post.href} className="border-t border-line">
              <label className="flex items-start gap-4 py-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!hidden.has(post.href)}
                  onChange={() => toggle(post.href)}
                  className="mt-1.5 h-4 w-4 accent-navy"
                />
                <span>
                  <span className="block font-display text-xl leading-snug text-ink">{post.title}</span>
                  <span className="block text-xs text-stone mt-1">
                    {new Date(post.date).toLocaleDateString("en-GB")} · {hidden.has(post.href) ? "Hidden" : "Shown"}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {status && (
        <p role="status" className={`text-sm mb-4 ${status.kind === "ok" ? "text-navy" : "text-red-800"}`}>
          {status.text}
        </p>
      )}
      <button onClick={save} disabled={isSaving || posts === null} className={primaryButton}>
        {isSaving ? "Saving..." : "Save visibility"}
      </button>
    </div>
  );
}
