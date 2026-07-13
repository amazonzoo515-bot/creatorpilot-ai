import type { MetadataRoute } from "next";

// SEO Sitemap Configuration
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://youtubethumbnails-downloader.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}