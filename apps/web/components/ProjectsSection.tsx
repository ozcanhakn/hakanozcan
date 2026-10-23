import FeaturedProject from "@/components/FeaturedProject";
import { featuredProjects } from "@/content/projects";

export default function Projects() {
  return (
    <section id="work" className="scroll-mt-24 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="mb-14">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-5">Work</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink">Selected work</h2>
        </div>

        {featuredProjects.map((project) => (
          <FeaturedProject key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
