"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { getProjectImages } from "@/data/projects";
import { quietFade } from "@/lib/motion";
import type { Project } from "@/data/types";

type ProjectDetailProps = {
  project: Project;
  nextProject: Project;
};

const IMAGE_GAPS: Record<NonNullable<Project["spacing"]>, string> = {
  tight: "gap-1.5",
  medium: "gap-16 md:gap-[18vh]",
  spaced: "gap-24 md:gap-[28vh]",
};

export function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const reduceMotion = useReducedMotion();
  const images = getProjectImages(project);
  const gapClass = IMAGE_GAPS[project.spacing ?? "medium"];
  const noteIndex = images.length > 1 ? 0 : -1;

  return (
    <main className="section-shell flex min-h-screen flex-col pb-20 pt-36 md:pt-44">
      <section className="max-w-[720px]">
        <div className="mb-8 flex items-baseline justify-between gap-6">
          <ViewTransition name={`project-title-${project.slug}`} share="text-morph" default="none">
            <motion.h1
              className="text-[clamp(1.4rem,3vw,1.8rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[#0a0a0a]"
              {...quietFade(reduceMotion)}
            >
              {project.title}
            </motion.h1>
          </ViewTransition>
          <motion.span
            className="shrink-0 font-mono text-[11px] tabular-nums text-[#a3a3a3]"
            {...quietFade(reduceMotion, 0.04)}
          >
            {project.year}
          </motion.span>
        </div>

        {images.length > 0 ? (
          <div className={`flex flex-col ${gapClass}`}>
            {images.map((screen, index) => (
              <div key={screen.src}>
                <motion.div {...quietFade(reduceMotion, 0.06 + index * 0.04)}>
                  <ProjectFrame src={screen.src} alt={`${project.title} — ${screen.label}`} />
                </motion.div>
                {index === noteIndex ? (
                  <motion.p
                    className="mx-auto mt-10 max-w-md text-center text-[13px] leading-[1.7] text-[#737373] md:mt-14"
                    {...quietFade(reduceMotion, 0.1)}
                  >
                    {project.oneLineOutcome}
                  </motion.p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <motion.p
            className="max-w-xl text-[15px] leading-[1.7] text-[#525252]"
            {...quietFade(reduceMotion, 0.06)}
          >
            {project.description}
          </motion.p>
        )}

        {images.length <= 1 ? (
          <motion.p
            className="mt-10 max-w-md text-[13px] leading-[1.7] text-[#737373]"
            {...quietFade(reduceMotion, 0.1)}
          >
            {project.oneLineOutcome}
          </motion.p>
        ) : null}

        {project.externalUrl ? (
          <motion.div className="mt-10" {...quietFade(reduceMotion, 0.12)}>
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] tracking-[-0.01em] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]"
            >
              Visit project →
            </a>
          </motion.div>
        ) : null}
      </section>

      {project.storyBlocks.length > 0 ? (
        <section className="mt-24 max-w-xl space-y-10 md:mt-32">
          {project.storyBlocks.map((block, i) => (
            <motion.div key={block.label} {...quietFade(reduceMotion, i * 0.04)}>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#a3a3a3]">
                {block.label}
              </p>
              <h2 className="mt-2 text-[17px] font-medium leading-[1.3] tracking-[-0.02em] text-[#0a0a0a]">
                {block.heading}
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#737373]">
                {block.body}
              </p>
            </motion.div>
          ))}
        </section>
      ) : null}

      <section className="mt-16 max-w-xl">
        <motion.p className="eyebrow mb-4" {...quietFade(reduceMotion)}>
          Stack
        </motion.p>
        <motion.div className="flex flex-wrap gap-2" {...quietFade(reduceMotion, 0.04)}>
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[rgba(0,0,0,0.08)] px-3 py-1 font-mono text-[11px] text-[#737373]"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </section>

      <Link
        href={`/work/${nextProject.slug}`}
        {...({ transitionTypes: ["nav-forward"] } as { transitionTypes: string[] })}
        className="group mt-20 block max-w-xl"
      >
        <motion.div
          className="flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] py-6"
          {...quietFade(reduceMotion)}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#a3a3a3]">
              Next
            </p>
            <p className="mt-1 text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
              {nextProject.title}
            </p>
          </div>
          <span className="text-[13px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">
            →
          </span>
        </motion.div>
      </Link>
    </main>
  );
}

function ProjectFrame({ src, alt }: { src: string; alt: string }) {
  const tallCrop =
    src === "/previews/studio-os.png" ||
    src === "/previews/wavr/home.png" ||
    src === "/previews/studio-os/home.png";

  if (tallCrop) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f0f0f0]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      sizes="(max-width: 768px) 100vw, 720px"
      className="h-auto w-full bg-[#f0f0f0]"
    />
  );
}
