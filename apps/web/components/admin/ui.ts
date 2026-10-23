export const fieldClass =
  "w-full bg-transparent border-b border-ink/30 focus:border-navy py-2.5 text-[17px] text-ink outline-none transition-colors";
export const areaClass =
  "w-full border border-line bg-white/50 p-3 text-[16px] leading-relaxed text-ink outline-none focus:border-navy transition-colors";
export const labelClass = "block text-xs tracking-[0.2em] uppercase text-stone mb-1";
export const primaryButton =
  "bg-navy text-cream px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-navy-2 disabled:opacity-50 transition-colors";

export type Status = { kind: "ok" | "error"; text: string } | null;
