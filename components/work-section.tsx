"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/types";
import type { WorkItem } from "@/data/work";

type WorkSectionProps = {
  projects: Project[];
  items: WorkItem[];
};

type Card =
  | { type: "project"; project: Project }
  | { type: "art"; href: string };

const ART_PIECES = [
  { src: "/art/pieces/chaos.jpg", alt: "Chaos — abstract digital piece" },
  { src: "/art/pieces/in-the-fire.jpg", alt: "In the Fire — abstract digital piece" },
  { src: "/art/pieces/shattered.jpg", alt: "Shattered — abstract digital piece" },
  { src: "/art/pieces/unfiltered-projections.jpg", alt: "Unfiltered Projections — abstract digital piece" },
];

export function WorkSection({ projects, items }: WorkSectionProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const cards: Card[] = [];
  for (const item of items) {
    if (item.type === "art") {
      cards.push(item);
    } else {
      const project = projects.find((p) => p.slug === item.slug);
      if (project) cards.push({ type: "project", project });
    }
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="section-shell py-16 md:py-24">
      <div className="max-w-[680px]">
        <h2 id="work-heading" className="eyebrow mb-8">
          Selected work
        </h2>

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2">
          {cards.map((card, index) => (
            <Reveal
              key={card.type === "art" ? "litt-works" : card.project.slug}
              index={index}
              reduceMotion={reduceMotion}
            >
              {card.type === "art" ? (
                <ArtCard href={card.href} />
              ) : (
                <ProjectCard project={card.project} />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reveal({
  children,
  index,
  reduceMotion,
}: {
  children: React.ReactNode;
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.05 }}
    >
      {children}
    </motion.div>
  );
}

const LINK =
  "group block rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]";

// Shared frame: thin border, small radius, neutral fill behind the image
const FRAME =
  "relative aspect-[16/10] overflow-hidden rounded-[10px] border border-[rgba(0,0,0,0.08)] transition-[border-color,box-shadow] duration-300 group-hover:border-[rgba(0,0,0,0.14)] group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)]";

const IMAGE_MOTION =
  "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

function CardCaption({
  title,
  meta,
  description,
  status,
  external = false,
}: {
  title: string;
  meta: string;
  description: string;
  status?: string;
  external?: boolean;
}) {
  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.01em] text-[#0a0a0a]">
          {status && (
            <span
              className="mr-0.5 h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[#9BD62E]"
              title={status}
              aria-hidden="true"
            />
          )}
          {title}
          {status && <span className="sr-only"> ({status})</span>}
          <span
            className="text-[12px] text-[#737373] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            {external ? "↗" : "→"}
          </span>
        </h3>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-[#737373]">
          {meta}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-[13px] leading-[1.55] text-[#737373]">{description}</p>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { preview, background, position } = project.coverMedia;

  return (
    <Link
      href={`/work/${project.slug}`}
      {...({ transitionTypes: ["nav-forward"] } as object)}
      className={LINK}
    >
      <div className={`${FRAME} bg-[#f0f0f0]`}>
        {preview ? (
          <Image
            src={preview}
            alt={`${project.title} — ${project.oneLineOutcome}`}
            fill
            sizes="(min-width: 640px) 340px, 100vw"
            className={IMAGE_MOTION}
            style={{ objectPosition: position ?? "center" }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background }} aria-hidden="true" />
        )}
      </div>
      <CardCaption
        title={project.title}
        meta={project.year.slice(-4)}
        description={project.oneLineOutcome}
        status={project.status}
      />
    </Link>
  );
}

function ArtCard({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      <div className={`${FRAME} grid grid-cols-2 grid-rows-2 gap-px bg-[rgba(0,0,0,0.08)]`}>
        {ART_PIECES.map((piece) => (
          <div key={piece.src} className="relative overflow-hidden bg-[#f0f0f0]">
            <Image
              src={piece.src}
              alt={piece.alt}
              fill
              sizes="170px"
              // Scans have white paper edges; zoom slightly to crop them out
              className="scale-[1.08] object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.1] motion-reduce:transition-none"
            />
          </div>
        ))}
      </div>
      <CardCaption
        title="litt.works"
        meta="2024–26"
        description="Abstract digital art — prints, visual experiments, and long-form pieces."
        external
      />
      <span className="sr-only"> (opens GitHub in a new tab)</span>
    </a>
  );
}
