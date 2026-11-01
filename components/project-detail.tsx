import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/work-section";
import type { Project } from "@/data/types";

type ProjectDetailProps = {
  project: Project;
  nextProject: Project;
};

// Same frame as the homepage work cards
const FRAME =
  "relative aspect-[16/10] overflow-hidden rounded-[10px] border border-[rgba(0,0,0,0.08)]";

function hostname(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

export function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const { preview, background, position } = project.coverMedia;
  const facts = [project.category, project.year, project.status].filter(Boolean);
  const screens = (project.screens ?? []).filter((screen) => screen.src !== preview);

  return (
    <main className="section-shell min-h-screen pb-20 pt-36 md:pt-44">
      <div className="max-w-[680px]">
        {/* Same shape as the homepage intro: the title opens the paragraph */}
        <section className="reveal-in">
          <div className="max-w-[520px] text-intro text-ink">
            <h1 className="inline">{project.title}.</h1>{" "}
            <p className="inline">{project.oneLineOutcome}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {facts.map((fact) => (
              <span key={fact} className="meta">
                {fact}
              </span>
            ))}
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-body"
              >
                {hostname(project.externalUrl)} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </section>

        <div className={`reveal-in mt-10 [animation-delay:60ms] ${FRAME}`} style={{ background }}>
          {preview && (
            <Image
              src={preview}
              alt={`${project.title} preview`}
              fill
              priority
              sizes="(min-width: 768px) 680px, 100vw"
              className="object-cover"
              style={{ objectPosition: position ?? "center" }}
            />
          )}
        </div>

        <Reveal className="mt-10 max-w-[520px]">
          <p className="text-body text-muted">{project.description}</p>
        </Reveal>

        {project.storyBlocks.length > 0 && (
          <section className="mt-16 grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
            {project.storyBlocks.map((block, i) => (
              <Reveal key={block.label} delay={(i % 2) * 0.05}>
                <p className="meta">{block.label}</p>
                <h2 className="mt-1 text-body font-medium text-ink">{block.heading}</h2>
                <p className="mt-0.5 text-body text-muted">{block.body}</p>
              </Reveal>
            ))}
          </section>
        )}

        {screens.length > 0 && (
          <section className="mt-16" aria-labelledby="screens-heading">
            <h2 id="screens-heading" className="eyebrow mb-6">
              Screens
            </h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2">
              {screens.map((screen, i) => (
                <Reveal key={screen.src} delay={(i % 2) * 0.05}>
                  <figure>
                    <div className={`${FRAME} bg-[#f0f0f0]`}>
                      <Image
                        src={screen.src}
                        alt={`${project.title}: ${screen.description}`}
                        fill
                        sizes="(min-width: 640px) 340px, 100vw"
                        className="object-cover object-top"
                      />
                    </div>
                    <figcaption className="mt-3">
                      <span className="text-body font-medium text-ink">{screen.label}</span>
                      <span className="mt-0.5 block text-body text-muted">{screen.description}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16" aria-labelledby="stack-heading">
          <h2 id="stack-heading" className="eyebrow mb-3">
            Stack
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {project.stack.map((tech) => (
              <span key={tech} className="meta">
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section
          className="mt-20 border-t border-[rgba(0,0,0,0.06)] pt-8"
          aria-labelledby="next-heading"
        >
          <h2 id="next-heading" className="eyebrow mb-6">
            Next project
          </h2>
          <div className="sm:w-[calc(50%-10px)]">
            <ProjectCard project={nextProject} />
          </div>
        </section>
      </div>
    </main>
  );
}
