"use client";

import { useEffect, useRef } from "react";

/**
 * A silent, looping clip that behaves like an animated picture. Browsers only autoplay video that
 * is muted, and React does not always put the muted flag on server-rendered markup, so it is set here.
 * The clip is paused for visitors who asked their system to reduce motion.
 */
export default function SiteVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
