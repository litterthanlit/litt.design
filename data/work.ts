// The homepage project list, top to bottom. Reorder, add or remove
// lines here to change what shows up and in which order.
// A wide card spans both columns from the sm breakpoint.
export type WorkItem =
  // A project from data/projects.ts (links to its /work/<slug> page)
  | { type: "project"; slug: string; wide?: boolean }
  // The litt.works digital art card (/art is served by the gallery app)
  | { type: "art"; href: string; wide?: boolean };

export const workList: WorkItem[] = [
  { type: "project", slug: "hypher", wide: true },
  { type: "project", slug: "brand" },
  { type: "project", slug: "carson" },
  { type: "project", slug: "studio-os" },
  { type: "project", slug: "vyo" },
  { type: "art", href: "/art", wide: true },
];
