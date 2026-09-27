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

// Plain-text tags: no pill, just weight and reduced opacity (see .meta)
const TAG = "meta";

export function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const reduceMotion = useReducedMotion();
  const visitFade = useFadeUp(0.16);

  return (
    <main className="section-shell flex min-h-screen flex-col gap-16 pb-20 pt-36 md:pt-44">
      {/* Thumbnail — hidden until better previews are ready */}

      {/* Title + description */}
      <section className="max-w-2xl space-y-4">
        <ViewTransition name={`project-title-${project.slug}`} share="text-morph" default="none">
          <motion.h1
            className="text-intro font-medium text-ink"
            initial={reduceMotion ? {} : { opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 30 }}
          >
            {project.title}
          </motion.h1>
        </ViewTransition>

        <motion.p
          className="text-body text-muted"
          {...useFadeUp(0.06)}
        >
          {project.description}
        </motion.p>

        <motion.div className="flex flex-wrap items-center gap-x-5 gap-y-1" {...useFadeUp(0.12)}>
          <span className={TAG}>{project.category}</span>
          <span className={`${TAG} tabular-nums`}>{project.year}</span>
          {project.status && (
            <span className={`${TAG} inline-flex items-center gap-1.5`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#9BD62E]" aria-hidden="true" />
              {project.status}
            </span>
          )}
        </motion.div>

        {project.externalUrl && (
          <motion.div {...visitFade}>
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.12)] px-4 py-2 text-body font-medium text-ink transition-colors duration-200 hover:border-[rgba(0,0,0,0.24)] hover:bg-[rgba(0,0,0,0.03)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a]"
            >
              Visit {project.title}
              <span
                className="text-body text-muted transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
                aria-hidden="true"
              >
                ↗
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
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
              <p className="meta">
                {block.label}
              </p>
              <h2 className="mt-1 text-body font-medium text-ink">
                {block.heading}
              </h2>
              <p className="mt-0.5 text-body text-muted">
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
        <motion.div className="flex flex-wrap gap-x-5 gap-y-1" {...useFadeUp(0.06)}>
          {project.stack.map((tech, i) => (
            <motion.span
              key={tech}
              className={TAG}
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
            <p className="meta">
              Next
            </p>
            <p className="mt-0.5 text-body font-medium text-ink">
              {nextProject.title}
            </p>
          </div>
          <span className="text-body text-muted transition-colors duration-150 group-hover:text-ink">
            →
          </span>
        </motion.div>
      </Link>
    </main>
  );
}
