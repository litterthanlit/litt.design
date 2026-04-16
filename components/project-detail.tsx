"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/types";

type ProjectDetailProps = {
  project: Project;
  nextProject: Project;
};

function useFadeUp(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 20, filter: "blur(4px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 30,
      mass: 1,
      delay,
    },
  };
}

export function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="section-shell flex min-h-screen flex-col gap-16 pb-20 pt-36 md:pt-44">
      {/* Thumbnail — hidden until better previews are ready */}

      {/* Title + description */}
      <section className="max-w-2xl space-y-6">
        <ViewTransition name={`project-title-${project.slug}`} share="text-morph" default="none">
          <motion.h1
            className="text-[clamp(1.6rem,4vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[#0a0a0a] pb-1"
            initial={reduceMotion ? {} : { opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 30 }}
          >
            {project.title}
          </motion.h1>
        </ViewTransition>

        <motion.p
          className="text-[15px] leading-[1.7] text-[#525252]"
          {...useFadeUp(0.06)}
        >
          {project.description}
        </motion.p>

        <motion.div className="flex flex-wrap gap-2" {...useFadeUp(0.12)}>
          <span className="rounded-full border border-[rgba(0,0,0,0.08)] px-3 py-1 font-mono text-[11px] font-medium text-[#a3a3a3]">
            {project.category}
          </span>
          <span className="rounded-full border border-[rgba(0,0,0,0.08)] px-3 py-1 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
            {project.year}
          </span>
        </motion.div>

        {project.externalUrl && (
          <motion.div {...useFadeUp(0.16)}>
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#E8F0FE] px-6 py-3 text-[15px] font-medium text-[#1a56db] transition-colors hover:bg-[#d4e4fc]"
            >
              Visit Project <span className="text-[12px]">↗</span>
            </a>
          </motion.div>
        )}
      </section>

      {/* Story */}
      {project.storyBlocks.length > 0 && (
        <section className="max-w-2xl space-y-10">
          {project.storyBlocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={reduceMotion ? {} : { opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 80, damping: 28, delay: i * 0.04 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#a3a3a3]">
                {block.label}
              </p>
              <h2 className="mt-2 text-[18px] font-medium leading-[1.3] tracking-[-0.02em] text-[#0a0a0a]">
                {block.heading}
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#737373]">
                {block.body}
              </p>
            </motion.div>
          ))}
        </section>
      )}

      {/* Screens — hidden until better previews are ready */}

      {/* Stack */}
      <section>
        <motion.p className="eyebrow mb-4" {...useFadeUp(0)}>
          Stack
        </motion.p>
        <motion.div className="flex flex-wrap gap-2" {...useFadeUp(0.06)}>
          {project.stack.map((tech, i) => (
            <motion.span
              key={tech}
              className="rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-1.5 font-mono text-[12px] font-medium text-[#737373]"
              initial={
                reduceMotion
                  ? {}
                  : { opacity: 0, y: 12, filter: "blur(2px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: 0.08 + i * 0.04,
              }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Next project */}
      <Link href={`/work/${nextProject.slug}`} {...{ transitionTypes: ["nav-forward"] } as any} className="group block">
        <motion.div
          className="flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] py-6"
          initial={reduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 30 }}
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
