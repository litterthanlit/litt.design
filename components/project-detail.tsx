import Image from "next/image";
import Link from "next/link";
import { HomeRow } from "@/components/home-row";
import type { Project } from "@/data/types";

type ProjectDetailProps = {
  project: Project;
  // The homepage card's cover, when the project has one
  cover?: string;
  nextProject: Project;
  nextCover: string;
};

// The homepage card's grey frame around a 16:10 picture
const FRAME = "rounded-[12px] bg-card p-1";
const PICTURE = "relative aspect-[16/10] overflow-hidden rounded-[8px] bg-card-hover";

function hostname(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

// Laid out in the homepage's rows: a muted label beside a 680px column
export function ProjectDetail({ project, cover, nextProject, nextCover }: ProjectDetailProps) {
  const facts = [project.category, project.year, project.status].filter(Boolean).join(" · ");

  return (
    <main>
      {/* Lines up with the rows, like the homepage intro */}
      <section className="section-shell pt-16 pb-4 md:pt-24 md:pb-6">
        <h1 className="reveal-in max-w-[800px] text-body md:pl-[120px]">
          <span className="block font-medium text-ink">{project.title}</span>
          <span className="block text-muted">{project.oneLineOutcome}</span>
        </h1>
      </section>

      <HomeRow id="overview" label="Overview" className="reveal-in [animation-delay:60ms]">
        {cover && (
          <div className={`${FRAME} mb-6`}>
            <div className={PICTURE}>
              <Image
                src={cover}
                alt={`${project.title} — ${project.oneLineOutcome}`}
                fill
                priority
                sizes="(min-width: 768px) 680px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <p className="max-w-[560px] text-body text-ink">{project.description}</p>
        <p className="meta mt-2">
          {facts}
          {project.externalUrl && (
            <>
              {" "}
              &middot;{" "}
              <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="link">
                {hostname(project.externalUrl)} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          )}
        </p>
      </HomeRow>

      {project.storyBlocks.map((block) => (
        <HomeRow key={block.label} id={block.label.toLowerCase()} label={block.label}>
          <h3 className="text-body font-medium text-ink">{block.heading}</h3>
          <p className="mt-1 max-w-[560px] text-body text-ink/60">{block.body}</p>
        </HomeRow>
      ))}

      {project.screens && project.screens.length > 0 && (
        <HomeRow id="screens" label="Screens">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
            {project.screens.map((screen) => (
              <figure key={screen.src}>
                <div className={FRAME}>
                  <div className={PICTURE}>
                    <Image
                      src={screen.src}
                      alt={`${project.title}: ${screen.description}`}
                      fill
                      sizes="(min-width: 640px) 330px, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <figcaption className="mt-3">
                  <span className="block text-body font-medium text-ink">{screen.label}</span>
                  <span className="mt-1 block text-body text-ink/60">{screen.description}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </HomeRow>
      )}

      <HomeRow id="stack" label="Stack">
        <p className="text-body text-ink">{project.stack.join(" · ")}</p>
      </HomeRow>

      <HomeRow id="next" label="Next">
        <Link
          href={`/work/${nextProject.slug}`}
          transitionTypes={["nav-forward"]}
          className="group grid gap-5 focus-visible:outline-offset-4 sm:grid-cols-[minmax(0,1fr)_200px]"
        >
          <div className={`${FRAME} transition-colors duration-150 ease-out group-hover:bg-card-hover`}>
            <div className={PICTURE}>
              <Image src={nextCover} alt="" fill sizes="(min-width: 640px) 460px, 100vw" className="object-cover" />
            </div>
          </div>
          <div>
            <h3 className="text-body font-medium text-ink">
              {nextProject.title}
              <span
                className="ml-1 inline-block text-muted transition-[translate,color] duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-ink"
                aria-hidden="true"
              >
                →
              </span>
            </h3>
            <p className="mt-1 text-body text-ink/60">{nextProject.oneLineOutcome}</p>
            <p className="meta mt-3">
              {nextProject.category} · {nextProject.year.slice(-4)}
            </p>
          </div>
        </Link>
      </HomeRow>
    </main>
  );
}
