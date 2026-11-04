import { ArrowUpRight } from "lucide-react";

import SiteImage from "@/components/SiteImage";
import SmartLink from "@/components/SmartLink";

interface Props {
  href: string;
  kicker?: string;
  title: string;
  summary?: string;
  image?: string | null;
  meta?: string;
  external?: boolean;
  /** Text shown on the colored block when there is no image. */
  placeholder?: string;
  /** "feature": image on top. "row": text on the left, image on the right. */
  layout?: "feature" | "row";
  large?: boolean;
}

function Media({ image, placeholder, title, ratio }: { image?: string | null; placeholder?: string; title: string; ratio: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-ink ${ratio}`}>
      {image ? (
        <SiteImage
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-end bg-gradient-to-br from-navy to-ink p-5">
          <span className="font-display text-xl leading-tight text-white/90 line-clamp-4">{placeholder ?? title}</span>
        </div>
      )}
    </div>
  );
}

/** A Gates Notes style article: small label, bold serif headline, gray summary, rounded photo. */
export default function ArticleCard({
  href,
  kicker,
  title,
  summary,
  image,
  meta,
  external,
  placeholder,
  layout = "feature",
  large = false,
}: Props) {
  const text = (
    <div className="min-w-0">
      {kicker && (
        <p className="flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] uppercase text-ink">
          {kicker}
          {external && <ArrowUpRight size={12} strokeWidth={2.5} />}
        </p>
      )}
      <h3
        className={`mt-2.5 font-display leading-[1.1] text-ink group-hover:text-navy transition-colors ${
          large ? "text-[34px] md:text-[44px]" : "text-[24px] md:text-[28px]"
        }`}
      >
        {title}
      </h3>
      {summary && <p className="mt-3 text-[16px] leading-[1.55] text-stone line-clamp-3">{summary}</p>}
      {meta && <p className="mt-3 text-sm text-stone">{meta}</p>}
    </div>
  );

  if (layout === "row") {
    return (
      <SmartLink href={href} className="group grid grid-cols-1 sm:grid-cols-[1fr_minmax(0,38%)] gap-6 items-center py-8 border-t border-ink/20">
        {text}
        <Media image={image} placeholder={placeholder} title={title} ratio="aspect-[4/3] order-first sm:order-none" />
      </SmartLink>
    );
  }

  return (
    <SmartLink href={href} className="group flex flex-col gap-6">
      <Media image={image} placeholder={placeholder} title={title} ratio={large ? "aspect-[16/10]" : "aspect-[4/3]"} />
      {text}
    </SmartLink>
  );
}
