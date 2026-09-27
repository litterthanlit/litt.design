import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { writings } from "@/data/writing";

const BASE = "https://litt.design";
const LAST_MODIFIED = new Date("2026-09-26");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: LAST_MODIFIED },
    { url: `${BASE}/art`, lastModified: LAST_MODIFIED },
    { url: `${BASE}/art2`, lastModified: LAST_MODIFIED },
    ...projects.map((project) => ({
      url: `${BASE}/work/${project.slug}`,
      lastModified: LAST_MODIFIED,
    })),
    ...writings
      .filter((entry) => entry.body)
      .map((entry) => ({
        url: `${BASE}/writing/${entry.slug}`,
        lastModified: LAST_MODIFIED,
      })),
  ];
}
