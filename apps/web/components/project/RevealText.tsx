"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";

interface Props {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  /** Rise one letter at a time (big titles) or one word at a time (longer lines). */
  by?: "letter" | "word";
  /** Start when the page loads instead of when the text scrolls into view. */
  onLoad?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Text that rises into place from behind a mask, staggered, like the headings on Palantir's Gotham page.
 * The whole text is kept as the accessible name; with reduced motion it is shown as it is.
 */
export default function RevealText({ text, className, style, as = "h2", by = "word", onLoad = false, delay = 0 }: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} style={{ whiteSpace: "pre-line", ...style }}>
        {text}
      </Plain>
    );
  }

  const container = {
    hidden: {},
    shown: { transition: { staggerChildren: by === "letter" ? 0.05 : 0.08, delayChildren: delay } },
  };
  const item = {
    hidden: { y: "115%", opacity: 0 },
    shown: { y: "0%", opacity: 1, transition: { duration: 0.95, ease: EASE } },
  };

  // Line breaks typed in the admin are kept: each line is its own group of words.
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim().split(/\s+/).filter(Boolean))
    .filter((words) => words.length > 0);

  return (
    <Tag
      aria-label={text}
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      {...(onLoad ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, amount: 0.6 } })}
    >
      {lines.map((words, l) => (
        <Fragment key={l}>
          {words.map((word, w) => (
            <Fragment key={w}>
              <span aria-hidden="true" className="inline-block whitespace-nowrap">
                {(by === "letter" ? Array.from(word) : [word]).map((piece, i) => (
                  // The padding keeps descenders (g, y, p) from being cut off by the mask.
                  <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
                    <motion.span className="inline-block" variants={item}>
                      {piece}
                    </motion.span>
                  </span>
                ))}
              </span>
              {/* The space sits between the word boxes, not inside one: trailing spaces inside an inline-block are
                  dropped, which glued the words together. Here it is a normal space, so a long title can also wrap. */}
              {w < words.length - 1 && " "}
            </Fragment>
          ))}
          {l < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </Tag>
  );
}
