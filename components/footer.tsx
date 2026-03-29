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
        <p className="text-[15px] leading-[1.7] text-[#525252]">
          {settings.heroIntro}
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
              &nearr;
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
            &nearr;
          </span>
        </motion.a>
      </motion.div>
    </footer>
  );
}
