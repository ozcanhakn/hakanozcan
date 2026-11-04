"use client";

import { useEffect, useRef, useState } from "react";

import SiteImage from "@/components/SiteImage";
import { isVideo } from "@/lib/media";

const PICTURE_SECONDS = 6;

/**
 * Several backgrounds shown one after another with a cross-fade: a video plays to its end,
 * a picture stays for a few seconds, then the next one fades in. After the last it starts over.
 * Only the visible clip plays; the others are paused so the page does not decode four videos at once.
 */
export default function HeroBackground({ sources }: { sources: string[] }) {
  const [active, setActive] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const next = () => setActive((index) => (index + 1) % sources.length);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((video, index) => {
      if (!video) return;
      video.muted = true;
      if (index === active && !reduced) {
        video.currentTime = 0;
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
    // A picture (or a visitor who prefers less motion) moves on by itself after a while.
    if (!isVideo(sources[active] ?? "") || reduced) {
      const timer = setTimeout(next, PICTURE_SECONDS * 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, sources]);

  return (
    <>
      {sources.map((src, index) => (
        <div
          key={`${src}-${index}`}
          aria-hidden="true"
          className={`absolute inset-0 -z-20 transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}
        >
          {isVideo(src) ? (
            <video
              ref={(element) => {
                videos.current[index] = element;
              }}
              src={src}
              muted
              playsInline
              preload={index === 0 || index === 1 ? "auto" : "metadata"}
              onEnded={index === active ? next : undefined}
              onError={index === active ? next : undefined}
              className="h-full w-full object-cover"
            />
          ) : (
            <SiteImage src={src} priority={index === 0} className="h-full w-full object-cover" />
          )}
        </div>
      ))}
    </>
  );
}
