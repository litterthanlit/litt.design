// The homepage project list, top to bottom. Reorder, add or remove
// lines here to change what shows up and in which order.
export type WorkItem =
  // A case study from data/projects.ts
  | { type: "project"; slug: string }
  // Work in progress with no case study page yet
  | { type: "wip"; title: string; kind: string; note: string; href: string }
  // The litt.works digital art card
  | { type: "art"; href: string };

export const workList: WorkItem[] = [
  {
    type: "wip",
    title: "Carson",
    kind: "Tribute",
    note: "A study of how David Carson moved type — rebuilt from physical copies, scans, and a lot of tinkering.",
    href: "https://github.com/litterthanlit/carson",
  },
  {
    type: "wip",
    title: "Brand",
    kind: "Tool study",
    note: "Taking apart the tools Basement Studio builds for their brand work.",
    href: "https://github.com/litterthanlit/brand",
  },
  {
    type: "wip",
    title: "Hypher",
    kind: "Product",
    note: "In progress. More soon.",
    href: "https://github.com/litterthanlit/hypher",
  },
  { type: "project", slug: "studio-os" },
  { type: "project", slug: "good-md" },
  { type: "project", slug: "vceezy" },
  { type: "art", href: "https://github.com/litterthanlit/gallery" },
  { type: "project", slug: "wavr" },
];
