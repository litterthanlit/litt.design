// Composes the homepage card covers into public/previews/covers/<slug>.jpg.
//
// Each cover is a stage, after the visuals on hypher.app: the project's own
// imagery blurred into a field of light, with one crisp piece of the real
// product floating on it. Sources are captured from the live sites (or read
// from public/art) into scripts/covers/.cache, which is gitignored.
//
//   node scripts/covers/build.mjs            every cover
//   node scripts/covers/build.mjs carson     one cover
//   node scripts/covers/build.mjs --fresh    recapture the sources first
//
// Needs Playwright with Chromium (npx playwright install chromium).

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CACHE = path.join(ROOT, "scripts/covers/.cache");
const OUT = path.join(ROOT, "public/previews/covers");
const ART = path.join(ROOT, "public/art/pieces");

// The stage is 16/10, or 2/1 for a card that spans both columns, rendered at 2x
const W = 800;
const height = (scene) => (scene.wide ? 400 : 500);

// Hypher's marketing CSS, minus every backdrop, so a card captures on transparent
const HYPHER_BARE =
  "html,body,main,section,.marketing-wrap,.marketing-section,.marketing-vtile,.marketing-photo,.marketing-vcards,.marketing-vcard{background:transparent!important}" +
  ".marketing-photo__img{visibility:hidden!important}" +
  ".marketing-photo::before,.marketing-photo::after,.marketing-vtile::before,.marketing-vtile::after{display:none!important}";

const download = (url) => async () => Buffer.from(await (await fetch(url)).arrayBuffer());

const shoot = (url, { scale = 2, css, prepare, locate, bare = false }) => async (browser) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: scale, reducedMotion: "reduce" });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    if (css) await page.addStyleTag({ content: css });
    if (prepare) await prepare(page);
    const el = locate(page);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    if (bare) await el.evaluate((node) => { for (let p = node.parentElement; p; p = p.parentElement) p.style.background = "transparent"; });
    return await el.screenshot({ omitBackground: bare });
  } finally {
    await page.close();
  }
};

const brandTile = (name) =>
  shoot("https://brand-five-gules.vercel.app/", { locate: (p) => p.locator("li").filter({ hasText: name }).first().locator(":scope > *").first() });

const SOURCES = {
  "hypher-ground.webp": download("https://www.hypher.app/marketing/visuals/light-streak.webp"),
  "hypher-note.png": shoot("https://www.hypher.app/", { scale: 3, css: HYPHER_BARE, bare: true, locate: (p) => p.locator("#the-loop .marketing-vtile").nth(1) }),
  "brand-blur-echo.png": brandTile("Blur Echo"),
  "brand-screen-orb.png": brandTile("Screen Orb"),
  "brand-long-exposure.png": brandTile("Long Exposure"),
  "carson-poster.png": shoot("https://carson-navy.vercel.app/", {
    scale: 5,
    bare: true,
    prepare: async (p) => { const skip = p.getByText("Skip intro"); if (await skip.count()) await skip.first().click(); },
    locate: (p) => p.locator("svg.home-wreck-art"),
  }),
  "studio-moodboard.png": download("https://studio-os.io/taste-moodboard-gallery.png"),
  // The taste rows, set into one dark panel of their own so the gaps read as the panel
  "studio-taste.png": shoot("https://studio-os.io/", {
    scale: 3,
    bare: true,
    css: "html,body{background:transparent!important}article.group div.absolute.inset-0{display:none!important}article.group div.max-w-\\[240px\\]{background:#0b0b10!important;padding:12px!important;max-width:264px!important;border-radius:8px!important}",
    locate: (p) => p.locator("article.group").nth(1).locator("div.max-w-\\[240px\\]"),
  }),
};

const cached = (name) => pathToFileURL(path.join(CACHE, name)).href;
const art = (name) => pathToFileURL(path.join(ART, name)).href;

// Zero-offset glow and a ring: litt's floating depth, so nothing casts sideways
const FLOAT = "0 0 0 1px rgb(0 0 0 / 0.08), 0 0 24px rgb(0 0 0 / 0.16), 0 0 72px rgb(0 0 0 / 0.14)";
const FLOAT_DARK = "0 0 0 1px rgb(255 255 255 / 0.06), 0 0 24px rgb(0 0 0 / 0.5), 0 0 72px rgb(0 0 0 / 0.45)";

// A ground is the project's own image, blurred until it reads as light.
// An object is a crisp piece of the product: w is its width in % of the stage,
// x and y its centre, ratio and top crop it to a fixed shape. A wide scene is
// for a card marked wide in data/work.ts, so keep the two in step.
const SCENES = {
  hypher: {
    wide: true,
    base: "#dfe4e8",
    ground: { src: cached("hypher-ground.webp"), blur: 0 },
    objects: [{ src: cached("hypher-note.png"), w: 52, x: 50, y: 52 }],
  },
  brand: {
    base: "#0a0a0b",
    ground: { src: cached("brand-long-exposure.png"), blur: 90, scale: 1.4, opacity: 0.4 },
    objects: [
      { src: cached("brand-blur-echo.png"), w: 26, x: 22, y: 51, ratio: "4 / 5", top: true, shadow: FLOAT_DARK },
      { src: cached("brand-screen-orb.png"), w: 26, x: 50, y: 51, ratio: "4 / 5", top: true, shadow: FLOAT_DARK },
      { src: cached("brand-long-exposure.png"), w: 26, x: 78, y: 51, ratio: "4 / 5", top: true, shadow: FLOAT_DARK },
    ],
  },
  carson: {
    base: "#d9323f",
    ground: { src: cached("carson-poster.png"), blur: 28, scale: 3.2, origin: "40% 62%", opacity: 0.5, blend: "multiply" },
    objects: [{ src: cached("carson-poster.png"), w: 35, x: 50, y: 52, rotate: -4 }],
  },
  "studio-os": {
    base: "#1a1c24",
    ground: { src: cached("studio-moodboard.png"), blur: 28, scale: 1.3, saturate: 1.3, brightness: 1.15 },
    objects: [{ src: cached("studio-taste.png"), w: 52, x: 50, y: 51, radius: 8, shadow: FLOAT_DARK }],
  },
  "litt-works": {
    wide: true,
    base: "#ece9e4",
    ground: { src: art("untld2.jpg"), blur: 80, scale: 1.6, opacity: 0.75 },
    objects: [
      { src: art("untld1.jpg"), w: 19, x: 31, y: 53, rotate: -6 },
      { src: art("in-the-fire.jpg"), w: 19, x: 69, y: 53, rotate: 6 },
      { src: art("shattered.jpg"), w: 21, x: 50, y: 50 },
    ],
  },
  vyo: { html: vyo },
};

function objectHtml(o) {
  const box = [
    `left:${o.x}%`,
    `top:${o.y}%`,
    `width:${o.w}%`,
    o.ratio && `aspect-ratio:${o.ratio}`,
    `transform:translate(-50%,-50%) rotate(${o.rotate ?? 0}deg)`,
    `box-shadow:${o.shadow ?? FLOAT}`,
    `border-radius:${o.radius ?? 4}px`,
  ].filter(Boolean).join(";");
  // A cropped object zooms 3% so the source's own edge never shows
  const fit = o.ratio ? `height:100%;object-fit:cover;object-position:${o.top ? "top" : "center"};transform:scale(1.03)` : "height:auto";
  // A transparent capture (a card with its own shadow) floats without a box of its own
  const transparent = o.src.endsWith(".png") && !o.ratio && !o.rotate && o.shadow === undefined;
  return `<div class="o" style="${box}${transparent ? ";box-shadow:none;border-radius:0" : ""}"><img src="${o.src}" style="width:100%;${fit}"></div>`;
}

function sceneHtml(s) {
  const g = s.ground;
  return `
    <div class="ground" style="background:${s.base}">
      <img src="${g.src}" style="filter:blur(${g.blur}px) saturate(${g.saturate ?? 1.15}) brightness(${g.brightness ?? 1});transform:scale(${g.scale ?? 1});transform-origin:${g.origin ?? "center"};opacity:${g.opacity ?? 1};mix-blend-mode:${g.blend ?? "normal"}">
    </div>
    ${s.objects.map(objectHtml).join("")}`;
}

// Vyo's own Block style: one hue, out of focus, with the features stacked as
// black blocks, each tagged with a status tab. Words sit on blocks, never on the field.
function vyo() {
  const col = (n) => 48 + n * (44 + 16);
  const span = (a, b) => col(b) - col(a) - 16;
  const blocks = [
    { from: 2, to: 8, tab: "Scan", say: "Reads the repository" },
    { from: 4, to: 12, tab: "App guide", say: "How the app works, in plain English" },
    { from: 1, to: 7, tab: "Project story", say: "The sheet you sell it with" },
    { from: 3, to: 10, tab: "Exploded view", say: "Its real parts, drawn from the code" },
  ];
  let y = 56;
  const stack = blocks.map((b, i) => {
    const h = i === 1 ? 104 : 88;
    const top = y;
    y += h;
    return `
      <div style="position:absolute;left:${col(b.from)}px;top:${top}px;width:${span(b.from, b.to)}px;height:${h}px;background:#0a0a0a">
        <div style="position:absolute;top:-12px;${i % 2 ? "right:0" : "left:0"};height:24px;padding:0 8px;display:flex;gap:6px;align-items:center;background:#ffcc00;font:700 10px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#0a0a0a">${b.tab}<span style="font-weight:400">Live</span></div>
        <p style="margin:0;padding:20px 16px 0;font:500 14px/24px 'Helvetica Neue',Arial,sans-serif;color:#fff">${b.say}</p>
      </div>`;
  });
  return `
    <div class="ground" style="background:#f2560a">
      <div style="position:absolute;inset:-20%;filter:blur(60px)">
        <div style="position:absolute;left:8%;top:6%;width:52%;height:58%;border-radius:50%;background:#ffb27a"></div>
        <div style="position:absolute;left:52%;top:40%;width:56%;height:62%;border-radius:50%;background:#b83300"></div>
        <div style="position:absolute;left:30%;top:58%;width:34%;height:40%;border-radius:50%;background:#ff8a3d"></div>
      </div>
    </div>
    ${stack.join("")}
    <div style="position:absolute;left:${col(8)}px;top:${y + 24}px;padding:8px 12px;background:#fff;font:700 18px/24px 'Helvetica Neue',Arial,sans-serif;letter-spacing:-.01em;color:#0a0a0a">Vyo<span style="color:#e4002b">.</span></div>`;
}

const page = (body, h) => `<!doctype html><html><head><style>
  html,body{margin:0}
  .stage{position:relative;width:${W}px;height:${h}px;overflow:hidden}
  .ground,.ground>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .o{position:absolute;overflow:hidden}
  .o img{display:block}
  .grain{position:absolute;inset:0;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
  .light{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 45% at 50% -8%,rgb(255 255 255/.16),transparent 70%)}
</style></head><body><div class="stage">${body}<div class="light"></div><div class="grain"></div></div></body></html>`;

const args = process.argv.slice(2);
const fresh = args.includes("--fresh");
const only = args.filter((a) => !a.startsWith("--"));
const slugs = only.length ? only : Object.keys(SCENES);
for (const slug of slugs) if (!SCENES[slug]) throw new Error(`No scene named ${slug}. Scenes: ${Object.keys(SCENES).join(", ")}`);

fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, get] of Object.entries(SOURCES)) {
    const file = path.join(CACHE, name);
    if (fresh || !fs.existsSync(file)) {
      fs.writeFileSync(file, await get(browser));
      console.log(`captured ${name}`);
    }
  }
  const tab = await browser.newPage({ viewport: { width: W, height: 500 }, deviceScaleFactor: 2 });
  for (const slug of slugs) {
    const s = SCENES[slug];
    const html = path.join(CACHE, `${slug}.html`);
    fs.writeFileSync(html, page(s.html ? s.html() : sceneHtml(s), height(s)));
    await tab.goto(pathToFileURL(html).href, { waitUntil: "load" });
    await tab.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
    await tab.locator(".stage").screenshot({ path: path.join(OUT, `${slug}.jpg`), type: "jpeg", quality: 86 });
    console.log(`wrote public/previews/covers/${slug}.jpg`);
  }
} finally {
  await browser.close();
}
