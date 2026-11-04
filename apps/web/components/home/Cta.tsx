import BackgroundMedia from "@/components/BackgroundMedia";
import SmartLink from "@/components/SmartLink";
import type { SiteSettings } from "@/lib/settings";

export default function Cta({ block }: { block: SiteSettings["blocks"]["cta"] }) {
  const hasMedia = block.media.length > 0;

  return (
    <section className="px-4 md:px-6 py-10 md:py-16">
      <div
        className={`relative isolate overflow-hidden max-w-6xl mx-auto rounded-2xl text-white px-6 md:px-14 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
          hasMedia ? "bg-ink" : "bg-navy"
        }`}
      >
        {hasMedia && (
          <>
            <BackgroundMedia sources={block.media} />
            {/* A light tint only, so the picture or video stays visible and the text stays readable. */}
            <div className="absolute inset-0 -z-10 bg-black/35" />
          </>
        )}
        <div className="lg:col-span-8">
          {block.eyebrow && (
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 mb-4">{block.eyebrow}</p>
          )}
          <h2 className="font-head text-4xl md:text-6xl font-extrabold leading-[1] tracking-tight">{block.heading}</h2>
          {block.body && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{block.body}</p>}
        </div>
        {block.buttonLabel && block.buttonHref && (
          <div className="lg:col-span-4 lg:text-right">
            <SmartLink
              href={block.buttonHref}
              className="inline-block rounded-lg bg-white text-ink px-8 py-4 text-sm font-bold hover:bg-ink hover:text-white transition-colors"
            >
              {block.buttonLabel}
            </SmartLink>
          </div>
        )}
      </div>
    </section>
  );
}
