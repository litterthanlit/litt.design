"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { quietFade } from "@/lib/motion";

type ArtPiece = {
  title: string;
  src: string;
  year: string;
  medium: string;
};

const artPieces: ArtPiece[] = [
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
];

const featuredPiece: ArtPiece = {
  title: "Reaching My Self Destruction",
  src: "/art/reaching-my-self-destruction.png",
  year: "2024",
  medium: "Digital",
};

const lightboxPieces: ArtPiece[] = [...artPieces, featuredPiece];

const artRows: ArtPiece[][] = [
  [artPieces[0]],
  [artPieces[1]],
  [artPieces[2], artPieces[3], artPieces[4]],
  [artPieces[5], artPieces[6]],
  [artPieces[7]],
  [artPieces[8], artPieces[9]],
  [artPieces[10]],
  [artPieces[11]],
  [artPieces[12], artPieces[13], artPieces[14]],
];

function Lightbox({
  piece,
  onClose,
  onPrev,
  onNext,
}: {
  piece: ArtPiece;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 text-[13px] text-[#a3a3a3] transition-colors hover:text-[#0a0a0a]"
      >
        Close
      </button>
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

      <motion.div
        className="relative z-10 max-h-[85vh] max-w-[90vw]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        key={piece.src}
      >
        <Image
          src={piece.src}
          alt={piece.title}
          width={1400}
          height={900}
          className="h-auto max-h-[80vh] w-auto object-contain"
          unoptimized={piece.src.endsWith(".gif")}
          priority
        />
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <span className="text-[15px] tracking-[-0.01em] text-[#0a0a0a]">{piece.title}</span>
          <div className="flex gap-3">
            <span className="font-mono text-[10px] text-[#a3a3a3]">{piece.medium}</span>
            <span className="font-mono text-[10px] tabular-nums text-[#a3a3a3]">{piece.year}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ArtImage({
  piece,
  square,
  onOpen,
}: {
  piece: ArtPiece;
  square: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full cursor-pointer overflow-hidden bg-[#f0f0f0] text-left"
    >
      <Image
        src={piece.src}
        alt={piece.title}
        width={square ? 800 : 1200}
        height={square ? 800 : 800}
        className={square ? "aspect-square h-auto w-full object-cover" : "h-auto w-full"}
        sizes={square ? "(max-width: 768px) 50vw, 360px" : "(max-width: 768px) 100vw, 720px"}
        unoptimized={piece.src.endsWith(".gif")}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-3 pb-2.5 pt-8 text-[12px] tracking-[-0.01em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        {piece.title}
      </span>
    </button>
  );
}

export function ArtPage() {
  const reduceMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const rows = useMemo(
    () => artRows.filter((row) => row.every((piece) => piece !== undefined)),
    [],
  );

  const openPiece = (piece: ArtPiece) => {
    const index = lightboxPieces.findIndex((entry) => entry.src === piece.src);
    if (index >= 0) setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);
  const prevPiece = () =>
    setLightboxIndex((index) =>
      index !== null ? (index - 1 + lightboxPieces.length) % lightboxPieces.length : null,
    );
  const nextPiece = () =>
    setLightboxIndex((index) =>
      index !== null ? (index + 1) % lightboxPieces.length : null,
    );

  return (
    <main className="section-shell min-h-screen pb-20 pt-36 md:pt-44">
      <div className="mx-auto max-w-[720px]">
        <motion.p className="eyebrow mb-8" {...quietFade(reduceMotion)}>
          Art
        </motion.p>

        <div className="flex flex-col gap-1.5">
          {rows.map((row, rowIndex) => (
            <motion.div
              key={row.map((piece) => piece.src).join("-")}
              className={
                row.length === 1
                  ? "grid grid-cols-1 gap-1.5"
                  : row.length === 2
                    ? "grid grid-cols-2 gap-1.5"
                    : "grid grid-cols-3 gap-1.5"
              }
              {...quietFade(reduceMotion, (rowIndex % 4) * 0.03)}
            >
              {row.map((piece) => (
                <ArtImage
                  key={piece.src}
                  piece={piece}
                  square={row.length > 1}
                  onOpen={() => openPiece(piece)}
                />
              ))}
            </motion.div>
          ))}
        </div>

        <div id="featured" className="mt-28 scroll-mt-28">
          <motion.p className="eyebrow mb-8" {...quietFade(reduceMotion)}>
            Featured
          </motion.p>

          <motion.div {...quietFade(reduceMotion, 0.04)}>
            <button
              type="button"
              className="block w-full cursor-pointer text-left"
              onClick={() => openPiece(featuredPiece)}
            >
              <Image
                src="/art/pieces/immutart-feature/piece.jpeg"
                alt="Reaching My Self Destruction"
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </button>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <h3 className="text-[18px] font-medium tracking-[-0.03em] text-[#0a0a0a]">
                Reaching My Self Destruction
              </h3>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
                Oct 2024
              </span>
            </div>
            <p className="mt-2 text-[13px] text-[#a3a3a3]">
              1/1 — sold at auction for 3,700 HBAR
            </p>
            <p className="mt-4 max-w-lg text-[14px] leading-[1.7] text-[#525252]">
              Featured as New Artist Spotlight on ImmutArt, an online gallery on the Hedera
              network. The piece explores emotional turbulence through layered collage,
              typography, and color.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-1.5">
              <Image
                src="/art/pieces/immutart-feature/poster.jpeg"
                alt="Poster"
                width={600}
                height={840}
                className="h-auto w-full"
                unoptimized
              />
              <Image
                src="/art/pieces/immutart-feature/feature.jpeg"
                alt="ImmutArt feature page"
                width={600}
                height={600}
                className="h-auto w-full"
                unoptimized
              />
              <Image
                src="/art/pieces/immutart-feature/spotlight.png"
                alt="ImmutArt spotlight tweet"
                width={600}
                height={720}
                className="h-auto w-full"
                unoptimized
              />
              <Image
                src="/art/pieces/immutart-feature/sold-tweet.png"
                alt="Sold — 3,700 HBAR"
                width={600}
                height={720}
                className="h-auto w-full"
                unoptimized
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href="https://immuta.art/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]"
              >
                ImmutArt ↗
              </a>
              <a
                href="https://x.com/immuta_art/status/1844058791031238957"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]"
              >
                Spotlight ↗
              </a>
              <a
                href="https://x.com/SentXSales/status/1844720406554349835"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]"
              >
                Sold ↗
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && lightboxPieces[lightboxIndex] ? (
          <Lightbox
            piece={lightboxPieces[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={prevPiece}
            onNext={nextPiece}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
