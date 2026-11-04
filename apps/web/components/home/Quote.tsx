import type { SiteSettings } from "@/lib/settings";

export default function Quote({ block }: { block: SiteSettings["blocks"]["quote"] }) {
  return (
    <section className="border-b border-line">
      <figure className="max-w-4xl mx-auto px-6 lg:px-10 py-20 md:py-28 text-center">
        <blockquote className="font-display italic text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.18] text-ink">
          &ldquo;{block.text}&rdquo;
        </blockquote>
        {block.author && (
          <figcaption className="mt-8 text-xs font-semibold tracking-[0.22em] uppercase text-brass">
            {block.author}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
