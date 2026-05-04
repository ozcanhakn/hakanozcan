"use client"

import { motion } from "framer-motion"
import { Github, Instagram, Mail, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
    return (
        <section className="relative w-full min-h-[115vh] overflow-hidden flex flex-col items-center justify-end font-sans selection:bg-white/20 selection:text-white">
            <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-[0]"
            />
            
            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center px-4 md:px-8 pb-10">
                {/* Upper CTA Placeholder */}
                <div className="w-full max-w-4xl mx-auto text-center mb-20 md:mb-32 mt-32">
                    <h2 className="text-4xl md:text-7xl font-medium text-white mb-6 tracking-tight">
                        Bilinmeyeni keşfetmeye hazır mısınız?
                    </h2>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Benimle ilgili kanallardan iletişime geçebilirsiniz
                    </p>
                    <Link href="/contact" className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors inline-block">
                        Yolculuğa Başlayın
                    </Link>
                </div>

                <motion.footer
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="liquid-glass w-full rounded-3xl p-6 md:p-10 text-white/70"
                >
                    {/* Top Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">
                        <div className="md:col-span-5">
                            <div className="flex items-center gap-3 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                                    <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
                                </svg>
                                <span className="text-xl font-medium text-white">Münür Hakan ÖZCAN</span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-sm">
                                Beni daha çok tanımak için
                            </p>
                        </div>

                        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">Discover</h4>
                                <ul className="text-xs space-y-2 flex flex-col">
                                    <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">The Mission</h4>
                                <ul className="text-xs space-y-2 flex flex-col">
                                    <Link href="#" className="hover:text-white transition-colors">Origin Story</Link>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">Contact</h4>
                                <ul className="text-xs space-y-2 flex flex-col">
                                    <Link href="/contact" className="hover:text-white transition-colors">Get in Touch</Link>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                        <p className="text-[10px] uppercase tracking-widest opacity-50">
                            Created by ozcanhakn
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest opacity-50">Join the Journey:</span>
                            <div className="flex items-center gap-3">
                                <a href="https://github.com/ozcanhakn" target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 hover:text-white transition-colors">
                                    <Github size={16} />
                                </a>
                                <a href="https://twitter.com/ozcanhakn" target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 hover:text-white transition-colors">
                                    <Twitter size={16} />
                                </a>
                                <a href="https://instagram.com/ozcanhakn" target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 hover:text-white transition-colors">
                                    <Instagram size={16} />
                                </a>
                                <a href="https://medium.com/@ozcanhakn" target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 hover:text-white transition-colors flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h7.358l5.378 11.798 4.718-11.798h6.924v.403l-2.017 1.96c-.23.21-.355.518-.342.827v10.844c-.013.31.112.618.342.828l2.05 1.958v.404h-8.08v-.404l2.016-1.958c.23-.21.356-.518.343-.828v-9.358l-5.185 11.13h-.762l-6.13-11.13v8.326c-.053.464.103.926.42 1.258l2.79 3.237v.403h-7.66v-.403l2.79-3.237c.316-.332.473-.794.42-1.258v-8.52z"/>
                                    </svg>
                                </a>
                                <a href="mailto:ozcanhakn@gmail.com" className="opacity-70 hover:opacity-100 hover:text-white transition-colors">
                                    <Mail size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.footer>
            </div>
        </section>
    )
}