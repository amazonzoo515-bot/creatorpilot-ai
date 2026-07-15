"use client";

import { useState } from "react";
import Script from "next/script";
import JSZip from "jszip";
import { saveAs } from "file-saver";
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
  const [loading, setLoading] = useState(false);

  async function handleSearch(url?: string) {
  const currentUrl = url ?? videoUrl;

  const videoId = extractVideoId(currentUrl);

  if (!videoId) {
    alert("Please enter a valid YouTube URL.");
    return;
  }

  setLoading(true);

  await new Promise((resolve) => setTimeout(resolve, 800));

  setThumbnails(getThumbnailUrls(videoId));

  setLoading(false);
}
  async function downloadAllThumbnails() {
  try {
    const zip = new JSZip();

    for (const thumb of thumbnails) {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(thumb.url)}`
      );

      if (!response.ok) continue;

      const blob = await response.blob();

      const fileName = `${thumb.name}-${thumb.resolution}`
        .replace(/[•()]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase() + ".jpg";

      zip.file(fileName, blob);
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    saveAs(zipBlob, "youtube-thumbnails.zip");
  } catch (error) {
    console.error("ZIP download failed:", error);
    alert("Failed to create ZIP file.");
  }
}

  return (
  <>
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
  loading={loading}
/>
          </div>
        </div>

        {/* Thumbnail Cards */}
{thumbnails.length > 0 && (
  <>
    <div className="mt-8 mb-6 flex justify-center">
      <button
        onClick={downloadAllThumbnails}
        className="rounded-xl bg-black px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
      >
        ⬇ Download All Thumbnails
      </button>
    </div>

    <div className="space-y-8">
      {thumbnails.map((thumb) => (
        <ThumbnailCard
          key={thumb.name}
          title={thumb.name}
          resolution={thumb.resolution}
          imageUrl={thumb.url}
        />
      ))}
    </div>
  </>
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
              <h3 className="text-xl font-bold text-black">
                Is this YouTube Thumbnail Downloader free?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, it is completely free to use.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">
                Can I download HD thumbnails?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, HD and Max Resolution thumbnails are supported.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">
                Does it work with YouTube Shorts?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, public YouTube Shorts thumbnails are supported.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">
                Do I need to install any software?
              </h3>
              <p className="mt-2 text-gray-600">
                No, everything works directly in your browser.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">
                Can I download YouTube thumbnails without signing up?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, no signup or account creation is required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">
                What is the highest thumbnail quality available?
              </h3>
              <p className="mt-2 text-gray-600">
                Max Resolution is the highest quality available for most videos.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">
                Is this tool mobile friendly?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, it works on Android, iPhone and tablet devices.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">
                How do I download a YouTube thumbnail?
              </h3>
              <p className="mt-2 text-gray-600">
                Paste the YouTube URL, click Get Thumbnail and download your
                preferred thumbnail size instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
     </main>

    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is this YouTube Thumbnail Downloader free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, this YouTube Thumbnail Downloader is completely free to use."
              }
            },
            {
              "@type": "Question",
              "name": "Can I download YouTube thumbnails in HD?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. You can download HD, HQ, MQ, SD and Max Resolution thumbnails."
              }
            },
            {
              "@type": "Question",
              "name": "Does this tool support YouTube Shorts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Public YouTube Shorts thumbnails are fully supported."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to sign up?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. No registration or account is required."
              }
            },
            {
              "@type": "Question",
              "name": "Can I use this tool on mobile?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. It works on Android, iPhone, tablets and desktop browsers."
              }
            }
          ]
        }),
      }}
    />

    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "YouTube Thumbnail Downloader",
          alternateName: "YT Thumbnail Downloader",
          url: "https://youtubethumbnails-downloader.com",
          description:
            "Download YouTube thumbnails in Max Resolution, HD, HQ, MQ, SD and Default quality for free.",
          inLanguage: "en",
          publisher: {
            "@type": "Organization",
            name: "YouTube Thumbnail Downloader",
            url: "https://youtubethumbnails-downloader.com",
          },
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://youtubethumbnails-downloader.com/?url={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
        <Script
      id="webapplication-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "YouTube Thumbnail Downloader",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript. Requires HTML5.",
          url: "https://youtubethumbnails-downloader.com",
          description:
            "Free online YouTube Thumbnail Downloader. Download HD, HQ, MQ, SD and Max Resolution thumbnails instantly from public YouTube videos and Shorts.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          creator: {
            "@type": "Organization",
            name: "YouTube Thumbnail Downloader",
          },
          featureList: [
            "Download Max Resolution thumbnails",
            "Download HD thumbnails",
            "Supports YouTube Shorts",
            "Free to use",
            "No registration required",
            "Works on desktop and mobile",
          ],
        }),
      }}
    />
  </>
);
}