"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent, looping clip that behaves like an animated picture. Browsers only autoplay video that
 * is muted, and React does not always put the muted flag on server-rendered markup, so it is set here.
 *
 * The file is only requested once the clip is about to scroll into view, and it is paused again when it
 * leaves the screen. A page with many clips therefore downloads just the ones a visitor actually sees,
 * instead of every clip on every visit. `priority` clips (above the fold) start straight away.
 * The clip stays paused for visitors who asked their system to reduce motion.
 */
export default function SiteVideo({ src, className, priority = false }: { src: string; className?: string; priority?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(priority);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      if (!reduced) video.play().catch(() => undefined);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setNear(true);
          if (!reduced) video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      className={className}
      autoPlay={near}
      muted
      loop
      playsInline
      preload={near ? "auto" : "none"}
      aria-hidden="true"
    />
  );
}
