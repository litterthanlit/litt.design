"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { quietFade } from "@/lib/motion";

const destinations = [
  {
    label: "litt.works",
    tag: "Art",
    href: "https://litt.works/",
    image: "/art/pieces/chaos.jpg",
  },
  {
    label: "LITOPIA",
    tag: "Magazine",
    href: "https://readymag.website/u286719728/4633791/",
    image: "/art/pieces/above-the-distance.jpeg",
  },
  {
    label: "Wavr",
    tag: "Live",
    href: "https://wavr-v1.vercel.app/",
    image: "/previews/wavr.jpg",
  },
  {
    label: "Studio OS",
    tag: "Live",
    href: "https://studio-os.io/",
    image: "/previews/studio-os.png",
  },
];

export function ElsewhereSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-shell pb-8 md:pb-12">
      <motion.p className="eyebrow mb-8" {...quietFade(reduceMotion)}>
        Elsewhere
      </motion.p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {destinations.map((destination, index) => (
          <motion.a
            key={destination.href}
            href={destination.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[21/9] overflow-hidden bg-[#111] md:aspect-[16/10]"
            {...quietFade(reduceMotion, index * 0.04)}
          >
            <Image
              src={destination.image}
              alt={destination.label}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <span className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white/80">
              {destination.tag}
            </span>
            <span className="absolute bottom-4 left-4 flex items-baseline gap-2 text-[13px] font-medium tracking-[-0.01em] text-white">
              {destination.label}
              <span className="translate-x-[-4px] text-[12px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
