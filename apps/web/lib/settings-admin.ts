import { SETTINGS_KEY, defaultSettings, mergeSettings, type SiteSettings } from "@/lib/settings";

type Result<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Settings are sanitized rather than rejected: texts are trimmed and capped, links and image
 * addresses that are not safe are dropped, and anything missing falls back to its default.
 */
export function parseSettingsInput(body: unknown): { ok: true; value: SiteSettings } | { ok: false; error: string } {
  if (!isRecord(body) || !isRecord(body.blocks) || !isRecord(body.hero)) {
    return { ok: false, error: "Invalid request body." };
  }

  const hidden = Array.isArray(body.hiddenMedium) ? body.hiddenMedium : [];
  if (hidden.length > 200 || hidden.some((h) => typeof h !== "string" || !/^https:\/\/medium\.com\/\S+$/.test(h) || h.length > 400)) {
    return { ok: false, error: "Invalid hidden Medium list." };
  }

  return { ok: true, value: mergeSettings(body) };
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
