import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/data/types";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  delay?: number;
};

export function ProjectCard({ project, featured = false, delay = 0 }: ProjectCardProps) {
  return (
    <Reveal delay={delay} className="group h-full">
      <Link
        href={`/work/${project.slug}`}
        className={`flex h-full flex-col justify-between overflow-hidden rounded-[2.2rem] border border-line ${
          featured ? "min-h-[34rem] bg-white/80" : "min-h-[28rem] bg-panel/60"
        }`}
      >
        <div className="relative flex min-h-[16rem] flex-1 overflow-hidden p-6 md:p-8">
          <div
            className="absolute inset-0 opacity-85 transition duration-500 group-hover:scale-[1.03]"
            style={{
              background: `radial-gradient(circle at 20% 15%, ${project.accent}55, transparent 28%), ${project.coverMedia.background}`,
            }}
          />
          <div className="relative flex w-full items-end justify-between gap-6">
            {project.heroFrames.slice(0, featured ? 7 : 5).map((frame, index) => (
              <div
                key={frame.id}
                className="h-full flex-1 rounded-[1.1rem] border border-white/55 shadow-[0_20px_40px_rgba(19,19,19,0.08)] transition duration-500 group-hover:-translate-y-2"
                style={{
                  background: frame.background,
                  transform: `perspective(900px) rotateY(${(index - 2) * 8}deg) translateY(${Math.abs(index - 2) * 8}px)`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4 border-t border-line p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{project.category}</p>
              <h3 className="mt-3 font-display text-[clamp(2rem,3vw,3.4rem)] leading-[0.94] tracking-[-0.06em] text-ink">
                {project.title}
              </h3>
            </div>
            <span className="text-sm uppercase tracking-[0.22em] text-muted">{project.year}</span>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-sm leading-7 text-muted">{project.oneLineOutcome}</p>
            <span className="text-sm uppercase tracking-[0.22em] text-ink transition group-hover:translate-x-1">
              Open case study ↗
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

