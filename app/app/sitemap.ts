import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

const baseUrl = "https://youtubethumbnails-downloader.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogUrls = blogPosts.map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: new Date("2026-07-17"),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-07-17"),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-07-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date("2026-07-17"),
      changeFrequency: "yearly",
      priority: 0.5,
    },

    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date("2026-07-17"),
      changeFrequency: "yearly",
      priority: 0.5,
    },

    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-07-17"),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-07-17"),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    ...blogUrls,
  ];
}