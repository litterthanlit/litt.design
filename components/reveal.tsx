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

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
        mass: 1,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
