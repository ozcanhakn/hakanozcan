"use client"

import Link from "next/link";

export default function Footer(){
    return (
    <footer className="bg-[#181818] text-[#D1D1D1] py-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Sol: Tel/Email */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <p>© 2025 Hakan ÖZCAN</p>
            <p>Email: ozcanhakn@gmail.com</p>
        </div>

        {/* Sağ: Sosyal / Linkler */}
        <div className="flex gap-6">
            <Link href="https://www.linkedin.com/in/ozcanhakan/" className="hover:text-white transition-colors duration-200">LinkedIn</Link>
            <Link href="https://github.com/ozcanhakn" className="hover:text-white transition-colors duration-200">GitHub</Link>
            <Link href="" className="hover:text-white transition-colors duration-200">Twitter</Link>
        </div>
        </div>
    </footer>
    )
}