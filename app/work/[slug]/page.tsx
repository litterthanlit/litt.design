import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectPanels } from "@/components/project-panels";
import { projects } from "@/data/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.oneLineOutcome,
    openGraph: {
      title: `${project.title} | litt.design`,
      description: project.oneLineOutcome,
      images: ["/og.svg"],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const nextProject =
    projects[(projects.findIndex((entry) => entry.slug === project.slug) + 1) % projects.length];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-16 px-5 pb-20 pt-32 md:px-8 lg:px-12">
      <section className="grid gap-10 border-b border-line pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <p className="eyebrow">Case Study</p>
          <h1 className="font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.92] tracking-[-0.06em] text-ink">
            {project.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted">{project.oneLineOutcome}</p>
        </div>
        <dl className="grid gap-6 text-sm text-muted sm:grid-cols-2">
          <div>
            <dt className="eyebrow mb-2">Client</dt>
            <dd className="text-base text-ink">{project.client}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Year</dt>
            <dd className="text-base text-ink">{project.year}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Category</dt>
            <dd className="text-base text-ink">{project.category}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Services</dt>
            <dd className="text-base text-ink">{project.services.join(" / ")}</dd>
          </div>
        </dl>
      </section>

      <ProjectPanels frames={project.heroFrames} accent={project.accent} reducedMotionMode="static" />

      <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="space-y-4">
          <p className="eyebrow">Brief</p>
          <p className="text-lg leading-8 text-muted">
            {project.storyBlocks.find((block) => block.label === "Challenge")?.body}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {project.metrics?.map((metric) => (
            <article key={metric.label} className="rounded-[2rem] border border-line bg-white/75 p-6">
              <p className="font-display text-4xl tracking-[-0.06em] text-ink">{metric.value}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-muted">{metric.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        {project.storyBlocks.map((block, index) => (
          <article
            key={block.label}
            className={`rounded-[2rem] border border-line p-8 ${
              index % 2 === 0 ? "bg-white/70" : "bg-panel/75"
            }`}
          >
            <p className="eyebrow mb-5">{block.label}</p>
            <h2 className="font-display text-3xl tracking-[-0.05em] text-ink">{block.heading}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">{block.body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2.4rem] border border-line bg-ink px-8 py-10 text-canvas md:px-10 md:py-12">
        <p className="eyebrow text-canvas/60">Next Project</p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.94] tracking-[-0.06em]">
              {nextProject.title}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-canvas/72">{nextProject.oneLineOutcome}</p>
          </div>
          <Link className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em]" href={`/work/${nextProject.slug}`}>
            Open case study
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

