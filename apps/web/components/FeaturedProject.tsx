import { ArrowRight, ArrowUpRight } from "lucide-react";

import SiteImage from "@/components/SiteImage";
import SmartLink from "@/components/SmartLink";
import { projectLink, type Project } from "@/lib/settings";

export default function FeaturedProject({ project }: { project: Project }) {
  const target = projectLink(project);

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-12 md:py-16 border-t border-line first:border-t-0 first:pt-0">
      <div className="lg:col-span-6">
        <div className="relative aspect-[16/10] bg-ink overflow-hidden">
          {project.image ? (
            <SiteImage src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy to-ink" />
          )}
        </div>
      </div>

      <div className="lg:col-span-6 flex flex-col justify-center">
        {(project.type || project.status) && (
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-brass mb-4">
            {[project.type, project.status].filter(Boolean).join("  ·  ")}
          </p>
        )}
        <h3 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink mb-6">{project.title}</h3>
        {project.summary && (
          <p className="font-display text-[22px] md:text-2xl leading-[1.35] text-ink mb-6">{project.summary}</p>
        )}
        {project.tags.length > 0 && <p className="text-xs tracking-wide text-stone mb-8">{project.tags.join("  ·  ")}</p>}
        {target && (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <SmartLink
              href={target}
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-navy underline underline-offset-[6px] decoration-navy/30 hover:decoration-navy transition-colors"
            >
              View project
              <ArrowRight size={14} strokeWidth={1.75} />
            </SmartLink>
            {/* A project with its own page can still point to the live site. */}
            {project.detail.enabled && project.href && (
              <SmartLink
                href={project.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone hover:text-ink transition-colors"
              >
                Visit site
                <ArrowUpRight size={14} strokeWidth={1.75} />
              </SmartLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
