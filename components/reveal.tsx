"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  blur?: number;
};

export function Reveal({ children, className, delay = 0, blur = 4 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  // Always animate to visible: the server renders the hidden initial state,
  // and hydration won't clear it if reduced motion swaps in a plain element.
  // The server can't know the preference, so CSS shows it at once under
  // reduced motion instead of waiting for it to scroll into view.
  return (
    <motion.div
      className={`motion-reduce:opacity-100! motion-reduce:transform-none! motion-reduce:filter-none! ${className ?? ""}`}
      initial={reduceMotion ? {} : { opacity: 0, y: 20, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 100, damping: 30, mass: 1, delay }
      }
    >
      {children}
    </motion.div>
  );
}
