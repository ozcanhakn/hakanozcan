import HeroStage from "@/components/home/HeroStage";
import SmartLink from "@/components/SmartLink";
import type { SiteSettings } from "@/lib/settings";

export default function Hero({ hero }: { hero: SiteSettings["hero"] }) {
  // The main background first, then any further ones; they play one after another.
  const backgrounds = [hero.image, ...hero.moreMedia].filter(Boolean);

  return (
    <section id="about" className="relative isolate scroll-mt-20 bg-ink text-white overflow-hidden">
      {backgrounds.length === 0 && (
        <>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--site-accent),transparent_62%)] opacity-80" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,var(--site-accent),transparent_55%)] opacity-40" />
        </>
      )}

      <HeroStage sources={backgrounds} textHidden={hero.textHidden}>
        {hero.eyebrow && (
          <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/80 mb-5">{hero.eyebrow}</p>
        )}
        <h1 className="font-head text-[clamp(2.6rem,7.2vw,6.25rem)] font-extrabold leading-[0.98] tracking-[-0.025em] max-w-5xl">
          {hero.headline}
        </h1>
        {hero.subheadline && (
          <p className="mt-7 max-w-2xl text-[17px] md:text-xl leading-[1.55] text-white/85">{hero.subheadline}</p>
        )}

        {((hero.ctaLabel && hero.ctaHref) || (hero.secondaryLabel && hero.secondaryHref)) && (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {hero.ctaLabel && hero.ctaHref && (
              <SmartLink
                href={hero.ctaHref}
                className="rounded-lg bg-white text-ink px-7 py-3.5 text-sm font-bold hover:bg-white/85 transition-colors"
              >
                {hero.ctaLabel}
              </SmartLink>
            )}
            {hero.secondaryLabel && hero.secondaryHref && (
              <SmartLink
                href={hero.secondaryHref}
                className="rounded-lg border border-white/60 text-white px-7 py-3.5 text-sm font-bold hover:bg-white hover:text-ink transition-colors"
              >
                {hero.secondaryLabel}
              </SmartLink>
            )}
          </div>
        )}
      </HeroStage>
    </section>
  );
}
