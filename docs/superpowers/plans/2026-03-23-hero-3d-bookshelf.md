# Hero 3D Bookshelf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage with a single hero section featuring 5 Three.js book cards standing upright on a shelf, with hover interaction.

**Architecture:** Split-layout hero — left side has brand text + CTA (Framer Motion reveals), right side has an R3F Canvas rendering 5 3D books. Books are `BoxGeometry` with cover textures generated from `coverMedia.background` gradients. Hover rotates a book to face the viewer via spring-interpolated `useFrame`. An HTML overlay shows project info on hover.

**Tech Stack:** Next.js 16 App Router, React Three Fiber + drei (already installed), Framer Motion (already installed), Tailwind CSS v4, Schibsted Grotesk + IBM Plex Sans (already loaded as local fonts)

**Spec:** `docs/superpowers/specs/2026-03-23-hero-3d-bookshelf-design.md`

**Note on testing:** This is a visual/3D project with no test framework configured. Verification is done by running the dev server (`npm run dev`) and checking visually in the browser. Each task ends with a visual check or build check.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `app/globals.css` | Add `--color-accent` token for acid lime |
| Modify | `data/site.ts` | Change `availability.color` from `#ae7357` → `#C2FF4D` |
| Create | `components/book.tsx` | Single 3D book mesh — geometry, materials, cover texture, hover/click logic |
| Create | `components/bookshelf-scene.tsx` | R3F Canvas, camera, lights, 5 Book instances, HTML info overlay |
| Create | `components/hero-text.tsx` | Left-side text block — headline, intro, availability, CTA |
| Modify | `app/page.tsx` | Strip all sections, render only the hero (HeroText + BookshelfScene) |
| Modify | `components/site-header.tsx` | Update availability dot to use acid lime, remove `Services` nav link |

Components that will no longer be imported from `page.tsx` but NOT deleted (they'll be needed later):
`hero-section.tsx`, `work-section.tsx`, `services-section.tsx`, `about-section.tsx`, `contact-section.tsx`, `project-card.tsx`, `project-accordion.tsx`, `project-panels.tsx`, `reveal.tsx`

---

### Task 1: Update design tokens and site data

**Files:**
- Modify: `app/globals.css`
- Modify: `data/site.ts`

- [ ] **Step 1: Add accent color token to globals.css**

In `app/globals.css`, add `--color-accent` inside the `@theme inline` block:

```css
@theme inline {
  --color-canvas: #efebe4;
  --color-panel: #e4dfd7;
  --color-line: rgba(19, 19, 19, 0.12);
  --color-ink: #131313;
  --color-muted: #666158;
  --color-accent: #C2FF4D;
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
```

- [ ] **Step 2: Update availability color in site.ts**

In `data/site.ts`, change the `availability` block:

```ts
availability: {
  label: "Available for projects",
  note: "Booking for April 2026",
  color: "#C2FF4D",
},
```

- [ ] **Step 3: Verify build**

Run: `npx next build --webpack 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css data/site.ts
git commit -m "feat: add acid lime accent token and update availability color"
```

---

### Task 2: Create the Book component

**Files:**
- Create: `components/book.tsx`

This is a `"use client"` component rendered inside R3F's `<Canvas>`. It creates a single 3D book using `BoxGeometry`, textures the cover face with the project's `coverMedia.background` gradient (rendered to an offscreen `<canvas>` and used as `CanvasTexture`), and handles hover/click.

- [ ] **Step 1: Create `components/book.tsx`**

```tsx
"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/data/types";

type BookProps = {
  project: Project;
  index: number;
  total: number;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: (index: number | null) => void;
  onClick: (slug: string) => void;
  reduceMotion: boolean;
};

/**
 * Renders a CSS gradient string onto an offscreen canvas
 * and returns a Three.js CanvasTexture.
 */
function useGradientTexture(cssGradient: string, width = 512, height = 720) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Parse the CSS gradient to extract colors and create a linear gradient.
    // coverMedia.background is a CSS linear-gradient string like:
    //   "linear-gradient(145deg, rgba(32,29,27,0.94), rgba(94,64,52,0.86) 38%, ...)"
    // We extract the color stops and render them.
    const colorsMatch = cssGradient.match(
      /(?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})\s*(?:\d+%)?/g
    );
    if (!colorsMatch || colorsMatch.length < 2) {
      // Fallback: solid mid-gray
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, width, height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.4, height);
      colorsMatch.forEach((stop, i) => {
        const percentMatch = stop.match(/(\d+)%/);
        const colorPart = stop.replace(/\s*\d+%\s*$/, "").trim();
        const offset = percentMatch
          ? parseInt(percentMatch[1], 10) / 100
          : i / (colorsMatch.length - 1);
        try {
          ctx.fillStyle = colorPart; // validate color
          gradient.addColorStop(offset, colorPart);
        } catch {
          gradient.addColorStop(offset, "#888");
        }
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [cssGradient, width, height]);
}

const BOOK_WIDTH = 2.2;
const BOOK_HEIGHT = 3.2;
const BOOK_DEPTH = 0.15;

export function Book({
  project,
  index,
  total,
  isHovered,
  anyHovered,
  onHover,
  onClick,
  reduceMotion,
}: BookProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoverCursor, setHoverCursor] = useState(false);

  const coverTexture = useGradientTexture(project.coverMedia.background);
  const spineColor = useMemo(() => {
    const c = new THREE.Color(project.accent);
    c.lerp(new THREE.Color("#0a0a0a"), 0.35);
    return c;
  }, [project.accent]);

  // 6 face materials: +x, -x, +y, -y, +z (front/cover), -z (back)
  const materials = useMemo(() => {
    const offWhite = new THREE.MeshStandardMaterial({
      color: "#F2F1EE",
      roughness: 0.8,
    });
    const spine = new THREE.MeshStandardMaterial({
      color: spineColor,
      roughness: 0.6,
    });
    const cover = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.7,
    });
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    // +x = right edge, -x = left edge (spine), +y = top, -y = bottom, +z = front (cover), -z = back
    return [offWhite, spine, offWhite, offWhite, cover, offWhite];
  }, [coverTexture, spineColor]);

  // Default Y rotation — angled like books on a shelf
  const centerOffset = index - (total - 1) / 2;
  const baseRotY = centerOffset * -0.22; // fan outward
  const baseX = centerOffset * (BOOK_WIDTH + 0.3);
  const baseY = 0;
  const baseZ = -Math.abs(centerOffset) * 0.15;

  // Targets
  const target = useRef({
    x: baseX,
    y: baseY,
    z: baseZ,
    rotY: baseRotY,
    brightness: 1,
  });

  useEffect(() => {
    if (isHovered) {
      target.current = {
        x: baseX,
        y: 0.3,
        z: 0.6,
        rotY: 0,
        brightness: 1,
      };
    } else if (anyHovered) {
      target.current = {
        x: baseX,
        y: baseY,
        z: baseZ,
        rotY: baseRotY,
        brightness: 0.65,
      };
    } else {
      target.current = {
        x: baseX,
        y: baseY,
        z: baseZ,
        rotY: baseRotY,
        brightness: 0.88,
      };
    }
  }, [isHovered, anyHovered, baseX, baseY, baseZ, baseRotY]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = target.current;
    const speed = reduceMotion ? 1 : 1 - Math.exp(-delta * 8);

    group.position.x = THREE.MathUtils.lerp(group.position.x, t.x, speed);
    group.position.y = THREE.MathUtils.lerp(group.position.y, t.y, speed);
    group.position.z = THREE.MathUtils.lerp(group.position.z, t.z, speed);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, t.rotY, speed);

    // Dim non-hovered books by adjusting material opacity
    const targetOpacity = isHovered ? 1 : anyHovered ? 0.55 : 0.88;
    materials.forEach((mat) => {
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, speed);
    });
  });

  // Cursor management
  useEffect(() => {
    if (hoverCursor) {
      document.body.style.cursor = "pointer";
    }
    return () => {
      if (hoverCursor) {
        document.body.style.cursor = "";
      }
    };
  }, [hoverCursor]);

  const handlePointerOver = useCallback(() => {
    onHover(index);
    setHoverCursor(true);
  }, [index, onHover]);

  const handlePointerOut = useCallback(() => {
    onHover(null);
    setHoverCursor(false);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick(project.slug);
  }, [onClick, project.slug]);

  return (
    <group ref={groupRef} position={[baseX, baseY, baseZ]} rotation={[0, baseRotY, 0]}>
      <mesh
        material={materials}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, BOOK_DEPTH]} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors in `book.tsx` (there may be pre-existing errors elsewhere).

- [ ] **Step 3: Commit**

```bash
git add components/book.tsx
git commit -m "feat: add 3D Book component with gradient cover texture and hover logic"
```

---

### Task 3: Create the Bookshelf Scene

**Files:**
- Create: `components/bookshelf-scene.tsx`

This wraps the R3F `<Canvas>`, sets up camera + lights, renders 5 Book instances, and provides an HTML overlay for project info on hover.

- [ ] **Step 1: Create `components/bookshelf-scene.tsx`**

```tsx
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

/**
 * Build a 5-book array from the 3 projects.
 * Order: Signal House, Luma, Northstar (center), Signal House, Luma
 */
function buildBookList(projects: Project[]): Project[] {
  // projects order in data: [Northstar(0), Signal House(1), Luma(2)]
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
      {/* Project info overlay */}
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

      {/* Hint when nothing is hovered */}
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
        camera={{ position: [0, 1.2, 8], fov: 35 }}
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
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors in `bookshelf-scene.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/bookshelf-scene.tsx
git commit -m "feat: add BookshelfScene with R3F Canvas, lighting, and 5-book layout"
```

---

### Task 4: Create the Hero Text component

**Files:**
- Create: `components/hero-text.tsx`

Left-side text with staggered Framer Motion reveals. Quiet luxury: medium weight, restrained sizes.

- [ ] **Step 1: Create `components/hero-text.tsx`**

```tsx
"use client";

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { SiteSettings } from "@/data/types";

type HeroTextProps = {
  settings: SiteSettings;
};

export function HeroText({ settings }: HeroTextProps) {
  return (
    <div className="flex h-full flex-col justify-between border-r border-line py-8 pl-5 pr-6 md:py-12 md:pl-8 md:pr-10 lg:pl-12 lg:pr-14">
      {/* Top: brand */}
      <Reveal delay={0.05}>
        <p className="font-display text-sm font-medium tracking-[-0.04em] text-ink">
          {settings.brandName}
        </p>
      </Reveal>

      {/* Center: headline */}
      <div className="my-auto space-y-5 py-8">
        <Reveal delay={0.12}>
          <h1 className="max-w-md font-display text-[clamp(1.8rem,3.2vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.04em] text-ink">
            Web experiences, brand identity and motion that{" "}
            <span className="bg-accent/25 px-0.5">convert</span>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-sm text-sm leading-7 text-muted">
            {settings.heroIntro}
          </p>
        </Reveal>
      </div>

      {/* Bottom: availability + CTA */}
      <Reveal delay={0.28}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(194,255,77,0.18)]" />
            <span>{settings.availability.label}</span>
          </div>
          <Link
            href={`mailto:${settings.contactEmail}`}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-canvas"
          >
            Start a project
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors in `hero-text.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/hero-text.tsx
git commit -m "feat: add HeroText component with quiet-luxury typography and Framer reveals"
```

---

### Task 5: Rewrite the homepage and update the header

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/site-header.tsx`

- [ ] **Step 1: Rewrite `app/page.tsx`**

Replace the entire contents with:

```tsx
import dynamic from "next/dynamic";
import { HeroText } from "@/components/hero-text";
import { projects } from "@/data/projects";
import { siteSettings } from "@/data/site";

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

export default function HomePage() {
  return (
    <main className="min-h-screen md:h-screen">
      <section className="grid h-full grid-cols-1 md:grid-cols-[0.42fr_0.58fr]">
        <HeroText settings={siteSettings} />
        <div className="hidden md:block">
          <BookshelfScene projects={projects} />
        </div>
      </section>

      {/* Mobile: canvas hidden via Tailwind responsive classes on the grid */}
    </main>
  );
}
```

- [ ] **Step 2: Update `components/site-header.tsx`**

Make two changes:

a) Update the availability dot shadow color. Find:
```tsx
<span className="h-2 w-2 rounded-full bg-[var(--status-color)] shadow-[0_0_0_6px_rgba(174,115,87,0.12)]" style={{ "--status-color": settings.availability.color } as CSSProperties} />
```
Replace with:
```tsx
<span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(194,255,77,0.15)]" />
```

b) Remove the `Services` nav link — no services section on the page right now. Find:
```tsx
<Link href="#services">Services</Link>
```
Remove that line (both in the desktop nav and the mobile menu).

c) Remove the `CSSProperties` import since we no longer need the style prop. Change:
```tsx
import type { CSSProperties } from "react";
```
to remove it (it's no longer used).

- [ ] **Step 3: Run the dev server and verify visually**

Run: `npm run dev`

Check at `http://localhost:3000`:
- Hero fills the viewport
- Left side: headline with acid lime highlight on "convert", availability dot, CTA button
- Right side: 5 3D books standing upright, angled on shelf
- Hover a book: it rotates to face you, lifts up, project info appears above
- Click a book: navigates to `/work/[slug]`
- Nav header: sticky, shows litt.design + Work/About/Contact + lime availability dot

- [ ] **Step 4: Verify build succeeds**

Run: `npx next build --webpack 2>&1 | tail -10`
Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/site-header.tsx
git commit -m "feat: wire up hero page with bookshelf scene and updated header"
```

---

### Task 6: Visual tuning pass

This task is for adjusting the 3D scene after the first visual check. Expect to tune:

- [ ] **Step 1: Camera position and FOV** — adjust `camera={{ position: [0, 1.2, 8], fov: 35 }}` in `bookshelf-scene.tsx` until the books fill the right pane nicely
- [ ] **Step 2: Book spacing** — adjust `BOOK_WIDTH + 0.3` gap in `book.tsx` `baseX` calculation
- [ ] **Step 3: Rotation angles** — adjust `centerOffset * -0.22` in `book.tsx` for the shelf-angle feel
- [ ] **Step 4: Hover lift/forward amounts** — adjust `y: 0.3, z: 0.6` targets in `book.tsx`
- [ ] **Step 5: Light intensity and position** — tune the directional light for natural shadows
- [ ] **Step 6: Cover texture quality** — verify gradient renders look correct on the book faces
- [ ] **Step 7: Commit tuning changes**

```bash
git add components/book.tsx components/bookshelf-scene.tsx
git commit -m "chore: tune 3D book positions, lighting, and hover feel"
```
