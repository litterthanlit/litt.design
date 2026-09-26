import type { Project } from "@/data/types";

export const projects: Project[] = [
  {
    slug: "studio-os",
    title: "Studio OS",
    category: "Design Tool",
    description:
      "A design tool that turns references into taste-driven UI. Drop moodboards, compile taste directives, and work in a canvas that respects structure. Copy HTML or publish when you're ready.",
    oneLineOutcome:
      "A design tool built around taste. References in, shipped UI out.",
    client: "Personal Project",
    year: "2025–2026",
    services: ["Product Strategy", "UI Design", "AI Integration"],
    stack: ["Next.js", "TypeScript", "Tailwind", "AI Agents"],
    accent: "#2D3436",
    coverMedia: {
      background:
        "linear-gradient(135deg, #2D3436 0%, #636e72 50%, #b2bec3 100%)",
      preview: "/previews/studio-os.png",
    },
    externalUrl: "https://studio-os.io/",
    screens: [
      { label: "Homepage", description: "Product landing with taste engine and canvas preview", src: "/previews/studio-os/home.png" },
      { label: "Preview", description: "Studio OS editor and inspector", src: "/previews/studio-os.png" },
    ],
    heroFrames: [
      { id: "sos-1", background: "linear-gradient(180deg, #2D3436, #636e72)", focus: 0.3 },
      { id: "sos-2", background: "linear-gradient(180deg, #636e72, #b2bec3)", focus: 0.5 },
      { id: "sos-3", background: "linear-gradient(180deg, #2D3436, #dfe6e9)", focus: 0.7 },
      { id: "sos-4", background: "linear-gradient(180deg, #b2bec3, #2D3436)", focus: 0.4 },
      { id: "sos-5", background: "linear-gradient(180deg, #636e72, #2D3436)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "AI output has no taste",
        body: "Generative UI tools produce competent, forgettable layouts. The references that shape a designer's eye — moodboards, screenshots, type specimens — never make it into the prompt.",
      },
      {
        label: "Approach",
        heading: "References in, directives out",
        body: "Drop in a moodboard and Studio OS compiles it into taste directives: type, spacing, colour, and composition rules that every generated screen has to follow.",
      },
      {
        label: "Execution",
        heading: "A canvas that respects structure",
        body: "Generated UI lands on a canvas as real, editable layout — not a flat image. Adjust it in the inspector, then copy clean HTML or publish when it's ready.",
      },
      {
        label: "Result",
        heading: "Taste you can reuse",
        body: "Direction stops living only in your head. The same directives shape every screen, so the output looks like it came from one designer with one point of view.",
      },
    ],
  },
  {
    slug: "wavr",
    title: "Wavr",
    category: "Creative Tool",
    description:
      "An interactive animated gradient editor. Create moving mesh gradients and visual effects through a visual editor, then export as CSS, PNG, or video. Raw WebGL shaders, no abstraction layer.",
    oneLineOutcome:
      "A visual gradient editor that turns shader code into exportable motion graphics.",
    client: "Personal Project",
    year: "2026",
    services: ["Product Design", "WebGL Development", "Shader Programming"],
    stack: ["Next.js", "WebGL 2", "GLSL", "Zustand", "Tailwind"],
    accent: "#E17055",
    coverMedia: {
      background:
        "linear-gradient(135deg, #E17055 0%, #fab1a0 40%, #ffeaa7 100%)",
      preview: "/previews/wavr.jpg",
    },
    externalUrl: "https://wavr-v1.vercel.app/",
    screens: [
      { label: "Landing", description: "Homepage with gradient types and feature overview", src: "/previews/wavr/home.png" },
      { label: "Editor", description: "Visual gradient editor with parameter controls", src: "/previews/wavr.jpg" },
    ],
    heroFrames: [
      { id: "wavr-1", background: "linear-gradient(180deg, #E17055, #fab1a0)", focus: 0.3 },
      { id: "wavr-2", background: "linear-gradient(180deg, #fab1a0, #ffeaa7)", focus: 0.5 },
      { id: "wavr-3", background: "linear-gradient(180deg, #E17055, #fdcb6e)", focus: 0.7 },
      { id: "wavr-4", background: "linear-gradient(180deg, #ffeaa7, #E17055)", focus: 0.4 },
      { id: "wavr-5", background: "linear-gradient(180deg, #fab1a0, #fdcb6e)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Gradient tools are static",
        body: "CSS gradient generators produce flat output. Designers want animated, organic gradients but shader programming has a steep learning curve.",
      },
      {
        label: "Approach",
        heading: "Visual controls over raw GLSL",
        body: "Exposed every shader uniform through intuitive UI controls — sliders for speed, complexity, distortion. The fragment shader does the heavy lifting; the interface hides the math.",
      },
      {
        label: "Execution",
        heading: "Single-shader architecture",
        body: "One fragment shader handles all gradient modes, noise, particles, bloom, and post-processing. No recompilation when switching modes — just uniform swaps.",
      },
      {
        label: "Result",
        heading: "Export-ready motion gradients",
        body: "Designers create living gradients and export as CSS, PNG, or WebM video in seconds. Mouse-reactive effects make every gradient feel interactive.",
      },
    ],
    metrics: [
      { label: "Gradient Modes", value: "5" },
      { label: "Effects", value: "6" },
      { label: "Export Formats", value: "3" },
    ],
  },
  {
    slug: "good-md",
    title: "Houston",
    category: "Desktop App",
    description:
      "A native Markdown reader built with Tauri. Opens and renders .md and .mdx files with syntax highlighting, GFM support, and a clean tabbed reading interface. Lightweight, fast, local-first.",
    oneLineOutcome:
      "A native desktop Markdown reader that prioritizes reading comfort over editing features.",
    client: "Personal Project",
    year: "2026",
    services: ["Product Design", "Desktop Development", "Typography"],
    stack: ["Tauri 2", "React 19", "Vite", "TypeScript"],
    accent: "#00B894",
    coverMedia: {
      background:
        "linear-gradient(135deg, #00B894 0%, #55efc4 50%, #dfe6e9 100%)",
      preview: "/previews/good-md.png",
    },
    externalUrl: "https://houston-rose.vercel.app/",
    heroFrames: [
      { id: "gmd-1", background: "linear-gradient(180deg, #00B894, #55efc4)", focus: 0.3 },
      { id: "gmd-2", background: "linear-gradient(180deg, #55efc4, #dfe6e9)", focus: 0.5 },
      { id: "gmd-3", background: "linear-gradient(180deg, #00B894, #81ecec)", focus: 0.7 },
      { id: "gmd-4", background: "linear-gradient(180deg, #dfe6e9, #00B894)", focus: 0.4 },
      { id: "gmd-5", background: "linear-gradient(180deg, #55efc4, #00cec9)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Markdown readers try to do too much",
        body: "Most Markdown apps are editors first. Readers who just want to open and read files get buried under editing chrome and configuration.",
      },
      {
        label: "Approach",
        heading: "Read-first, native-fast",
        body: "Built on Tauri for native performance with a minimal React UI. Drag-and-drop files, tabbed reading, keyboard navigation — nothing more.",
      },
      {
        label: "Execution",
        heading: "GFM, syntax highlighting, clean type",
        body: "Full GitHub-flavored Markdown support with syntax highlighting, auto-linked headings, and a reading layout designed around comfortable line lengths.",
      },
      {
        label: "Result",
        heading: "Opens instantly, reads beautifully",
        body: "A lightweight native app that does one thing well — rendering Markdown with the care of a good book layout.",
      },
    ],
    metrics: [
      { label: "Bundle Size", value: "~4MB" },
      { label: "Startup Time", value: "<200ms" },
      { label: "Formats", value: "md/mdx" },
    ],
  },
  {
    slug: "vceezy",
    title: "VCEEZY",
    category: "Web3 Platform",
    description:
      "A music and NFT platform on Hedera. Player, collection, archive, merch, and token-gated content with wallet connectivity. Monochrome quiet-luxury design with spring-driven motion.",
    oneLineOutcome:
      "A music platform where artists own their distribution through NFTs on Hedera.",
    client: "VCeezy",
    year: "2026",
    services: ["Brand Identity", "Web Design", "Web3 Integration"],
    stack: ["Next.js", "Hedera SDK", "Framer Motion", "Howler.js"],
    accent: "#1A1A1A",
    coverMedia: {
      background:
        "linear-gradient(135deg, #1A1A1A 0%, #4a4a4a 50%, #8a8a8a 100%)",
      preview: "/previews/vceezy.png",
    },
    heroFrames: [
      { id: "vc-1", background: "linear-gradient(180deg, #1A1A1A, #4a4a4a)", focus: 0.3 },
      { id: "vc-2", background: "linear-gradient(180deg, #4a4a4a, #8a8a8a)", focus: 0.5 },
      { id: "vc-3", background: "linear-gradient(180deg, #1A1A1A, #6a6a6a)", focus: 0.7 },
      { id: "vc-4", background: "linear-gradient(180deg, #8a8a8a, #1A1A1A)", focus: 0.4 },
      { id: "vc-5", background: "linear-gradient(180deg, #4a4a4a, #2a2a2a)", focus: 0.6 },
    ],
    storyBlocks: [
      {
        label: "Challenge",
        heading: "Artists lose control on streaming platforms",
        body: "Streaming services commoditize music. Artists need a way to distribute directly to fans with ownership, exclusivity, and real revenue.",
      },
      {
        label: "Approach",
        heading: "Token-gated music on Hedera",
        body: "NFT-based ownership on Hedera's low-cost network. Wallet-connected player, collection management, and a merch storefront — all in one monochrome interface.",
      },
      {
        label: "Execution",
        heading: "Quiet luxury, spring-driven motion",
        body: "Geist Sans typography, pill-shaped buttons, fadeUp animations with blur. Every interaction uses spring physics — no CSS easing. The design gets out of the music's way.",
      },
      {
        label: "Result",
        heading: "Direct artist-to-fan distribution",
        body: "A platform where artists control their catalog, fans own what they buy, and the interface respects both the music and the listener.",
      },
    ],
    metrics: [
      { label: "Routes", value: "7" },
      { label: "Chain", value: "Hedera" },
      { label: "Design", value: "Monochrome" },
    ],
  },
];
