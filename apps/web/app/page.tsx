import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import HeroSection from "@/components/HeroSection";
import Projects from "@/components/ProjectsSection";
import Timeline from "@/components/Timeline";

export default function Page() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <Projects />
      <Timeline />
      <BlogSection />
    </div>
      
  )
}
