"use client";

import { useEffect, useState } from "react";

/**
 * The A B C D index on the left edge: it shows while the scenes are on screen and highlights the one in view.
 * Clicking a letter scrolls to that scene.
 */
export default function LetterMenu({ ids, areaId }: { ids: string[]; areaId: string }) {
  const [active, setActive] = useState(ids[0] ?? "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const area = document.getElementById(areaId);
    const scenes = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!area || scenes.length === 0) return;

    const areaObserver = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0 });
    areaObserver.observe(area);

    // A scene counts as current while it crosses the middle of the screen.
    const sceneObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    scenes.forEach((el) => sceneObserver.observe(el));

    return () => {
      areaObserver.disconnect();
      sceneObserver.disconnect();
    };
  }, [ids, areaId]);

  if (ids.length < 2) return null;

  const go = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Scenes"
      className={`fixed left-5 xl:left-10 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1.5 lg:flex transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {ids.map((id, index) => {
        const on = id === active;
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={(event) => go(event, id)}
            aria-current={on ? "true" : undefined}
            className={`font-mono text-sm tracking-wider transition-colors ${on ? "text-white" : "text-white/30 hover:text-white/70"}`}
          >
            {on ? `[${String.fromCharCode(65 + index)}]` : String.fromCharCode(65 + index)}
          </a>
        );
      })}
    </nav>
  );
}
