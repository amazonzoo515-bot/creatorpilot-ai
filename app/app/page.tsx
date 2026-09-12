"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import SearchBox from "../components/SearchBox";
import ThumbnailCard from "../components/ThumbnailCard";

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

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform | null>(null);

  async function handleSearch(url?: string) {
    const inputText = (url ?? videoUrl).trim();
    const currentUrl = extractUrlFromText(inputText);

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

  const faqItems = [
    {
      question: "What is a YouTube thumbnail downloader?",
      answer:
        "A YouTube thumbnail downloader is a free online tool that pulls every available preview image for a public video URL — including the max resolution (HD) version — so you can inspect, compare, and save the exact file you need without opening YouTube Studio or taking a screenshot.",
    },
    {
      question: "How do I download a YouTube thumbnail in HD?",
      answer:
        "Paste the video's URL or ID into the search box above, wait for the available image versions to load, then click Download next to the Max Resolution (1280×720) card if it's available for that video. If Max Resolution isn't returned, the next-highest HQ or SD version will be.",
    },
    {
      question: "Can I download a thumbnail from a YouTube Shorts URL?",
      answer:
        "Yes. Paste a youtube.com/shorts/ link the same way you would a regular watch URL, and the tool will detect the video ID and return whatever thumbnail versions are available for that Short.",
    },
    {
      question: "What size should a YouTube thumbnail be?",
      answer:
        "YouTube recommends a 1280 × 720 pixel image at a 16:9 aspect ratio, saved as JPG, GIF, or PNG under 2MB. That canvas gives creators room for a clear subject, minimal text, and enough contrast to stay readable at the small size it appears in search and suggested feeds.",
    },
    {
      question: "What's the difference between Max Resolution, HD, HQ, MQ, and SD thumbnails?",
      answer:
        "These labels map to the file sizes YouTube generates automatically for every upload: maxresdefault (1280×720, not guaranteed on every video), sddefault (640×480), hqdefault (480×360), mqdefault (320×180), and default (120×90). This tool checks which of these actually exist for your specific video and only shows the ones that load successfully.",
    },
    {
      question: "Why does Max Resolution sometimes fail to load?",
      answer:
        "YouTube only generates the 1280×720 maxresdefault file for videos uploaded in sufficient source quality, so older, low-resolution, or auto-generated uploads may skip it entirely. When that happens, use the next-highest version this tool returns — HQ (480×360) is the safest fallback for most design and preview work.",
    },
    {
      question: "Does this thumbnail grabber work on mobile phones?",
      answer:
        "Yes. The tool runs entirely in your browser with no app or extension to install, so pasting a link and downloading an image works the same on an iPhone, Android device, tablet, or desktop.",
    },
    {
      question: "Is this thumbnail downloader free, and do I need an account?",
      answer:
        "It's completely free with no sign-up, login, or watermark. Paste a link, preview the results, and download — that's the entire workflow.",
    },
    {
      question: "Can I download thumbnails from Vimeo, TikTok, Dailymotion, Facebook, X/Twitter, and Bilibili too?",
      answer:
        "Yes. Alongside YouTube, this tool auto-detects and pulls available thumbnail images for public Vimeo, TikTok, Dailymotion, Facebook, X/Twitter (formerly Twitter), and Bilibili URLs from the same search box.",
    },
    {
      question: "Can I download several thumbnails at once?",
      answer:
        "Yes. When more than one thumbnail version is returned for a video, a Download All button appears that bundles every available image into a single ZIP file.",
    },
    {
      question: "Am I allowed to reuse a downloaded thumbnail commercially?",
      answer:
        "Downloading a publicly visible image doesn't transfer copyright. The original creator or channel typically retains rights to their thumbnail artwork, so get permission before reusing one commercially, in another video, or in marketing material.",
    },
    {
      question: "Why would I need to download my own thumbnail?",
      answer:
        "Creators use this tool to archive their own channel's thumbnails for portfolio pages, A/B-test old versus new designs side by side, pull a competitor's image dimensions for research, or grab a Shorts cover frame for cross-posting to other platforms.",
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-slate-100">
        <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">

          {/* Brand */}
          <div className="text-center">
            <Link
              href="https://youtubethumbnails-downloader.com/"
              className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-xl font-black text-white shadow-sm"
              >
                ▶
              </div>

              <span className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">
                YouTube Thumbnail Downloader
              </span>
            </Link>
          </div>

          {/* Hero */}
          <div className="mt-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              YouTube Thumbnail Downloader — HD &amp; Max Resolution, Free
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Using{" "}
              <Link
                href="https://youtubethumbnails-downloader.com/"
                className="text-red-600 font-semibold underline underline-offset-4 hover:text-red-700"
              >
                YouTube Thumbnail Downloader
              </Link>
              , paste any public YouTube link and instantly pull every thumbnail size
              it has — Max Resolution, HD, HQ, MQ, and SD — with exact pixel
              dimensions shown for each. Works on YouTube Shorts, plus Vimeo,
              TikTok, Dailymotion, Facebook, X/Twitter, and Bilibili links. No
              sign-up, no watermark, no app to install.
            </p>
          </div>

          {/* Downloader */}
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

              <div className="space-y-8">
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

          {/* Tool benefits */}
          <section className="mx-auto mt-20 max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <div className="space-y-6 leading-8 text-gray-600">
              <p>
                <strong className="text-gray-900">
                  Every real thumbnail size, verified:
                </strong>{" "}
                Instead of guessing a fixed filename and hoping it loads, our{" "}
                <Link
                  href="https://youtubethumbnails-downloader.com/"
                  className="text-red-600 font-medium underline underline-offset-2 hover:text-red-700"
                >
                  online YouTube thumbnail downloader
                </Link>{" "}
                checks maxresdefault, sddefault, hqdefault, mqdefault, and default
                directly against the video and only shows you the versions that
                actually exist for it.
              </p>

              <p>
                <strong className="text-gray-900">
                  Exact pixel dimensions on every card:
                </strong>{" "}
                Each result is labeled with its real width and height, so you can
                pick the right file for a thumbnail redesign, a competitor
                comparison, a blog post, or a presentation without opening it
                first to check.
              </p>

              <p>
                <strong className="text-gray-900">
                  One search box, seven platforms:
                </strong>{" "}
                Drop in a YouTube, YouTube Shorts, Vimeo, TikTok, Dailymotion,
                Facebook, X/Twitter, or Bilibili link — the platform is detected
                automatically and the matching thumbnail data loads without
                switching tools.
              </p>
            </div>
          </section>

          {/* YouTube main topical section */}
          <section className="mt-20 rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              The Fastest Way to Download a YouTube Thumbnail
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Every YouTube upload automatically generates a set of preview
              images — the thumbnails you see in search results, the home
              feed, Suggested videos, playlists, and channel pages. Because
              that small image is usually the first thing a viewer sees before
              the title even registers, creators, designers, and marketers
              regularly need the original file at full size: to study what
              makes a competitor's packaging work, rebuild their own thumbnail
              in an editor, archive their channel's history, or pull a cover
              frame for a blog post.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              This tool skips the manual work of guessing a YouTube image URL
              or digging through page source. Paste the video link, and it
              checks every size YouTube actually generated for that upload —
              returning the real, working files with their pixel dimensions
              so you know exactly what you're downloading.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              How to Download a YouTube Thumbnail in 3 Steps
            </h3>

            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-gray-600">
              <li>
                <strong className="text-gray-900">Copy the video link</strong>{" "}
                — any public watch URL, youtu.be short link, or Shorts URL
                works.
              </li>
              <li>
                <strong className="text-gray-900">Paste it into{" "}
                <Link
                  href="https://youtubethumbnails-downloader.com/"
                  className="text-red-600 underline hover:text-red-700"
                >
                  youtubethumbnails-downloader.com
                </Link></strong>{" "}
                — the tool detects the platform and video ID automatically.
              </li>
              <li>
                <strong className="text-gray-900">Pick a size and download</strong>{" "}
                — compare the returned versions by dimension and save the one
                that fits your use, or grab all of them at once as a ZIP.
              </li>
            </ol>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Which YouTube URLs Work With This Tool
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              Standard watch URLs (youtube.com/watch?v=), shortened youtu.be
              links, embed URLs, and youtube.com/shorts/ links are all
              supported — the tool extracts the underlying video ID regardless
              of which link format you paste, so there's no need to clean up
              the URL first or strip tracking parameters.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              YouTube Thumbnail Resolutions Explained
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              YouTube stores several preview sizes per video under
              predictable filenames, and this tool checks each one for you:
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 font-bold text-gray-900">
                      Label
                    </th>
                    <th className="px-4 py-3 font-bold text-gray-900">
                      Typical dimensions
                    </th>
                    <th className="px-4 py-3 font-bold text-gray-900">
                      Best for
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      Max Resolution
                    </td>
                    <td className="px-4 py-3">1280 × 720 (when available)</td>
                    <td className="px-4 py-3">
                      Redesign, print, close-up study
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      SD
                    </td>
                    <td className="px-4 py-3">640 × 480</td>
                    <td className="px-4 py-3">
                      Blog covers, mid-size previews
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      HQ
                    </td>
                    <td className="px-4 py-3">480 × 360</td>
                    <td className="px-4 py-3">
                      Reliable fallback, most videos have it
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      MQ
                    </td>
                    <td className="px-4 py-3">320 × 180</td>
                    <td className="px-4 py-3">
                      Lightweight embeds and lists
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      Default
                    </td>
                    <td className="px-4 py-3">120 × 90</td>
                    <td className="px-4 py-3">
                      Tiny previews, icons
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-5 leading-8 text-gray-600">
              Max Resolution isn't guaranteed for every video — YouTube only
              creates it when the source upload quality supports it. If your
              search doesn't return a Max Resolution card, the HQ (480×360)
              version is the most consistently available fallback.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Designing a Thumbnail That Gets Clicked
            </h3>

            <div className="mt-4 space-y-4 leading-7 text-gray-600">
              <p>
                <strong className="text-gray-900">
                  1. One focal point, not five.
                </strong>{" "}
                A face, product, or single clear scene reads instantly at
                thumbnail size — a busy composition doesn't.
              </p>

              <p>
                <strong className="text-gray-900">
                  2. Build hierarchy on purpose.
                </strong>{" "}
                Size, brightness, and placement should tell the eye what to
                look at first, second, and third.
              </p>

              <p>
                <strong className="text-gray-900">
                  3. Fewer words, bigger words.
                </strong>{" "}
                Two or three words of text can survive being shrunk to a
                phone screen; a full sentence can't.
              </p>

              <p>
                <strong className="text-gray-900">
                  4. Contrast with intent.
                </strong>{" "}
                Separate subject and text from the background instead of
                maxing out saturation everywhere.
              </p>

              <p>
                <strong className="text-gray-900">
                  5. Preview it small before publishing.
                </strong>{" "}
                Shrink your draft to mobile size and check that the subject
                and text are still legible.
              </p>

              <p>
                <strong className="text-gray-900">
                  6. Match the promise to the video.
                </strong>{" "}
                Curiosity earns the click, but a thumbnail that misleads
                costs watch time and trust.
              </p>

              <p>
                <strong className="text-gray-900">
                  7. Cut anything decorative.
                </strong>{" "}
                If an element doesn't support the main message, it's
                competing with it.
              </p>

              <p>
                <strong className="text-gray-900">
                  8. Study patterns, not pixels.
                </strong>{" "}
                Use this tool to pull competitor thumbnails at full size,
                learn their composition and color choices, then build
                something original.
              </p>
            </div>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              YouTube Shorts Thumbnails
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              Shorts use the same underlying video-ID system as regular
              uploads, so a youtube.com/shorts/ link works in this tool
              exactly like a standard watch URL — paste it, review whichever
              image versions YouTube generated for that Short, and download
              the one you need for cross-posting or a portfolio.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              No App, No Extension, No Sign-Up
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              The entire workflow runs in your browser tab on desktop,
              Android, iPhone, or tablet. There's nothing to install and
              nothing to create an account for — paste a link, review the
              results, and download.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Fixing Common Download Problems
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              If nothing loads, double-check that the full URL was pasted and
              that the video is public — private, deleted, age-restricted, or
              region-blocked videos won't return usable thumbnail data.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              If only some sizes appear, that's expected: not every video has
              a Max Resolution file. Use the highest version this tool
              actually returns rather than assuming every upload has all
              five sizes.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Copyright and Fair Use
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              A thumbnail being publicly viewable doesn't put it in the
              public domain. The channel or creator typically holds the
              rights to their thumbnail artwork, so downloading through this
              tool is meant for previewing, research, and comparison — get
              permission before republishing or using someone else's
              thumbnail commercially.
            </p>
          </section>

          {/* Other supported platforms */}
          <section className="mt-16 rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Also Works With Vimeo, TikTok, Dailymotion, Facebook,
              X/Twitter &amp; Bilibili
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              The same search box that handles YouTube also detects public
              Vimeo, TikTok, Dailymotion, Facebook, X/Twitter, and Bilibili
              links automatically — no need to pick a platform first or use a
              separate tool for each site.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <article className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Vimeo Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Paste a public Vimeo link to pull its cover image at the
                  highest resolution available — useful for design research,
                  presentations, and organizing video libraries.
                </p>
              </article>

              <article className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  TikTok Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Drop in a public TikTok video link and preview its cover
                  frame before saving it — handy for cross-posting or
                  content planning.
                </p>
              </article>

              <article className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Dailymotion Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Public Dailymotion links return their available preview
                  image directly, ready to inspect and download.
                </p>
              </article>

              <article className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Facebook Video Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Works with public Facebook video links where thumbnail
                  metadata is exposed; private or restricted posts won't
                  return usable data.
                </p>
              </article>

              <article className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  X/Twitter Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Paste a public X/Twitter post URL containing video to
                  retrieve its preview image the same way you would a
                  YouTube link.
                </p>
              </article>

              <article className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Bilibili Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Public Bilibili links and supported short URLs return
                  their cover image for preview and download.
                </p>
              </article>

            </div>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              How Multi-Platform Detection Works
            </h3>

            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-gray-600">
              <li>Copy any supported public video or post link.</li>
              <li>Paste it into the same search box above.</li>
              <li>The platform is identified from the URL automatically.</li>
              <li>Available thumbnail data is fetched for that source.</li>
              <li>Compare the returned image and its dimensions.</li>
              <li>Download the version you need, or grab all as a ZIP.</li>
            </ol>

            <p className="mt-6 leading-8 text-gray-600">
              Each platform exposes different numbers of thumbnail sizes, so
              results vary — the tool reports exactly what's retrievable for
              your link rather than promising identical output across every
              site.
            </p>
          </section>

          {/* About / purpose */}
          <section className="mt-16 rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Creators Use This Tool
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Grabbing a thumbnail used to mean right-click-saving a low-res
              preview or manually typing out an img.youtube.com URL and
              hoping it worked. By using{" "}
              <Link
                href="https://youtubethumbnails-downloader.com/"
                className="text-red-600 underline hover:text-red-700"
              >
                youtubethumbnails-downloader.com
              </Link>
              , you replace that guesswork: paste a link, and every retrievable
              size loads with its real dimensions so you can pick the right file
              the first time.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              It's built around one rule — only show what's actually
              retrievable for that specific video, never a placeholder or a
              broken link dressed up as a working thumbnail.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Common uses include thumbnail redesign research, competitor
              benchmarking, portfolio archiving, blog and course thumbnails,
              classroom media projects, and pulling reference images for
              editing workflows — always within the bounds of what the
              rights holder permits.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-16 rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {faqItems.map((item) => (
                <article key={item.question}>
                  <h3 className="text-lg font-bold leading-7 text-gray-900">
                    {item.question}
                  </h3>

                  <p className="mt-2 leading-7 text-gray-600">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>

        </section>
      </main>

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* Website Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "YouTube Thumbnail Downloader",
            alternateName: [
              "YouTube Thumbnail Downloader Online",
              "YouTube Thumbnail Grabber",
              "Vimeo Thumbnail Downloader",
              "TikTok Thumbnail Downloader",
              "Dailymotion Thumbnail Downloader",
              "Facebook Video Thumbnail Downloader",
              "X Twitter Thumbnail Downloader",
              "Bilibili Thumbnail Downloader",
            ],
            url: "https://youtubethumbnails-downloader.com/",
            description:
              "Free browser-based YouTube thumbnail downloader that returns Max Resolution, HD, HQ, MQ, and SD images with exact dimensions, plus support for public Vimeo, TikTok, Dailymotion, Facebook, X/Twitter, and Bilibili video URLs.",
            inLanguage: "en",
          }),
        }}
      />

      {/* WebApplication Schema */}
      <Script
        id="webapplication-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "YouTube Thumbnail Downloader",
            alternateName: "YouTube Thumbnail Downloader Online",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            browserRequirements:
              "Requires JavaScript and a modern HTML5-compatible browser.",
            url: "https://youtubethumbnails-downloader.com/",
            description:
              "Free online thumbnail downloader for public YouTube videos (including Shorts) and supported Vimeo, TikTok, Dailymotion, Facebook, X/Twitter, and Bilibili URLs, with exact pixel dimensions for every returned image.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "YouTube thumbnail download in Max Resolution, HD, HQ, MQ, SD",
              "YouTube Shorts thumbnail support",
              "Exact pixel dimensions shown per thumbnail",
              "Vimeo thumbnail download",
              "TikTok thumbnail download",
              "Dailymotion thumbnail download",
              "Facebook video thumbnail download",
              "X/Twitter thumbnail download",
              "Bilibili thumbnail download",
              "Multiple available image versions per video",
              "Download all thumbnails as a single ZIP",
              "No registration required",
              "Works on desktop and mobile browsers",
            ],
          }),
        }}
      />
    </>
  );
}