"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { WritingEntry } from "@/data/writing";

type WritingSectionProps = {
  entries: WritingEntry[];
};

export function WritingSection({ entries }: WritingSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="writing" className="section-shell py-16 md:py-24 *:max-w-[680px]">
      <motion.h2
        className="eyebrow mb-4"
        initial={reduceMotion ? {} : { clipPath: "inset(100% 0 0 0)", y: 8 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 30 }}
      >
        Writing
      </motion.h2>

      <div>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.slug}
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
            {entry.body ? (
              <Link
                href={`/writing/${entry.slug}`}
                {...{ transitionTypes: ["nav-forward"] } as any}
                className="group -mx-2 flex items-baseline justify-between rounded-md px-2 py-2 transition-colors duration-150 ease-out hover:bg-[rgba(0,0,0,0.03)] focus-visible:outline-offset-0 active:bg-[rgba(0,0,0,0.05)]"
              >
                <span className="flex items-center gap-1.5 text-body font-medium text-ink">
                  {entry.title}
                  <span
                    className="-translate-x-1 text-muted opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
                <span className="meta ml-4 shrink-0">
                  {entry.date}
                </span>
              </Link>
            ) : (
              <div className="flex items-baseline justify-between py-2">
                <span className="text-body text-muted">
                  {entry.title}
                  <span className="sr-only"> (draft, not yet published)</span>
                </span>
                <span className="meta ml-4 shrink-0">
                  {entry.date}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

    </section>
  );
}
