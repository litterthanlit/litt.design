"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
      <motion.h2
        className="eyebrow mb-10"
        initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 30 }}
      >
        Projects
      </motion.h2>

      <div
        ref={containerRef}
        className="relative"
        onPointerMove={handlePointerMove}
      >
        {/* Floating preview card */}
        <AnimatePresence>
          {hoveredSlug === "litt-works" && !reduceMotion && (
            <motion.div
              key="litt-works"
              className="pointer-events-none absolute right-0 z-10 hidden w-[340px] lg:block"
              style={{ top: cursorY - 100 }}
              initial={{ opacity: 0, x: 16, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 10, scale: 0.97, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
            >
              <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="relative h-24">
                    <Image src="/art/pieces/chaos.jpg" alt="Chaos" fill className="object-cover" />
                  </div>
                  <div className="relative h-24">
                    <Image src="/art/pieces/in-the-fire.jpg" alt="In the Fire" fill className="object-cover" />
                  </div>
                  <div className="relative h-24">
                    <Image src="/art/pieces/shattered.jpg" alt="Shattered" fill className="object-cover" />
                  </div>
                  <div className="relative h-24">
                    <Image src="/art/pieces/unfiltered-projections.jpg" alt="Unfiltered Projections" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-2 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
                      Digital Art
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#a3a3a3]">
                      2024–2026
                    </span>
                  </div>
                  <p className="text-[13px] leading-[1.6] text-[#525252]">
                    Abstract digital art — prints, visual experiments, and long-form pieces.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
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
                {hoveredProject.coverMedia.preview ? (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={hoveredProject.coverMedia.preview}
                      alt={hoveredProject.title}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div
                    className="h-32"
                    style={{ background: hoveredProject.coverMedia.background }}
                  />
                )}
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

        {/* Project pills */}
        <div className="flex max-w-xl flex-col items-stretch gap-3">
          {projects.map((project, index) => (
              <ProjectPill
                key={project.slug}
                project={project}
                index={index}
                onHover={setHoveredSlug}
                reduceMotion={reduceMotion ?? false}
              />
            ))}
          <ArtPill reduceMotion={reduceMotion ?? false} onHover={setHoveredSlug} />
        </div>
      </div>
    </section>
  );
}

type ProjectPillProps = {
  project: Project;
  index: number;
  onHover: (slug: string | null) => void;
  reduceMotion: boolean;
};

function ProjectPill({ project, index, onHover, reduceMotion }: ProjectPillProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      {...{ transitionTypes: ["nav-forward"] } as any}
      onMouseEnter={() => onHover(project.slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(project.slug)}
      onBlur={() => onHover(null)}
      className="block w-full rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
    >
      <motion.div
        className="border-b border-[rgba(0,0,0,0.06)] py-4"
        initial={reduceMotion ? {} : { opacity: 0, y: 10, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 28, delay: index * 0.04 }}
      >
        <h3 className="text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
          {project.title}
        </h3>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-[#737373]">
          {project.oneLineOutcome}
        </p>
      </motion.div>
    </Link>
  );
}

function ArtPill({ reduceMotion, onHover }: { reduceMotion: boolean; onHover: (slug: string | null) => void }) {
  return (
    <Link
      href="/art"
      {...{ transitionTypes: ["nav-forward"] } as any}
      onMouseEnter={() => onHover("litt-works")}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover("litt-works")}
      onBlur={() => onHover(null)}
      className="block w-full rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]"
    >
      <motion.div
        className="border-b border-[rgba(0,0,0,0.06)] py-4"
        initial={reduceMotion ? {} : { opacity: 0, y: 10, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 28, delay: 0.2 }}
      >
        <h3 className="text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
          litt.works
        </h3>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-[#737373]">
          Abstract digital art — prints, visual experiments, and long-form pieces.
        </p>
      </motion.div>
    </Link>
  );
}
