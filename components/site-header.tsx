"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/data/types";

type SiteHeaderProps = {
  settings: SiteSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell">
        <div className="mt-4 flex items-center justify-between rounded-full border border-line bg-canvas/82 px-4 py-3 shadow-[0_20px_60px_rgba(19,19,19,0.06)] backdrop-blur-md md:px-6">
          <Link href="/" className="font-display text-lg tracking-[-0.08em] text-ink" onClick={closeMenu}>
            {settings.brandName}
          </Link>
          <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.22em] text-muted md:flex">
            <Link href="#work">Work</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
          </nav>
          <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(194,255,77,0.15)]" />
            <span className="hidden sm:inline">{settings.availability.label}</span>
          </div>
          <button
            type="button"
            className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className="space-y-1.5">
              <span className={`block h-px w-4 bg-current transition ${isOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px w-4 bg-current transition ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-4 bg-current transition ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      {isOpen ? (
        <div className="section-shell md:hidden">
          <div className="mt-3 rounded-[2rem] border border-line bg-canvas/95 p-6 shadow-[0_24px_80px_rgba(19,19,19,0.08)] backdrop-blur-md">
            <nav className="flex flex-col gap-5 text-sm uppercase tracking-[0.22em] text-ink">
              <Link href="#work" onClick={closeMenu}>
                Work
              </Link>
              <Link href="#about" onClick={closeMenu}>
                About
              </Link>
              <Link href="#contact" onClick={closeMenu}>
                Contact
              </Link>
            </nav>
            <div className="mt-8 border-t border-line pt-5 text-xs uppercase tracking-[0.18em] text-muted">
              {settings.availability.label}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
