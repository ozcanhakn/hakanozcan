import FocusSection from "@/components/FocusSection";
import HeroSection from "@/components/HeroSection";
import Projects from "@/components/ProjectsSection";
import StatementSection from "@/components/StatementSection";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

export default async function Page() {
  const { sections, content } = await getSiteSettings();

  return (
    <div>
      <HeroSection content={content} sections={sections} />
      {sections.statement && <StatementSection content={content} />}
      {sections.expertise && <FocusSection content={content} />}
      {sections.work && <Projects />}
    </div>
  );
}
