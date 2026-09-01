"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { quietFade } from "@/lib/motion";

export function IntroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-shell pt-36 pb-12 md:pt-44 md:pb-16">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        <motion.div
          className="h-[150px] w-[150px] shrink-0 overflow-hidden rounded-lg border-2 border-[rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]"
          {...quietFade(reduceMotion)}
        >
          <Image
            src="/nick.png"
            alt="Nick"
            width={150}
            height={150}
            className="h-full w-full object-cover"
            priority
          />
        </motion.div>

        <motion.p
          className="max-w-lg text-[20px] font-normal leading-[1.5] tracking-[-0.02em] text-[#0a0a0a]"
          {...quietFade(reduceMotion, 0.06)}
        >
          Hi, I&apos;m Nick. I got into design through art and a fascination with how people
          interact with things - spaces, objects and screens. Studying marketing in Australia
          only made it worse. Now I design sites, products, and tools that are simple, usable,
          and feel considered.
        </motion.p>
      </div>
    </section>
  );
}
