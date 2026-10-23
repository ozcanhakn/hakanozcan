import { requireAdmin } from "@/lib/admin-auth";
import { normalizeTitle } from "@/lib/blog";
import { adminListPosts } from "@/lib/blog-admin";
import { getMediumPosts } from "@/lib/medium";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const [medium, own] = await Promise.all([getMediumPosts(), adminListPosts()]);

  // Is the same article also saved as a post on this site? That copy is what visitors see.
  const onSiteByTitle = new Map<string, "published" | "draft">();
  if (own.ok) {
    for (const post of own.data.posts) {
      onSiteByTitle.set(normalizeTitle(post.title), post.published === false ? "draft" : "published");
    }
  }

  return Response.json({
    posts: medium.map((post) => ({ ...post, onSite: onSiteByTitle.get(normalizeTitle(post.title)) ?? null })),
  });
}
