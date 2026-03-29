"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/types";

type WorkSectionProps = {
  projects: Project[];
};

export function WorkSection({ projects }: WorkSectionProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [cursorY, setCursorY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const hoveredProject = projects.find((p) => p.slug === hoveredSlug);

  function handlePointerMove(e: React.PointerEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorY(e.clientY - rect.top);
  }

  return (
    <section id="work" className="section-shell py-20 md:py-32">
      {/* Eyebrow */}
      <motion.p
        className="eyebrow mb-10"
        initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 30 }}
      >
        Selected Work
      </motion.p>

      <div
        ref={containerRef}
        className="relative"
        onPointerMove={handlePointerMove}
      >
        {/* Floating preview card */}
        <AnimatePresence>
          {hoveredProject && !reduceMotion && (
            <motion.div
              key={hoveredProject.slug}
              className="pointer-events-none absolute right-0 z-10 hidden w-[340px] lg:block"
              style={{ top: cursorY - 100 }}
              initial={{ opacity: 0, x: 16, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 10, scale: 0.97, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
            >
              <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div
                  className="h-32"
                  style={{ background: hoveredProject.coverMedia.background }}
                />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
                      {hoveredProject.category}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#a3a3a3]">
                      {hoveredProject.year}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[1.6] text-[#525252]">
                    {hoveredProject.oneLineOutcome}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hoveredProject.stack.map((tech, i) => (
                      <motion.span
                        key={tech}
                        className="rounded-full border border-[rgba(0,0,0,0.06)] bg-[#fafafa] px-2 py-0.5 font-mono text-[10px] text-[#737373]"
                        initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 25,
                          delay: 0.06 + i * 0.04,
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project pills — stacked */}
        <div className="flex flex-col gap-3">
          {projects.map((project, index) => (
            <ProjectPill
              key={project.slug}
              project={project}
              index={index}
              isHovered={hoveredSlug === project.slug}
              onHover={setHoveredSlug}
              reduceMotion={reduceMotion ?? false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProjectPillProps = {
  project: Project;
  index: number;
  isHovered: boolean;
  onHover: (slug: string | null) => void;
  reduceMotion: boolean;
};

function ProjectPill({ project, index, isHovered, onHover, reduceMotion }: ProjectPillProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      onMouseEnter={() => onHover(project.slug)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className="group flex w-full items-center gap-4"
        initial={
          reduceMotion
            ? {}
            : { opacity: 0, y: 12, filter: "blur(4px)" }
        }
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 28,
          delay: index * 0.05,
        }}
      >
        {/* Pill around title only */}
        <motion.span
          className="inline-block rounded-full bg-[#0a0a0a] px-7 py-3 text-[clamp(1.1rem,3vw,1.5rem)] font-medium tracking-[-0.03em] text-white md:px-9 md:py-4"
          whileHover={reduceMotion ? {} : { y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {project.title}
        </motion.span>

        {/* Arrow */}
        <motion.span
          className="text-[16px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]"
          animate={reduceMotion ? {} : { x: isHovered ? 4 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          &rarr;
        </motion.span>
      </motion.div>
    </Link>
  );
}
