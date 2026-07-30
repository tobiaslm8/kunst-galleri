import type { MetadataRoute } from "next";
import { artists } from "@/lib/artists";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    ...artists.map((artist) => ({
      url: `${baseUrl}/artists/${artist.slug}`,
      lastModified: new Date()
    }))
  ];
}
