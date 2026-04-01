"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { HeroFrame } from "@/data/types";

type ProjectPanelsProps = {
  frames: HeroFrame[];
  accent: string;
  reducedMotionMode?: "static" | "gentle";
};

type Pointer = {
  x: number;
  y: number;
};

export function ProjectPanels({
  frames,
  accent,
  reducedMotionMode = "gentle",
}: ProjectPanelsProps) {
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion || reducedMotionMode === "static") {
      return;
    }

    const updatePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x, y });
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, [reduceMotion, reducedMotionMode]);

  const shouldAnimate = !reduceMotion && reducedMotionMode !== "static";

  return (
    <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[2.6rem] border border-line bg-white/55 px-6 py-10 sm:min-h-[420px] lg:min-h-[620px]">
      <div
        className="absolute inset-[9%] rounded-[2rem] opacity-70 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, ${accent}44 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-180 text-[0.72rem] uppercase tracking-[0.28em] text-muted [writing-mode:vertical-rl] md:block">
        True-to-life details
      </div>
      <div className="relative flex h-full w-full max-w-[760px] items-center justify-center gap-1 sm:gap-2">
        {frames.map((frame, index) => {
          const offset = index - (frames.length - 1) / 2;
          const rotateY = offset * 11 + (shouldAnimate ? pointer.x * 8 : 0);
          const translateY = Math.abs(offset) * 7 + (shouldAnimate ? pointer.y * -10 : 0);
          const translateX = offset * 8;
          const scale = 1 - Math.abs(offset) * 0.02;

          return (
            <motion.div
              key={frame.id}
              className="relative h-[270px] w-[12%] origin-center overflow-hidden rounded-[1.2rem] border border-white/60 shadow-[0_24px_50px_rgba(19,19,19,0.12)] sm:h-[340px] lg:h-[520px]"
              animate={{
                rotateY,
                x: translateX,
                y: translateY,
                scale,
              }}
              transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.7 }}
              style={{
                transformStyle: "preserve-3d",
                background: frame.background,
              }}
            >
              <div
                className="absolute inset-0 opacity-55 mix-blend-multiply"
                style={{ backgroundImage: frame.texture }}
              />
              <div
                className="absolute inset-y-0 left-[var(--slice-position)] w-[180%] -translate-x-1/2"
                style={{
                  "--slice-position": `${frame.focus * 100}%`,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 36%, rgba(0,0,0,0.18) 100%)",
                } as CSSProperties}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
