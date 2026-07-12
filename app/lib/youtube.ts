export function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }

    // https://www.youtube.com/watch?v=VIDEO_ID
    const videoId = parsedUrl.searchParams.get("v");
    if (videoId) {
      return videoId;
    }

    // https://www.youtube.com/shorts/VIDEO_ID
    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/shorts/")[1];
    }

    // https://www.youtube.com/embed/VIDEO_ID
    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1];
    }

    return null;
  } catch {
    return null;
  }
}

export function getThumbnailUrls(videoId: string) {
  return [
    {
      name: "Max Resolution",
      resolution: "Max Resolution (1280 × 720) - Highest Quality",
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    },
    {
      name: "SD",
      resolution: "SD - Standard Definition (640 × 480)",
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    },
    {
      name: "HQ",
      resolution: "HQ - High Quality (480 × 360)",
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    },
    {
      name: "MQ",
      resolution: "MQ - Medium Quality (320 × 180)",
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    },
    {
      name: "Default",
      resolution: "Default - Normal Quality (120 × 90)",
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    },
  ];
}