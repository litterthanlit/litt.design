// The homepage project list, top to bottom. Reorder, add or remove
// lines here to change what shows up and in which order.
export type WorkItem =
  // A case study from data/projects.ts
  | { type: "project"; slug: string }
  // Work in progress with no case study page yet
  | { type: "wip"; title: string; kind: string; note: string }
  // The litt.works digital art link (/art)
  | { type: "art" };

export const workList: WorkItem[] = [
  {
    type: "wip",
    title: "Carson",
    kind: "Tribute",
    note: "A study of how David Carson moved type — rebuilt from physical copies, scans, and a lot of tinkering.",
  },
  {
    type: "wip",
    title: "Brand",
    kind: "Tool study",
    note: "Taking apart the tools Basement Studio builds for their brand work.",
  },
  {
    type: "wip",
    title: "Hyphr",
    kind: "Product",
    note: "In progress. More soon.",
  },
  { type: "project", slug: "studio-os" },
  { type: "project", slug: "good-md" },
  { type: "project", slug: "vceezy" },
  { type: "art" },
  { type: "project", slug: "wavr" },
];
