import { normalizeTitle, getPosts } from "@/lib/blog";
import { getMediumPosts } from "@/lib/medium";
import type { SiteSettings } from "@/lib/settings";

export interface WritingEntry {
  key: string;
  title: string;
  summary: string;
  date: string;
  href: string;
  external: boolean;
  source: string;
  thumbnail: string | null;
}

/**
 * Everything shown as "writing": site posts plus the Medium articles that are not hidden.
 * A post that exists both on the site and on Medium is listed once, as the on-site version.
 */
export async function getWritingEntries(settings: SiteSettings): Promise<WritingEntry[]> {
  const [mediumAll, notes] = await Promise.all([getMediumPosts(), getPosts()]);

  const onSite = new Set(notes.map((post) => normalizeTitle(post.title)));
  const hidden = new Set(settings.hiddenMedium);
  const medium = mediumAll.filter((post) => !onSite.has(normalizeTitle(post.title)) && !hidden.has(post.href));

  return [
    ...notes.map((post) => ({
      key: `note-${post.id}`,
      title: post.title,
      summary: post.summary,
      date: post.created_at,
      href: `/blog/${post.slug}`,
      external: false,
      source: "Notes",
      thumbnail: post.thumbnail,
    })),
    ...medium.map((post) => ({
      key: post.href,
      title: post.title,
      summary: post.summary,
      date: post.date,
      href: post.href,
      external: true,
      source: "Medium",
      thumbnail: null,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
