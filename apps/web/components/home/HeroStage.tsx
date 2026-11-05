"use client";

import { useState, type ReactNode } from "react";

import HeroBackground from "@/components/home/HeroBackground";
import SiteImage from "@/components/SiteImage";

interface Props {
  sources: string[];
  /** Backgrounds that play without the hero text on top. */
  textHidden: string[];
  /** The hero text and buttons. */
  children: ReactNode;
}

/**
 * The hero's background and its text. It knows which background is showing, so the text can fade away
 * while the backgrounds chosen in the admin play and fade back in on the others.
 */
export default function HeroStage({ sources, textHidden, children }: Props) {
  const [active, setActive] = useState(0);
  const current = sources[Math.min(active, sources.length - 1)];
  const hidden = current !== undefined && textHidden.includes(current);

  return (
    <>
      {sources.length > 0 && (
        <>
          {sources.length === 1 ? (
            <SiteImage src={sources[0]!} priority className="absolute inset-0 -z-20 h-full w-full object-cover" />
          ) : (
            <HeroBackground sources={sources} active={active} onActiveChange={setActive} />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </>
      )}

      <div className="max-w-6xl mx-auto px-6 lg:px-10 min-h-[78vh] md:min-h-[88vh] flex flex-col justify-end pb-14 md:pb-24 pt-36">
        {/* `inert` keeps the hidden buttons out of reach of the keyboard and screen readers. */}
        <div
          inert={hidden}
          aria-hidden={hidden || undefined}
          className={`transition-opacity duration-700 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
