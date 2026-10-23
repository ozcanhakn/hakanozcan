import { siteConfig } from "@/content/site";
import type { SiteContent } from "@/lib/settings";

export default function StatementSection({ content }: { content: SiteContent }) {
  return (
    <section className="border-b border-line">
      <figure className="max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-28 text-center">
        <blockquote className="font-display italic text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.18] text-ink">
          &ldquo;{[content.statement, content.statementBody].filter(Boolean).join(" ")}&rdquo;
        </blockquote>
        <figcaption className="mt-8 text-xs font-medium tracking-[0.22em] uppercase text-brass">
          {siteConfig.name}
        </figcaption>
      </figure>
    </section>
  );
}
