import { SETTINGS_KEY, defaultSettings, mergeSettings, type SiteSettings } from "@/lib/settings";

type Result<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function text(value: unknown, label: string, max: number, required = true): string | { error: string } {
  if (typeof value !== "string") return { error: `${label} is required.` };
  const trimmed = value.trim();
  if (required && !trimmed) return { error: `${label} is required.` };
  if (trimmed.length > max) return { error: `${label} is too long (max ${max} characters).` };
  return trimmed;
}

export function parseSettingsInput(body: unknown): { ok: true; value: SiteSettings } | { ok: false; error: string } {
  if (!isRecord(body) || !isRecord(body.content) || !isRecord(body.sections)) {
    return { ok: false, error: "Invalid request body." };
  }
  const c = body.content;
  const s = body.sections;

  const fields = {
    title: text(c.title, "Title", 80),
    intro: text(c.intro, "Introduction", 600),
    statement: text(c.statement, "Quote", 200),
    statementBody: text(c.statementBody, "Quote continuation", 300, false),
    approach: text(c.approach, "Expertise introduction", 600),
  };
  for (const value of Object.values(fields)) {
    if (typeof value !== "string") return { ok: false, error: value.error };
  }

  const descriptor = Array.isArray(c.descriptor) ? c.descriptor : [];
  if (descriptor.length === 0 || descriptor.length > 6 || descriptor.some((d) => typeof d !== "string" || !d.trim() || d.length > 40)) {
    return { ok: false, error: "Fields needs 1 to 6 short items." };
  }

  const areas = Array.isArray(c.focusAreas) ? c.focusAreas : [];
  if (areas.length === 0 || areas.length > 6) return { ok: false, error: "Expertise needs 1 to 6 cards." };
  const focusAreas: { title: string; body: string }[] = [];
  for (const area of areas) {
    if (!isRecord(area)) return { ok: false, error: "Invalid expertise card." };
    const title = text(area.title, "Card title", 80);
    const body = text(area.body, "Card text", 400);
    if (typeof title !== "string") return { ok: false, error: title.error };
    if (typeof body !== "string") return { ok: false, error: body.error };
    focusAreas.push({ title, body });
  }

  const hidden = Array.isArray(body.hiddenMedium) ? body.hiddenMedium : [];
  if (hidden.length > 200 || hidden.some((h) => typeof h !== "string" || !/^https:\/\/medium\.com\/\S+$/.test(h) || h.length > 400)) {
    return { ok: false, error: "Invalid hidden Medium list." };
  }

  return {
    ok: true,
    value: {
      sections: {
        quickLinks: s.quickLinks !== false,
        statement: s.statement !== false,
        expertise: s.expertise !== false,
        work: s.work !== false,
      },
      hiddenMedium: hidden as string[],
      content: {
        title: fields.title as string,
        intro: fields.intro as string,
        statement: fields.statement as string,
        statementBody: fields.statementBody as string,
        approach: fields.approach as string,
        descriptor: (descriptor as string[]).map((d) => d.trim()),
        focusAreas,
      },
    },
  };
}

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return {
    url: `${url}/rest/v1/site_settings`,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  };
}

export async function adminGetSettings(): Promise<Result<{ settings: SiteSettings; supported: boolean }>> {
  const client = db();
  if (!client) return { ok: false, status: 503, error: "Supabase is not configured." };

  const res = await fetch(`${client.url}?key=eq.${SETTINGS_KEY}&select=value&limit=1`, {
    headers: client.headers,
    cache: "no-store",
  });
  // The table does not exist until supabase/admin-panel.sql has been run.
  if (res.status === 404) return { ok: true, data: { settings: defaultSettings, supported: false } };
  if (!res.ok) {
    console.error("Settings read failed:", res.status, await res.text().catch(() => ""));
    return { ok: false, status: 502, error: "The database request failed." };
  }
  const rows: unknown = await res.json();
  const stored = Array.isArray(rows) && isRecord(rows[0]) ? rows[0].value : null;
  return { ok: true, data: { settings: mergeSettings(stored), supported: true } };
}

export async function adminSaveSettings(settings: SiteSettings): Promise<Result<SiteSettings>> {
  const client = db();
  if (!client) return { ok: false, status: 503, error: "Supabase is not configured." };

  const res = await fetch(`${client.url}?on_conflict=key`, {
    method: "POST",
    headers: { ...client.headers, Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ key: SETTINGS_KEY, value: settings, updated_at: new Date().toISOString() }),
  });
  if (res.status === 404) {
    return { ok: false, status: 409, error: "The site_settings table is missing. Run supabase/admin-panel.sql first." };
  }
  if (!res.ok) {
    console.error("Settings write failed:", res.status, await res.text().catch(() => ""));
    return { ok: false, status: 502, error: "The database request failed." };
  }
  return { ok: true, data: settings };
}
