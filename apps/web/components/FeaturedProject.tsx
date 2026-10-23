import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content/projects";

export default function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-12 md:py-16 border-t border-line first:border-t-0 first:pt-0">
      <div className="lg:col-span-6">
        <div className="relative aspect-[16/10] bg-navy border border-line overflow-hidden">
          {project.image && (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-top"
            />
          )}
        </div>
      </div>

      <div className="lg:col-span-6 flex flex-col justify-center">
        <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-4">
          {[project.type, project.status].filter(Boolean).join("  ·  ")}
        </p>
        <h3 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink mb-6">{project.title}</h3>
        <p className="font-display text-[22px] md:text-2xl leading-[1.35] text-ink mb-6">{project.summary}</p>
        <p className="text-xs tracking-wide text-stone mb-8">{project.tags.join("  ·  ")}</p>
        {project.href && (
          <Link
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start text-sm font-medium text-navy underline underline-offset-[6px] decoration-navy/30 hover:decoration-navy transition-colors"
          >
            View project
            <ArrowRight size={14} strokeWidth={1.75} />
          </Link>
        )}
      </div>
    </article>
  );
}
