"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/data/types";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  delay?: number;
};

export function ProjectCard({ project, featured = false, delay = 0 }: ProjectCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link href={`/work/${project.slug}`} className="group block h-full">
        <motion.div
          className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-white/80 backdrop-blur-sm ${
            featured ? "min-h-[36rem]" : "min-h-[30rem]"
          }`}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Cover gradient area */}
          <div className="relative flex flex-1 items-end overflow-hidden p-6 md:p-8">
            <div
              className="absolute inset-0 opacity-[0.08] transition-opacity duration-700 group-hover:opacity-[0.14]"
              style={{ background: project.coverMedia.background }}
            />

            {/* Floating hero frames */}
            <div className="relative flex w-full items-end gap-3">
              {project.heroFrames.slice(0, featured ? 5 : 4).map((frame, index) => (
                <motion.div
                  key={frame.id}
                  className="aspect-[3/4] flex-1 rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(19,19,19,0.06)]"
                  style={{ background: frame.background }}
                  initial={false}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.02,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-5 border-t border-line/60 p-6 md:p-8">
            {/* Top row: category pill + year pill */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-line/60 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-muted"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: project.accent }}
                />
                {project.category}
              </span>
              <span className="rounded-full border border-line/40 px-2.5 py-1 text-[0.65rem] tabular-nums tracking-[0.16em] text-muted/70">
                {project.year}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[0.96] tracking-[-0.05em] text-ink">
              {project.title}
            </h3>

            {/* Description */}
            <p className="max-w-lg text-[0.88rem] leading-[1.7] text-muted">
              {project.oneLineOutcome}
            </p>

            {/* Stack pills */}
            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-panel/50 px-2.5 py-1 text-[0.65rem] tracking-[0.08em] text-muted/80 transition-colors duration-300 group-hover:bg-panel/80"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[0.76rem] uppercase tracking-[0.2em] text-ink/70 transition-colors duration-300 group-hover:text-ink">
                View project
              </span>
              <motion.span
                className="text-ink/40 transition-colors duration-300 group-hover:text-ink"
                initial={false}
                animate={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                &rarr;
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    </Reveal>
  );
}
