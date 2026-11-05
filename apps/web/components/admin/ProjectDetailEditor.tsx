"use client";

import { ImageField, MoveButtons, TextField, Toggle, moveItem } from "@/components/admin/fields";
import { fieldClass, labelClass } from "@/components/admin/ui";
import { SCENE_SHAPES, type ProjectDetail, type ProjectFeature, type ProjectScene, type SceneShape } from "@/lib/settings";

interface Props {
  projectId: string;
  detail: ProjectDetail;
  onChange: (detail: ProjectDetail) => void;
}

const MAX_SCENES = 6;
const MAX_FEATURES = 6;

/** Everything on a project's own page: opening screen, scenes, feature rows and the closing band. */
export default function ProjectDetailEditor({ projectId, detail, onChange }: Props) {
  const patch = (next: Partial<ProjectDetail>) => onChange({ ...detail, ...next });
  const updateScene = (index: number, next: Partial<ProjectScene>) =>
    patch({ scenes: detail.scenes.map((scene, i) => (i === index ? { ...scene, ...next } : scene)) });
  const updateFeature = (index: number, next: Partial<ProjectFeature>) =>
    patch({ features: detail.features.map((feature, i) => (i === index ? { ...feature, ...next } : feature)) });

  return (
    <details className="border-t border-line pt-4" open={detail.enabled ? undefined : false}>
      <summary className="cursor-pointer text-sm font-semibold text-navy select-none">
        Detail page{detail.enabled ? " · on" : " · off"}
      </summary>

      <div className="mt-5 space-y-6">
        <Toggle label="Give this project its own page" checked={detail.enabled} onChange={(enabled) => patch({ enabled })} />
        <p className="text-xs text-stone -mt-3">
          The page lives at <code className="font-mono">/projects/{projectId}</code>. When it is on, the project cards open it (the project link stays as a “Visit site” link).
          Page address and title come from the project; save once to see it live.
        </p>

        <div className="space-y-4">
          <p className="text-xs tracking-[0.2em] uppercase text-stone">Opening screen</p>
          <ImageField label="Background (picture or video)" value={detail.heroMedia} onChange={(heroMedia) => patch({ heroMedia })} />
          <p className="text-xs text-stone -mt-2">The project name appears over it in huge letters. Empty uses the project image.</p>
          <TextField label="Intro headline" rows={2} value={detail.introTitle} max={200} hint="The big sentence under the opening screen. Empty uses the project description." onChange={(introTitle) => patch({ introTitle })} />
          <TextField label="Intro line (small)" value={detail.introSubtitle} max={300} onChange={(introSubtitle) => patch({ introSubtitle })} />
        </div>

        <div className="space-y-4">
          <p className="text-xs tracking-[0.2em] uppercase text-stone">Scenes · {detail.scenes.length} of {MAX_SCENES}</p>
          <p className="text-xs text-stone -mt-2">Each scene is a big heading with a picture or video shown through a shape. They get the letters A, B, C… in the side menu.</p>
          {detail.scenes.map((scene, index) => (
            <div key={index} className="border border-line bg-cream-deep/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-brass">{String.fromCharCode(65 + index)}</span>
                <span className="flex items-center gap-4">
                  <MoveButtons index={index} length={detail.scenes.length} onMove={(from, to) => patch({ scenes: moveItem(detail.scenes, from, to) })} />
                  <button type="button" onClick={() => patch({ scenes: detail.scenes.filter((_, i) => i !== index) })} className="text-xs text-red-800 underline underline-offset-4">
                    Remove
                  </button>
                </span>
              </div>
              <TextField label="Heading" rows={2} value={scene.title} max={160} onChange={(title) => updateScene(index, { title })} />
              <TextField label="Small text under the heading" value={scene.label} max={200} onChange={(label) => updateScene(index, { label })} />
              <ImageField label="Picture or video" value={scene.media} onChange={(media) => updateScene(index, { media })} />
              <label className="block">
                <span className={labelClass}>Shape</span>
                <select value={scene.shape} onChange={(e) => updateScene(index, { shape: e.target.value as SceneShape })} className={fieldClass}>
                  {SCENE_SHAPES.map((shape) => (
                    <option key={shape.value} value={shape.value}>{shape.label}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
          {detail.scenes.length < MAX_SCENES && (
            <button type="button" onClick={() => patch({ scenes: [...detail.scenes, { title: "", label: "", media: "", shape: "rect" }] })} className="text-sm text-navy underline underline-offset-4">
              Add a scene
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs tracking-[0.2em] uppercase text-stone">Feature rows · {detail.features.length} of {MAX_FEATURES}</p>
          <p className="text-xs text-stone -mt-2">A big title on the left; text and a picture or video on the right. With both a picture/video and “More text”, visitors get a switch between them.</p>
          {detail.features.map((feature, index) => (
            <div key={index} className="border border-line bg-cream-deep/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-brass">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex items-center gap-4">
                  <MoveButtons index={index} length={detail.features.length} onMove={(from, to) => patch({ features: moveItem(detail.features, from, to) })} />
                  <button type="button" onClick={() => patch({ features: detail.features.filter((_, i) => i !== index) })} className="text-xs text-red-800 underline underline-offset-4">
                    Remove
                  </button>
                </span>
              </div>
              <TextField label="Title" value={feature.title} max={120} onChange={(title) => updateFeature(index, { title })} />
              <TextField label="Text" rows={4} value={feature.body} max={1200} hint="Leave an empty line between paragraphs." onChange={(body) => updateFeature(index, { body })} />
              <ImageField label="Picture or video" value={feature.media} onChange={(media) => updateFeature(index, { media })} />
              <TextField label="More text (behind the DETAILS button, optional)" rows={4} value={feature.details} max={2000} onChange={(details) => updateFeature(index, { details })} />
            </div>
          ))}
          {detail.features.length < MAX_FEATURES && (
            <button type="button" onClick={() => patch({ features: [...detail.features, { title: "", body: "", details: "", media: "" }] })} className="text-sm text-navy underline underline-offset-4">
              Add a feature row
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs tracking-[0.2em] uppercase text-stone">Closing band</p>
          <TextField label="Text" rows={2} value={detail.ctaText} max={240} onChange={(ctaText) => patch({ ctaText })} />
          <div className="grid md:grid-cols-2 gap-6">
            <TextField label="Button text" value={detail.ctaLabel} max={40} onChange={(ctaLabel) => patch({ ctaLabel })} />
            <TextField label="Button link" value={detail.ctaHref} max={500} placeholder="/contact" onChange={(ctaHref) => patch({ ctaHref })} />
          </div>
          <p className="text-xs text-stone">An “All projects” button is always shown.</p>
        </div>
      </div>
    </details>
  );
}
