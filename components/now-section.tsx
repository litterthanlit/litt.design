"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { NowEntry } from "@/data/now";

type NowSectionProps = {
  entries: NowEntry[];
};

export function NowSection({ entries }: NowSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="now" aria-labelledby="now-heading" className="section-shell py-16 md:py-24">
      <motion.h2
        id="now-heading"
        className="eyebrow mb-8"
        initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 30 }}
      >
        Currently making
      </motion.h2>

      <ul className="max-w-2xl">
        {entries.map((entry, i) => (
          <motion.li
            key={entry.title}
            className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-[rgba(0,0,0,0.06)] py-4"
            initial={reduceMotion ? {} : { opacity: 0, y: 10, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ type: "spring", stiffness: 120, damping: 28, delay: i * 0.04 }}
          >
            <h3 className="flex items-center gap-2.5 text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C2FF4D] shadow-[0_0_0_3px_rgba(194,255,77,0.25)]"
                aria-hidden="true"
              />
              {entry.title}
            </h3>
            <span className="self-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
              {entry.kind}
            </span>
            <p className="col-span-2 mt-1.5 text-[14px] leading-[1.6] text-[#737373]">
              {entry.note}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
