"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Book } from "@/components/book";
import type { Project } from "@/data/types";

type BookshelfSceneProps = {
  projects: Project[];
};

function buildBookList(projects: Project[]): Project[] {
  const [northstar, signal, luma] = projects;
  return [signal, luma, northstar, signal, luma];
}

function Scene({
  books,
  hoveredIndex,
  onHover,
  onClickBook,
  reduceMotion,
}: {
  books: Project[];
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  onClickBook: (slug: string) => void;
  reduceMotion: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[4, 5, 7]}
        intensity={0.8}
        color="#fff8ef"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <group position={[0, -0.2, 0]}>
        {books.map((project, index) => (
          <Book
            key={`${project.slug}-${index}`}
            project={project}
            index={index}
            total={books.length}
            isHovered={hoveredIndex === index}
            anyHovered={hoveredIndex !== null}
            onHover={onHover}
            onClick={onClickBook}
            reduceMotion={reduceMotion}
          />
        ))}
      </group>
      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.25}
        scale={16}
        blur={2.2}
        far={6}
      />
    </>
  );
}

export function BookshelfScene({ projects }: BookshelfSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const router = useRouter();
  const books = buildBookList(projects);

  const hoveredProject = hoveredIndex !== null ? books[hoveredIndex] : null;

  const handleClickBook = useCallback(
    (slug: string) => {
      router.push(`/work/${slug}`);
    },
    [router]
  );

  return (
    <div className="relative h-full w-full">
      <div
        className={`pointer-events-none absolute left-0 right-0 top-6 z-10 text-center transition-opacity duration-300 ${
          hoveredProject ? "opacity-100" : "opacity-0"
        }`}
      >
        {hoveredProject && (
          <>
            <p className="eyebrow">{hoveredProject.category}</p>
            <p className="mt-2 font-display text-[clamp(1.1rem,2vw,1.5rem)] font-medium tracking-[-0.03em] text-ink">
              {hoveredProject.title}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
              Open case study ↗
            </p>
          </>
        )}
      </div>

      <div
        className={`pointer-events-none absolute bottom-4 left-0 right-0 z-10 text-center text-xs uppercase tracking-[0.18em] text-muted transition-opacity duration-300 ${
          hoveredProject ? "opacity-0" : "opacity-60"
        }`}
      >
        Hover to explore
      </div>

      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.5, 6], fov: 40 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene
            books={books}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
            onClickBook={handleClickBook}
            reduceMotion={reduceMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
