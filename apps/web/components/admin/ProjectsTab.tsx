"use client";

import { useState } from "react";

import { Card, ImageField, MoveButtons, SaveBar, TextField, Toggle, moveItem } from "@/components/admin/fields";
import ProjectDetailEditor from "@/components/admin/ProjectDetailEditor";
import { type Status } from "@/components/admin/ui";
import { emptyDetail, type Project, type SiteSettings } from "@/lib/settings";

const emptyProject = (): Project => ({
  id: `project-${Date.now().toString(36)}`,
  title: "",
  type: "",
  status: "",
  summary: "",
  image: "",
  tags: [],
  href: "",
  featured: false,
  detail: emptyDetail(),
});

interface Props {
  settings: SiteSettings;
  onSave: (next: SiteSettings) => Promise<string | null>;
}

export default function ProjectsTab({ settings, onSave }: Props) {
  const [projects, setProjects] = useState<Project[]>(settings.projects);
  // Tags are typed as one comma separated line, so they are kept as text while editing.
  const [tags, setTags] = useState<string[]>(settings.projects.map((project) => project.tags.join(", ")));
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState(false);

  const update = (index: number, patch: Partial<Project>) =>
    setProjects((current) => current.map((project, i) => (i === index ? { ...project, ...patch } : project)));

  const move = (from: number, to: number) => {
    setProjects((current) => moveItem(current, from, to));
    setTags((current) => moveItem(current, from, to));
  };

  const save = async () => {
    setIsSaving(true);
    const next = projects.map((project, index) => ({
      ...project,
      tags: (tags[index] ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    }));
    const error = await onSave({ ...settings, projects: next });
    setStatus(error ? { kind: "error", text: error } : { kind: "ok", text: "Saved. The Work page and home page update within a minute." });
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-[15px] leading-relaxed text-stone">
        Every project is listed on the Work page. Projects marked as featured also appear in the “Featured projects”
        section of the home page. Projects without a title are dropped when you save.
      </p>

      {projects.map((project, index) => (
        <Card
          key={project.id}
          title={project.title || "New project"}
          aside={
            <span className="flex items-center gap-4">
              <MoveButtons index={index} length={projects.length} onMove={move} />
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Remove this project?")) return;
                  setProjects((current) => current.filter((_, i) => i !== index));
                  setTags((current) => current.filter((_, i) => i !== index));
                }}
                className="text-xs text-red-800 underline underline-offset-4"
              >
                Remove
              </button>
            </span>
          }
        >
          <TextField label="Title" value={project.title} max={120} onChange={(title) => update(index, { title })} />
          <div className="grid md:grid-cols-2 gap-6">
            <TextField label="Kind of project" value={project.type} max={80} placeholder="Graph-based intelligence" onChange={(type) => update(index, { type })} />
            <TextField label="Status" value={project.status} max={40} placeholder="Live" onChange={(value) => update(index, { status: value })} />
          </div>
          <TextField label="Description" rows={4} value={project.summary} max={600} onChange={(summary) => update(index, { summary })} />
          <ImageField label="Image" value={project.image} onChange={(image) => update(index, { image })} />
          <TextField
            label="Tags (separate with commas)"
            value={tags[index] ?? ""}
            onChange={(value) => setTags((current) => current.map((tag, i) => (i === index ? value : tag)))}
          />
          <TextField label="Project link" value={project.href} max={500} placeholder="https://…" onChange={(href) => update(index, { href })} />
          <Toggle label="Featured on the home page" checked={project.featured} onChange={(featured) => update(index, { featured })} />
          <ProjectDetailEditor projectId={project.id} detail={project.detail} onChange={(detail) => update(index, { detail })} />
        </Card>
      ))}

      {projects.length < 30 && (
        <button
          type="button"
          onClick={() => {
            setProjects((current) => [...current, emptyProject()]);
            setTags((current) => [...current, ""]);
          }}
          className="text-sm text-navy underline underline-offset-4"
        >
          Add a project
        </button>
      )}

      <SaveBar status={status} isSaving={isSaving} onSave={save} label="Save projects" />
    </div>
  );
}
