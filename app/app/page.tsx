"use client";

import { useState } from "react";
import SearchBox from "../components/SearchBox";
import ThumbnailCard from "../components/ThumbnailCard";
import { extractVideoId, getThumbnailUrls } from "../lib/youtube";

type Thumbnail = {
  name: string;
  resolution: string;
  url: string;
};

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

  function handleSearch() {
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      alert("Please enter a valid YouTube URL.");
      return;
    }

    setThumbnails(getThumbnailUrls(videoId));
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">

        <h1 className="text-center text-4xl font-extrabold text-gray-900 md:text-6xl">
          YouTube Thumbnail Downloader
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-gray-600">
          Download YouTube thumbnails in Max Resolution, HD, HQ, MQ, SD and
          Default quality. Simply paste any public YouTube video URL and
          instantly access every available thumbnail size.
        </p>

        {/* Search Box */}
        <div className="mx-auto mt-10 flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchBox
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Thumbnail Cards */}
        {thumbnails.length > 0 && (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {thumbnails.map((thumb) => (
              <ThumbnailCard
                key={thumb.name}
                title={thumb.name}
                resolution={thumb.resolution}
                imageUrl={thumb.url}
              />
            ))}
          </div>
        )}

      </section>
    </main>
  );
}