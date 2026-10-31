"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { SiteSettings } from "@/data/types";

type FooterProps = {
  settings: SiteSettings;
};

export function Footer({ settings }: FooterProps) {
  const reduceMotion = useReducedMotion();

  // Same as Reveal: always animate to visible so reduced motion can't leave
  // the server-rendered opacity:0 in place.
  const fadeUp: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: reduceMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 100, damping: 30, delay },
    }),
  };

  // One trigger for the whole footer: when it ends the page, the last row
  // can't scroll 80px into view to trigger its own reveal.
  return (
    <motion.footer
      className="section-shell py-16 md:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Bio */}
      <motion.div className="max-w-xl" variants={fadeUp} custom={0}>
        <p className="text-body font-medium text-ink">I build tools for creators.</p>
        <p className="text-body text-ink">The craft is in what I leave out.</p>
        <p className="text-body text-ink">More play.</p>
        <p className="meta mt-4">
          {settings.location} &middot;{" "}
          <Link href="/services" className="link group">
            {settings.availability.label}
            <span
              className="ml-1 inline-block transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </p>
      </motion.div>

      {/* Socials */}
      <motion.div className="mt-6 flex flex-wrap gap-x-5 gap-y-1" variants={fadeUp} custom={0.08}>
        {settings.socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link text-body"
          >
            {link.label}
          </a>
        ))}
        <a
          href={`mailto:${settings.contactEmail}`}
          className="link text-body"
        >
          {settings.contactEmail}
        </a>
      </motion.div>
    </motion.footer>
  );
}
