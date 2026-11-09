import type { MetadataRoute } from "next";

const baseUrl = "https://youtubethumbnails-downloader.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-11-09"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/youtube-thumbnail-resizer`,
      lastModified: new Date("2026-11-09"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
