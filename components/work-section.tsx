"use client";

import { useState, useRef, useEffect, ViewTransition } from "react";
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

        {/* Project pills — grouped by tier */}
        <div className="space-y-6">
          {/* Tools */}
          <div>
            <motion.span
              className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#0a0a0a]"
              initial={reduceMotion ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              Tools
            </motion.span>
            <div className="flex flex-wrap gap-2">
              {projects
                .filter((p) => ["ergon", "wavr", "good-md"].includes(p.slug))
                .map((project, index) => (
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

          {/* Products */}
          <div>
            <motion.span
              className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#0a0a0a]"
              initial={reduceMotion ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Products
            </motion.span>
            <div className="flex flex-wrap gap-2">
              {projects
                .filter((p) => ["studio-os", "vceezy"].includes(p.slug))
                .map((project, index) => (
                  <ProjectPill
                    key={project.slug}
                    project={project}
                    index={index + 3}
                    isHovered={hoveredSlug === project.slug}
                    onHover={setHoveredSlug}
                    reduceMotion={reduceMotion ?? false}
                  />
                ))}
            </div>
          </div>

          {/* Art */}
          <div>
            <motion.span
              className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#0a0a0a]"
              initial={reduceMotion ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              Art
            </motion.span>
            <div className="flex flex-wrap gap-2">
              <ArtPill reduceMotion={reduceMotion ?? false} onHover={setHoveredSlug} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Individual pill colors — muted, tasteful, no neon
const PILL_COLORS: Record<string, string> = {
  ergon: "#2D3436",     // charcoal
  wavr: "#4A6741",      // sage green
  "good-md": "#6B5B73", // muted plum
  "studio-os": "#1a56db", // deep blue
  vceezy: "#1A1A1A",    // obsidian
};

type ProjectPillProps = {
  project: Project;
  index: number;
  isHovered: boolean;
  onHover: (slug: string | null) => void;
  reduceMotion: boolean;
};

const SHADOW_COLORS = [
  [255, 160, 80],   // orange
  [255, 120, 100],  // coral
  [100, 200, 255],  // sky
  [120, 255, 180],  // mint
  [200, 160, 255],  // lilac
];

function useColorCycleShadow(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !ref.current) {
      if (ref.current) ref.current.style.boxShadow = "none";
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const el = ref.current;
    const start = performance.now();

    function tick(now: number) {
      const t = (now - start) / 1000;
      const cycleLen = SHADOW_COLORS.length;
      const progress = (t * 0.4) % cycleLen; // slow cycle
      const idx = Math.floor(progress);
      const blend = progress - idx;
      const a = SHADOW_COLORS[idx % cycleLen];
      const b = SHADOW_COLORS[(idx + 1) % cycleLen];
      const r = Math.round(a[0] + (b[0] - a[0]) * blend);
      const g = Math.round(a[1] + (b[1] - a[1]) * blend);
      const bv = Math.round(a[2] + (b[2] - a[2]) * blend);

      el.style.boxShadow = `0 4px 20px rgba(${r},${g},${bv},0.2), 0 8px 40px rgba(${r},${g},${bv},0.1), inset 0 1px 0 rgba(255,255,255,0.06)`;
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return ref;
}

function GlassPill({
  children,
  isHovered,
  reduceMotion,
  delay,
}: {
  children: React.ReactNode;
  isHovered: boolean;
  reduceMotion: boolean;
  delay: number;
}) {
  const shadowRef = useColorCycleShadow(isHovered && !reduceMotion);

  return (
    <motion.div
      ref={shadowRef}
      className="relative flex items-center overflow-hidden rounded-full border px-5 py-2.5"
      style={{
        borderColor: isHovered
          ? "rgba(255,255,255,0.7)"
          : "rgba(255,255,255,0.5)",
        background: isHovered
          ? "rgba(255,255,255,0.7)"
          : "rgba(255,255,255,0.45)",
        backdropFilter: isHovered ? "blur(40px) saturate(1.8)" : "blur(12px) saturate(1.2)",
        WebkitBackdropFilter: isHovered ? "blur(40px) saturate(1.8)" : "blur(12px) saturate(1.2)",
        boxShadow: isHovered
          ? "0 2px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)"
          : "0 1px 3px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)",
        transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s",
      }}
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
        delay,
      }}
      whileHover={reduceMotion ? {} : { y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Glare sweep on hover */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
        }}
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={
          isHovered
            ? { type: "spring", stiffness: 80, damping: 20, mass: 0.6 }
            : { duration: 0 }
        }
      />

      <span className="relative z-10">
        <span
          className="text-[17px] font-normal tracking-[-0.02em] text-[#0a0a0a] transition-all duration-300"
          style={{ filter: isHovered ? "blur(0px)" : "blur(2px)" }}
        >
          {children}
        </span>
      </span>
    </motion.div>
  );
}

function ProjectPill({ project, index, isHovered, onHover, reduceMotion }: ProjectPillProps) {
  const isExternal = !!project.externalUrl;
  const href = isExternal ? project.externalUrl! : `/work/${project.slug}`;

  return (
    <Link
      href={href}
      {...(isExternal
        ? { target: "_blank" as const, rel: "noopener noreferrer" }
        : { transitionTypes: ["nav-forward"] } as any)}
      onMouseEnter={() => onHover(project.slug)}
      onMouseLeave={() => onHover(null)}
    >
      <GlassPill
        isHovered={isHovered}
        reduceMotion={reduceMotion}
        delay={index * 0.05}
      >
        <ViewTransition name={`project-title-${project.slug}`} share="text-morph" default="none">
          <span>{project.title}</span>
        </ViewTransition>
      </GlassPill>
    </Link>
  );
}

function ArtPill({ reduceMotion, onHover }: { reduceMotion: boolean; onHover: (slug: string | null) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/art"
      {...{ transitionTypes: ["nav-forward"] } as any}
      onMouseEnter={() => { setHovered(true); onHover("litt-works"); }}
      onMouseLeave={() => { setHovered(false); onHover(null); }}
    >
      <GlassPill isHovered={hovered} reduceMotion={reduceMotion} delay={0.25}>
        litt.works
      </GlassPill>
    </Link>
  );
}
