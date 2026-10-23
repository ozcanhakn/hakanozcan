"use client";

import { useState } from "react";

import { areaClass, fieldClass, labelClass, primaryButton, type Status } from "@/components/admin/ui";
import { defaultSettings, type SiteContent, type SiteSettings } from "@/lib/settings";

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
}

export default function TextsTab({ settings, onSave }: Props) {
  const [content, setContent] = useState<SiteContent>(settings.content);
  const [descriptor, setDescriptor] = useState(settings.content.descriptor.join(", "));
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  const update = (patch: Partial<SiteContent>) => setContent((current) => ({ ...current, ...patch }));

  const updateArea = (index: number, patch: Partial<SiteContent["focusAreas"][number]>) =>
    update({ focusAreas: content.focusAreas.map((area, i) => (i === index ? { ...area, ...patch } : area)) });

  const save = async () => {
    setIsSaving(true);
    const next: SiteContent = {
      ...content,
      descriptor: descriptor.split(",").map((item) => item.trim()).filter(Boolean),
    };
    const error = await onSave({ ...settings, content: next });
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved. The site updates within a minute." });
    setIsSaving(false);
  };

  const restore = () => {
    setContent(defaultSettings.content);
    setDescriptor(defaultSettings.content.descriptor.join(", "));
    setStatus({ kind: "ok", text: "Defaults loaded. Press Save to apply them." });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <label htmlFor="t-title" className={labelClass}>Title under your name</label>
        <input id="t-title" maxLength={80} value={content.title} onChange={(e) => update({ title: e.target.value })} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="t-fields" className={labelClass}>Fields (separate with commas)</label>
        <input id="t-fields" value={descriptor} onChange={(e) => setDescriptor(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="t-intro" className={labelClass}>Introduction</label>
        <textarea id="t-intro" rows={4} maxLength={600} value={content.intro} onChange={(e) => update({ intro: e.target.value })} className={areaClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="t-statement" className={labelClass}>Quote (first sentence)</label>
          <textarea id="t-statement" rows={3} maxLength={200} value={content.statement} onChange={(e) => update({ statement: e.target.value })} className={areaClass} />
        </div>
        <div>
          <label htmlFor="t-body" className={labelClass}>Quote (continuation, optional)</label>
          <textarea id="t-body" rows={3} maxLength={300} value={content.statementBody} onChange={(e) => update({ statementBody: e.target.value })} className={areaClass} />
        </div>
      </div>

      <div>
        <label htmlFor="t-approach" className={labelClass}>Text above the expertise cards</label>
        <textarea id="t-approach" rows={4} maxLength={600} value={content.approach} onChange={(e) => update({ approach: e.target.value })} className={areaClass} />
      </div>

      <div>
        <p className={`${labelClass} mb-3`}>Expertise cards (1 to 6)</p>
        <div className="space-y-5">
          {content.focusAreas.map((area, index) => (
            <div key={index} className="border border-line bg-white/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-brass">{String(index + 1).padStart(2, "0")}</span>
                {content.focusAreas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => update({ focusAreas: content.focusAreas.filter((_, i) => i !== index) })}
                    className="text-xs text-red-800 underline underline-offset-4"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input aria-label={`Card ${index + 1} title`} maxLength={80} value={area.title} onChange={(e) => updateArea(index, { title: e.target.value })} className={fieldClass} />
              <textarea aria-label={`Card ${index + 1} text`} rows={3} maxLength={400} value={area.body} onChange={(e) => updateArea(index, { body: e.target.value })} className={areaClass} />
            </div>
          ))}
        </div>
        {content.focusAreas.length < 6 && (
          <button
            type="button"
            onClick={() => update({ focusAreas: [...content.focusAreas, { title: "", body: "" }] })}
            className="mt-4 text-sm text-navy underline underline-offset-4"
          >
            Add a card
          </button>
        )}
      </div>

      {status && (
        <p role="status" className={`text-sm ${status.kind === "ok" ? "text-navy" : "text-red-800"}`}>
          {status.text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6">
        <button onClick={save} disabled={isSaving} className={primaryButton}>
          {isSaving ? "Saving..." : "Save texts"}
        </button>
        <button type="button" onClick={restore} className="text-sm text-stone hover:text-navy underline underline-offset-4">
          Load default texts
        </button>
      </div>
    </div>
  );
}
