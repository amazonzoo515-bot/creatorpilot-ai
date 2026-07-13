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
          <div className="mt-6 grid gap-8 md:grid-cols-2">
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

        {/* Features */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              HD & Max Resolution
            </h2>
            <p className="mt-3 text-gray-600">
              Download thumbnails in HD, HQ, MQ, SD and Max Resolution quality.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Fast & Free
            </h2>
            <p className="mt-3 text-gray-600">
              No registration required and completely free to use.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Works Everywhere
            </h2>
            <p className="mt-3 text-gray-600">
              Works perfectly on desktop, tablet and mobile devices.
            </p>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-20 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">
            What Is YouTube Thumbnail Downloader?
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            YouTube Thumbnail Downloader is a free online tool that helps users
            download YouTube thumbnails in multiple resolutions including HD,
            HQ, MQ, SD and Max Resolution quality. Simply paste a public
            YouTube video URL and instantly access available thumbnail images.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            How To Download YouTube Thumbnails
          </h2>

          <ol className="mt-4 list-decimal space-y-3 pl-6 text-gray-600">
            <li>Copy the YouTube video URL.</li>
            <li>Paste the URL into the search box.</li>
            <li>Click Get Thumbnail.</li>
            <li>Select your preferred thumbnail size.</li>
            <li>Download instantly.</li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Available Thumbnail Sizes
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            Access Max Resolution, HD, HQ, MQ, SD and Default thumbnail sizes
            for public YouTube videos and Shorts.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-xl font-semibold">
                Is this tool free?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, it is completely free to use.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Can I download HD thumbnails?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, HD and Max Resolution thumbnails are supported.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Does it work with YouTube Shorts?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, public YouTube Shorts thumbnails are supported.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Do I need software?
              </h3>
              <p className="mt-2 text-gray-600">
                No, everything works directly in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}