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
        <h2 id="work-heading" className="eyebrow mb-6">
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

// Press feedback: a quick 1% shrink on click/tap (off for reduced motion)
const LINK =
  "group block rounded-[10px] transition-transform duration-150 ease-out focus-visible:outline-offset-4 active:scale-[0.99] motion-reduce:active:scale-100";

// Shared frame: thin border, small radius, neutral fill behind the image
const FRAME =
  "relative aspect-[16/10] overflow-hidden rounded-[10px] border border-[rgba(0,0,0,0.08)] transition-[border-color,box-shadow] duration-200 ease-out group-hover:border-[rgba(0,0,0,0.14)] group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] group-focus-visible:border-[rgba(0,0,0,0.14)]";

const IMAGE_MOTION =
  "object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-focus-visible:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

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
        <h3 className="flex items-center gap-1.5 text-body font-medium text-ink">
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
            className="-translate-x-1 text-body text-muted opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            {external ? "↗" : "→"}
          </span>
        </h3>
        <span className="meta shrink-0">
          {meta}
        </span>
      </div>
      <p className="mt-0.5 line-clamp-2 text-body text-muted">{description}</p>
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
    // /art is a separate app on this domain, so a plain <a> (not <Link>)
    <a href={href} className={LINK}>
      <div className={`${FRAME} bg-[#f0f0f0]`}>
        <Image
          src="/previews/litt-works-orb.jpg"
          alt="litt.works gallery in Orb view — artworks arranged on a slowly drifting sphere"
          fill
          sizes="(min-width: 640px) 340px, 100vw"
          className={IMAGE_MOTION}
        />
      </div>
      <CardCaption
        title="litt.works"
        meta="2024–26"
        description="Abstract digital art — prints, visual experiments, and long-form pieces."
      />
    </a>
  );
}
