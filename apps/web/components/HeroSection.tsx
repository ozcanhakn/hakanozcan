import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/content/site";
import type { SiteContent, SiteSections } from "@/lib/settings";

interface Props {
  content: SiteContent;
  sections: SiteSections;
}

export default function HeroSection({ content, sections }: Props) {
  const portrait = siteConfig.portrait;

  const quickLinks = [
    sections.work && { name: "Selected work", href: "/#work" },
    sections.expertise && { name: "Areas of expertise", href: "/#expertise" },
    { name: "Writing", href: "/blog" },
    { name: "GitHub", href: siteConfig.socials.github, external: true },
  ].filter((link): link is { name: string; href: string; external?: boolean } => Boolean(link));

  return (
    <>
      <section id="about" className="scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className={portrait ? "lg:col-span-7 order-2 lg:order-1" : "lg:col-span-9"}>
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-6">
              Intelligence Systems
            </p>
            <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1] tracking-[-0.01em] text-ink">
              {siteConfig.name}
            </h1>
            <p className="mt-3 font-display italic text-2xl md:text-3xl text-stone">{content.title}</p>

            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px] border-t border-line pt-6">
              <dt className="text-xs font-medium tracking-[0.18em] uppercase text-brass pt-1">Fields</dt>
              <dd className="text-ink">{content.descriptor.join(" · ")}</dd>
            </dl>

            <p className="mt-8 max-w-xl text-[17px] leading-[1.75] text-stone">{content.intro}</p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="bg-navy text-cream px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-navy-2 transition-colors"
              >
                View work
              </Link>
              <Link
                href="/contact"
                className="border border-navy text-navy px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-navy hover:text-cream transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>

          {portrait && (
            <figure className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative aspect-[4/5] bg-cream-deep border border-line overflow-hidden">
                <Image
                  src={portrait}
                  alt={siteConfig.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs leading-relaxed text-stone">{siteConfig.name}</figcaption>
            </figure>
          )}
        </div>
      </section>

      {sections.quickLinks && (
        <nav aria-label="Quick links" className="bg-navy-2 text-cream">
          <ul className="max-w-6xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap gap-x-8 gap-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="text-[13px] font-medium tracking-wide text-cream/90 underline underline-offset-[6px] decoration-cream/30 hover:decoration-brass-light hover:text-brass-light transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
