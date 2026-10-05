"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Press and drag on empty space to draw, with a marker or a spray can. Strokes
// sit under the content, are stored per page in localStorage, and only exist
// for mouse and pen input so touch scrolling is never hijacked. Text and
// elements are keep-out zones: ink that lands on or near them is erased, so
// the drawing never overlaps them.

// Marker points carry the line width; spray points carry how much paint landed
type Point = [x: number, y: number, size: number];
type Drip = [x: number, y: number, length: number, width: number];
type Stroke = { color: string; points: Point[]; tool?: "spray"; seed?: number; drips?: Drip[] };
type Rect = { x: number; y: number; w: number; h: number };
type Tool = "marker" | "spray";

const COLORS = [
  { value: "#0a0a0a", label: "Ink" },
  { value: "#F0782D", label: "Orange" },
  { value: "#7B61FF", label: "Violet" },
  { value: "#9BD62E", label: "Lime" },
] as const;

const MIN_WIDTH = 2;
const MAX_WIDTH = 7;
const MAX_POINTS = 20000; // total across strokes; oldest strokes drop first
const STORAGE_PREFIX = "litt:graffiti:";

const SPRAY_RADIUS = 16;
const SPRAY_RATE = 1.1; // speckles per millisecond the nozzle is held down
const DRIP_AFTER = 500; // ms lingering in one spot before the paint runs
const DRIP_EVERY = 900; // ms of further lingering per extra drip
const MAX_DRIPS_PER_SPOT = 3;
const MAX_CACHE_PIXELS = 12_000_000; // bigger spray strokes are drawn directly

const KEEP_OUT_PAD = 10; // breathing room around text and elements

// Elements that are keep-out zones as a whole box (text is handled per line)
const BLOCKS =
  "a, button, input, textarea, select, label, summary, img, picture, video, svg, canvas, iframe, " +
  "figure, table, pre, blockquote, header, nav, [data-no-graffiti]";

// Never start a stroke inside these, wherever the pointer is
const INTERACTIVE = `${BLOCKS}, [role], [tabindex], [contenteditable]`;

// Decorative layers (backgrounds, this canvas, the toolbar) are not content
const IGNORE = '[aria-hidden="true"], [data-graffiti-ignore]';

// Every text line and element box on the page, in drawing coordinates
function collectKeepOut(): Rect[] {
  const cx = window.innerWidth / 2;
  const sy = window.scrollY;
  const rects: Rect[] = [];
  const add = (r: DOMRect) => {
    if (!r.width || !r.height) return;
    rects.push({
      x: r.left - cx - KEEP_OUT_PAD,
      y: r.top + sy - KEEP_OUT_PAD,
      w: r.width + KEEP_OUT_PAD * 2,
      h: r.height + KEEP_OUT_PAD * 2,
    });
  };

  for (const el of document.body.querySelectorAll(BLOCKS)) {
    if (!el.closest(IGNORE)) add(el.getBoundingClientRect());
  }

  // Line boxes of every visible text node, so text in plain divs counts too
  const range = document.createRange();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.nodeValue?.trim() && !node.parentElement?.closest(`script, style, noscript, ${IGNORE}`)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  while (walker.nextNode()) {
    range.selectNodeContents(walker.currentNode);
    for (const r of range.getClientRects()) add(r);
  }
  return rects;
}

function hits(rects: Rect[], x: number, y: number) {
  return rects.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
}

// Cut every keep-out zone within the given band of the screen out of the ink
function eraseKeepOut(
  ctx: CanvasRenderingContext2D,
  rects: Rect[],
  cx: number,
  scrollY: number,
  top: number,
  bottom: number
) {
  ctx.globalCompositeOperation = "destination-out";
  for (const r of rects) {
    const y = r.y - scrollY;
    if (y > bottom || y + r.h < top) continue;
    ctx.fillRect(r.x + cx, y, r.w, r.h);
  }
  ctx.globalCompositeOperation = "source-over";
}

function readStrokes(path: string): Stroke[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + path);
    return raw ? (JSON.parse(raw) as Stroke[]) : [];
  } catch {
    return [];
  }
}

function writeStrokes(path: string, strokes: Stroke[]) {
  try {
    if (strokes.length) localStorage.setItem(STORAGE_PREFIX + path, JSON.stringify(strokes));
    else localStorage.removeItem(STORAGE_PREFIX + path);
  } catch {
    // Storage full or blocked — the drawing just won't survive a reload
  }
}

function trim(strokes: Stroke[]) {
  let total = strokes.reduce((n, s) => n + s.points.length, 0);
  while (total > MAX_POINTS && strokes.length > 1) total -= strokes.shift()!.points.length;
  return strokes;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

// Points are stored with x relative to the viewport centre (the layout is
// centred, so drawings stay next to the content they were drawn beside) and
// y relative to the top of the document.
function toScreen([x, y]: Point | Drip, cx: number, scrollY: number) {
  return [x + cx, y - scrollY] as const;
}

// Document-space box a stroke can paint into, drips included
function strokeBounds(stroke: Stroke): Rect {
  const pad = stroke.tool === "spray" ? SPRAY_RADIUS + 2 : MAX_WIDTH;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const grow = (x: number, y: number, r: number) => {
    x0 = Math.min(x0, x - r);
    y0 = Math.min(y0, y - r);
    x1 = Math.max(x1, x + r);
    y1 = Math.max(y1, y + r);
  };
  for (const [x, y] of stroke.points) grow(x, y, pad);
  for (const [x, y, length, width] of stroke.drips ?? []) grow(x, y + length, width * 2);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  i: number,
  cx: number,
  scrollY: number
) {
  const pts = stroke.points;
  const [x0, y0] = toScreen(pts[Math.max(0, i - 2)], cx, scrollY);
  const [x1, y1] = toScreen(pts[i - 1], cx, scrollY);
  const [x2, y2] = toScreen(pts[i], cx, scrollY);
  // Quadratic through midpoints keeps the line smooth at any pointer rate
  ctx.beginPath();
  ctx.moveTo((x0 + x1) / 2, (y0 + y1) / 2);
  ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2);
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = pts[i][2];
  ctx.stroke();
}

function drawMarker(ctx: CanvasRenderingContext2D, stroke: Stroke, cx: number, scrollY: number) {
  const pts = stroke.points;
  if (pts.length === 1) {
    const [x, y] = toScreen(pts[0], cx, scrollY);
    ctx.beginPath();
    ctx.arc(x, y, pts[0][2] / 2, 0, Math.PI * 2);
    ctx.fillStyle = stroke.color;
    ctx.fill();
    return;
  }
  for (let i = 1; i < pts.length; i++) drawSegment(ctx, stroke, i, cx, scrollY);
}

// Seeded PRNG (mulberry32): the speckle pattern is stored as a seed, so a
// redraw scatters every dot exactly where it first landed
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Soft radial blob under the speckle, one per colour
const mistSprites = new Map<string, HTMLCanvasElement>();
function mist(color: string) {
  let sprite = mistSprites.get(color);
  if (!sprite) {
    sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const g = sprite.getContext("2d")!;
    const gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.45, `${color}80`);
    gradient.addColorStop(1, `${color}00`);
    g.fillStyle = gradient;
    g.fillRect(0, 0, 64, 64);
    mistSprites.set(color, sprite);
  }
  return sprite;
}

function drawSprayPoint(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  i: number,
  cx: number,
  scrollY: number
) {
  const [x, y] = toScreen(stroke.points[i], cx, scrollY);
  const paint = stroke.points[i][2];
  const r = SPRAY_RADIUS;
  const rand = random((stroke.seed ?? 0) ^ Math.imul(i + 1, 0x9e3779b1));
  // Mist builds up wherever the can lingers, like real overspray
  ctx.globalAlpha = Math.min(0.2, paint * 0.0035);
  ctx.drawImage(mist(stroke.color), x - r, y - r, r * 2, r * 2);
  ctx.fillStyle = stroke.color;
  for (let d = 0; d < paint; d++) {
    const angle = rand() * Math.PI * 2;
    // Rayleigh falloff: a dense core that thins out towards the edge
    const dist = Math.min(r, r * 0.4 * Math.sqrt(-2 * Math.log(1 - rand() * 0.9999)));
    const s = 0.5 + rand() * 1.1;
    ctx.globalAlpha = 0.35 + rand() * 0.55;
    ctx.fillRect(x + Math.cos(angle) * dist - s / 2, y + Math.sin(angle) * dist - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
}

// A run of paint from `from` to `to` px below the drip's origin
function drawDrip(
  ctx: CanvasRenderingContext2D,
  drip: Drip,
  from: number,
  to: number,
  color: string,
  cx: number,
  scrollY: number
) {
  const [x, y] = toScreen(drip, cx, scrollY);
  const [, , length, width] = drip;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y + from);
  ctx.lineTo(x, y + to);
  ctx.stroke();
  if (to >= length) {
    // The bead of paint that collects at the bottom
    ctx.beginPath();
    ctx.arc(x, y + to, width * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function drawSpray(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  cx: number,
  scrollY: number,
  shown?: (drip: Drip) => number
) {
  for (let i = 0; i < stroke.points.length; i++) drawSprayPoint(ctx, stroke, i, cx, scrollY);
  for (const drip of stroke.drips ?? []) {
    drawDrip(ctx, drip, 0, shown?.(drip) ?? drip[2], stroke.color, cx, scrollY);
  }
}

// Ring cursor the size of the spray, tinted with the current colour
function sprayCursor(color: string) {
  const size = SPRAY_RADIUS * 2 + 4;
  const c = size / 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    `<circle cx="${c}" cy="${c}" r="${SPRAY_RADIUS}" fill="none" stroke="#fff" stroke-width="2.5" stroke-opacity=".7"/>` +
    `<circle cx="${c}" cy="${c}" r="${SPRAY_RADIUS}" fill="none" stroke="${color}" stroke-dasharray="2 3"/>` +
    `<circle cx="${c}" cy="${c}" r="1.5" fill="${color}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${c} ${c}, crosshair`;
}

const TOOLS = [
  {
    value: "marker",
    label: "Marker",
    icon: (
      <>
        <path d="M10 2.5 13.5 6l-6 6L4 8.5z" />
        <path d="M4 8.5 7.5 12l-5 1.5z" />
      </>
    ),
  },
  {
    value: "spray",
    label: "Spray can",
    icon: (
      <>
        <rect x="3.5" y="6.5" width="6" height="8" rx="1.25" />
        <path d="M4.75 6.5V5h3.5v1.5M6.5 5V3h2" />
        <circle cx="12" cy="2.5" r=".6" fill="currentColor" stroke="none" />
        <circle cx="14" cy="3.5" r=".6" fill="currentColor" stroke="none" />
        <circle cx="12.25" cy="4.75" r=".6" fill="currentColor" stroke="none" />
        <circle cx="14.25" cy="6" r=".6" fill="currentColor" stroke="none" />
      </>
    ),
  },
] as const;

export function GraffitiLayer() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const colorRef = useRef<string>(COLORS[0].value);
  const toolRef = useRef<Tool>("marker");
  const redrawRef = useRef<() => void>(() => {});
  const relayoutRef = useRef<() => void>(() => {});
  const [enabled, setEnabled] = useState(false);
  const [color, setColor] = useState<string>(COLORS[0].value);
  const [tool, setTool] = useState<Tool>("marker");
  const [count, setCount] = useState(0);

  // Only fine pointers with hover (mouse, trackpad, pen) get the feature
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Load this page's drawing whenever the route changes
  useEffect(() => {
    strokesRef.current = readStrokes(pathname);
    setCount(strokesRef.current.length);
    redrawRef.current();
    // The new page's content has to lay out before its keep-out zones exist
    const id = requestAnimationFrame(() => relayoutRef.current());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dpr = 1;
    let frame = 0;
    let settle = 0;
    let keepOut: Rect[] = [];
    let current: Stroke | null = null;
    let cursor = "";
    let last = { x: 0, y: 0, t: 0, w: MIN_WIDTH };

    // Spray state: pointer in client space, last emission and dwell in document space
    let pointer = { x: 0, y: 0 };
    let nozzle = { x: 0, y: 0, t: 0 };
    let dwell = { x: 0, y: 0, time: 0, drips: 0 };
    let sprayFrame = 0;
    let dripFrame = 0;
    const growing = new Map<Drip, { stroke: Stroke; start: number; shown: number }>();

    // Finished spray strokes are thousands of dots; render each once into its
    // own bitmap so scrolling only has to blit it
    const sprayCache = new WeakMap<
      Stroke,
      { dpr: number; bounds: Rect; image: HTMLCanvasElement | null }
    >();

    function cachedSpray(stroke: Stroke) {
      const hit = sprayCache.get(stroke);
      if (hit && hit.dpr === dpr) return hit;
      const bounds = strokeBounds(stroke);
      const w = Math.ceil(bounds.w * dpr);
      const h = Math.ceil(bounds.h * dpr);
      let image: HTMLCanvasElement | null = null;
      if (w > 0 && h > 0 && w * h <= MAX_CACHE_PIXELS) {
        image = document.createElement("canvas");
        image.width = w;
        image.height = h;
        const g = image.getContext("2d");
        if (g) {
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          drawSpray(g, stroke, -bounds.x, bounds.y);
        } else image = null;
      }
      const entry = { dpr, bounds, image };
      sprayCache.set(stroke, entry);
      return entry;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(window.innerWidth * dpr);
      canvas!.height = Math.round(window.innerHeight * dpr);
      relayout();
    }

    function redraw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const sy = window.scrollY;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      const offscreen = (b: Rect) => b.y - sy > h || b.y + b.h - sy < 0;
      for (const stroke of strokesRef.current) {
        if (stroke.tool === "spray") {
          const live = stroke === current || stroke.drips?.some((d) => growing.has(d));
          if (!live) {
            const { bounds, image } = cachedSpray(stroke);
            if (offscreen(bounds)) continue;
            if (image) {
              ctx!.drawImage(image, bounds.x + cx, bounds.y - sy, image.width / dpr, image.height / dpr);
            } else drawSpray(ctx!, stroke, cx, sy);
            continue;
          }
          if (!offscreen(strokeBounds(stroke))) {
            drawSpray(ctx!, stroke, cx, sy, (d) => growing.get(d)?.shown ?? d[2]);
          }
          continue;
        }
        if (!offscreen(strokeBounds(stroke))) drawMarker(ctx!, stroke, cx, sy);
      }
      eraseKeepOut(ctx!, keepOut, cx, sy, 0, h);
    }
    redrawRef.current = redraw;

    function relayout() {
      keepOut = collectKeepOut();
      redraw();
    }
    relayoutRef.current = relayout;

    // Reveal animations and lazy images shift content while scrolling, so
    // re-measure once scrolling settles
    function onScroll() {
      scheduleRedraw();
      clearTimeout(settle);
      settle = window.setTimeout(relayout, 150);
    }

    function scheduleRedraw() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(redraw);
    }

    function addPoint(e: PointerEvent) {
      if (!current) return;
      const now = e.timeStamp;
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      if (dist < 1.5) return;
      // Faster strokes thin out like a real marker; eased so width never jumps
      const speed = dist / Math.max(1, now - last.t);
      const target = Math.max(MIN_WIDTH, MAX_WIDTH - speed * 2.2);
      const w = last.w + (target - last.w) * 0.35;
      current.points.push([e.clientX - window.innerWidth / 2, e.clientY + window.scrollY, w]);
      const prevY = last.y;
      last = { x: e.clientX, y: e.clientY, t: now, w };
      const cx = window.innerWidth / 2;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSegment(ctx!, current, current.points.length - 1, cx, window.scrollY);
      const pad = MAX_WIDTH * 2;
      eraseKeepOut(
        ctx!,
        keepOut,
        cx,
        window.scrollY,
        Math.min(prevY, e.clientY) - pad,
        Math.max(prevY, e.clientY) + pad
      );
    }

    // The can sprays on every frame it is held down, not only when it moves:
    // paint per frame is fixed, so a fast sweep leaves a light dusting and a
    // slow pass or a pause builds up solid colour
    function sprayTick(now: number) {
      if (!current || current.tool !== "spray") return;
      const cx = window.innerWidth / 2;
      const sy = window.scrollY;
      const x = pointer.x - cx;
      const y = pointer.y + sy;
      const dt = Math.min(48, Math.max(0, now - nozzle.t));
      const dist = Math.hypot(x - nozzle.x, y - nozzle.y);
      const steps = Math.max(1, Math.ceil(dist / (SPRAY_RADIUS * 0.35)));
      const paint = Math.max(1, Math.round((dt * SPRAY_RATE) / steps));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        current.points.push([
          round1(nozzle.x + (x - nozzle.x) * t),
          round1(nozzle.y + (y - nozzle.y) * t),
          paint,
        ]);
        drawSprayPoint(ctx!, current, current.points.length - 1, cx, sy);
      }
      eraseKeepOut(
        ctx!,
        keepOut,
        cx,
        sy,
        Math.min(nozzle.y, y) - sy - SPRAY_RADIUS * 2,
        Math.max(nozzle.y, y) - sy + SPRAY_RADIUS * 2
      );
      nozzle = { x, y, t: now };

      // Hold still long enough and the paint starts to run
      if (Math.hypot(x - dwell.x, y - dwell.y) > SPRAY_RADIUS * 0.5) {
        dwell = { x, y, time: 0, drips: 0 };
      } else {
        dwell.time += dt;
        if (
          dwell.drips < MAX_DRIPS_PER_SPOT &&
          dwell.time > DRIP_AFTER + dwell.drips * DRIP_EVERY
        ) {
          dwell.drips++;
          startDrip(current, x, y);
        }
      }

      sprayFrame = requestAnimationFrame(sprayTick);
    }

    function startDrip(stroke: Stroke, x: number, y: number) {
      const drip: Drip = [
        round1(x + (Math.random() - 0.5) * SPRAY_RADIUS * 0.8),
        round1(y + SPRAY_RADIUS * 0.3),
        Math.round(26 + Math.random() * 70),
        round1(1.6 + Math.random() * 1.4),
      ];
      (stroke.drips ??= []).push(drip);
      if (reducedMotion.matches) {
        const cx = window.innerWidth / 2;
        const sy = window.scrollY;
        drawDrip(ctx!, drip, 0, drip[2], stroke.color, cx, sy);
        eraseKeepOut(ctx!, keepOut, cx, sy, drip[1] - sy, drip[1] - sy + drip[2] + 8);
        return;
      }
      growing.set(drip, { stroke, start: performance.now(), shown: 0 });
      if (!dripFrame) dripFrame = requestAnimationFrame(dripTick);
    }

    // Drips are stored at full length; this only animates how much is shown
    function dripTick(now: number) {
      dripFrame = 0;
      const cx = window.innerWidth / 2;
      const sy = window.scrollY;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const [drip, run] of growing) {
        // Undone, cleared or left behind on another page
        if (!strokesRef.current.includes(run.stroke)) {
          growing.delete(drip);
          continue;
        }
        const length = drip[2];
        const t = Math.min(1, Math.max(0, now - run.start) / (500 + length * 14));
        const shown = length * (1 - (1 - t) ** 3); // gravity wins, then it dries
        drawDrip(ctx!, drip, run.shown, shown, run.stroke.color, cx, sy);
        const top = drip[1] - sy;
        eraseKeepOut(ctx!, keepOut, cx, sy, top + run.shown - 8, top + shown + 8);
        run.shown = shown;
        if (t === 1) growing.delete(drip);
      }
      if (growing.size) dripFrame = requestAnimationFrame(dripTick);
    }

    function isEmptyAt(e: PointerEvent) {
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return false;
      return !hits(keepOut, e.clientX - window.innerWidth / 2, e.clientY + window.scrollY);
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch" || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      keepOut = collectKeepOut(); // measure fresh so the start check is exact
      if (!isEmptyAt(e)) return;
      e.preventDefault(); // no text selection while drawing
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY + window.scrollY;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (toolRef.current === "spray") {
        current = {
          tool: "spray",
          color: colorRef.current,
          seed: (Math.random() * 2 ** 32) >>> 0,
          points: [[round1(x), round1(y), 12]],
        };
        strokesRef.current.push(current);
        pointer = { x: e.clientX, y: e.clientY };
        nozzle = { x, y, t: performance.now() };
        dwell = { x, y, time: 0, drips: 0 };
        drawSprayPoint(ctx!, current, 0, window.innerWidth / 2, window.scrollY);
        eraseKeepOut(
          ctx!,
          keepOut,
          window.innerWidth / 2,
          window.scrollY,
          e.clientY - SPRAY_RADIUS * 2,
          e.clientY + SPRAY_RADIUS * 2
        );
        sprayFrame = requestAnimationFrame(sprayTick);
        return;
      }

      const w = (MIN_WIDTH + MAX_WIDTH) / 2;
      current = { color: colorRef.current, points: [[x, y, w]] };
      strokesRef.current.push(current);
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp, w };
      drawMarker(ctx!, current, window.innerWidth / 2, window.scrollY);
    }

    function onPointerMove(e: PointerEvent) {
      if (current) {
        if (current.tool === "spray") {
          pointer = { x: e.clientX, y: e.clientY };
          return;
        }
        // Coalesced events give smooth curves on fast flicks
        const events = e.getCoalescedEvents?.() ?? [];
        if (events.length) events.forEach(addPoint);
        else addPoint(e);
        return;
      }
      if (e.pointerType === "touch") return;
      const next = !isEmptyAt(e)
        ? ""
        : toolRef.current === "spray"
          ? sprayCursor(colorRef.current)
          : "crosshair";
      if (cursor !== next) root.style.cursor = cursor = next;
    }

    function onPointerUp() {
      if (!current) return;
      cancelAnimationFrame(sprayFrame);
      current = null;
      strokesRef.current = trim(strokesRef.current);
      writeStrokes(window.location.pathname, strokesRef.current);
      setCount(strokesRef.current.length);
    }

    // Page height changes (images loading, route changes) move content
    const observer = new ResizeObserver(() => relayout());
    observer.observe(document.body);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("blur", onPointerUp);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(sprayFrame);
      cancelAnimationFrame(dripFrame);
      clearTimeout(settle);
      observer.disconnect();
      growing.clear();
      root.style.cursor = "";
      redrawRef.current = () => {};
      relayoutRef.current = () => {};
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("blur", onPointerUp);
    };
  }, [enabled]);

  const pickColor = useCallback((value: string) => {
    colorRef.current = value;
    setColor(value);
  }, []);

  const pickTool = useCallback((value: Tool) => {
    toolRef.current = value;
    setTool(value);
  }, []);

  const update = useCallback(
    (next: Stroke[]) => {
      strokesRef.current = next;
      writeStrokes(pathname, next);
      setCount(next.length);
      redrawRef.current();
    },
    [pathname]
  );

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 -z-[1] h-screen w-screen"
        aria-hidden="true"
      />

      {count > 0 && (
        <div
          role="toolbar"
          aria-label="Graffiti"
          data-graffiti-ignore
          className="graffiti-toolbar fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-white/70 p-1 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] backdrop-blur-md"
        >
          {TOOLS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => pickTool(t.value)}
              aria-label={t.label}
              aria-pressed={tool === t.value}
              title={t.label}
              className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors duration-150 hover:text-ink aria-pressed:bg-ink/[0.06] aria-pressed:text-ink"
            >
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {t.icon}
              </svg>
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => pickColor(c.value)}
              aria-label={`${c.label} colour`}
              aria-pressed={color === c.value}
              className="grid h-7 w-7 place-items-center rounded-full"
            >
              <span
                className="h-3.5 w-3.5 rounded-full transition-transform duration-150 ease-out"
                style={{
                  background: c.value,
                  transform: color === c.value ? "scale(1.25)" : undefined,
                  boxShadow: color === c.value ? `0 0 0 2px #fff, 0 0 0 3px ${c.value}` : undefined,
                }}
              />
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
          <button
            type="button"
            onClick={() => update(strokesRef.current.slice(0, -1))}
            className="rounded-full px-2.5 py-1 text-meta text-muted transition-colors hover:text-ink"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => update([])}
            className="rounded-full px-2.5 py-1 text-meta text-muted transition-colors hover:text-ink"
          >
            Clear
          </button>
        </div>
      )}
    </>
  );
}
