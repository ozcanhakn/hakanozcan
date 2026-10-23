"use client";

import { useCallback, useEffect, useState } from "react";

import { areaClass, fieldClass, labelClass, primaryButton, type Status } from "@/components/admin/ui";
import Markdown from "@/components/Markdown";
import type { Post } from "@/lib/blog";

interface Draft {
  id: string | null;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  content: string;
  published: boolean;
}

const emptyDraft: Draft = { id: null, title: "", slug: "", summary: "", thumbnail: "", content: "", published: true };

const TURKISH: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => TURKISH[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export default function PostsTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [supportsPublished, setSupportsPublished] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(false);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/admin/posts");
    if (res.status === 401) return onUnauthorized();
    const data = (await res.json().catch(() => null)) as
      | { posts?: Post[]; supportsPublished?: boolean; error?: string }
      | null;
    if (!res.ok) {
      setStatus({ kind: "error", text: data?.error ?? "Could not load posts." });
    } else {
      setPosts(data?.posts ?? []);
      setSupportsPublished(Boolean(data?.supportsPublished));
    }
    setIsLoading(false);
  }, [onUnauthorized]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));

  const startNew = () => {
    setDraft(emptyDraft);
    setSlugTouched(false);
    setPreview(false);
    setStatus(null);
  };

  const edit = (post: Post) => {
    setDraft({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      thumbnail: post.thumbnail ?? "",
      content: post.content ?? "",
      published: post.published !== false,
    });
    setSlugTouched(true);
    setPreview(false);
    setStatus(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const res = await fetch(draft.id ? `/api/admin/posts/${draft.id}` : "/api/admin/posts", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json().catch(() => null)) as { post?: Post; error?: string } | null;
      if (res.status === 401) return onUnauthorized();
      if (!res.ok || !data?.post) {
        setStatus({ kind: "error", text: data?.error ?? "Could not save the post." });
        return;
      }
      setDraft((current) => ({ ...current, id: data.post!.id }));
      setStatus({
        kind: "ok",
        text: !draft.id ? "Post created." : "Changes saved.",
      });
      await loadPosts();
    } catch {
      setStatus({ kind: "error", text: "Could not reach the server." });
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    if (!draft.id || !window.confirm("Delete this post permanently?")) return;
    const res = await fetch(`/api/admin/posts/${draft.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus({ kind: "error", text: data?.error ?? "Could not delete the post." });
      return;
    }
    startNew();
    setStatus({ kind: "ok", text: "Post deleted." });
    await loadPosts();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <aside className="lg:col-span-4">
        <button onClick={startNew} className={`${primaryButton} w-full mb-6`}>
          New post
        </button>

        {isLoading ? (
          <p className="text-sm text-stone">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-stone">No posts yet.</p>
        ) : (
          <ul className="border-b border-line">
            {posts.map((post) => (
              <li key={post.id} className="border-t border-line">
                <button
                  onClick={() => edit(post)}
                  className={`w-full text-left py-4 px-1 transition-colors ${
                    draft.id === post.id ? "text-navy" : "text-ink hover:text-navy"
                  }`}
                >
                  <span className="block font-display text-xl leading-snug">{post.title}</span>
                  <span className="block text-xs text-stone mt-1">
                    {post.published === false && (
                      <span className="mr-2 border border-brass px-1.5 py-0.5 text-brass uppercase tracking-wider">Draft</span>
                    )}
                    {new Date(post.created_at).toLocaleDateString("en-GB")} · /blog/{post.slug}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <form onSubmit={save} className="lg:col-span-8 space-y-7">
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input
            id="title"
            required
            maxLength={200}
            value={draft.title}
            onChange={(e) =>
              update({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })
            }
            className={`${fieldClass} font-display text-3xl`}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Slug (the post address: /blog/slug)</label>
          <input
            id="slug"
            required
            value={draft.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update({ slug: slugify(e.target.value) });
            }}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="summary" className={labelClass}>Summary</label>
          <textarea
            id="summary"
            required
            rows={2}
            maxLength={500}
            value={draft.summary}
            onChange={(e) => update({ summary: e.target.value })}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className={labelClass}>Cover image URL (optional)</label>
          <input
            id="thumbnail"
            type="url"
            value={draft.thumbnail}
            onChange={(e) => update({ thumbnail: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={labelClass}>Content (Markdown)</span>
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
            <div className="min-h-[24rem] border border-line bg-white/50 p-6">
              {draft.content.trim() ? <Markdown>{draft.content}</Markdown> : <p className="text-stone">Nothing to preview.</p>}
            </div>
          ) : (
            <textarea
              required
              rows={20}
              value={draft.content}
              onChange={(e) => update({ content: e.target.value })}
              placeholder={"## A heading\n\nWrite in Markdown. **Bold**, *italic*, [links](https://example.com), lists and tables work."}
              className={`${areaClass} font-mono text-[14px] p-4`}
            />
          )}
        </div>

        <label className={`flex items-start gap-3 ${supportsPublished ? "" : "opacity-60"}`}>
          <input
            type="checkbox"
            checked={draft.published}
            disabled={!supportsPublished}
            onChange={(e) => update({ published: e.target.checked })}
            className="mt-1 h-4 w-4 accent-navy"
          />
          <span className="text-sm text-ink">
            Visible on the site
            <span className="block text-xs text-stone mt-0.5">
              {supportsPublished
                ? "Untick to keep this post as a draft: it stays here but disappears from the public site."
                : "Drafts are not enabled yet. Run supabase/admin-panel.sql in Supabase to turn this on."}
            </span>
          </span>
        </label>

        {status && (
          <p role="status" className={`text-sm ${status.kind === "ok" ? "text-navy" : "text-red-800"}`}>
            {status.text}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={isSaving} className={primaryButton}>
            {isSaving ? "Saving..." : draft.id ? "Save changes" : "Create post"}
          </button>
          {draft.slug && draft.id && draft.published && (
            <a href={`/blog/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-navy underline underline-offset-4">
              View post
            </a>
          )}
          {draft.id && (
            <button type="button" onClick={remove} className="ml-auto text-sm text-red-800 underline underline-offset-4">
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
