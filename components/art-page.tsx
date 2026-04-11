"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

function Lightbox({
  piece,
  onClose,
  onPrev,
  onNext,
}: {
  piece: (typeof artPieces)[0];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-white/90 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 text-[13px] text-[#a3a3a3] transition-colors hover:text-[#0a0a0a]"
      >
        Close
      </button>

      {/* Prev / Next */}
      <button
        onClick={onPrev}
        className="absolute left-6 top-1/2 z-10 -translate-y-1/2 text-[20px] text-[#a3a3a3] transition-colors hover:text-[#0a0a0a]"
      >
        ←
      </button>
      <button
        onClick={onNext}
        className="absolute right-6 top-1/2 z-10 -translate-y-1/2 text-[20px] text-[#a3a3a3] transition-colors hover:text-[#0a0a0a]"
      >
        →
      </button>

      {/* Image */}
      <motion.div
        className="relative z-10 max-h-[85vh] max-w-[90vw]"
        initial={{ scale: 0.9, filter: "blur(8px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        exit={{ scale: 0.95, filter: "blur(4px)" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        key={piece.src}
      >
        <Image
          src={piece.src}
          alt={piece.title}
          width={1400}
          height={900}
          className="h-auto max-h-[80vh] w-auto object-contain"
          priority
        />
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-[15px] tracking-[-0.01em] text-[#0a0a0a]">
            {piece.title}
          </span>
          <div className="flex gap-3">
            <span className="font-mono text-[10px] text-[#a3a3a3]">
              {piece.medium}
            </span>
            <span className="font-mono text-[10px] tabular-nums text-[#a3a3a3]">
              {piece.year}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ArtPage() {
  const reduceMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPiece = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + artPieces.length) % artPieces.length : null));
  const nextPiece = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % artPieces.length : null));

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
            className="cursor-pointer"
            onClick={() => openLightbox(i)}
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
            whileHover={reduceMotion ? {} : { y: -4 }}
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

      {/* Featured — ImmutArt */}
      <div className="mt-24">
        <motion.p
          className="eyebrow mb-10"
          initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
          whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 30 }}
        >
          Featured
        </motion.p>

        <motion.div
          className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white"
          initial={reduceMotion ? {} : { opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 80, damping: 28 }}
        >
          {/* Hero image — the piece */}
          <div
            className="cursor-pointer p-6 md:p-10"
            onClick={() => openLightbox(artPieces.findIndex(p => p.title === "Reaching My Self Destruction"))}
          >
            <Image
              src="/art/pieces/immutart-feature/piece.jpeg"
              alt="Reaching My Self Destruction"
              width={1200}
              height={800}
              className="h-auto w-full"
            />
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[22px] font-medium tracking-[-0.03em] text-[#0a0a0a]">
                  Reaching My Self Destruction
                </h3>
                <p className="mt-2 text-[13px] text-[#a3a3a3]">
                  1/1 — sold at auction for 3,700 HBAR
                </p>
              </div>
              <span className="rounded-full border border-[rgba(0,0,0,0.06)] px-3 py-1 font-mono text-[10px] tabular-nums text-[#a3a3a3]">
                Oct 2024
              </span>
            </div>

            <p className="mt-5 max-w-lg text-[14px] leading-[1.7] text-[#525252]">
              Featured as New Artist Spotlight on ImmutArt, an online gallery on the Hedera network. The piece explores emotional turbulence through layered collage, typography, and color.
            </p>

            {/* Image grid — feature screenshots, natural ratios */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <Image
                src="/art/pieces/immutart-feature/poster.jpeg"
                alt="Poster"
                width={600}
                height={840}
                className="h-auto w-full rounded-lg border border-[rgba(0,0,0,0.06)]"
                unoptimized
              />
              <Image
                src="/art/pieces/immutart-feature/feature.jpeg"
                alt="ImmutArt feature page"
                width={600}
                height={600}
                className="h-auto w-full rounded-lg border border-[rgba(0,0,0,0.06)]"
                unoptimized
              />
              <Image
                src="/art/pieces/immutart-feature/spotlight.png"
                alt="ImmutArt spotlight tweet"
                width={600}
                height={720}
                className="h-auto w-full rounded-lg border border-[rgba(0,0,0,0.06)]"
                unoptimized
              />
              <Image
                src="/art/pieces/immutart-feature/sold-tweet.png"
                alt="Sold — 3,700 HBAR"
                width={600}
                height={720}
                className="h-auto w-full rounded-lg border border-[rgba(0,0,0,0.06)]"
                unoptimized
              />
            </div>

            {/* Links */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://immuta.art/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-2 text-[13px] text-[#737373] transition-colors duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#0a0a0a]"
              >
                ImmutArt
                <span className="text-[11px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">↗</span>
              </a>
              <a
                href="https://x.com/immuta_art/status/1844058791031238957"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-2 text-[13px] text-[#737373] transition-colors duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#0a0a0a]"
              >
                Spotlight Post
                <span className="text-[11px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">↗</span>
              </a>
              <a
                href="https://x.com/SentXSales/status/1844720406554349835"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-2 text-[13px] text-[#737373] transition-colors duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#0a0a0a]"
              >
                Sold
                <span className="text-[11px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            piece={artPieces[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={prevPiece}
            onNext={nextPiece}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
