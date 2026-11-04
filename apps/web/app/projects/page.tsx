import type { Metadata } from "next";

import FeaturedProject from "@/components/FeaturedProject";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Work" };

export default async function ProjectsPage() {
  const { projects } = await getSiteSettings();

  return (
    <section>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-brass mb-5">Work</p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1] text-ink mb-6">Work</h1>
          <p className="text-[17px] leading-[1.75] text-stone">
            Systems I have designed and built across intelligence, security and applied AI.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-stone border-t border-line pt-8">No projects to show yet.</p>
        ) : (
          projects.map((project) => <FeaturedProject key={project.id} project={project} />)
        )}
      </div>
    </section>
  );
}
