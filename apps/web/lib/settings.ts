import { siteConfig } from "@/content/site";

export interface SiteContent {
  title: string;
  intro: string;
  descriptor: string[];
  statement: string;
  statementBody: string;
  approach: string;
  focusAreas: { title: string; body: string }[];
}

export interface SiteSections {
  quickLinks: boolean;
  statement: boolean;
  expertise: boolean;
  work: boolean;
}

export interface SiteSettings {
  sections: SiteSections;
  hiddenMedium: string[];
  content: SiteContent;
}

export const SETTINGS_KEY = "site";

export const defaultSettings: SiteSettings = {
  sections: { quickLinks: true, statement: true, expertise: true, work: true },
  hiddenMedium: [],
  content: {
    title: siteConfig.title,
    intro: siteConfig.intro,
    descriptor: [...siteConfig.descriptor],
    statement: siteConfig.statement,
    statementBody: siteConfig.statementBody,
    approach: siteConfig.approach,
    focusAreas: siteConfig.focusAreas.map((area) => ({ ...area })),
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const str = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

/** Merges whatever is stored with the defaults, so a missing or partial row never breaks the site. */
export function mergeSettings(stored: unknown): SiteSettings {
  if (!isRecord(stored)) return defaultSettings;

  const sections = isRecord(stored.sections) ? stored.sections : {};
  const content = isRecord(stored.content) ? stored.content : {};
  const d = defaultSettings;

  const focusAreas = Array.isArray(content.focusAreas)
    ? content.focusAreas.flatMap((area) =>
        isRecord(area) && typeof area.title === "string" && typeof area.body === "string" && area.title.trim()
          ? [{ title: area.title, body: area.body }]
          : []
      )
    : [];

  const descriptor = Array.isArray(content.descriptor)
    ? content.descriptor.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return {
    sections: {
      quickLinks: sections.quickLinks !== false,
      statement: sections.statement !== false,
      expertise: sections.expertise !== false,
      work: sections.work !== false,
    },
    hiddenMedium: Array.isArray(stored.hiddenMedium)
      ? stored.hiddenMedium.filter((item): item is string => typeof item === "string")
      : [],
    content: {
      title: str(content.title, d.content.title),
      intro: str(content.intro, d.content.intro),
      descriptor: descriptor.length > 0 ? descriptor : d.content.descriptor,
      statement: str(content.statement, d.content.statement),
      statementBody: typeof content.statementBody === "string" ? content.statementBody : d.content.statementBody,
      approach: str(content.approach, d.content.approach),
      focusAreas: focusAreas.length > 0 ? focusAreas : d.content.focusAreas,
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaultSettings;

  try {
    const res = await fetch(
      `${url}/rest/v1/site_settings?key=eq.${SETTINGS_KEY}&select=value&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } }
    );
    if (!res.ok) return defaultSettings;
    const rows: unknown = await res.json();
    const value = Array.isArray(rows) && isRecord(rows[0]) ? rows[0].value : null;
    return mergeSettings(value);
  } catch (error) {
    console.error("Could not load site settings:", error);
    return defaultSettings;
  }
}
