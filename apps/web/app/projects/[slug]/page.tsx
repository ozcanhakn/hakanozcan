import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectView from "@/components/project/ProjectView";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

async function findProject(params: Params) {
  const { slug } = await params;
  const { projects } = await getSiteSettings();
  return projects.find((project) => project.id === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = await findProject(params);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary || undefined };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const project = await findProject(params);
  if (!project) notFound();
  return <ProjectView project={project} />;
}
