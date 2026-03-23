"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/data/types";

const BookshelfScene = dynamic(
  () =>
    import("@/components/bookshelf-scene").then((mod) => mod.BookshelfScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          Loading...
        </p>
      </div>
    ),
  }
);

type Props = {
  projects: Project[];
};

export function BookshelfSceneLoader({ projects }: Props) {
  return <BookshelfScene projects={projects} />;
}
