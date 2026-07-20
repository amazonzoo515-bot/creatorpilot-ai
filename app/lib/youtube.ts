export function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }

    const videoId = parsedUrl.searchParams.get("v");
    if (videoId) {
      return videoId;
    }

    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/shorts/")[1];
    }

    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1];
    }

    if (parsedUrl.pathname.startsWith("/live/")) {
      return parsedUrl.pathname.split("/live/")[1];
    }

    return null;
  } catch {
    return null;
  }
}

export async function getThumbnailUrls(videoId: string) {
  const response = await fetch(
    `/api/download?check=true&id=${videoId}`,
    {
      cache: "no-store",
    }
  );

  const { hdAvailable } = await response.json();

  return [
    {
      name: "HD Thumbnail",
      resolution: "1280 × 720 pixels • Highest Quality",
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      available: hdAvailable,
    },
    {
      name: "SD Thumbnail",
      resolution: "640 × 480 pixels • Standard Definition",
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      available: true,
    },
    {
      name: "HQ Thumbnail",
      resolution: "480 × 360 pixels • High Quality",
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      available: true,
    },
    {
      name: "MQ Thumbnail",
      resolution: "320 × 180 pixels • Medium Quality",
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      available: true,
    },
    {
      name: "Default Thumbnail",
      resolution: "120 × 90 pixels • Default Quality",
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      available: true,
    },
  ];
}