import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import DetailHero from "@/components/project/DetailHero";
import FeatureRow from "@/components/project/FeatureRow";
import LetterMenu from "@/components/project/LetterMenu";
import RevealText from "@/components/project/RevealText";
import Scene from "@/components/project/Scene";
import SmartLink from "@/components/SmartLink";
import type { Project } from "@/lib/settings";

/** A project's own page, built from what is entered in the admin: opening screen, intro, scenes, feature rows, closing band. */
export default function ProjectView({ project }: { project: Project }) {
  const { detail } = project;
  const heroMedia = detail.heroMedia || project.image;
  const kicker = [project.type, project.status].filter(Boolean).join("  ·  ");
  const sceneIds = detail.scenes.map((_, index) => `scene-${String.fromCharCode(97 + index)}`);

  return (
    <div className="bg-[#0c0f12]">
      <DetailHero title={project.title} media={heroMedia} kicker={kicker} />

      {/* Everything below slides up over the sticky opening screen. */}
      <div className="relative z-10 bg-[#0c0f12] text-white">
        <section className="px-5 md:px-10 pt-24 md:pt-36 pb-10 text-center">
          {project.tags.length > 0 && (
            <p className="mb-8 text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-white/45">{project.tags.join("  ·  ")}</p>
          )}
          <RevealText
            text={detail.introTitle || project.summary || project.title}
            className="mx-auto max-w-5xl font-head text-[clamp(2.4rem,6.4vw,6rem)] font-light leading-[1.02] tracking-[-0.03em]"
          />
          {detail.introSubtitle && (
            <p className="mx-auto mt-10 max-w-xl text-sm md:text-[15px] leading-relaxed text-white/60">{detail.introSubtitle}</p>
          )}
          {project.href && (
            <SmartLink
              href={project.href}
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white hover:text-[#0c0f12] transition-colors"
            >
              Visit project
              <ArrowUpRight size={15} />
            </SmartLink>
          )}
        </section>

        {detail.scenes.length > 0 && (
          <div id="scenes">
            <LetterMenu ids={sceneIds} areaId="scenes" />
            {detail.scenes.map((scene, index) => (
              <Scene key={index} id={sceneIds[index]!} scene={scene} />
            ))}
          </div>
        )}

        {detail.features.length > 0 && (
          <section className="bg-white text-[#0e1114]">
            <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
              {detail.features.map((feature, index) => (
                <FeatureRow key={index} feature={feature} />
              ))}
            </div>
          </section>
        )}

        <section className="px-5 md:px-10 py-24 md:py-36 text-center">
          {detail.ctaText && (
            <RevealText
              text={detail.ctaText}
              className="mx-auto max-w-4xl font-head text-[clamp(2rem,5vw,4.4rem)] font-light leading-[1.08] tracking-[-0.025em] text-white/90"
            />
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {detail.ctaLabel && detail.ctaHref && (
              <SmartLink href={detail.ctaHref} className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#0c0f12] hover:bg-white/85 transition-colors">
                {detail.ctaLabel}
              </SmartLink>
            )}
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold hover:bg-white hover:text-[#0c0f12] transition-colors"
            >
              <ArrowLeft size={15} />
              All projects
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
