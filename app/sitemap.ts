import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://litt.design",
      lastModified: new Date("2026-03-10"),
    },
    ...projects.map((project) => ({
      url: `https://litt.design/work/${project.slug}`,
      lastModified: new Date("2026-03-10"),
    })),
  ];
}

