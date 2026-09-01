"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { quietFade } from "@/lib/motion";

export function ProofSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-shell py-8 md:py-12">
      <motion.div className="max-w-[680px]" {...quietFade(reduceMotion)}>
        <p className="eyebrow mb-8">Proof</p>
        <Link
          href="/art#featured"
          {...({ transitionTypes: ["nav-forward"] } as { transitionTypes: string[] })}
          className="group block"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
            <Image
              src="/art/pieces/immutart-feature/piece.jpeg"
              alt="Reaching My Self Destruction"
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <h2 className="text-[17px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
              Reaching My Self Destruction
            </h2>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
              2024
            </span>
          </div>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-[#737373]">
            1/1 sold at auction — ImmutArt, Hedera.
          </p>
        </Link>
      </motion.div>
    </section>
  );
}
