"use client";

export type Platform =
  | "youtube"
  | "vimeo"
  | "tiktok"
  | "dailymotion"
  | "facebook"
  | "twitter"
  | "bilibili";

export type Thumbnail = {
  name: string;
  resolution: string;
  url: string;
  available: boolean;
};

// -----------------------------
// Performance Cache
// -----------------------------
const thumbnailCache = new Map<string, Thumbnail[]>();
const pendingRequests = new Map<string, Promise<Thumbnail[]>>();
const API_TIMEOUT = 8000;

// -----------------------------
// Fast API Fetch
// -----------------------------
async function fetchApi(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT);
  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

// -----------------------------
// Quality Label
// -----------------------------
function getQualityLabel(width: number, height: number): string {
  const longSide = Math.max(width, height);
  const shortSide = Math.min(width, height);

  if (longSide >= 1900 && shortSide >= 1000) {
    return "1080p";
  }

  if (longSide >= 1200 && shortSide >= 650) {
    return "HD";
  }

  if (longSide >= 800 && shortSide >= 450) {
    return "480p";
  }

  if (longSide >= 600 && shortSide >= 330) {
    return "360p";
  }

  if (longSide >= 300 && shortSide >= 160) {
    return "180p";
  }

  if (longSide >= 240 && shortSide >= 130) {
    return "144p";
  }

  return `${width} × ${height}`;
}
// -----------------------------
// Create Thumbnail
// -----------------------------
function createThumbnail(
  width: number,
  height: number,
  url: string
): Thumbnail {
  const quality = getQualityLabel(width, height);
  return {
    name: `${quality} Thumbnail`,
    resolution: quality,
    url,
    available: true,
  };
}

// -----------------------------
// Platform Detection
// -----------------------------
export function detectPlatform(url: string): Platform | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtu.be" ||
      hostname === "www.youtu.be"
    ) {
      return "youtube";
    }
    if (hostname === "vimeo.com" || hostname === "www.vimeo.com") {
      return "vimeo";
    }
    if (
      hostname === "tiktok.com" ||
      hostname === "www.tiktok.com" ||
      hostname === "m.tiktok.com"
    ) {
      return "tiktok";
    }
    if (
      hostname === "dailymotion.com" ||
      hostname === "www.dailymotion.com" ||
      hostname === "dai.ly" ||
      hostname === "www.dai.ly"
    ) {
      return "dailymotion";
    }
    if (
      hostname === "facebook.com" ||
      hostname === "www.facebook.com" ||
      hostname === "m.facebook.com" ||
      hostname === "fb.watch"
    ) {
      return "facebook";
    }
    if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      return "twitter";
    }
    if (
      hostname.includes("bilibili.com") ||
      hostname === "b23.tv" ||
      hostname === "www.b23.tv"
    ) {
      return "bilibili";
    }
    return null;
  } catch {
    return null;
  }
}

// -----------------------------
// YouTube Video ID
// -----------------------------
export function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    if (hostname === "youtu.be" || hostname === "www.youtu.be") {
      return parsedUrl.pathname.slice(1).split("/")[0] || null;
    }
    const videoId = parsedUrl.searchParams.get("v");
    if (videoId) {
      return videoId;
    }
    const pathname = parsedUrl.pathname;
    if (pathname.startsWith("/shorts/")) {
      return pathname.split("/shorts/")[1]?.split("/")[0] || null;
    }
    if (pathname.startsWith("/embed/")) {
      return pathname.split("/embed/")[1]?.split("/")[0] || null;
    }
    if (pathname.startsWith("/live/")) {
      return pathname.split("/live/")[1]?.split("/")[0] || null;
    }
    return null;
  } catch {
    return null;
  }
}

// -----------------------------
// Dailymotion Video ID
// -----------------------------
export function extractDailymotionVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    if (hostname === "dai.ly" || hostname === "www.dai.ly") {
      return parsedUrl.pathname.slice(1).split("/")[0] || null;
    }
    const match = parsedUrl.pathname.match(/\/video\/([^/?]+)/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

// -----------------------------
// YouTube Thumbnails
// -----------------------------
export async function getYouTubeThumbnailUrls(
  videoId: string
): Promise<Thumbnail[]> {
  const cacheKey = `youtube:${videoId}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }
  const request = (async () => {
    let hdAvailable = true;
    try {
      const response = await fetchApi(
        `/api/download?check=true&id=${encodeURIComponent(videoId)}`
      );
      if (response.ok) {
        const data = await response.json();
        hdAvailable = Boolean(data.hdAvailable);
      }
    } catch {
      // API call fail hone par fallback default True rakhega
      hdAvailable = true;
    }

    const thumbnails: Thumbnail[] = [
      {
        name: "Full HD Thumbnail",
        resolution: "1080p",
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        available: hdAvailable,
      },
      {
        name: "HD Thumbnail",
        resolution: "720p",
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        available: hdAvailable,
      },
      {
        name: "Standard Thumbnail",
        resolution: "480p",
        url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        available: true,
      },
      {
        name: "High Quality Thumbnail",
        resolution: "360p",
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        available: true,
      },
      {
        name: "Medium Quality Thumbnail",
        resolution: "180p",
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        available: true,
      },
      {
        name: "Default Thumbnail",
        resolution: "90p",
        url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
        available: true,
      },
    ];

    thumbnailCache.set(cacheKey, thumbnails);
    return thumbnails;
  })();

  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// -----------------------------
// Vimeo Thumbnails
// -----------------------------
export async function getVimeoThumbnail(url: string): Promise<Thumbnail[]> {
  const cacheKey = `vimeo:${url}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }
  const request = (async () => {
    const response = await fetchApi(
      `/api/download?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("Vimeo thumbnails not found");
    }
    const data = await response.json();
    let thumbnails: Thumbnail[];
    if (Array.isArray(data.thumbnails)) {
      thumbnails = data.thumbnails.filter(
        (thumb: Thumbnail) =>
          Boolean(thumb?.url) &&
          Boolean(thumb?.resolution) &&
          thumb.available !== false
      );
    } else if (data.thumbnailUrl) {
      const width = Number(data.thumbnailWidth);
      const height = Number(data.thumbnailHeight);
      thumbnails =
        width > 0 && height > 0
          ? [createThumbnail(width, height, data.thumbnailUrl)]
          : [
              {
                name: "Highest Available Thumbnail",
                resolution: "Highest Available",
                url: data.thumbnailUrl,
                available: true,
              },
            ];
    } else {
      throw new Error("Vimeo thumbnail is not available");
    }
    thumbnailCache.set(cacheKey, thumbnails);
    return thumbnails;
  })();
  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// -----------------------------
// TikTok Thumbnail
// -----------------------------
export async function getTikTokThumbnail(url: string): Promise<Thumbnail[]> {
  const cacheKey = `tiktok:${url}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }
  const request = (async () => {
    const response = await fetchApi(
      `/api/download?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("TikTok thumbnail not found");
    }
    const data = await response.json();
    if (!data.thumbnailUrl) {
      throw new Error("TikTok thumbnail is not available");
    }
    const width = Number(data.thumbnailWidth);
    const height = Number(data.thumbnailHeight);
    const thumbnails: Thumbnail[] =
      width > 0 && height > 0
        ? [createThumbnail(width, height, data.thumbnailUrl)]
        : [
            {
              name: "Highest Available Thumbnail",
              resolution: "Highest Available",
              url: data.thumbnailUrl,
              available: true,
            },
          ];
    thumbnailCache.set(cacheKey, thumbnails);
    return thumbnails;
  })();
  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// -----------------------------
// Dailymotion Thumbnails
// -----------------------------
export async function getDailymotionThumbnail(
  url: string
): Promise<Thumbnail[]> {
  const cacheKey = `dailymotion:${url}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }
  const request = (async () => {
    const response = await fetchApi(
      `/api/download?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("Dailymotion thumbnails not found");
    }
    const data = await response.json();
    let thumbnails: Thumbnail[];
    if (Array.isArray(data.thumbnails)) {
      thumbnails = data.thumbnails
        .filter(
          (thumb: Thumbnail) =>
            Boolean(thumb?.url) &&
            Boolean(thumb?.resolution) &&
            thumb.available !== false
        )
        .map((thumb: Thumbnail) => ({
          name: thumb.name,
          resolution: thumb.resolution,
          url: thumb.url,
          available: true,
        }));
    } else if (data.thumbnailUrl) {
      const width = Number(data.thumbnailWidth);
      const height = Number(data.thumbnailHeight);
      thumbnails =
        width > 0 && height > 0
          ? [
              {
                name: "Dailymotion Thumbnail",
                resolution: `${width} × ${height}`,
                url: data.thumbnailUrl,
                available: true,
              },
            ]
          : [
              {
                name: "Dailymotion Thumbnail",
                resolution: "Highest Available",
                url: data.thumbnailUrl,
                available: true,
              },
            ];
    } else {
      throw new Error("Dailymotion thumbnail is not available");
    }
    thumbnailCache.set(cacheKey, thumbnails);
    return thumbnails;
  })();
  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// -----------------------------
// Facebook Thumbnail
// -----------------------------
export async function getFacebookThumbnail(url: string): Promise<Thumbnail[]> {
  const cacheKey = `facebook:${url}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }
  const request = (async () => {
    const response = await fetchApi(
      `/api/download?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("Facebook thumbnail not found");
    }
    const data = await response.json();
    if (!data.thumbnailUrl) {
      throw new Error("Facebook thumbnail is not available");
    }
    const width = Number(data.thumbnailWidth);
    const height = Number(data.thumbnailHeight);
    const thumbnails: Thumbnail[] = [
      {
        name: "Facebook Thumbnail",
        resolution:
          width > 0 && height > 0
            ? `${width} × ${height}`
            : "Highest Available",
        url: data.thumbnailUrl,
        available: true,
      },
    ];
    thumbnailCache.set(cacheKey, thumbnails);
    return thumbnails;
  })();
  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// -----------------------------
// X / Twitter Thumbnail
// -----------------------------
export async function getTwitterThumbnail(url: string): Promise<Thumbnail[]> {
  const cacheKey = `twitter:${url}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }
  const request = (async () => {
    const response = await fetchApi(
      `/api/download?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("X/Twitter thumbnail not found");
    }
    const data = await response.json();
    if (!data.thumbnailUrl) {
      throw new Error("X/Twitter thumbnail is not available");
    }
    const width = Number(data.thumbnailWidth) || 0;
    const height = Number(data.thumbnailHeight) || 0;
    const thumbnails: Thumbnail[] = [
      {
        name: "X/Twitter Thumbnail",
        resolution:
          width > 0 && height > 0
            ? `${width} × ${height}`
            : "Highest Available",
        url: `/api/download?url=${encodeURIComponent(data.thumbnailUrl)}`,
        available: true,
      },
    ];
    thumbnailCache.set(cacheKey, thumbnails);
    return thumbnails;
  })();
  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// -----------------------------
// Bilibili Image Loader
// -----------------------------
async function loadBilibiliImage(imageUrl: string): Promise<{
  url: string;
  width: number;
  height: number;
} | null> {
  return new Promise((resolve) => {
    const proxyUrl = `/api/download?url=${encodeURIComponent(imageUrl)}`;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (width > 0 && height > 0) {
        resolve({
          url: proxyUrl,
          width,
          height,
        });
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = proxyUrl;
  });
}

// -----------------------------
// Bilibili Resolution Candidates
// -----------------------------
function getBilibiliResolutionCandidates(imageUrl: string): string[] {
  const cleanUrl = imageUrl
    .trim()
    .replace(/\\u002F/g, "/")
    .replace(/\\u003A/gi, ":")
    .replace(/^\/\//, "https://")
    .replace(/^http:\/\//i, "https://");
  const baseUrl = cleanUrl.replace(/@[^/?#]+$/, "");
  const sizes = ["1920w", "1280w", "720w", "480w", "360w"];
  return sizes.map((size) => `${baseUrl}@${size}.jpg`);
}

// -----------------------------
// Bilibili Thumbnail
// -----------------------------
export async function getBilibiliThumbnail(url: string): Promise<Thumbnail[]> {
  const cacheKey = `bilibili:${url}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }
  const request = (async () => {
    const response = await fetchApi(
      `/api/download?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("Bilibili thumbnail not found");
    }
    const data = await response.json();
    if (!data.thumbnailUrl) {
      throw new Error("Bilibili thumbnail is not available");
    }
    const candidates = getBilibiliResolutionCandidates(data.thumbnailUrl);
    const results = await Promise.allSettled(
      candidates.map((candidate) => loadBilibiliImage(candidate))
    );
    const thumbnails: Thumbnail[] = [];
    for (const result of results) {
      if (result.status !== "fulfilled") {
        continue;
      }
      const image = result.value;
      if (!image) {
        continue;
      }
      const quality = getQualityLabel(image.width, image.height);
      const resolution = quality;
      const exists = thumbnails.some(
        (thumbnail) => thumbnail.resolution === resolution
      );
      if (exists) {
        continue;
      }
      thumbnails.push({
        name: `${quality} Thumbnail`,
        resolution,
        url: image.url,
        available: true,
      });
    }

    const qualityOrder: Record<string, number> = {
      "1080p": 1080,
      "720p": 720,
      "480p": 480,
      "360p": 360,
      "240p": 240,
      "180p": 180,
      "144p": 144,
      "90p": 90,
    };
    thumbnails.sort(
      (a, b) =>
        (qualityOrder[b.resolution] ?? 0) - (qualityOrder[a.resolution] ?? 0)
    );
    if (thumbnails.length === 0) {
      throw new Error("Bilibili thumbnail is not available");
    }
    thumbnailCache.set(cacheKey, thumbnails);
    return thumbnails;
  })();
  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// -----------------------------
// Platform-aware Thumbnail Loader
// -----------------------------
export async function getThumbnailUrls(url: string): Promise<Thumbnail[]> {
  const normalizedUrl = url.trim();
  const platform = detectPlatform(normalizedUrl);
  if (platform === "youtube") {
    const videoId = extractVideoId(normalizedUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }
    return getYouTubeThumbnailUrls(videoId);
  }
  if (platform === "vimeo") {
    return getVimeoThumbnail(normalizedUrl);
  }
  if (platform === "tiktok") {
    return getTikTokThumbnail(normalizedUrl);
  }
  if (platform === "dailymotion") {
    const videoId = extractDailymotionVideoId(normalizedUrl);
    if (!videoId) {
      throw new Error("Invalid Dailymotion URL");
    }
    return getDailymotionThumbnail(normalizedUrl);
  }
  if (platform === "facebook") {
    return getFacebookThumbnail(normalizedUrl);
  }
  if (platform === "twitter") {
    return getTwitterThumbnail(normalizedUrl);
  }
  if (platform === "bilibili") {
    return getBilibiliThumbnail(normalizedUrl);
  }
  throw new Error("Unsupported platform");
}