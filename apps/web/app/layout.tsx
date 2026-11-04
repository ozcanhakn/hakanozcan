import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import type { CSSProperties } from "react";

import { Providers } from "@/components/providers";
import "@workspace/ui/globals.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/content/site";
import { getSiteSettings } from "@/lib/settings";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

// Bold serif for article titles, bold grotesque for the logo and big headlines.
const fontDisplay = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
})

const fontHead = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-head-face",
})

export async function generateMetadata(): Promise<Metadata> {
  const { brand, hero } = await getSiteSettings();
  const title = hero.eyebrow ? `${brand.name} — ${hero.eyebrow}` : brand.name;
  return {
    title: { default: title, template: `%s — ${brand.name}` },
    description: siteConfig.description,
    openGraph: { type: "website", siteName: brand.name, title, description: siteConfig.description },
    twitter: { card: "summary_large_image", title, description: siteConfig.description },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{ "--site-accent": settings.brand.accent } as CSSProperties}
        className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} ${fontHead.variable} bg-[#f5f5f7] text-ink font-sans antialiased min-h-screen`}
      >
        <Providers>
          {/* Gray page with a white column in the middle, like Gates Notes. */}
          <div className="max-w-[1500px] mx-auto bg-white min-h-screen flex flex-col">
            <Navbar brand={settings.brand} nav={settings.nav} />
            <main className="flex-1">
              {children}
            </main>
            <Footer brand={settings.brand} footer={settings.footer} />
          </div>
        </Providers>
      </body>
    </html>
  )
}
