import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

const baseUrl = "https://youtubethumbnails-downloader.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogUrls,
  ];
}