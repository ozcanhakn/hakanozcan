import HeroBackground from "@/components/home/HeroBackground";
import SiteImage from "@/components/SiteImage";

/**
 * A full-bleed background for a section (the section needs `relative isolate overflow-hidden`).
 * One picture or video is shown as it is; several play one after another with a cross-fade.
 */
export default function BackgroundMedia({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;
  if (sources.length === 1) {
    return <SiteImage src={sources[0]!} priority className="absolute inset-0 -z-20 h-full w-full object-cover" />;
  }
  return <HeroBackground sources={sources} />;
}
