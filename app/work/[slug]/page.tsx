import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { DirectionalTransition } from "@/components/view-transitions";
import { projects } from "@/data/projects";
import { coverFor, sliderSlugs } from "@/data/work";
import { OG_IMAGE } from "@/data/site";

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
      images: [OG_IMAGE],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  // Next follows the homepage slider, so it always leads to a project with a cover.
  // A project outside the slider leads to the slider's first.
  const nextSlug = sliderSlugs[(sliderSlugs.indexOf(project.slug) + 1) % sliderSlugs.length];
  const nextProject = getProject(nextSlug) ?? project;
  const cover = sliderSlugs.includes(project.slug) ? coverFor(project.slug) : undefined;

  return (
    <DirectionalTransition>
      <ProjectDetail project={project} cover={cover} nextProject={nextProject} nextCover={coverFor(nextProject.slug)} />
    </DirectionalTransition>
  );
}
