"use client";

import { useState } from "react";

import { primaryButton, type Status } from "@/components/admin/ui";
import type { SiteSections, SiteSettings } from "@/lib/settings";

const options: { key: keyof SiteSections; label: string; hint: string }[] = [
  { key: "quickLinks", label: "Quick links bar", hint: "The navy strip of shortcuts under the top of the home page." },
  { key: "statement", label: "Quote", hint: "The large italic quote between the introduction and expertise." },
  { key: "expertise", label: "Areas of expertise", hint: "The numbered cards describing what you work on." },
  { key: "work", label: "Selected work", hint: "The featured project (The Architect) on the home page." },
];

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
}

export default function SectionsTab({ settings, onSave }: Props) {
  const [sections, setSections] = useState<SiteSections>(settings.sections);
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    const error = await onSave({ ...settings, sections });
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved. The home page updates within a minute." });
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <p className="text-[15px] leading-relaxed text-stone mb-8">
        Choose which sections appear on the home page. The introduction at the top, the menu and the footer are always shown.
      </p>

      <ul className="border-b border-line mb-8">
        {options.map((option) => (
          <li key={option.key} className="border-t border-line">
            <label className="flex items-start gap-4 py-5 cursor-pointer">
              <input
                type="checkbox"
                checked={sections[option.key]}
                onChange={(e) => setSections((current) => ({ ...current, [option.key]: e.target.checked }))}
                className="mt-1.5 h-4 w-4 accent-navy"
              />
              <span>
                <span className="block font-display text-xl text-ink">{option.label}</span>
                <span className="block text-sm text-stone mt-1">{option.hint}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      {status && (
        <p role="status" className={`text-sm mb-4 ${status.kind === "ok" ? "text-navy" : "text-red-800"}`}>
          {status.text}
        </p>
      )}
      <button onClick={save} disabled={isSaving} className={primaryButton}>
        {isSaving ? "Saving..." : "Save sections"}
      </button>
    </div>
  );
}
