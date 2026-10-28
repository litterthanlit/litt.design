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
  | { type: "project"; project: Project; wide?: boolean }
  | { type: "art"; href: string; wide?: boolean };


export function WorkSection({ projects, items }: WorkSectionProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const cards: Card[] = [];
  for (const item of items) {
    if (item.type === "art") {
      cards.push(item);
    } else {
      const project = projects.find((p) => p.slug === item.slug);
      if (project) cards.push({ type: "project", project, wide: item.wide });
    }
  }

  // The right card of a pair reveals a beat after the left; a wide card starts a new row
  let column = 0;
  const delays = cards.map((card) => {
    if (card.wide) {
      column = 0;
      return 0;
    }
    const delay = column * 0.05;
    column = 1 - column;
    return delay;
  });

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
              delay={delays[index]}
              reduceMotion={reduceMotion}
              className={card.wide ? "sm:col-span-2" : undefined}
            >
              {card.type === "art" ? (
                <ArtCard href={card.href} wide={card.wide} />
              ) : (
                <ProjectCard project={card.project} wide={card.wide} />
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
  delay,
  reduceMotion,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  reduceMotion: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// The fill steps one grey darker on hover and press; nothing moves
const CARD =
  "flex flex-col rounded-[8px] bg-card p-1 shadow-card transition-colors duration-100 ease-out hover:bg-card-hover active:bg-card-hover focus-visible:outline-offset-4";

function coverSizes(wide?: boolean) {
  return wide ? "(min-width: 640px) 680px, 92vw" : "(min-width: 640px) 340px, 92vw";
}

function CardBody({
  title,
  category,
  year,
  status,
  wide,
  children,
}: {
  title: string;
  category: string;
  year: string;
  status?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* The hairline lies over the image so a pale cover keeps its edge */}
      <div className={`relative aspect-[16/10] ${wide ? "sm:aspect-[2/1]" : ""} w-full overflow-hidden rounded-[4px] bg-panel after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-line)]`}>
        {children}
      </div>
      <div className="grid grid-cols-2 gap-x-4 px-4 pt-4 pb-3">
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

function ProjectCard({ project, wide }: { project: Project; wide?: boolean }) {
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
        wide={wide}
      >
        {preview ? (
          <Image
            src={preview}
            alt={`${project.title} — ${project.oneLineOutcome}`}
            fill
            sizes={coverSizes(wide)}
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

function ArtCard({ href, wide }: { href: string; wide?: boolean }) {
  return (
    // /art is a separate app on this domain, so a plain <a> (not <Link>)
    <a href={href} className={CARD}>
      <CardBody title="litt.works" category="Digital Art" year="2024–26" wide={wide}>
        <Image
          src="/previews/covers/litt-works.jpg"
          alt="litt.works: three prints from the gallery floating over a blurred field of their own colour"
          fill
          sizes={coverSizes(wide)}
          className="object-cover"
        />
      </CardBody>
    </a>
  );
}
