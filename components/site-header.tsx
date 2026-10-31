"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function SiteHeader() {
  const [showTooltip, setShowTooltip] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative z-50" style={{ viewTransitionName: "site-header" }}>
      <div className="section-shell flex items-center justify-between py-5">
        <div
          className="relative shrink-0"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        >
          <Link href="/" transitionTypes={["nav-back"]} aria-label="Home">
            {/* Animated AVIF with a WebP fallback, and a still frame under reduced motion */}
            <picture>
              <source media="(prefers-reduced-motion: reduce)" srcSet="/logo-still.webp" />
              <source type="image/avif" srcSet="/logo.avif" />
              <img
                src="/logo.webp"
                alt="litt.design"
                width={80}
                height={57}
                className="w-16 sm:w-20"
                fetchPriority="high"
              />
            </picture>
          </Link>

          <AnimatePresence>
            {showTooltip && (
              <motion.span
                className="absolute left-full top-1/2 ml-3 whitespace-nowrap rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-3.5 py-1.5 text-[12px] text-[#0a0a0a]"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: -6, scale: 0.96, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: -4, scale: 0.97, filter: "blur(2px)" }
                }
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                frame by frame
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex flex-wrap items-center justify-end gap-x-2.5 gap-y-1 sm:gap-x-6">
          <Link href="/#work" className="link text-body">
            Work
          </Link>
          <Link
            href="/services"
            transitionTypes={["nav-forward"]}
            className="link text-body"
          >
            Services
          </Link>
          {/* /art and /studies are separate apps on this domain: plain <a>, not <Link> */}
          <a href="/art" className="link text-body">
            Art
          </a>
          <a href="/studies" className="link text-body">
            Studies
          </a>
        </nav>
      </div>
    </header>
  );
}
