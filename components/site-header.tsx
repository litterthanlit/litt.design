"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function SiteHeader() {
  const [showTooltip, setShowTooltip] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative z-50">
      <div className="section-shell flex items-center justify-between py-5">
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Link href="/" aria-label="Home">
            <Image
              src="/logo.gif"
              alt="litt.design"
              width={80}
              height={42}
              unoptimized
              priority
            />
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

        <nav className="flex items-center gap-6">
          {[
            { label: "Work", href: "/#work" },
            { label: "Craft", href: "/craft" },
            { label: "Art", href: "/art" },
            { label: "Writing", href: "/#writing" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] tracking-[-0.01em] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
