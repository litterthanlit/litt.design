"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/data/types";

type WorkSectionProps = {
  projects: Project[];
};

const categories = ["All", "Creative Tool", "Desktop App", "AI Product", "Web3 Platform"];

export function WorkSection({ projects }: WorkSectionProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="content-section section-shell py-16 md:py-24">
      {/* Header */}
      <Reveal>
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow mb-4">Selected Work</p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.96] tracking-[-0.05em] text-ink">
            Projects built with
            <br />
            intention and craft.
          </h2>
        </div>
      </Reveal>

      {/* Filter pills */}
      <Reveal delay={0.08}>
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`rounded-full px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                activeFilter === cat
                  ? "bg-ink text-canvas"
                  : "border border-line text-muted hover:border-ink/20 hover:text-ink"
              }`}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </Reveal>

      {/* Project grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          className="grid gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={filtered.length === 1 || (activeFilter === "All" && index === 0)}
              delay={index * 0.06}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-muted">
          No projects in this category yet.
        </div>
      )}
    </section>
  );
}
