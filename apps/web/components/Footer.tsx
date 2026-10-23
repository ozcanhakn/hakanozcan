import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { siteConfig } from "@/content/site"

const columnLink = "inline-flex items-center gap-1 text-cream/70 hover:text-brass-light transition-colors"

export default function Footer() {
    return (
        <footer className="bg-navy text-cream">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/15">
                    <div className="lg:col-span-7">
                        <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass-light mb-5">Contact</p>
                        <h2 className="font-display text-4xl md:text-6xl leading-[1.04] mb-8 max-w-2xl">
                            Let&apos;s work on something that matters.
                        </h2>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-cream text-navy px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-brass-light transition-colors"
                        >
                            Get in touch
                            <ArrowUpRight size={15} strokeWidth={1.75} />
                        </Link>
                    </div>

                    <nav className="lg:col-span-2" aria-label="Footer">
                        <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass-light mb-5">Explore</p>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/#about" className={columnLink}>About</Link></li>
                            <li><Link href="/projects" className={columnLink}>Work</Link></li>
                            <li><Link href="/blog" className={columnLink}>Writing</Link></li>
                            <li><Link href="/contact" className={columnLink}>Contact</Link></li>
                        </ul>
                    </nav>

                    <div className="lg:col-span-3">
                        <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass-light mb-5">Elsewhere</p>
                        <ul className="space-y-3 text-sm">
                            <li><a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className={columnLink}>LinkedIn <ArrowUpRight size={12} /></a></li>
                            <li><a href={siteConfig.socials.github} target="_blank" rel="noreferrer" className={columnLink}>GitHub <ArrowUpRight size={12} /></a></li>
                            <li><a href={siteConfig.socials.twitter} target="_blank" rel="noreferrer" className={columnLink}>X <ArrowUpRight size={12} /></a></li>
                            <li><a href={siteConfig.socials.medium} target="_blank" rel="noreferrer" className={columnLink}>Medium <ArrowUpRight size={12} /></a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs tracking-wide text-cream/50">
                    <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
                    <a href={siteConfig.socials.email} className="hover:text-cream transition-colors">ozcanhakn@gmail.com</a>
                </div>
            </div>
        </footer>
    )
}
