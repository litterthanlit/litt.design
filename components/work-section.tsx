import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardBody, CardCover, CardDescription, CardLink, CardTitle } from "@/components/litt/card";
import { Tag } from "@/components/litt/tag";
import type { Project } from "@/data/types";
import type { WorkItem } from "@/data/work";

type WorkSectionProps = {
  projects: Project[];
  items: WorkItem[];
};

type Entry =
  | { type: "project"; project: Project }
  | { type: "art"; href: string };

// Registry gap: litt's CardLink always renders a plain <a>, so a client-side route
// (with its nav-forward view transition) needs next/link instead. These are CardLink's
// own classes, so the stretched target, the focus ring and the card hover are the same.
const CARD_LINK =
  "cursor-pointer text-left outline-none focus-visible:outline-none " +
  "after:absolute after:inset-0 after:rounded-litt-surface " +
  "focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-litt-focus";

// A cover is at most half the 9-column body: 441px on desktop, a bit less down to 1024.
const COVER_SIZES = "(min-width: 1280px) 441px, (min-width: 1024px) 36vw, (min-width: 640px) 45vw, 100vw";

export function WorkSection({ projects, items }: WorkSectionProps) {
  const entries: Entry[] = [];
  for (const item of items) {
    if (item.type === "art") {
      entries.push(item);
    } else {
      const project = projects.find((p) => p.slug === item.slug);
      if (project) entries.push({ type: "project", project });
    }
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="section">
      <div className="shell">
        <div className="split">
          <div className="split-label">
            <h2 id="work-heading" className="text-litt-h4 text-litt-fg">
              Selected work
            </h2>
          </div>

          <ul className="split-body grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {entries.map((entry, index) => {
              // The first two covers are in or near the first view; the rest load lazily.
              const priority = index < 2;
              return entry.type === "art" ? (
                <ArtCard key="litt-works" href={entry.href} />
              ) : (
                <ProjectCard key={entry.project.slug} project={entry.project} priority={priority} />
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CardHeading({ title, year, status }: { title: ReactNode; year: string; status?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <CardTitle>{title}</CardTitle>
      <div className="flex shrink-0 items-center gap-3">
        {status && <Tag status="neutral">{status}</Tag>}
        <span className="meta">{year}</span>
      </div>
    </div>
  );
}

function ProjectCard({ project, priority }: { project: Project; priority: boolean }) {
  const { preview, position } = project.coverMedia;

  return (
    <Card as="li" cover="inset">
      <CardCover ratio="8/5">
        {preview && (
          <Image
            src={preview}
            alt={`Preview of ${project.title}`}
            fill
            sizes={COVER_SIZES}
            priority={priority}
            className="object-cover"
            style={{ objectPosition: position ?? "center" }}
          />
        )}
      </CardCover>
      <CardBody>
        <CardHeading
          title={
            <Link
              href={`/work/${project.slug}`}
              data-card-link=""
              className={CARD_LINK}
            >
              {project.title}
            </Link>
          }
          year={project.year.slice(-4)}
          status={project.status}
        />
        <CardDescription className="text-pretty">{project.oneLineOutcome}</CardDescription>
      </CardBody>
    </Card>
  );
}

function ArtCard({ href }: { href: string }) {
  return (
    <Card as="li" cover="inset">
      <CardCover ratio="8/5">
        <Image
          src="/previews/litt-works-orb.jpg"
          alt="litt.works gallery in Orb view: artworks arranged on a slowly drifting sphere"
          fill
          sizes={COVER_SIZES}
          className="object-cover"
        />
      </CardCover>
      <CardBody>
        <CardHeading
          title={
            // /art is a separate app on this domain, so CardLink's plain <a> is right here
            <CardLink href={href}>litt.works</CardLink>
          }
          year="2024–26"
        />
        <CardDescription className="text-pretty">Abstract digital art — prints, visual experiments, and long-form pieces.</CardDescription>
      </CardBody>
    </Card>
  );
}
