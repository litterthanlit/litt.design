"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { getHomepageProjects } from "@/data/projects";
import { quietFade } from "@/lib/motion";
import type { Project } from "@/data/types";

const ART_THUMBS = [
  { src: "/art/pieces/chaos.jpg", alt: "Chaos" },
  { src: "/art/pieces/in-the-fire.jpg", alt: "In the Fire" },
  { src: "/art/pieces/shattered.jpg", alt: "Shattered" },
  { src: "/art/pieces/unfiltered-projections.jpg", alt: "Unfiltered Projections" },
];

export function WorkSection() {
  const reduceMotion = useReducedMotion();
  const projects = getHomepageProjects();

  return (
    <section id="work" className="section-shell py-16 md:py-24">
      <motion.p className="eyebrow mb-10" {...quietFade(reduceMotion)}>
        Projects
      </motion.p>

      <div className="flex max-w-[680px] flex-col gap-16 md:gap-24">
        {projects.map((project, index) => (
          <WorkItem
            key={project.slug}
            project={project}
            delay={index * 0.04}
            reduceMotion={reduceMotion ?? false}
          />
        ))}
        <ArtItem reduceMotion={reduceMotion ?? false} delay={projects.length * 0.04} />
      </div>
    </section>
  );
}

function WorkItem({
  project,
  delay,
  reduceMotion,
}: {
  project: Project;
  delay: number;
  reduceMotion: boolean;
}) {
  const image = project.coverMedia.preview;

  return (
    <Link
      href={`/work/${project.slug}`}
      {...({ transitionTypes: ["nav-forward"] } as { transitionTypes: string[] })}
      className="group block"
    >
      <motion.article {...quietFade(reduceMotion, delay)}>
        {image ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-[#f0f0f0]">
            <Image
              src={image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          </div>
        ) : null}
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
            {project.title}
          </h3>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
            {project.year}
          </span>
        </div>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-[#737373]">
          {project.oneLineOutcome}
        </p>
      </motion.article>
    </Link>
  );
}

function ArtItem({ reduceMotion, delay }: { reduceMotion: boolean; delay: number }) {
  return (
    <Link
      href="/art"
      {...({ transitionTypes: ["nav-forward"] } as { transitionTypes: string[] })}
      className="group block"
    >
      <motion.article {...quietFade(reduceMotion, delay)}>
        <div className="grid grid-cols-2 gap-1 overflow-hidden">
          {ART_THUMBS.map((thumb) => (
            <div key={thumb.src} className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                sizes="(max-width: 768px) 50vw, 340px"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
            litt.works
          </h3>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
            2024–2026
          </span>
        </div>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-[#737373]">
          Abstract digital art — prints, visual experiments, and long-form pieces.
        </p>
      </motion.article>
    </Link>
  );
}
