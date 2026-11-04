import SiteImage from "@/components/SiteImage";
import SmartLink from "@/components/SmartLink";
import type { SiteSettings } from "@/lib/settings";

export default function Tiles({ block }: { block: SiteSettings["blocks"]["tiles"] }) {
  if (block.items.length === 0) return null;

  return (
    <section id="expertise" className="scroll-mt-24 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="max-w-3xl mb-12">
          {block.eyebrow && (
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-brass mb-3">{block.eyebrow}</p>
          )}
          <h2 className="font-head text-4xl md:text-6xl font-extrabold leading-[1] tracking-tight text-ink">{block.title}</h2>
          {block.intro && <p className="mt-6 text-[18px] leading-[1.6] text-stone">{block.intro}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {block.items.map((tile, index) => {
            const card = (
              <>
                {tile.image ? (
                  <SiteImage
                    src={tile.image}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-navy to-ink" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {!tile.image && (
                    <p className="font-head text-sm font-bold text-white/60 mb-3">{String(index + 1).padStart(2, "0")}</p>
                  )}
                  <h3 className="font-head text-[24px] font-bold leading-[1.1] tracking-tight text-white">{tile.title}</h3>
                  {tile.body && <p className="mt-3 text-sm leading-relaxed text-white/80 line-clamp-4">{tile.body}</p>}
                </div>
              </>
            );
            const classes = "group relative block aspect-[3/4] overflow-hidden rounded-xl bg-ink";

            return tile.href ? (
              <SmartLink key={`${tile.title}-${index}`} href={tile.href} className={classes}>
                {card}
              </SmartLink>
            ) : (
              <div key={`${tile.title}-${index}`} className={classes}>
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
