"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Press and drag on empty space to draw. Strokes sit under the content, are
// stored per page in localStorage, and only exist for mouse and pen input so
// touch scrolling is never hijacked.

type Point = [x: number, y: number, width: number];
type Stroke = { color: string; points: Point[] };

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

// Anything a visitor reads or clicks is not "empty space"
const SOLID =
  "a, button, input, textarea, select, label, summary, img, picture, video, svg, canvas, iframe, " +
  "p, h1, h2, h3, h4, h5, h6, li, dt, dd, blockquote, pre, code, figure, table, span, strong, em, time, " +
  "header, nav, [role], [tabindex], [contenteditable], [data-no-graffiti]";

function isEmptySpace(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target === document.documentElement || target === document.body) return true;
  return !target.closest(SOLID);
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

// Points are stored with x relative to the viewport centre (the layout is
// centred, so drawings stay next to the content they were drawn beside) and
// y relative to the top of the document.
function toScreen([x, y]: Point, cx: number, scrollY: number) {
  return [x + cx, y - scrollY] as const;
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

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, cx: number, scrollY: number) {
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

export function GraffitiLayer() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const colorRef = useRef<string>(COLORS[0].value);
  const redrawRef = useRef<() => void>(() => {});
  const [enabled, setEnabled] = useState(false);
  const [color, setColor] = useState<string>(COLORS[0].value);
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
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    let dpr = 1;
    let frame = 0;
    let current: Stroke | null = null;
    let last = { x: 0, y: 0, t: 0, w: MIN_WIDTH };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(window.innerWidth * dpr);
      canvas!.height = Math.round(window.innerHeight * dpr);
      redraw();
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
      for (const stroke of strokesRef.current) {
        // Skip strokes entirely off screen
        let visible = false;
        for (const [, y] of stroke.points) {
          const top = y - sy;
          if (top > -MAX_WIDTH && top < h + MAX_WIDTH) {
            visible = true;
            break;
          }
        }
        if (visible) drawStroke(ctx!, stroke, cx, sy);
      }
    }
    redrawRef.current = redraw;

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
      last = { x: e.clientX, y: e.clientY, t: now, w };
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSegment(ctx!, current, current.points.length - 1, window.innerWidth / 2, window.scrollY);
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch" || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!isEmptySpace(e.target)) return;
      e.preventDefault(); // no text selection while drawing
      const w = (MIN_WIDTH + MAX_WIDTH) / 2;
      current = {
        color: colorRef.current,
        points: [[e.clientX - window.innerWidth / 2, e.clientY + window.scrollY, w]],
      };
      strokesRef.current.push(current);
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp, w };
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStroke(ctx!, current, window.innerWidth / 2, window.scrollY);
    }

    function onPointerMove(e: PointerEvent) {
      if (current) {
        // Coalesced events give smooth curves on fast flicks
        const events = e.getCoalescedEvents?.() ?? [];
        if (events.length) events.forEach(addPoint);
        else addPoint(e);
        return;
      }
      if (e.pointerType === "touch") return;
      const empty = isEmptySpace(e.target);
      const cursor = empty ? "crosshair" : "";
      if (root.style.cursor !== cursor) root.style.cursor = cursor;
    }

    function onPointerUp() {
      if (!current) return;
      current = null;
      strokesRef.current = trim(strokesRef.current);
      writeStrokes(window.location.pathname, strokesRef.current);
      setCount(strokesRef.current.length);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", scheduleRedraw, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("blur", onPointerUp);

    return () => {
      cancelAnimationFrame(frame);
      root.style.cursor = "";
      redrawRef.current = () => {};
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scheduleRedraw);
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
          className="graffiti-toolbar fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-white/70 p-1 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] backdrop-blur-md"
        >
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => pickColor(c.value)}
              aria-label={`${c.label} marker`}
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
