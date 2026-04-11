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
      {/* Thumbnail */}
      {project.coverMedia.preview ? (
        <motion.div
          className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)]"
          initial={reduceMotion ? {} : { opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 25 }}
        >
          <div className="relative aspect-[16/9]">
            <Image
              src={project.coverMedia.preview}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="aspect-[16/9] overflow-hidden rounded-xl"
          style={{ background: project.coverMedia.background }}
          initial={reduceMotion ? {} : { opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 25 }}
        />
      )}

      {/* Title + description */}
      <section className="max-w-2xl space-y-6">
        <ViewTransition name={`project-title-${project.slug}`} share="text-morph" default="none">
          <motion.h1
            className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1] tracking-[-0.04em] text-[#0a0a0a]"
            initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
            whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
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
          <span className="rounded-full border border-[rgba(0,0,0,0.08)] px-3 py-1 font-mono text-[11px] text-[#a3a3a3]">
            {project.category}
          </span>
          <span className="rounded-full border border-[rgba(0,0,0,0.08)] px-3 py-1 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
            {project.year}
          </span>
        </motion.div>
      </section>

      {/* Stack */}
      <section>
        <motion.p className="eyebrow mb-4" {...useFadeUp(0)}>
          Stack
        </motion.p>
        <motion.div className="flex flex-wrap gap-2" {...useFadeUp(0.06)}>
          {project.stack.map((tech, i) => (
            <motion.span
              key={tech}
              className="rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-1.5 font-mono text-[12px] text-[#737373]"
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
