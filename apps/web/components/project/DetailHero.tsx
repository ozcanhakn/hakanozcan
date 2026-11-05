import RevealText from "@/components/project/RevealText";
import SiteImage from "@/components/SiteImage";

/**
 * The opening screen of a project page: its name in huge letters over a picture or video.
 * It sticks to the top, so the rest of the page slides up over it like a curtain.
 */
export default function DetailHero({ title, media, kicker }: { title: string; media: string; kicker: string }) {
  // Long names get a smaller size so they stay on one line: about 0.55em per letter must fit in ~92vw.
  const size = Math.min(19, 165 / Math.max(title.length, 1));

  return (
    <section className="sticky top-0 z-0 h-[100svh] overflow-hidden bg-[#0c0f12] text-white">
      {media ? (
        <SiteImage src={media} priority className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--site-accent),transparent_62%)] opacity-70" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/45" />

      <div className="absolute inset-x-0 bottom-0 px-5 md:px-10 pb-10 md:pb-14">
        {kicker && <p className="mb-5 text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-white/70">{kicker}</p>}
        <RevealText
          as="h1"
          by="letter"
          onLoad
          delay={0.2}
          text={title}
          style={{ "--hs": `min(${size}vw, 15rem)` } as React.CSSProperties}
          className="hero-title font-head font-extrabold leading-[0.95] tracking-[-0.04em]"
        />
        {/* One line on wide screens; on phones the title may wrap, so it can be bigger. */}
        <style>{`.hero-title{font-size:max(var(--hs),12vw)}@media (min-width:768px){.hero-title{font-size:var(--hs)}}`}</style>
      </div>
      <div aria-hidden="true" className="absolute bottom-4 left-1/2 hidden md:block h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-white/60" />
    </section>
  );
}
