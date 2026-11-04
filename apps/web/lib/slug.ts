const TURKISH: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

/** "Gödel, Escher, Bach" -> "godel-escher-bach". Used for page addresses. */
export function slugify(value: string, fallback = "item"): string {
  return (
    value
      .toLowerCase()
      .replace(/[çğıöşü]/g, (c) => TURKISH[c] ?? c)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || fallback
  );
}

/** Adds -2, -3… until the address is not in `taken`. */
export function uniqueId(base: string, taken: Set<string>): string {
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  return id;
}
