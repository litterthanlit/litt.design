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
      <p className="eyebrow mb-16">Selected Work</p>

      <div
        ref={containerRef}
        className="relative"
        onPointerMove={handlePointerMove}
      >
        {/* Floating preview card */}
        <AnimatePresence>
          {hoveredProject && (
            <motion.div
              key={hoveredProject.slug}
              className="pointer-events-none absolute right-0 z-10 hidden w-[340px] lg:block"
              style={{ top: cursorY - 100 }}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 12, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
            >
              <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                {/* Gradient strip */}
                <div
                  className="h-32"
                  style={{ background: hoveredProject.coverMedia.background }}
                />

                <div className="space-y-3 p-5">
                  {/* Category + Year */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
                      {hoveredProject.category}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#a3a3a3]">
                      {hoveredProject.year}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] leading-[1.6] text-[#525252]">
                    {hoveredProject.oneLineOutcome}
                  </p>

                  {/* Stack pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hoveredProject.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-[rgba(0,0,0,0.06)] bg-[#fafafa] px-2 py-0.5 font-mono text-[10px] text-[#737373]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project list */}
        <div className="divide-y divide-[rgba(0,0,0,0.06)]">
          {projects.map((project, index) => (
            <ProjectRow
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

type ProjectRowProps = {
  project: Project;
  index: number;
  isHovered: boolean;
  onHover: (slug: string | null) => void;
  reduceMotion: boolean;
};

function ProjectRow({ project, index, isHovered, onHover, reduceMotion }: ProjectRowProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block"
      onMouseEnter={() => onHover(project.slug)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className="flex items-baseline gap-4 py-6 md:gap-6 md:py-8"
        animate={
          reduceMotion
            ? {}
            : { x: isHovered ? 8 : 0 }
        }
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      >
        {/* Number */}
        <span className="font-mono text-[11px] tabular-nums text-[#a3a3a3] transition-colors duration-200 group-hover:text-[#0a0a0a]">
          {num}
        </span>

        {/* Project name */}
        <h3 className="text-[clamp(1.6rem,4vw,3.2rem)] font-[450] leading-[1] tracking-[-0.04em] text-[#0a0a0a]">
          {project.title}
        </h3>

        {/* Category — visible on larger screens */}
        <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.08em] text-[#a3a3a3] transition-colors duration-200 group-hover:text-[#737373] md:block">
          {project.category}
        </span>

        {/* Arrow */}
        <motion.span
          className="text-[#a3a3a3] transition-colors duration-200 group-hover:text-[#0a0a0a]"
          animate={reduceMotion ? {} : { x: isHovered ? 4 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          &rarr;
        </motion.span>
      </motion.div>
    </Link>
  );
}
