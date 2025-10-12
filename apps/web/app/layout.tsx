import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import "@workspace/ui/globals.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <html lang="tr" suppressHydrationWarning>
    <body
  className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-screen flex flex-col`}
>
  <Providers>
    <Navbar />
    <main className="flex-1 pt-20">
      {children}
    </main>
    <Footer />
  </Providers>
</body>

  </html>
)

}
