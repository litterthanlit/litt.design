"use client";

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
    <main className="section-shell flex min-h-screen flex-col gap-20 pb-20 pt-28 md:pt-36">
      {/* Hero */}
      <section className="space-y-8">
        {/* Title — clipPath reveal */}
        <motion.h1
          className="text-[clamp(2.4rem,7vw,5.5rem)] font-medium leading-[0.94] tracking-[-0.04em] text-[#0a0a0a]"
          initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
          whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 30 }}
        >
          {project.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="max-w-2xl text-[17px] leading-[1.7] text-[#525252]"
          {...useFadeUp(0.08)}
        >
          {project.oneLineOutcome}
        </motion.p>

        {/* Meta pills row */}
        <motion.div className="flex flex-wrap gap-2" {...useFadeUp(0.14)}>
          <span className="rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-1.5 font-mono text-[12px] text-[#737373]">
            {project.category}
          </span>
          <span className="rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-1.5 font-mono text-[12px] tabular-nums text-[#737373]">
            {project.year}
          </span>
          {project.services.map((s) => (
            <span
              key={s}
              className="rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-1.5 font-mono text-[12px] text-[#737373]"
            >
              {s}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Gradient hero panel */}
      <motion.div
        className="overflow-hidden rounded-2xl"
        style={{ background: project.coverMedia.background }}
        initial={reduceMotion ? {} : { opacity: 0, scale: 0.97, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 60, damping: 25 }}
      >
        <div className="flex items-end justify-center gap-2 px-8 pb-0 pt-12 sm:gap-3 md:pt-16">
          {project.heroFrames.map((frame, i) => (
            <motion.div
              key={frame.id}
              className="aspect-[3/4] w-[14%] rounded-t-xl border border-white/30 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]"
              style={{ background: frame.background }}
              initial={
                reduceMotion
                  ? {}
                  : { opacity: 0, y: 24, filter: "blur(4px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 28,
                delay: 0.2 + i * 0.06,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-3">
          {project.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6"
              {...useFadeUp(i * 0.06)}
              whileHover={reduceMotion ? {} : { y: -4 }}
            >
              <p className="text-[28px] font-medium tracking-[-0.03em] text-[#0a0a0a]">
                {metric.value}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#a3a3a3]">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </section>
      )}

      {/* Story blocks */}
      <section className="grid gap-3 md:grid-cols-2">
        {project.storyBlocks.map((block, i) => (
          <motion.article
            key={block.label}
            className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-7 md:p-8"
            {...useFadeUp(i * 0.06)}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#a3a3a3]">
              {block.label}
            </span>
            <h2 className="mt-4 text-[20px] font-medium leading-[1.3] tracking-[-0.02em] text-[#0a0a0a]">
              {block.heading}
            </h2>
            <p className="mt-3 text-[14px] leading-[1.7] text-[#737373]">
              {block.body}
            </p>
          </motion.article>
        ))}
      </section>

      {/* Stack */}
      <section>
        <motion.p className="eyebrow mb-6" {...useFadeUp(0)}>
          Tech Stack
        </motion.p>
        <motion.div className="flex flex-wrap gap-2" {...useFadeUp(0.06)}>
          {project.stack.map((tech, i) => (
            <motion.span
              key={tech}
              className="rounded-full bg-[#0a0a0a] px-5 py-2 text-[14px] font-medium text-white"
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
              whileHover={reduceMotion ? {} : { y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Next project */}
      <Link href={`/work/${nextProject.slug}`} className="group block">
        <motion.div
          className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-8 md:p-10"
          initial={reduceMotion ? {} : { opacity: 0, scale: 0.97, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 60, damping: 25 }}
          whileHover={reduceMotion ? {} : { y: -4 }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#a3a3a3]">
            Next Project
          </p>
          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1] tracking-[-0.04em] text-[#0a0a0a]">
                {nextProject.title}
              </h2>
              <p className="mt-3 max-w-lg text-[14px] leading-[1.7] text-[#737373]">
                {nextProject.oneLineOutcome}
              </p>
            </div>
            <motion.span
              className="text-[14px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]"
              animate={reduceMotion ? {} : undefined}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              View project →
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </main>
  );
}
