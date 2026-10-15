"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useStagger, useTransition, useTravel } from "@/lib/litt/motion";

/**
 * The intro is the view's one expressive moment: it arrives once, on load, as a short
 * cascade (opacity and transform only, one --stagger apart). Nothing else on the page
 * moves by itself. Under reduced motion the hooks return zero and everything is in place.
 */
function Arrive({ index, className, children }: { index: number; className?: string; children: ReactNode }) {
  const travel = useTravel();
  const stagger = useStagger();
  const enter = useTransition("expressive");
  const transition = { ...enter, delay: index * stagger };

  return (
    <motion.div
      className={className}
      // The server renders the resting travel; a reduced-motion client reads zero.
      suppressHydrationWarning
      initial={{ opacity: 0, y: travel }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function IntroSection() {
  return (
    <section aria-labelledby="intro-heading" className="pt-16 sm:pt-24 lg:pt-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-6">
          {/* The portrait: a flat raised surface that catches the top light on its upper edge. */}
          <Arrive index={0} className="lg:col-start-11 lg:col-end-13 lg:row-start-1">
            <div className="litt-raised aspect-square w-24 p-1 lg:w-full">
              <Image
                src="/nick.png"
                alt="Portrait of Nick"
                width={728}
                height={728}
                sizes="(min-width: 1024px) 192px, 96px"
                className="size-full rounded-litt-control object-cover"
                priority
              />
            </div>
          </Arrive>

          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <Arrive index={1}>
              <p className="text-litt-body text-litt-fg">
                Nick Georgiev
                <span className="text-litt-fg-subtle"> · Designer &amp; engineer</span>
              </p>
            </Arrive>

            <Arrive index={2} className="mt-6">
              <h1 id="intro-heading" className="text-litt-display text-litt-fg text-balance">
                I design sites, products, and tools that are simple, usable, and feel considered.
              </h1>
            </Arrive>

            <Arrive index={3} className="mt-8">
              <p className="max-w-(--litt-measure) text-litt-reading text-litt-fg-muted">
                Hi, I&apos;m Nick. I got into design through art and a fascination with how people interact with things - spaces, objects and screens. Studying marketing in Australia only made it worse.
              </p>
            </Arrive>
          </div>
        </div>
      </div>
    </section>
  );
}
