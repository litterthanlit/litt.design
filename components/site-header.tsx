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
        <div className="mt-3 flex items-center justify-between rounded-full border border-[rgba(0,0,0,0.06)] bg-white/80 px-5 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <Link href="/" className="text-[14px] font-medium tracking-[-0.02em] text-[#0a0a0a]" onClick={closeMenu}>
            {settings.brandName}
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#work" className="text-[13px] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]">
              Work
            </Link>
            <Link href="#about" className="text-[13px] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]">
              About
            </Link>
            <Link href="#contact" className="text-[13px] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <span className="hidden text-[12px] text-[#737373] sm:inline">
              {settings.availability.label}
            </span>
          </div>

          <button
            type="button"
            className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#737373] transition-colors hover:text-[#0a0a0a] md:hidden"
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className="space-y-1">
              <span className={`block h-px w-3.5 bg-current transition-all duration-200 ${isOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block h-px w-3.5 bg-current transition-all duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-3.5 bg-current transition-all duration-200 ${isOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="section-shell md:hidden">
          <div className="mt-2 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white/95 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <nav className="flex flex-col gap-4">
              <Link href="#work" onClick={closeMenu} className="text-[14px] text-[#0a0a0a]">Work</Link>
              <Link href="#about" onClick={closeMenu} className="text-[14px] text-[#0a0a0a]">About</Link>
              <Link href="#contact" onClick={closeMenu} className="text-[14px] text-[#0a0a0a]">Contact</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
