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
    {
      url: `${baseUrl}/youtube-thumbnail-size`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/youtube-shorts-thumbnail-size`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/youtube-banner-size`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/youtube-profile-picture-size`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/download-youtube-thumbnail-on-phone`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chrome-extension`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-11-14"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-11-12"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
