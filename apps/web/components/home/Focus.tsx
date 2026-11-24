import SmartLink from "@/components/SmartLink";
import { formatDate, type Post } from "@/lib/blog";
import type { SiteSettings } from "@/lib/settings";

// Full class names so Tailwind can see them. Phones always get one column.
const GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

/** How many of the newest posts each column lists; the column's own link leads to the rest. */
const POSTS_PER_COLUMN = 3;

/**
 * Text-led columns for research, interests and the kind of collaboration being sought.
 * `posts` are the published posts filed under a column (matched by the column's id).
 */
export default function Focus({ block, posts }: { block: SiteSettings["blocks"]["focus"]; posts: Post[] }) {
  const items = block.items;
  if (items.length === 0) return null;

  return (
    <section id="focus" className="scroll-mt-24 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="max-w-3xl mb-12">
          {block.eyebrow && (
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-brass mb-3">{block.eyebrow}</p>
          )}
          <h2 className="font-head text-4xl md:text-6xl font-extrabold leading-[1] tracking-tight text-ink">{block.title}</h2>
          {block.intro && <p className="mt-6 text-[18px] leading-[1.6] text-stone">{block.intro}</p>}
        </div>

        <div className={`grid ${GRID[Math.min(6, items.length)]} gap-x-10 gap-y-12`}>
          {items.map((item, index) => {
            const latest = posts.filter((post) => post.area === item.id).slice(0, POSTS_PER_COLUMN);
            return (
            <article key={`${item.id}-${index}`} id={item.id} className="scroll-mt-24 border-t-2 border-ink pt-6 flex flex-col">
              <p className="font-head text-sm font-bold text-brass mb-4">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="font-head text-[26px] font-bold leading-[1.1] tracking-tight text-ink">{item.title}</h3>
              {item.body && <p className="mt-4 text-[17px] leading-[1.6] text-stone">{item.body}</p>}

              {item.tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-line px-3 py-1 text-[13px] font-semibold text-ink">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {latest.length > 0 && (
                <ul className="mt-6 border-t border-line">
                  {latest.map((post) => (
                    <li key={post.id} className="border-b border-line">
                      <SmartLink href={`/blog/${post.slug}`} className="group block py-3">
                        <span className="block text-[16px] font-bold leading-snug text-ink group-hover:text-brass transition-colors">
                          {post.title}
                        </span>
                        <span className="block mt-1 text-[13px] text-stone">{formatDate(post.created_at)}</span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              )}

              {item.href && item.linkLabel && (
                <SmartLink
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-ink underline underline-offset-4 hover:text-brass"
                >
                  {item.linkLabel}
                  <span aria-hidden="true">→</span>
                </SmartLink>
              )}
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
