import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site-url";

const PAGES = ["", "/work", "/about", "/about/competitions", "/about/activities", "/cv", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({
      url: `${siteUrl}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.9,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
