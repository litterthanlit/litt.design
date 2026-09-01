import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-01");

  return [
    {
      url: "https://litt.design",
      lastModified,
    },
    {
      url: "https://litt.design/art",
      lastModified,
    },
    ...projects.map((project) => ({
      url: `https://litt.design/work/${project.slug}`,
      lastModified,
    })),
  ];
}
