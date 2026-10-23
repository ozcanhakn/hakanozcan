import { siteConfig } from "@/content/site";

export interface MediumPost {
  title: string;
  href: string;
  date: string;
  summary: string;
  tags: string[];
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function readTag(item: string, name: string): string {
  const escaped = name.replace(":", "\\:");
  const match = item.match(
    new RegExp(`<${escaped}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${escaped}>`)
  );
  return (match?.[1] ?? match?.[2] ?? "").trim();
}

function summarize(html: string): string {
  const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((m) => stripTags(m[1] ?? ""))
    .filter((text) => text.length >= 40);
  const first = paragraphs[0] ?? "";
  if (first.length <= 220) return first;
  return `${first.slice(0, 220).replace(/\s+\S*$/, "")}…`;
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    const res = await fetch(`https://medium.com/feed/${siteConfig.mediumHandle}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PersonalSite/1.0)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    return items.flatMap((item): MediumPost[] => {
      const title = decodeEntities(readTag(item, "title"));
      const link = readTag(item, "link");
      const date = new Date(readTag(item, "pubDate"));
      if (!title || !link || Number.isNaN(date.getTime())) return [];

      const url = new URL(link);
      url.search = "";

      return [
        {
          title,
          href: url.toString(),
          date: date.toISOString(),
          summary: summarize(readTag(item, "content:encoded")),
          tags: [...item.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)]
            .map((m) => m[1] ?? "")
            .filter(Boolean),
        },
      ];
    });
  } catch (error) {
    console.error("Could not load Medium feed:", error);
    return [];
  }
}
