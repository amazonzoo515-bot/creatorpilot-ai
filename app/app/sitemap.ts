import type { MetadataRoute } from "next";

const baseUrl = "https://youtubethumbnails-downloader.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}