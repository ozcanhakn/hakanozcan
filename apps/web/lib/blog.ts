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
}

const LIST_COLUMNS = "id,title,slug,summary,thumbnail,created_at";

function anonRequest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}` } };
}

/**
 * Queries only published posts. If the `published` column has not been added yet
 * (see supabase/admin-panel.sql), PostgREST answers 400 and we retry without the filter.
 */
async function fetchPublished(request: NonNullable<ReturnType<typeof anonRequest>>, query: string): Promise<Response> {
  const init = { headers: request.headers, next: { revalidate: 60 } };
  const res = await fetch(`${request.url}/rest/v1/blogs?${query}&published=eq.true`, init);
  return res.status === 400 ? fetch(`${request.url}/rest/v1/blogs?${query}`, init) : res;
}

export async function getPosts(): Promise<Post[]> {
  const request = anonRequest();
  if (!request) return [];

  try {
    const res = await fetchPublished(request, `select=${LIST_COLUMNS}&order=created_at.desc`);
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
    const res = await fetchPublished(request, `slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return Array.isArray(data) && data.length > 0 ? (data[0] as Post) : null;
  } catch (error) {
    console.error("Could not load post:", error);
    return null;
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
