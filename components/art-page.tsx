"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const artPieces = [
  { title: "Chaos", src: "/art/pieces/chaos.jpg", year: "2024", medium: "litt.works" },
  { title: "Emptiness Surrounding Me", src: "/art/pieces/emptiness.jpg", year: "2024", medium: "litt.works" },
  { title: "In the Fire", src: "/art/pieces/in-the-fire.jpg", year: "2024", medium: "litt.works" },
  { title: "Shattered", src: "/art/pieces/shattered.jpg", year: "2024", medium: "litt.works" },
  { title: "Unfiltered Projections", src: "/art/pieces/unfiltered-projections.jpg", year: "2024", medium: "litt.works" },
  { title: "Untitled I", src: "/art/pieces/untld1.jpg", year: "2024", medium: "litt.works" },
  { title: "Untitled II", src: "/art/pieces/untld2.jpg", year: "2024", medium: "litt.works" },
  { title: "Above the Distance", src: "/art/pieces/above-the-distance.jpeg", year: "2024", medium: "LITOPIA" },
  { title: "Cacophony of the Unsound", src: "/art/pieces/cacophony-of-the-unsound.jpeg", year: "2024", medium: "LITOPIA" },
  { title: "Gust Came Through Like Spring", src: "/art/pieces/gust-came-through.jpeg", year: "2024", medium: "LITOPIA" },
  { title: "LITOPIA Stop Motion", src: "/art/pieces/litopia-stopmotion.gif", year: "2024", medium: "LITOPIA" },
  { title: "Blur", src: "/art/pieces/blur.jpg", year: "2025", medium: "Digital" },
  { title: "Buzz", src: "/art/pieces/buzz-scanned.jpeg", year: "2025", medium: "Mixed / Scanned" },
  { title: "Unsound Coercion", src: "/art/pieces/unsound-coercion.jpeg", year: "2025", medium: "Digital" },
  { title: "Quiet Collision", src: "/art/pieces/quiet-collision.jpeg", year: "2025", medium: "Digital" },
  { title: "Reaching My Self Destruction", src: "/art/reaching-my-self-destruction.png", year: "2024", medium: "Digital" },
];

const artCollections = [
  {
    title: "litt.works",
    description: "Abstract digital art exploring emotional turbulence and psychological landscapes. Seven pieces — fire, emptiness, chaos, stillness.",
    url: "https://litt.works/",
    year: "2024-2026",
    medium: "Digital Art / Prints",
  },
  {
    title: "LITOPIA",
    description: "A scrolling visual magazine. Three chapters of art direction, motion, and curated imagery — built on Readymag.",
    url: "https://readymag.website/u286719728/4633791/",
    year: "2024-2026",
    medium: "Digital Magazine",
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
    <main className="section-shell min-h-screen pb-20 pt-36 md:pt-44">
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


      {/* Art pieces — 2-up grid */}
      <div className="grid grid-cols-2 gap-x-[124px] gap-y-12">
        {artPieces.map((piece, i) => (
          <motion.div
            key={piece.title}
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
              delay: (i % 2) * 0.06,
            }}
          >
            <Image
              src={piece.src}
              alt={piece.title}
              width={600}
              height={400}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[13px] tracking-[-0.01em] text-[#0a0a0a]">
                {piece.title}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-[#a3a3a3]">
                {piece.year}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collections — external links */}
      <div className="mt-20">
        <motion.p
          className="eyebrow mb-8"
          initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
          whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 30 }}
        >
          Collections
        </motion.p>

        <div className="space-y-0">
          {artCollections.map((col, i) => (
            <motion.a
              key={col.title}
              href={col.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between border-b border-[rgba(0,0,0,0.06)] py-4"
              initial={
                reduceMotion
                  ? {}
                  : { opacity: 0, y: 10, filter: "blur(2px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 28,
                delay: i * 0.04,
              }}
            >
              <div>
                <span className="text-[15px] font-medium tracking-[-0.02em] text-[#0a0a0a] transition-colors duration-150 group-hover:text-[#525252]">
                  {col.title}
                </span>
                <span className="ml-3 text-[13px] text-[#a3a3a3]">
                  {col.description}
                </span>
              </div>
              <span className="ml-4 shrink-0 text-[12px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">
                ↗
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="mt-20">
        <motion.p
          className="eyebrow mb-8"
          initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
          whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 30 }}
        >
          Featured
        </motion.p>

        <motion.a
          href="https://x.com/immuta_art/status/1844058791031238957"
          target="_blank"
          rel="noopener noreferrer"
          className="group block border-b border-[rgba(0,0,0,0.06)] py-4"
          {...useFadeUp(0.06)}
        >
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[15px] font-medium tracking-[-0.02em] text-[#0a0a0a] transition-colors duration-150 group-hover:text-[#525252]">
                ImmutArt — New Artist Spotlight
              </span>
              <span className="ml-3 text-[13px] text-[#a3a3a3]">
                1/1 piece sold at auction for 3,700 HBAR
              </span>
            </div>
            <span className="ml-4 shrink-0 font-mono text-[10px] tabular-nums text-[#a3a3a3]">
              2024
            </span>
          </div>
        </motion.a>
      </div>
    </main>
  );
}
