"use client";

import { useState } from "react";

import RevealText from "@/components/project/RevealText";
import SiteImage from "@/components/SiteImage";
import { isVideo } from "@/lib/media";
import type { ProjectFeature } from "@/lib/settings";

/** A feature row: the title on the left, the text on the right with a picture or video, and a VIDEO / DETAILS switch. */
export default function FeatureRow({ feature }: { feature: ProjectFeature }) {
  const hasMedia = Boolean(feature.media);
  const hasDetails = Boolean(feature.details);
  const [tab, setTab] = useState<"media" | "details">("media");
  const mediaLabel = isVideo(feature.media) ? "VIDEO" : "IMAGE";

  const paragraphs = (text: string) =>
    text
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part, i) => (
        <p key={i} className="text-[17px] md:text-lg leading-[1.6] text-[#4a5159]">
          {part}
        </p>
      ));

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-16 md:py-24 border-t border-[#e3e6e8] first:border-t-0">
      <div className="lg:col-span-5">
        {feature.title && (
          <RevealText
            text={feature.title}
            className="font-head text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[1.02] tracking-[-0.03em] text-[#0e1114]"
          />
        )}
      </div>

      <div className="lg:col-span-7 space-y-6 lg:max-w-[34rem]">
        {feature.body && <div className="space-y-5">{paragraphs(feature.body)}</div>}

        {hasMedia && hasDetails && (
          <div role="tablist" aria-label="Show" className="inline-flex rounded-full border border-[#cfd4d8] p-0.5 text-[11px] font-semibold tracking-[0.14em]">
            {(["media", "details"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`rounded-full px-4 py-1.5 transition-colors ${tab === key ? "bg-[#0e1114] text-white" : "text-[#4a5159] hover:text-[#0e1114]"}`}
              >
                {key === "media" ? mediaLabel : "DETAILS"}
              </button>
            ))}
          </div>
        )}

        {hasMedia && (!hasDetails || tab === "media") && (
          <div className="aspect-video overflow-hidden rounded-xl bg-[#0e1114] lg:w-[calc(100%+4rem)]">
            <SiteImage src={feature.media} alt={feature.title} className="h-full w-full object-cover" />
          </div>
        )}
        {hasDetails && (!hasMedia || tab === "details") && <div className="space-y-5">{paragraphs(feature.details)}</div>}
      </div>
    </article>
  );
}
