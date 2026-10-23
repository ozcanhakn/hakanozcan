import type { Metadata } from "next";

import FeaturedProject from "@/components/FeaturedProject";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Work" };

export default function ProjectsPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-5">Work</p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1] text-ink mb-6">Work</h1>
          <p className="text-[17px] leading-[1.75] text-stone">
            Systems I have designed and built across intelligence, security and applied AI.
          </p>
        </div>

        {projects.map((project) => (
          <FeaturedProject key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
