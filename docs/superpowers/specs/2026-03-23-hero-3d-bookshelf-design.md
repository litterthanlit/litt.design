# Hero Page — 3D Bookshelf

**Date:** 2026-03-23
**Scope:** Single hero page with 5 Three.js book cards. No other sections.
**Aesthetic:** Quiet luxury. Understated, not loud.

---

## 1. Page layout

Full viewport height. Two zones:

| Zone | Content | Width |
|------|---------|-------|
| Left | Brand text, tagline, availability, CTA | ~42% |
| Right | Three.js canvas — 3D bookshelf scene | ~58% |

Background: warm off-white (`#F2F1EE`) with subtle film grain overlay (`opacity: 0.04–0.06`, `mix-blend-mode: multiply`).

### Navigation

Sticky single-line header:

```
litt.design                        Work  About  Contact
```

- No hamburger on desktop
- Availability indicator: small acid lime dot + "Available for projects"
- Font: body font, small uppercase, tracked out

---

## 2. Typography

Quiet luxury — restraint over impact. No oversized display type.

| Role | Font | Size range | Weight |
|------|------|-----------|--------|
| Headline | Geist | 32–48px | 500 (medium) |
| Subtext / intro | Inter | 14–16px | 400 (regular) |
| Labels / nav | Inter | 11–13px | 400, uppercase, tracked |
| CTA button | Inter | 13px | 500, uppercase, tracked |

No weight above 600 (semibold) anywhere on the page.

### Headline copy

```
Web experiences, brand identity
and motion that convert.
```

"convert" highlighted with acid lime (`#C2FF4D`) — subtle background highlight, not a loud fill. Consider `background: rgba(194, 255, 77, 0.25)` or a thin underline rather than a solid block.

---

## 3. Color palette

| Role | Value | Notes |
|------|-------|-------|
| Background | `#F2F1EE` | Warm off-white |
| Surface / nav | `#FFFFFF` at low opacity | If needed |
| Text primary | `#0A0A0A` | Near-black |
| Text secondary | `#6B6B6B` | Muted labels, captions |
| Accent | `#C2FF4D` | Acid lime — used sparingly |
| Line / border | `rgba(10, 10, 10, 0.08)` | Subtle dividers |

---

## 4. 3D Bookshelf (React Three Fiber)

### Scene setup

- `<Canvas>` fills the right zone (58% of viewport width, full height)
- Camera: perspective, positioned slightly above and in front of the shelf
- Background: transparent (page background shows through)

### Books

5 books total. Each book is a `BoxGeometry` with real thickness:

| Dimension | Value |
|-----------|-------|
| Width | ~2.2 units |
| Height | ~3.2 units |
| Depth | ~0.15 units (book thickness) |

- Standing upright, side by side with small gaps
- Cover face: textured using `coverMedia.background` from `projects.ts` — this is a CSS gradient string, rendered to an offscreen `<canvas>` element and used as a Three.js `CanvasTexture`
- Spine face: solid color derived from `project.accent`
- Other faces: neutral off-white (`#F2F1EE`)

#### Book-to-project mapping (5 books)

5 slots, 3 unique projects. Duplicates are intentional — they fill the shelf visually. Duplicate books use the same gradient, same accent, and link to the same `/work/[slug]`. They are visually identical to their counterpart.

| Position | Project | Duplicate? |
|----------|---------|------------|
| 1 (far left) | Signal House Capital | yes (copy of 4) |
| 2 | Luma Robotics | yes (copy of 5) |
| 3 (center) | Northstar Biotics | primary |
| 4 | Signal House Capital | primary |
| 5 (far right) | Luma Robotics | primary |

### Default pose

Books are angled on the Y axis — you see partial covers, like books placed casually on a shelf:

- Far books: `rotateY(±35–42°)`
- Mid books: `rotateY(±18–24°)`
- Center book: `rotateY(~8°)`

Slight brightness falloff on outer books (farther = slightly darker).

### Lighting

- 1 ambient light (soft fill, `intensity: 0.6`)
- 1 directional light (from upper-left, `intensity: 0.8`) casting soft shadows
- Optional: subtle environment map for material reflection

### Materials

- `MeshStandardMaterial` with low roughness (~0.7) for a matte-but-not-flat feel
- Cover face gets the project gradient as a texture
- Edge/spine gets a slightly darker solid from the project accent

---

## 5. Hover interaction

When the user hovers a book:

1. **Hovered book:**
   - Rotates to face the viewer (`rotateY → 0`)
   - Lifts up slightly (`translateY: -0.3 units`)
   - Comes forward (`translateZ: +0.5 units`)
   - Transition: spring physics (damping ~15, stiffness ~120) via `@react-three/drei` or R3F spring

2. **Other books:**
   - Dim slightly (reduce material brightness or opacity)
   - Stay in place

3. **Project info (HTML overlay):**
   - Appears above the 3D scene (positioned absolutely over the canvas)
   - Shows: category label (uppercase, tracked) + project title (medium weight)
   - Fades in with `opacity` transition (~300ms)
   - Fades out on mouse leave

### Click

- Clicking a book navigates to `/work/[slug]`
- Use Next.js `router.push` triggered from the R3F click handler
- Cursor changes to pointer on hover (via R3F `onPointerOver`)

---

## 6. Motion principles

- No infinite loops, no autoplay
- Spring-based transitions for 3D interactions (not linear easing)
- Left-side text: staggered fade-in on load using Framer Motion (`opacity: 0→1`, `y: 8→0`, stagger 80ms between elements)
- Respect `prefers-reduced-motion`: disable 3D hover animations, show books in neutral forward-facing pose

---

## 7. Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) — already set up |
| 3D | `@react-three/fiber` + `@react-three/drei` |
| Left-side animation | `framer-motion` (already installed) |
| Styling | Tailwind CSS v4 (already set up) |
| Fonts | Geist (display) + Inter (body) |
| Data | `projects.ts` (existing, no changes needed) |

### New dependencies

```
@react-three/fiber
@react-three/drei
three
@types/three
```

### Component structure

```
app/
  page.tsx              — renders HeroPage only (strip other sections for now)
  layout.tsx            — root layout, fonts, metadata (keep)
  globals.css           — updated tokens (accent color, refined palette)

components/
  hero-scene.tsx        — the R3F Canvas + bookshelf scene (client component)
  book.tsx              — single 3D book mesh with hover/click logic
  hero-text.tsx         — left-side text block with Framer Motion reveals
  site-header.tsx       — sticky nav (keep/update)

data/
  projects.ts           — unchanged, drives book content
  types.ts              — unchanged
  site.ts               — required change: availability.color from #ae7357 → #C2FF4D
```

---

## 8. What's NOT in scope

- Work section / case study grid
- About section
- Services section
- Contact section
- Case study detail pages (route exists but not being rebuilt now)
- Custom cursor
- Dark mode
- Mobile-specific 3D behavior: below 768px, hide the Three.js canvas entirely and show a simple static fallback (e.g. stacked project cards). Full mobile design is deferred.
- Page transitions

---

## 9. Open questions for later

- Mobile fallback for the 3D scene (canvas performance on mobile)
- Whether to add subtle idle animation to the books (gentle sway)
- Full site sections below the hero
- Case study page redesign
