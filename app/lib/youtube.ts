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
      name: "HD Max Resolution",
      resolution: "1280 × 720 pixels • Highest Quality",
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    },
    {
      name: "SD",
      resolution: "640 × 480 pixels • Standard Definition",
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    },
    {
      name: "HQ",
      resolution: "480 × 360 pixels • High Quality",
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    },
    {
      name: "MQ",
      resolution: "320 × 180 pixels • Medium Quality",
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    },
    {
      name: "Default",
      resolution: "120 × 90 pixels • Default Quality",
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    },
  ];
}