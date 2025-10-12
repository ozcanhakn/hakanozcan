"use client"

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-[#D1D1D1] py-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Sol: Tel / Email */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
          <p>© 2025 Hakan ÖZCAN</p>
          <p>Email: hakan@example.com</p>
          <p>Tel: +90 123 456 7890</p>
        </div>

        {/* Sağ: Sosyal / Linkler */}
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/hakan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/hakan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/hakan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}
