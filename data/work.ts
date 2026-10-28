import { projects } from "@/data/projects";

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
  { type: "project", slug: "studio-os" },
  { type: "project", slug: "vyo" },
  { type: "project", slug: "litt-md" },
  { type: "art", href: "/art", wide: true },
];

// Every project cover comes in these shapes, made by scripts/covers/build.mjs
// as public/previews/covers/<slug>-<shape>.jpg
export const coverShapes = ["landscape", "wide", "square", "portrait"] as const;
export type CoverShape = (typeof coverShapes)[number];

// Everything a card needs, whichever layout draws it. Plain data, so a
// server page can hand it to a client component.
export type WorkCard = {
  key: string;
  title: string;
  category: string;
  year: string;
  status?: string;
  href: string;
  // /art is a separate app on this domain, so it takes a plain <a>, not <Link>
  sameApp: boolean;
  alt: string;
  wide: boolean;
  covers: Record<CoverShape, string>;
};

const coversFor = (slug: string) =>
  Object.fromEntries(coverShapes.map((shape) => [shape, `/previews/covers/${slug}-${shape}.jpg`])) as Record<CoverShape, string>;

export function workCards(items: WorkItem[] = workList): WorkCard[] {
  return items.flatMap((item): WorkCard[] => {
    if (item.type === "art") {
      return [
        {
          key: "litt-works",
          title: "litt.works",
          category: "Digital Art",
          year: "2024–26",
          href: item.href,
          sameApp: false,
          alt: "litt.works gallery in Orb view — artworks arranged on a slowly drifting sphere",
          wide: item.wide ?? false,
          covers: coversFor("litt-works"),
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
        status: project.status,
        href: `/work/${project.slug}`,
        sameApp: true,
        alt: `${project.title} — ${project.oneLineOutcome}`,
        wide: item.wide ?? false,
        covers: coversFor(project.slug),
      },
    ];
  });
}
