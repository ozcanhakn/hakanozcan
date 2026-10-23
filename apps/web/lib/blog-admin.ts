import type { Post } from "@/lib/blog";

export interface PostInput {
  title: string;
  slug: string;
  summary: string;
  thumbnail: string | null;
  content: string;
  published: boolean;
}

type ParseResult = { ok: true; value: PostInput } | { ok: false; error: string };
type AdminResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export function isValidId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export function parsePostInput(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid request body." };
  const raw = body as Record<string, unknown>;
  const text = (key: string) => (typeof raw[key] === "string" ? (raw[key] as string).trim() : "");

  const title = text("title");
  const slug = text("slug");
  const summary = text("summary");
  const thumbnail = text("thumbnail");
  const content = typeof raw.content === "string" ? raw.content : "";

  if (!title || title.length > 200) return { ok: false, error: "Title is required (max 200 characters)." };
  if (!SLUG_PATTERN.test(slug) || slug.length > 100) {
    return { ok: false, error: "Slug may only contain lowercase letters, numbers and hyphens." };
  }
  if (!summary || summary.length > 500) return { ok: false, error: "Summary is required (max 500 characters)." };
  if (!content.trim() || content.length > 200_000) return { ok: false, error: "Content is required." };
  if (thumbnail && !/^https?:\/\/\S+$/i.test(thumbnail)) {
    return { ok: false, error: "Thumbnail must be an http(s) URL." };
  }

  return {
    ok: true,
    value: { title, slug, summary, thumbnail: thumbnail || null, content, published: raw.published !== false },
  };
}

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return {
    url: `${url}/rest/v1/blogs`,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  };
}

const NOT_CONFIGURED = { ok: false as const, status: 503, error: "Supabase is not configured." };

async function failure(res: Response): Promise<{ ok: false; status: number; error: string }> {
  if (res.status === 409) return { ok: false, status: 409, error: "A post with this slug already exists." };
  console.error("Supabase request failed:", res.status, await res.text().catch(() => ""));
  return { ok: false, status: 502, error: "The database request failed." };
}

/** True once `supabase/admin-panel.sql` has added the `published` column. */
async function supportsPublished(db: NonNullable<ReturnType<typeof supabase>>): Promise<boolean> {
  const res = await fetch(`${db.url}?select=published&limit=0`, { headers: db.headers, cache: "no-store" });
  return res.ok;
}

/** The `published` field is only sent when the column exists. */
function columns(input: PostInput, withPublished: boolean) {
  const { published, ...rest } = input;
  return withPublished ? { ...rest, published } : rest;
}

export async function adminListPosts(): Promise<AdminResult<{ posts: Post[]; supportsPublished: boolean }>> {
  const db = supabase();
  if (!db) return NOT_CONFIGURED;
  const res = await fetch(`${db.url}?select=*&order=created_at.desc`, { headers: db.headers, cache: "no-store" });
  if (!res.ok) return failure(res);
  return { ok: true, data: { posts: (await res.json()) as Post[], supportsPublished: await supportsPublished(db) } };
}

export async function adminCreatePost(input: PostInput): Promise<AdminResult<Post>> {
  const db = supabase();
  if (!db) return NOT_CONFIGURED;
  const res = await fetch(db.url, {
    method: "POST",
    headers: db.headers,
    body: JSON.stringify({
      ...columns(input, await supportsPublished(db)),
      created_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) return failure(res);
  const rows = (await res.json()) as Post[];
  return { ok: true, data: rows[0] as Post };
}

export async function adminUpdatePost(id: string, input: PostInput): Promise<AdminResult<Post>> {
  const db = supabase();
  if (!db) return NOT_CONFIGURED;
  const res = await fetch(`${db.url}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: db.headers,
    body: JSON.stringify({
      ...columns(input, await supportsPublished(db)),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) return failure(res);
  const rows = (await res.json()) as Post[];
  return rows[0] ? { ok: true, data: rows[0] } : { ok: false, status: 404, error: "Post not found." };
}

export async function adminDeletePost(id: string): Promise<AdminResult<Post>> {
  const db = supabase();
  if (!db) return NOT_CONFIGURED;
  const res = await fetch(`${db.url}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: db.headers,
  });
  if (!res.ok) return failure(res);
  const rows = (await res.json()) as Post[];
  return rows[0] ? { ok: true, data: rows[0] } : { ok: false, status: 404, error: "Post not found." };
}
