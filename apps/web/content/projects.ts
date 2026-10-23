export interface Project {
  id: string;
  title: string;
  type?: string;
  status?: string;
  summary: string;
  image?: string;
  tags: string[];
  href?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "intria",
    title: "The Architect (Intria)",
    type: "Graph-based intelligence",
    status: "Live",
    summary:
      "A graph-based intelligence system that turns global events (geopolitical, macro, logistics) into financial signals and supply-chain impact maps for S&P 500 companies, built on Neo4j and WebGL.",
    image: "/intria1.PNG",
    tags: ["Ontology", "Knowledge Graph", "Financial Intelligence"],
    href: "https://intria.app",
    featured: true,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
