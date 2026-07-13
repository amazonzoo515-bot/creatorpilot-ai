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

        {/* Features */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              HD & Max Resolution
            </h2>
            <p className="mt-3 text-gray-600">
              Download YouTube thumbnails in HD, HQ, MQ, SD and Max Resolution
              quality.
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
              Use the tool on desktop, tablet and mobile devices.
            </p>
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

        {/* SEO Content */}
        <div className="mt-20 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">
            What Is YouTube Thumbnail Downloader?
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            YouTube Thumbnail Downloader is a free online tool that allows you
            to download YouTube thumbnails in multiple resolutions. Simply paste
            a public YouTube video URL and instantly access thumbnail images in
            HD, HQ, MQ, SD and Max Resolution quality.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            How To Download YouTube Thumbnails
          </h2>

          <ol className="mt-4 list-decimal space-y-3 pl-6 text-gray-600">
            <li>Copy the YouTube video URL.</li>
            <li>Paste the URL into the search box above.</li>
            <li>Click the Get Thumbnail button.</li>
            <li>Select your preferred thumbnail size.</li>
            <li>Download the image instantly.</li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Available Thumbnail Sizes
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            This tool supports Max Resolution, HD, HQ, MQ, SD and Default
            thumbnail sizes. Content creators, marketers and designers can use
            these images for inspiration, analysis and reference purposes.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Why Use This Tool?
          </h2>

          <ul className="mt-4 list-disc space-y-3 pl-6 text-gray-600">
            <li>Free and easy to use.</li>
            <li>No registration required.</li>
            <li>Supports multiple thumbnail resolutions.</li>
            <li>Works directly in your browser.</li>
            <li>Fast results on desktop and mobile.</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-xl font-semibold">
                Is this YouTube Thumbnail Downloader free?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, the tool is completely free to use.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Can I download HD thumbnails?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, HD and Max Resolution thumbnails are supported whenever
                available.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Does it work with YouTube Shorts?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, public YouTube Shorts thumbnails can also be accessed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Do I need to install software?
              </h3>
              <p className="mt-2 text-gray-600">
                No, everything works directly in your browser.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Which thumbnail sizes are available?
              </h3>
              <p className="mt-2 text-gray-600">
                Max Resolution, HD, HQ, MQ, SD and Default sizes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Can I use this tool on mobile?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, the tool works on smartphones and tablets.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Is registration required?
              </h3>
              <p className="mt-2 text-gray-600">
                No registration or login is required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Is the tool safe to use?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, it works directly in the browser and does not require
                downloads.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}