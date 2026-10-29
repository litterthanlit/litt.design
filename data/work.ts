import { projects } from "@/data/projects";

// The homepage project list, in slider order. Reorder, add or remove
// lines here to change what shows up and in which order.
export type WorkItem =
  // A project from data/projects.ts (links to its /work/<slug> page)
  | { type: "project"; slug: string }
  // The litt.works digital art card (/art is served by the gallery app)
  | { type: "art"; href: string };

export const workList: WorkItem[] = [
  { type: "project", slug: "hypher" },
  { type: "project", slug: "brand" },
  { type: "project", slug: "studio-os" },
  { type: "project", slug: "vyo" },
  { type: "project", slug: "litt-md" },
  { type: "art", href: "/art" },
];

// Everything a card needs. Plain data, so the server page can hand it to the
// client slider.
export type WorkCard = {
  key: string;
  title: string;
  category: string;
  year: string;
  // One line on what it is
  summary: string;
  href: string;
  // /art is a separate app on this domain, so it takes a plain <a>, not <Link>
  sameApp: boolean;
  alt: string;
  // Made by scripts/covers/build.mjs
  cover: string;
};

const coverFor = (slug: string) => `/previews/covers/${slug}-landscape.jpg`;

export function workCards(items: WorkItem[] = workList): WorkCard[] {
  return items.flatMap((item): WorkCard[] => {
    if (item.type === "art") {
      return [
        {
          key: "litt-works",
          title: "litt.works",
          category: "Digital Art",
          year: "2024–26",
          summary: "Abstract digital art: prints, visual experiments and long-form pieces.",
          href: item.href,
          sameApp: false,
          alt: "litt.works gallery in Orb view — artworks arranged on a slowly drifting sphere",
          cover: coverFor("litt-works"),
        },
      ];
    }
    const project = projects.find((p) => p.slug === item.slug);
    if (!project) return [];
    return [
      {
        key: project.slug,
        title: project.title,
        category: project.category,
        year: project.year.slice(-4),
        summary: project.oneLineOutcome,
        href: `/work/${project.slug}`,
        sameApp: true,
        alt: `${project.title} — ${project.oneLineOutcome}`,
        cover: coverFor(project.slug),
      },
    ];
  });
}
