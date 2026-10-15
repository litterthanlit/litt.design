import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { DirectionalTransition } from "@/components/view-transitions";
import { projects } from "@/data/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** A public image's pixel size, read from its PNG or JPEG header, so the cover keeps its own shape. */
async function imageSize(src: string): Promise<{ width: number; height: number } | undefined> {
  try {
    const file = await readFile(path.join(process.cwd(), "public", src));
    if (file.readUInt32BE(0) === 0x89504e47) {
      return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
    }
    if (file.readUInt16BE(0) === 0xffd8) {
      let i = 2;
      while (i + 9 < file.length) {
        if (file[i] !== 0xff) {
          i += 1;
          continue;
        }
        const marker = file[i + 1];
        // A start-of-frame marker holds the size; every other segment is skipped by its length.
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: file.readUInt16BE(i + 7), height: file.readUInt16BE(i + 5) };
        }
        i += 2 + file.readUInt16BE(i + 2);
      }
    }
  } catch {
    // No size: the cover falls back to 8:5.
  }
  return undefined;
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

  const preview = project.coverMedia.preview;
  const coverSize = preview ? await imageSize(preview) : undefined;

  return (
    <DirectionalTransition>
      <ProjectDetail project={project} nextProject={nextProject} coverSize={coverSize} />
    </DirectionalTransition>
  );
}
