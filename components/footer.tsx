"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SiteSettings } from "@/data/types";

type FooterProps = {
  settings: SiteSettings;
};

export function Footer({ settings }: FooterProps) {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20, filter: "blur(4px)" } as const,
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
          viewport: { once: true, margin: "-80px" } as const,
          transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 30,
            delay,
          },
        };

  return (
    <footer className="section-shell border-t border-[rgba(0,0,0,0.06)] py-16 md:py-24">
      {/* Bio */}
      <motion.div className="max-w-xl" {...fadeUp(0)}>
        <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.02em] text-[#0a0a0a]">
          I build tools for creators.
        </p>
        <p className="mt-2 text-[20px] font-medium leading-[1.5] tracking-[-0.02em] text-[#0a0a0a]">
          The craft is in what I leave out.
        </p>
        <p className="mt-2 text-[20px] font-medium leading-[1.5] tracking-[-0.02em] text-[#0a0a0a]">
          Life is play.
        </p>
        <p className="mt-4 text-[13px] leading-[1.7] text-[#a3a3a3]">
          {settings.location} &middot; {settings.availability.label}
        </p>
      </motion.div>

      {/* Socials */}
      <motion.div className="mt-10 flex flex-wrap gap-2" {...fadeUp(0.08)}>
        {settings.socialLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-2 text-[13px] text-[#737373] transition-colors duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#0a0a0a]"
            whileHover={reduceMotion ? {} : { y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={
              reduceMotion
                ? {}
                : { opacity: 0, y: 12, filter: "blur(2px)" }
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              delay: 0.12 + i * 0.04,
            }}
          >
            {link.label}
            <span className="text-[11px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">
              ↗
            </span>
          </motion.a>
        ))}

        {/* Email */}
        <motion.a
          href={`mailto:${settings.contactEmail}`}
          className="group flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 py-2 text-[13px] text-[#737373] transition-colors duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#0a0a0a]"
          whileHover={reduceMotion ? {} : { y: -2 }}
          whileTap={{ scale: 0.97 }}
          initial={
            reduceMotion
              ? {}
              : { opacity: 0, y: 12, filter: "blur(2px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            delay: 0.12 + settings.socialLinks.length * 0.04,
          }}
        >
          {settings.contactEmail}
          <span className="text-[11px] text-[#a3a3a3] transition-colors duration-150 group-hover:text-[#0a0a0a]">
            ↗
          </span>
        </motion.a>
      </motion.div>
    </footer>
  );
}

export function ThankYouOrb() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-32 md:py-48">
      {/* Outer bloom — large, soft, diffused */}
      <div
        className="absolute h-[600px] w-[600px] rounded-full blur-[100px] md:h-[700px] md:w-[700px]"
        style={{
          background:
            "radial-gradient(circle, rgba(206,220,80,0.2) 0%, rgba(180,210,60,0.06) 50%, transparent 70%)",
        }}
      />

      {/* Mid bloom — tighter glow ring */}
      <div
        className="absolute h-[420px] w-[420px] rounded-full blur-[60px] md:h-[500px] md:w-[500px]"
        style={{
          background:
            "radial-gradient(circle, rgba(206,220,80,0.35) 0%, rgba(200,216,74,0.12) 60%, transparent 80%)",
        }}
      />

      {/* Inner bloom — bright halo around orb edge */}
      <div
        className="absolute h-[320px] w-[320px] rounded-full blur-[30px] md:h-[400px] md:w-[400px]"
        style={{
          background:
            "radial-gradient(circle, rgba(228,236,138,0.5) 0%, rgba(213,224,96,0.2) 50%, transparent 70%)",
        }}
      />

      {/* Orb — soft gradient with blur on edges */}
      <div
        className="relative flex h-[280px] w-[280px] items-center justify-center rounded-full md:h-[360px] md:w-[360px]"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(228,236,138,0.9) 0%, rgba(213,224,96,0.85) 30%, rgba(200,216,74,0.75) 60%, rgba(180,200,60,0.5) 100%)",
          boxShadow:
            "0 0 60px rgba(206,220,80,0.4), 0 0 120px rgba(206,220,80,0.15), inset 0 0 80px rgba(255,255,255,0.1)",
        }}
      >
        <p className="pl-8 text-[16px] font-medium leading-[1.5] tracking-[-0.01em] text-white/90 drop-shadow-[0_1px_8px_rgba(255,255,255,0.3)] md:text-[18px]">
          thank you
          <br />
          for being here
        </p>
      </div>
    </section>
  );
}
