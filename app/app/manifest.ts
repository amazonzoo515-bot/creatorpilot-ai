import type { MetadataRoute } from "next";

// PWA Site Manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YouTube Thumbnail Downloader",
    short_name: "YT Thumbnail",
    description:
      "Download YouTube thumbnails in Max Resolution, HD, HQ, MQ and SD quality.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}