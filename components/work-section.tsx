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

type Wip = Extract<WorkItem, { type: "wip" }>;

const ART_PIECES = [
  { src: "/art/pieces/chaos.jpg", alt: "Chaos — abstract digital piece" },
  { src: "/art/pieces/in-the-fire.jpg", alt: "In the Fire — abstract digital piece" },
  { src: "/art/pieces/shattered.jpg", alt: "Shattered — abstract digital piece" },
  { src: "/art/pieces/unfiltered-projections.jpg", alt: "Unfiltered Projections — abstract digital piece" },
];

export function WorkSection({ projects, items }: WorkSectionProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const cards: Card[] = [];
  const wips: Wip[] = [];
  for (const item of items) {
    if (item.type === "wip") wips.push(item);
    else if (item.type === "art") cards.push(item);
    else {
      const project = projects.find((p) => p.slug === item.slug);
      if (project) cards.push({ type: "project", project });
    }
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="section-shell py-20 md:py-32">
      <h2 id="work-heading" className="eyebrow mb-10">
        Selected work
      </h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-16">
        {cards.map((card, index) => (
          <Reveal
            key={card.type === "art" ? "litt-works" : card.project.slug}
            index={index}
            reduceMotion={reduceMotion}
            className={index === 0 ? "md:col-span-2" : undefined}
          >
            {card.type === "art" ? (
              <ArtCard href={card.href} />
            ) : (
              <ProjectCard project={card.project} featured={index === 0} />
            )}
          </Reveal>
        ))}
      </div>

      {wips.length > 0 && (
        <div className="mt-20 md:mt-28">
          <h3 className="eyebrow mb-4">In progress</h3>
          <ul className="grid grid-cols-1 border-t border-[rgba(0,0,0,0.08)] md:grid-cols-3">
            {wips.map((wip) => (
              <li
                key={wip.title}
                className="border-b border-[rgba(0,0,0,0.08)] md:border-b-0 md:[&:not(:first-child)]:border-l"
              >
                <a
                  href={wip.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full py-5 transition-colors duration-200 hover:bg-[rgba(0,0,0,0.02)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a] md:py-6 md:pr-8 md:[li:not(:first-child)>&]:pl-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em] text-[#0a0a0a]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9BD62E]" aria-hidden="true" />
                      {wip.title}
                      <span
                        className="text-[13px] text-[#737373] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
                      {wip.kind}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.6] text-[#737373]">{wip.note}</p>
                  <span className="sr-only"> (opens GitHub in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Reveal({
  children,
  index,
  reduceMotion,
  className,
}: {
  children: React.ReactNode;
  index: number;
  reduceMotion: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.06 }}
    >
      {children}
    </motion.div>
  );
}

// Shared frame: thin border, small radius, neutral fill behind the image
const FRAME =
  "relative overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#f0f0f0] transition-[border-color,box-shadow] duration-300 group-hover:border-[rgba(0,0,0,0.16)] group-hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]";

const IMAGE_MOTION =
  "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

function CardCaption({
  title,
  meta,
  description,
  external = false,
}: {
  title: string;
  meta: string;
  description: string;
  external?: boolean;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="flex items-center gap-1.5 text-[15px] font-medium tracking-[-0.01em] text-[#0a0a0a]">
          {title}
          <span
            className="text-[13px] text-[#737373] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            {external ? "↗" : "→"}
          </span>
        </h3>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
          {meta}
        </span>
      </div>
      <p className="mt-1 text-[13px] leading-[1.6] text-[#737373]">{description}</p>
    </div>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  const { preview, background, position } = project.coverMedia;

  return (
    <Link
      href={`/work/${project.slug}`}
      {...({ transitionTypes: ["nav-forward"] } as object)}
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
    >
      <div className={`${FRAME} ${featured ? "aspect-[2/1]" : "aspect-[16/10]"}`}>
        {preview ? (
          <Image
            src={preview}
            alt={`${project.title} — ${project.oneLineOutcome}`}
            fill
            sizes={featured ? "(min-width: 1200px) 1104px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            className={IMAGE_MOTION}
            style={{ objectPosition: position ?? "center" }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background }} aria-hidden="true" />
        )}
      </div>
      <CardCaption
        title={project.title}
        meta={`${project.category} · ${project.year}`}
        description={project.oneLineOutcome}
      />
    </Link>
  );
}

function ArtCard({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
    >
      <div className={`${FRAME.replace("bg-[#f0f0f0]", "")} grid aspect-[16/10] grid-cols-2 grid-rows-2 gap-px bg-[rgba(0,0,0,0.08)]`}>
        {ART_PIECES.map((piece) => (
          <div key={piece.src} className="relative overflow-hidden bg-[#f0f0f0]">
            <Image
              src={piece.src}
              alt={piece.alt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              // Scans have white paper edges; zoom slightly to crop them out
              className="scale-[1.08] object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.1] motion-reduce:transition-none"
            />
          </div>
        ))}
      </div>
      <CardCaption
        title="litt.works"
        meta="Digital art · 2024–2026"
        description="Abstract digital art — prints, visual experiments, and long-form pieces."
        external
      />
      <span className="sr-only"> (opens GitHub in a new tab)</span>
    </a>
  );
}
