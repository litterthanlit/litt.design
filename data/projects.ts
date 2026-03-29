import type { Project } from "@/data/types";

export const projects: Project[] = [
  {
    slug: "ergon",
    title: "Ergon",
    category: "Creative Tool",
    description:
      "A browser-based creative coding studio for generative art. Write code templates, tweak parameters in real time, and export visual output — Processing meets a polished desktop IDE.",
    stack: ["Next.js", "TypeScript", "WebGL", "CodeMirror", "Zustand"],
    accent: "#6C5CE7",
    coverMedia: {
      background:
        "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 50%, #dfe6e9 100%)",
    },
  },
  {
    slug: "wavr",
    title: "Wavr",
    category: "Creative Tool",
    description:
      "An interactive animated gradient editor. Create moving mesh gradients and visual effects through a visual editor, then export as CSS, PNG, or video. Raw WebGL shaders, no abstraction layer.",
    stack: ["Next.js", "WebGL 2", "GLSL", "Zustand", "Tailwind"],
    accent: "#E17055",
    coverMedia: {
      background:
        "linear-gradient(135deg, #E17055 0%, #fab1a0 40%, #ffeaa7 100%)",
    },
  },
  {
    slug: "good-md",
    title: "Good MD",
    category: "Desktop App",
    description:
      "A native Markdown reader built with Tauri. Opens and renders .md and .mdx files with syntax highlighting, GFM support, and a clean tabbed reading interface. Lightweight, fast, local-first.",
    stack: ["Tauri 2", "React 19", "Vite", "TypeScript"],
    accent: "#00B894",
    coverMedia: {
      background:
        "linear-gradient(135deg, #00B894 0%, #55efc4 50%, #dfe6e9 100%)",
    },
  },
  {
    slug: "studio-os",
    title: "Studio OS",
    category: "AI Product",
    description:
      "An AI-powered creative workspace for designers. Briefing dashboard, six specialized AI agents, and an ASCII-inspired visual identity — a command center for solo design practice.",
    stack: ["Next.js", "TypeScript", "Tailwind", "AI Agents"],
    accent: "#2D3436",
    coverMedia: {
      background:
        "linear-gradient(135deg, #2D3436 0%, #636e72 50%, #b2bec3 100%)",
    },
  },
  {
    slug: "vceezy",
    title: "VCeezy",
    category: "Web3 Platform",
    description:
      "A music and NFT platform on Hedera. Player, collection, archive, merch, and token-gated content with wallet connectivity. Monochrome quiet-luxury design with spring-driven motion.",
    stack: ["Next.js", "Hedera SDK", "Framer Motion", "Howler.js"],
    accent: "#1A1A1A",
    coverMedia: {
      background:
        "linear-gradient(135deg, #1A1A1A 0%, #4a4a4a 50%, #8a8a8a 100%)",
    },
  },
];
