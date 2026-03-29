import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/data/types";

type WorkSectionProps = {
  projects: Project[];
};

export function WorkSection({ projects }: WorkSectionProps) {
  const [featured, ...rest] = projects;

  return (
    <section id="work" className="content-section section-shell py-14 md:py-20">
      <div className="mb-10 grid gap-6 md:grid-cols-[0.48fr_1fr] md:items-end">
        <div>
          <p className="eyebrow">Selected Work</p>
          <h2 className="mt-4 font-display text-[clamp(2.7rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.06em] text-ink">
            Lean case studies with enough detail to prove the work.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-muted md:justify-self-end">
          Each project brings the same mix of art direction, interface craft, and launch-minded execution. The visual system shifts to fit the company, not the other way around.
        </p>
      </div>
      <div className="grid gap-6">
        <ProjectCard project={featured} featured delay={0.05} />
        <div className="grid gap-6 lg:grid-cols-2">
          {rest.map((project, index) => (
            <ProjectCard key={project.slug} project={project} delay={0.1 + index * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

