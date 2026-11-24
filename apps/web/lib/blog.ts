export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string | null;
  content?: string;
  created_at: string;
  updated_at?: string | null;
  published?: boolean;
  /** Id of the home page focus area this post belongs to (e.g. "research"). Needs the `area` column. */
  area?: string | null;
  /** Where the same text was published elsewhere, shown under the post. Needs the `source_url` column. */
  source_url?: string | null;
}

const LIST_COLUMNS = "id,title,slug,summary,thumbnail,created_at";
/** Columns added by supabase/admin-panel.sql. Asked for on top of the others, and dropped again if they do not exist yet. */
const AREA_COLUMNS = "area,source_url";

function anonRequest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}` } };
}

/**
 * Queries only published posts. Columns that supabase/admin-panel.sql adds (`published`, `area`, `source_url`)
 * may not exist yet, in which case PostgREST answers 400, so the request is retried with less:
 * first without the extra columns, then also without the `published` filter.
 */
async function fetchPublished(
  request: NonNullable<ReturnType<typeof anonRequest>>,
  select: string,
  rest: string,
  extraColumns = "",
): Promise<Response> {
  const init = { headers: request.headers, next: { revalidate: 60 } };
  const attempts: { extra: string; onlyPublished: boolean }[] = [
    ...(extraColumns ? [{ extra: extraColumns, onlyPublished: true }] : []),
    { extra: "", onlyPublished: true },
    { extra: "", onlyPublished: false },
  ];

  let res!: Response;
  for (const { extra, onlyPublished } of attempts) {
    const columns = extra ? `${select},${extra}` : select;
    res = await fetch(`${request.url}/rest/v1/blogs?select=${columns}&${rest}${onlyPublished ? "&published=eq.true" : ""}`, init);
    if (res.status !== 400) break;
  }
  return res;
}

export async function getPosts(): Promise<Post[]> {
  const request = anonRequest();
  if (!request) return [];

  try {
    const res = await fetchPublished(request, LIST_COLUMNS, "order=created_at.desc", AREA_COLUMNS);
    if (!res.ok) {
      console.error("Could not load posts:", res.status, await res.text().catch(() => ""));
      return [];
    }
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as Post[]) : [];
  } catch (error) {
    console.error("Could not load posts:", error);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  const request = anonRequest();
  if (!request) return null;

  try {
    const res = await fetchPublished(request, "*", `slug=eq.${encodeURIComponent(slug)}&limit=1`);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return Array.isArray(data) && data.length > 0 ? (data[0] as Post) : null;
  } catch (error) {
    console.error("Could not load post:", error);
    return null;
  }
}

/** Titles are compared without case, spaces or punctuation, to spot the same article on Medium and on the site. */
export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

/** "https://www.medium.com/x" becomes "medium.com", for link text like “Also published on medium.com”. */
export function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
