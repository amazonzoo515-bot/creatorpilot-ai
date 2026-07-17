import type { MetadataRoute } from "next";

// PWA Site Manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YouTube Thumbnail Downloader",
    short_name: "Thumbnail Downloader",
    description:
      "Download YouTube thumbnails in Max Resolution, HD, HQ, MQ, SD and Default quality. Paste any public YouTube video URL and instantly download high-quality thumbnail images.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}