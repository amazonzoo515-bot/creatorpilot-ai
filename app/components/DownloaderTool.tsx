"use client";

import { useState } from "react";

import SearchBox from "./SearchBox";
import ThumbnailCard from "./ThumbnailCard";

import {
  detectPlatform,
  extractVideoId,
  getThumbnailUrls,
  type Platform,
} from "../lib/youtube";

type Thumbnail = {
  name: string;
  resolution: string;
  url: string;
  available?: boolean;
};

function extractUrlFromText(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s<>"']+/i);

  if (!match?.[0]) {
    return null;
  }

  return match[0].replace(/[),.;!?]+$/g, "").trim();
}

export default function DownloaderTool() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform | null>(null);

  async function handleSearch(url?: string) {
    const inputText = (url ?? videoUrl).trim();

    // A bare 11-character YouTube video ID is accepted too.
    const bareVideoId = /^[A-Za-z0-9_-]{11}$/.test(inputText)
      ? inputText
      : null;

    const currentUrl = bareVideoId
      ? `https://www.youtube.com/watch?v=${bareVideoId}`
      : extractUrlFromText(inputText);

    if (!currentUrl) {
      alert("Please enter a valid video URL.");
      return;
    }

    setThumbnails([]);
    setPlatform(null);
    setLoading(true);

    const detectedPlatform = detectPlatform(currentUrl);

    if (!detectedPlatform) {
      setLoading(false);

      alert(
        "Please enter a valid YouTube, Vimeo, TikTok, Dailymotion, Facebook, X/Twitter, or Bilibili URL."
      );

      return;
    }

    setPlatform(detectedPlatform);

    try {
      if (detectedPlatform === "youtube") {
        const videoId = extractVideoId(currentUrl);

        if (!videoId) {
          throw new Error("Invalid YouTube URL");
        }
      }

      const thumbs = await getThumbnailUrls(currentUrl);
      setThumbnails(thumbs);
    } catch (error) {
      console.error("Thumbnail search failed:", error);

      switch (detectedPlatform) {
        case "youtube":
          alert("Failed to fetch YouTube thumbnails.");
          break;

        case "vimeo":
          alert("Failed to fetch Vimeo thumbnail.");
          break;

        case "tiktok":
          alert("Failed to fetch TikTok thumbnail.");
          break;

        case "dailymotion":
          alert("Failed to fetch Dailymotion thumbnails.");
          break;

        case "facebook":
          alert("Failed to fetch Facebook thumbnail.");
          break;

        case "twitter":
          alert("Failed to fetch X/Twitter thumbnail.");
          break;

        case "bilibili":
          alert("Failed to fetch Bilibili thumbnail.");
          break;

        default:
          alert("Failed to fetch thumbnail.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function downloadAllThumbnails() {
    if (thumbnails.length <= 1) {
      return;
    }

    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);
      const zip = new JSZip();

      for (const thumb of thumbnails) {
        if (!thumb.available) {
          continue;
        }

        const response = await fetch(
          `/api/download?url=${encodeURIComponent(thumb.url)}`
        );

        if (!response.ok) {
          continue;
        }

        const blob = await response.blob();

        const fileName =
          `${thumb.name}-${thumb.resolution}`
            .replace(/[•()]/g, "")
            .replace(/\s+/g, "-")
            .replace(/×/g, "x")
            .toLowerCase() + ".jpg";

        zip.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const zipName =
        platform === "youtube"
          ? "youtube-thumbnails.zip"
          : platform === "vimeo"
            ? "vimeo-thumbnails.zip"
            : platform === "tiktok"
              ? "tiktok-thumbnails.zip"
              : platform === "dailymotion"
                ? "dailymotion-thumbnails.zip"
                : platform === "facebook"
                  ? "facebook-thumbnails.zip"
                  : platform === "twitter"
                    ? "x-twitter-thumbnails.zip"
                    : platform === "bilibili"
                      ? "bilibili-thumbnails.zip"
                      : "thumbnails.zip";

      saveAs(zipBlob, zipName);
    } catch (error) {
      console.error("ZIP download failed:", error);
      alert("Failed to create ZIP file.");
    }
  }

  const platformName =
    platform === "youtube"
      ? "YouTube"
      : platform === "vimeo"
        ? "Vimeo"
        : platform === "tiktok"
          ? "TikTok"
          : platform === "dailymotion"
            ? "Dailymotion"
            : platform === "facebook"
              ? "Facebook"
              : platform === "twitter"
                ? "X/Twitter"
                : platform === "bilibili"
                  ? "Bilibili"
                  : "Video";

  return (
    <>
          <div className="mx-auto mt-16 flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBox
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                onSearch={handleSearch}
                loading={loading}
              />
            </div>
          </div>

          {/* Results */}
          {thumbnails.length > 0 && (
            <>
              {thumbnails.length > 1 && (
                <div className="mb-6 mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={downloadAllThumbnails}
                    aria-label={`Download all available ${platformName} thumbnails`}
                    className="rounded-xl bg-black px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
                  >
                    ⬇ Download All Thumbnails
                  </button>
                </div>
              )}

              <div className="relative left-1/2 w-[min(calc(100vw-3rem),1380px)] -translate-x-1/2 space-y-8">
                {thumbnails.map((thumb) => (
                  <ThumbnailCard
                    key={`${thumb.name}-${thumb.url}`}
                    title={thumb.name}
                    resolution={thumb.resolution}
                    imageUrl={thumb.url}
                    unavailable={!thumb.available}
                  />
                ))}
              </div>
            </>
          )}

    </>
  );
}
