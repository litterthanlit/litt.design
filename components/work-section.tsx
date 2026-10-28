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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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

// The fill steps one grey darker on hover and press; nothing moves
const CARD =
  "flex flex-col rounded-[8px] bg-card p-6 shadow-card transition-colors duration-100 ease-out hover:bg-card-hover active:bg-card-hover focus-visible:outline-offset-4";

const COVER_SIZES = "(min-width: 640px) 240px, 70vw";

function CardBody({
  title,
  category,
  year,
  status,
  children,
}: {
  title: string;
  category: string;
  year: string;
  status?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* The hairline lies over the image so a pale screenshot keeps its edge */}
      <div className="relative aspect-[16/10] w-5/6 overflow-hidden rounded-[4px] bg-panel after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-line)]">
        {children}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-4">
        <div>
          <h3 className="text-body font-medium text-ink">{title}</h3>
          {status && (
            <p className="meta mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#9BD62E]" aria-hidden="true" />
              {status}
            </p>
          )}
        </div>
        <div>
          {/* Not text-muted: it fails contrast on the hover grey */}
          <p className="text-body text-ink/60">{category}</p>
          <p className="meta mt-1">{year}</p>
        </div>
      </div>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { preview, background, position } = project.coverMedia;

  return (
    <Link
      href={`/work/${project.slug}`}
      transitionTypes={["nav-forward"]}
      className={CARD}
    >
      <CardBody
        title={project.title}
        category={project.category}
        year={project.year.slice(-4)}
        status={project.status}
      >
        {preview ? (
          <Image
            src={preview}
            alt={`${project.title} — ${project.oneLineOutcome}`}
            fill
            sizes={COVER_SIZES}
            className="object-cover"
            style={{ objectPosition: position ?? "center" }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background }} aria-hidden="true" />
        )}
      </CardBody>
    </Link>
  );
}

function ArtCard({ href }: { href: string }) {
  return (
    // /art is a separate app on this domain, so a plain <a> (not <Link>)
    <a href={href} className={CARD}>
      <CardBody title="litt.works" category="Digital Art" year="2024–26">
        <Image
          src="/previews/litt-works-orb.jpg"
          alt="litt.works gallery in Orb view — artworks arranged on a slowly drifting sphere"
          fill
          sizes={COVER_SIZES}
          className="object-cover"
        />
      </CardBody>
    </a>
  );
}
