import type { SiteContent } from "@/lib/settings";

export default function FocusSection({ content }: { content: SiteContent }) {
  return (
    <section id="expertise" className="border-b border-line scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-5">Expertise</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink mb-6">
            Areas of expertise
          </h2>
          <p className="text-[17px] leading-[1.75] text-stone">{content.approach}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-ink">
          {content.focusAreas.map((area, index) => (
            <article
              key={`${area.title}-${index}`}
              className={`py-8 lg:py-10 lg:px-8 border-b border-line lg:border-b-0 ${
                index > 0 ? "lg:border-l lg:border-line" : "lg:pl-0"
              }`}
            >
              <p className="font-display text-lg text-brass mb-4">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="font-display text-[26px] leading-[1.15] text-ink mb-4">{area.title}</h3>
              <p className="text-[15px] leading-[1.7] text-stone">{area.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
