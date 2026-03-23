"use client";

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { SiteSettings } from "@/data/types";

type HeroTextProps = {
  settings: SiteSettings;
};

export function HeroText({ settings }: HeroTextProps) {
  return (
    <div className="flex h-full flex-col justify-between border-r border-line py-8 pl-5 pr-6 md:py-12 md:pl-8 md:pr-10 lg:pl-12 lg:pr-14">
      {/* Top: brand */}
      <Reveal delay={0.05}>
        <p className="font-display text-sm font-medium tracking-[-0.04em] text-ink">
          {settings.brandName}
        </p>
      </Reveal>

      {/* Center: headline */}
      <div className="my-auto space-y-5 py-8">
        <Reveal delay={0.12}>
          <h1 className="max-w-md font-display text-[clamp(1.8rem,3.2vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.04em] text-ink">
            Web experiences, brand identity and motion that{" "}
            <span className="bg-accent/25 px-0.5">convert</span>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-sm text-sm leading-7 text-muted">
            {settings.heroIntro}
          </p>
        </Reveal>
      </div>

      {/* Bottom: availability + CTA */}
      <Reveal delay={0.28}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(194,255,77,0.18)]" />
            <span>{settings.availability.label}</span>
          </div>
          <Link
            href={`mailto:${settings.contactEmail}`}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-canvas"
          >
            Start a project
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
