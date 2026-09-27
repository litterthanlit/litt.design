// The homepage project list, top to bottom. Reorder, add or remove
// lines here to change what shows up and in which order.
export type WorkItem =
  // A project from data/projects.ts (links to its /work/<slug> page)
  | { type: "project"; slug: string }
  // The litt.works digital art card
  | { type: "art"; href: string };

export const workList: WorkItem[] = [
  { type: "project", slug: "carson" },
  { type: "project", slug: "brand" },
  { type: "project", slug: "hypher" },
  { type: "project", slug: "studio-os" },
  { type: "project", slug: "good-md" },
  { type: "project", slug: "vceezy" },
  { type: "art", href: "https://github.com/litterthanlit/gallery" },
  { type: "project", slug: "wavr" },
];
