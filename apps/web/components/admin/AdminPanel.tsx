"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import MediumTab from "@/components/admin/MediumTab";
import PostsTab from "@/components/admin/PostsTab";
import SectionsTab from "@/components/admin/SectionsTab";
import TextsTab from "@/components/admin/TextsTab";
import type { SiteSettings } from "@/lib/settings";

const tabs = [
  { id: "posts", label: "Posts" },
  { id: "medium", label: "Medium" },
  { id: "home", label: "Home page" },
  { id: "texts", label: "Texts" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("posts");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsSupported, setSettingsSupported] = useState(true);
  const [loadError, setLoadError] = useState("");

  const onUnauthorized = useCallback(() => router.refresh(), [router]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/settings");
      if (res.status === 401) return onUnauthorized();
      const data = (await res.json().catch(() => null)) as
        | { settings?: SiteSettings; supported?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.settings) {
        setLoadError(data?.error ?? "Could not load settings.");
        return;
      }
      setSettings(data.settings);
      setSettingsSupported(data.supported !== false);
    })();
  }, [onUnauthorized]);

  /** Saves the whole settings object. Resolves to an error message, or null on success. */
  const saveSettings = async (next: SiteSettings): Promise<string | null> => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (res.status === 401) {
        onUnauthorized();
        return "Your session has expired.";
      }
      const data = (await res.json().catch(() => null)) as { settings?: SiteSettings; error?: string } | null;
      if (!res.ok || !data?.settings) return data?.error ?? "Could not save.";
      setSettings(data.settings);
      setSettingsSupported(true);
      return null;
    } catch {
      return "Could not reach the server.";
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-brass mb-3">Admin</p>
            <h1 className="font-display text-5xl leading-[1] text-ink">Site manager</h1>
          </div>
          <button onClick={signOut} className="text-sm text-stone hover:text-navy underline underline-offset-4">
            Sign out
          </button>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line mb-10" aria-label="Admin sections">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
              className={`text-sm font-medium pb-3 -mb-px border-b-2 transition-colors ${
                tab === item.id ? "text-navy border-navy" : "text-stone border-transparent hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {tab === "posts" && <PostsTab onUnauthorized={onUnauthorized} />}

        {tab !== "posts" && (
          <>
            {loadError && <p className="text-sm text-red-800 mb-6">{loadError}</p>}
            {!settingsSupported && (
              <p className="max-w-3xl border border-brass/50 bg-cream-deep px-4 py-3 text-sm text-ink mb-8">
                These settings cannot be saved yet. Run <code className="font-mono">supabase/admin-panel.sql</code> once in the Supabase SQL Editor, then reload this page.
              </p>
            )}
            {!settings && !loadError && <p className="text-sm text-stone">Loading...</p>}
            {settings && tab === "medium" && <MediumTab settings={settings} onSave={saveSettings} onUnauthorized={onUnauthorized} />}
            {settings && tab === "home" && <SectionsTab settings={settings} onSave={saveSettings} />}
            {settings && tab === "texts" && <TextsTab settings={settings} onSave={saveSettings} />}
          </>
        )}
      </div>
    </section>
  );
}
