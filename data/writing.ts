export type WritingEntry = {
  slug: string;
  title: string;
  date: string;
  external?: string;
};

export const writings: WritingEntry[] = [
  {
    slug: "why-i-build-tools",
    title: "Why I build tools instead of apps",
    date: "2026-03",
  },
  {
    slug: "raw-webgl-no-abstraction",
    title: "Raw WebGL, no abstraction layer",
    date: "2026-02",
  },
  {
    slug: "designing-with-restraint",
    title: "Designing with restraint",
    date: "2026-01",
  },
  {
    slug: "spring-physics-not-easing",
    title: "Spring physics, not easing curves",
    date: "2025-12",
  },
];
