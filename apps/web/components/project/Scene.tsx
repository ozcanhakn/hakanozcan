"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import RevealText from "@/components/project/RevealText";
import SiteImage from "@/components/SiteImage";
import type { ProjectScene, SceneShape } from "@/lib/settings";

// The cut-outs the scene videos are shown through (the same kind of shapes Palantir uses on its Gotham page).
const CLIPS: Record<SceneShape, string> = {
  rect: "inset(0 round 10px)",
  diagonal: "polygon(42% 0%, 82% 0%, 58% 100%, 19% 100%)",
  chevron: "polygon(100% 30%, 100% 50%, 50% 70%, 0% 50%, 0% 30%, 50% 50%)",
  reverse: "polygon(25% 0%, 45% 0%, 75% 100%, 55% 100%)",
};

/** One big scroll scene: a heading with a shaped picture or video that drifts slightly as you scroll. */
export default function Scene({ scene, id }: { scene: ProjectScene; id: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <section id={id} ref={ref} className="relative px-5 md:px-10 pt-24 md:pt-32 pb-28 md:pb-40 text-center scroll-mt-4">
      {scene.title && (
        <RevealText
          text={scene.title}
          className="mx-auto max-w-5xl font-head text-[clamp(2.2rem,5.6vw,5.2rem)] font-light leading-[1.04] tracking-[-0.025em] text-white"
        />
      )}
      {scene.label && <p className="mt-8 text-sm md:text-[15px] leading-relaxed text-white/60 max-w-xl mx-auto">{scene.label}</p>}

      {scene.media && (
        <motion.div
          style={{ clipPath: CLIPS[scene.shape], y: reduced ? 0 : y }}
          className="mx-auto mt-14 md:mt-20 aspect-video w-full max-w-[1500px] overflow-hidden bg-[#161a1e]"
        >
          <SiteImage src={scene.media} alt={scene.title} className="h-full w-full object-cover" />
        </motion.div>
      )}
    </section>
  );
}
