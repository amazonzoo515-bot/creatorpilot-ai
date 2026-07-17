import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
  {
    userAgent: "*",
    allow: "/",
    disallow: [
      "/api/",
    ],
  },
],

    sitemap: "https://youtubethumbnails-downloader.com/sitemap.xml",

    host: "https://youtubethumbnails-downloader.com",
  };
}