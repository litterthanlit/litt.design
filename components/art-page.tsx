"use client";

import { motion, useReducedMotion } from "framer-motion";

const artProjects = [
  {
    title: "litt.works",
    description: "Abstract digital art exploring emotional turbulence and psychological landscapes. Seven pieces — fire, emptiness, chaos, stillness.",
    url: "https://litt.works/",
    year: "2024–2026",
    medium: "Digital Art / Prints",
    accent: "#8B0000",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #2d1111 100%)",
  },
  {
    title: "LITOPIA",
    description: "A scrolling visual magazine. Three chapters of art direction, motion, and curated imagery — built on Readymag.",
    url: "https://readymag.website/u286719728/4633791/",
    year: "2024–2026",
    medium: "Digital Magazine",
    accent: "#0080FF",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0c1a3d 100%)",
  },
];

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

export function ArtPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="section-shell min-h-screen pb-20 pt-28 md:pt-36">
      {/* Header */}
      <motion.p
        className="eyebrow mb-4"
        initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 30 }}
      >
        Art
      </motion.p>

      <motion.p
        className="mb-16 max-w-lg text-[15px] leading-[1.7] text-[#737373]"
        {...useFadeUp(0.06)}
      >
        Separate from client work. Abstract, digital, mostly dark.
      </motion.p>

      {/* Art cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {artProjects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)]"
            initial={
              reduceMotion
                ? {}
                : { opacity: 0, y: 20, filter: "blur(8px)" }
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 28,
              delay: i * 0.08,
            }}
            whileHover={reduceMotion ? {} : { y: -4 }}
          >
            {/* Gradient panel */}
            <div
              className="h-48 transition-transform duration-500 group-hover:scale-[1.02] md:h-56"
              style={{ background: project.gradient }}
            />

            {/* Info */}
            <div className="space-y-3 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: project.accent }}
                  />
                  <span className="text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
                    {project.title}
                  </span>
                </div>
                <span className="text-[12px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">
                  ↗
                </span>
              </div>

              <p className="text-[13px] leading-[1.6] text-[#525252]">
                {project.description}
              </p>

              <div className="flex gap-2">
                <span className="rounded-full border border-[rgba(0,0,0,0.06)] px-3 py-1 font-mono text-[10px] text-[#a3a3a3]">
                  {project.medium}
                </span>
                <span className="rounded-full border border-[rgba(0,0,0,0.06)] px-3 py-1 font-mono text-[10px] tabular-nums text-[#a3a3a3]">
                  {project.year}
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </main>
  );
}
