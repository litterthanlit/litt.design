"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { Project, SiteSettings } from "@/data/types";

const ProjectAccordion = dynamic(
  () => import("@/components/project-accordion").then((mod) => mod.ProjectAccordion),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[32rem] rounded-[2.8rem] border border-line bg-white/50 shadow-[0_40px_120px_rgba(19,19,19,0.08)]" />
    ),
  },
);

type HeroSectionProps = {
  settings: SiteSettings;
  projects: Project[];
};

export function HeroSection({ settings, projects }: HeroSectionProps) {
  return (
    <section className="section-shell relative flex min-h-screen items-center pb-12 pt-28 md:pt-36">
      <div className="w-full space-y-8">
        <Reveal delay={0.1}>
          <p className="max-w-4xl text-sm leading-7 text-muted md:text-base">
            Web experiences, brand identity and motion that converts / moves / flows /
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <ProjectAccordion projects={projects} />
        </Reveal>
        <Reveal delay={0.32}>
          <div className="grid gap-6 border-t border-line pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="grid gap-5 md:grid-cols-2">
              <p className="max-w-md text-sm leading-7 text-muted md:text-base">{settings.heroIntro}</p>
              <p className="max-w-md text-sm leading-7 text-muted md:text-base">
                Hover or tap through the project stack to preview how each engagement shifts its own palette, pace, and point of view.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:justify-end">
              <Link
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-ink px-5 py-3 text-sm uppercase tracking-[0.22em] text-ink transition hover:bg-ink hover:text-canvas"
              >
                Start a project
                <span aria-hidden="true">↗</span>
              </Link>
              <Link href="#work" className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-ink">
                More work
                <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
