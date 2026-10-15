import { ViewTransition } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, CardDescription, CardTitle } from "@/components/litt/card";
import { Tag } from "@/components/litt/tag";
import type { Project } from "@/data/types";

type ProjectDetailProps = {
  project: Project;
  nextProject: Project;
  /** The cover's pixel size, so it keeps its own shape. Without it the cover is 8:5. */
  coverSize?: { width: number; height: number };
};

// litt's primary Button always renders a <button>, and "Visit" is a link that
// leaves the site, so it is an <a> that wears the same lg primary look: the
// control scale, the accent fill and glow (the view's one), and a trimmed label.
const visitLink =
  "relative inline-flex h-litt-control-lg w-fit shrink-0 items-center justify-center whitespace-nowrap select-none " +
  "rounded-litt-control bg-litt-accent px-litt-control-pad-lg text-(length:--litt-control-text-lg) text-litt-accent-fg " +
  "shadow-litt-glow inset-shadow-[0_1px_0_color-mix(in_oklab,var(--litt-accent-fg)_22%,transparent)] " +
  "transition-[background-color,color,scale] duration-(--litt-dur-instant) ease-litt " +
  "hover:bg-litt-accent-hover active:scale-(--litt-press-scale) [-webkit-tap-highlight-color:transparent] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-litt-focus";

// The next project is one card that links somewhere. litt's CardLink renders a
// plain <a>, and the page transition needs next/link, so the link wears
// CardLink's stretched target and focus ring itself.
const nextLink =
  "cursor-pointer text-left outline-none focus-visible:outline-none " +
  "after:absolute after:inset-0 after:rounded-litt-surface " +
  "focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-litt-focus";

/** A flat image surface: the surface radius, a 1px hairline drawn over the picture, no shadow. */
function Shot({
  src,
  alt,
  sizes,
  ratio = "8 / 5",
  preload = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Width over height. A tall page screenshot is cropped to this from its top. */
  ratio?: string;
  preload?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-litt-surface bg-litt-surface-2" style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover object-top" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-litt-surface shadow-[inset_0_0_0_1px_var(--litt-line)]"
      />
    </div>
  );
}

function Caption({ label, description }: { label: string; description: string }) {
  return (
    <figcaption className="mt-4 text-litt-small text-litt-fg-subtle">
      <span className="block text-litt-fg">{label}</span>
      {description}
    </figcaption>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-litt-small text-litt-fg-subtle">{label}</dt>
      <dd className="mt-2 text-litt-small text-litt-fg">{children}</dd>
    </div>
  );
}

export function ProjectDetail({ project, nextProject, coverSize }: ProjectDetailProps) {
  const cover = project.coverMedia.preview;
  // A screen that is also the cover is shown once, under the cover, with its caption.
  const coverScreen = project.screens?.find((screen) => screen.src === cover);
  const screens = project.screens?.filter((screen) => screen.src !== cover) ?? [];

  return (
    <main className="shell">
      {/* Intro: the title and outcome in columns 1-5, the cover in 7-12 */}
      <header className="section">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-(--litt-grid-gap)">
          <div className="lg:col-span-5">
            <ViewTransition name={`project-title-${project.slug}`} share="text-morph" default="none">
              <h1 className="text-litt-h1 text-litt-fg text-balance">{project.title}</h1>
            </ViewTransition>
            <p className="mt-4 max-w-(--litt-measure) text-litt-reading text-litt-fg-muted">
              {project.oneLineOutcome}
            </p>

            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={visitLink + " mt-8"}
              >
                <span className="litt-trim">Visit {project.title}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>

          {cover && (
            <figure className="lg:col-span-6 lg:col-start-7">
              <Shot
                src={cover}
                alt={`${project.title} interface`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                ratio={coverSize ? `${coverSize.width} / ${coverSize.height}` : undefined}
                preload
              />
              {coverScreen && <Caption label={coverScreen.label} description={coverScreen.description} />}
            </figure>
          )}
        </div>
      </header>

      {/* Overview: what it is, then the facts */}
      <section aria-labelledby="overview" className="section">
        <div className="split">
          <h2 id="overview" className="split-label text-litt-h4 text-litt-fg-subtle">
            Overview
          </h2>
          <div className="split-body">
            <p className="max-w-(--litt-measure) text-litt-reading text-litt-fg-muted">{project.description}</p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
              <Fact label="Client">{project.client}</Fact>
              <Fact label="Year">{project.year}</Fact>
              <Fact label="Category">{project.category}</Fact>
              {project.status && (
                <Fact label="Status">
                  <Tag status="neutral">{project.status}</Tag>
                </Fact>
              )}
              <Fact label="Services">
                <ul className="flex flex-col gap-1">
                  {project.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </Fact>
              <Fact label="Stack">
                <ul className="flex flex-col gap-1 font-litt-mono">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </Fact>
            </dl>
          </div>
        </div>
      </section>

      {/* Story: one idea per section, label left, text right */}
      {project.storyBlocks.map((block) => {
        const id = `story-${block.label.toLowerCase()}`;
        return (
          <section key={block.label} aria-labelledby={id} className="section">
            <div className="split">
              <h2 id={id} className="split-label text-litt-h4 text-litt-fg-subtle">
                {block.label}
              </h2>
              <div className="split-body">
                <h3 className="max-w-litt-reading text-litt-h3 text-litt-fg text-balance">{block.heading}</h3>
                <p className="mt-4 max-w-(--litt-measure) text-litt-reading text-litt-fg-muted">{block.body}</p>
              </div>
            </div>
          </section>
        );
      })}

      {project.metrics && project.metrics.length > 0 && (
        <section aria-labelledby="metrics" className="section">
          <div className="split">
            <h2 id="metrics" className="split-label text-litt-h4 text-litt-fg-subtle">
              Metrics
            </h2>
            <div className="split-body">
              <dl className="grid divide-y divide-litt-line border-y border-litt-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                    <dt className="text-litt-small text-litt-fg-subtle">{metric.label}</dt>
                    <dd className="mt-2 font-litt-mono text-litt-h3 text-litt-fg">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {screens.length > 0 && (
        <section aria-labelledby="screens" className="section">
          <div className="split">
            <h2 id="screens" className="split-label text-litt-h4 text-litt-fg-subtle">
              Screens
            </h2>
            <div className="split-body flex flex-col gap-12">
              {screens.map((screen) => (
                <figure key={screen.src}>
                  <Shot
                    src={screen.src}
                    alt={`${project.title} ${screen.label.toLowerCase()} screen`}
                    sizes="(min-width: 1024px) 75vw, 100vw"
                  />
                  <Caption label={screen.label} description={screen.description} />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next project: one quiet card at the end */}
      <section aria-labelledby="next-project" className="section section-end">
        <div className="split">
          <h2 id="next-project" className="split-label text-litt-h4 text-litt-fg-subtle">
            Next project
          </h2>
          <div className="split-body">
            <Card className="max-w-litt-reading">
              <CardBody>
                <CardTitle>
                  <Link
                    href={`/work/${nextProject.slug}`}
                    data-card-link=""
                    className={nextLink}
                  >
                    {nextProject.title}
                  </Link>
                </CardTitle>
                <CardDescription>{nextProject.oneLineOutcome}</CardDescription>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
