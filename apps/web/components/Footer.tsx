"use client"

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Footer() {
    const [time, setTime] = useState<string>("")

    useEffect(() => {
        setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }))
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <footer className="relative w-full bg-black text-white py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 flex flex-col justify-between min-h-[600px]">

                {/* Top Section: CTA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div>
                        <p className="text-gray-400 text-xl mb-4">Bir projeniz mi var?</p>
                        <a href="mailto:ozcanhakn@gmail.com" className="group relative inline-block">
                            <h2 className="text-6xl md:text-9xl font-bold tracking-tighter hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 transition-all duration-500">
                                LET'S TALK
                            </h2>
                            <ArrowUpRight className="absolute -right-12 top-0 w-12 h-12 text-white opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 group-hover:translate-x-4 transition-all duration-500" />
                        </a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <SocialLink href="https://www.linkedin.com/in/ozcanhakan/" label="LinkedIn" />
                        <SocialLink href="https://github.com/ozcanhakn" label="GitHub" />
                        <SocialLink href="#" label="Twitter" />
                        <SocialLink href="#" label="Instagram" />
                    </div>
                </div>

                {/* Bottom Section: Copyright & Info */}
                <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-10 mt-20">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-bold">Hakan ÖZCAN</h3>
                        <p className="text-gray-500 text-sm">© 2025 Tüm hakları saklıdır.</p>
                    </div>

                    <div className="flex gap-8 mt-6 md:mt-0">
                        <p className="text-gray-500 text-sm">Ankara, Turkey</p>
                        <p className="text-gray-500 text-sm">Local Time: {time}</p>
                    </div>
                </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        </footer>
    )
}

function SocialLink({ href, label }: { href: string, label: string }) {
    return (
        <Link href={href} target="_blank" className="group flex items-center gap-3 text-xl text-gray-400 hover:text-white transition-colors">
            <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-blue-500 transition-colors" />
            {label}
        </Link>
    )
}