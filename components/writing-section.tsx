"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WritingEntry } from "@/data/writing";

type WritingSectionProps = {
  entries: WritingEntry[];
};

export function WritingSection({ entries }: WritingSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="writing" className="section-shell py-16 md:py-24">
      <motion.p
        className="eyebrow mb-8"
        initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 30 }}
      >
        Writing
      </motion.p>

      <div className="space-y-0">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.slug}
            className="group flex items-baseline justify-between border-b border-[rgba(0,0,0,0.06)] py-3.5"
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
            <span className="text-[15px] tracking-[-0.01em] text-[#0a0a0a] transition-colors duration-150 group-hover:text-[#525252]">
              {entry.title}
            </span>
            <span className="ml-4 shrink-0 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
              {entry.date}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="mt-6 text-[12px] italic text-[#a3a3a3]"
        initial={reduceMotion ? {} : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Coming soon
      </motion.p>
    </section>
  );
}
