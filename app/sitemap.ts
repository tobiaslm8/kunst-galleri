import type { MetadataRoute } from "next";
import { artists } from "@/lib/artists";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1
    },
    ...artists.map((artist) => ({
      url: `${siteConfig.url}/artists/${artist.slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
