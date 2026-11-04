import FeaturedProject from "@/components/FeaturedProject";
import type { SiteSettings } from "@/lib/settings";

export default function ProjectBlock({
  block,
  projects,
}: {
  block: SiteSettings["blocks"]["project"];
  projects: SiteSettings["projects"];
}) {
  const featured = projects.filter((project) => project.featured);
  if (featured.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-20 border-b border-line">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="mb-12">
          {block.eyebrow && (
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-brass mb-4">{block.eyebrow}</p>
          )}
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink">{block.title}</h2>
        </div>

        {featured.map((project) => (
          <FeaturedProject key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
