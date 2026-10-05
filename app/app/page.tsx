"use client";

import { useState } from "react";
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
        "It's a free online tool that takes a public video link and returns every thumbnail image YouTube has stored for it, including the 1280×720 max resolution version. You can look at each size, compare them, and save the one you want. No screenshots, no YouTube Studio.",
    },
    {
      question: "How do I download a YouTube thumbnail in HD?",
      answer:
        "Paste the video link into the box at the top and wait a second for the results. If a Max Resolution (1280×720) card shows up, hit Download on it. If it doesn't, the video has no HD thumbnail file, and the next biggest card in the list (SD or HQ) is the best you can get.",
    },
    {
      question: "How do I download a YouTube thumbnail in full size, 1280x720?",
      answer:
        "Look for the Max Resolution card. That's the 1280×720 file, also known as maxresdefault. Some videos don't have it, usually older or lower-quality uploads, so if the card is missing, the video simply doesn't have a 1280×720 thumbnail on YouTube's servers.",
    },
    {
      question: "Can I download a thumbnail from a YouTube Shorts link?",
      answer:
        "Yes. Paste a youtube.com/shorts/ link exactly as you would a normal watch link. The tool reads the video ID from it and returns whatever thumbnail sizes exist for that Short.",
    },
    {
      question: "What size should a YouTube thumbnail be?",
      answer:
        "1280 × 720 pixels, 16:9, saved as JPG, GIF, or PNG and under 2MB. That's the size YouTube asks for. Leave enough room around the subject, because the image gets shrunk a lot in search results and suggested videos.",
    },
    {
      question: "What's the difference between maxresdefault, sddefault, hqdefault, mqdefault, and default?",
      answer:
        "They're the file names YouTube uses for each size: maxresdefault is 1280×720 (not on every video), sddefault is 640×480, hqdefault is 480×360, mqdefault is 320×180, and default is 120×90. This tool checks each one against your video and only lists the ones that actually load.",
    },
    {
      question: "Why is the Max Resolution thumbnail missing for some videos?",
      answer:
        "YouTube doesn't create a 1280×720 thumbnail for every upload. It tends to be missing on older videos or ones uploaded at low quality. When that happens, HQ (480×360) is the safest fallback, since almost every video has it.",
    },
    {
      question: "How do I save a YouTube thumbnail on my iPhone or Android phone?",
      answer:
        "Open this page in your phone's browser, paste the video link, and tap Download on the size you want. Nothing to install. It works the same way on iPhone, Android, tablets, and desktop.",
    },
    {
      question: "Is this YouTube thumbnail downloader free? Do I need to sign up?",
      answer:
        "It's free. No account, no login, no watermark on the images. Paste a link, look at the results, download.",
    },
    {
      question: "Can I also download thumbnails from Vimeo, TikTok, Dailymotion, Facebook, X/Twitter, and Bilibili?",
      answer:
        "Yes. The same search box recognises public links from those sites and fetches whatever thumbnail they expose. How many sizes you get depends on the platform.",
    },
    {
      question: "Can I download all the thumbnail sizes at once?",
      answer:
        "Yes. If a video returns more than one size, a Download All Thumbnails button appears above the results and packs every available image into one ZIP file.",
    },
    {
      question: "How do I get the thumbnail image URL of a YouTube video?",
      answer:
        "YouTube thumbnails sit at img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg, with VIDEO_ID swapped for the ID of your video. You can type that out yourself, but if the video has no maxresdefault file you'll get a broken image. This tool checks which files exist so you don't have to guess.",
    },
    {
      question: "Can I reuse a downloaded thumbnail in my own video or commercially?",
      answer:
        "Not without permission. A thumbnail being visible to everyone doesn't make it free to use. The creator usually owns the artwork, so ask before putting it in your own video, an ad, or anything you sell.",
    },
    {
      question: "Can I download a thumbnail from a private YouTube video?",
      answer:
        "No. Private, deleted, age-restricted and region-blocked videos don't return usable thumbnail data, so the tool has nothing to fetch. The video needs to be public.",
    },
    {
      question: "What file format do the downloaded thumbnails come in?",
      answer:
        "The images in the ZIP from Download All Thumbnails are saved as JPG files, named after their size so they're easy to tell apart.",
    },
    {
      question: "How do I download a TikTok video thumbnail?",
      answer:
        "Copy the link of a public TikTok video, paste it into the search box at the top, and the cover image loads for you to preview and save.",
    },
    {
      question: "How do I download a Facebook video thumbnail?",
      answer:
        "Paste the link of a public Facebook video into the search box. If the post is private or restricted, Facebook doesn't expose a thumbnail, so nothing will come back.",
    },
    {
      question: "Why would I need to download my own YouTube thumbnail?",
      answer:
        "Mostly for housekeeping: saving old thumbnails for a portfolio, putting an old design next to a new one for an A/B comparison, or reusing a Shorts cover on another platform. Plenty of people also use it to look at a competitor's thumbnail at full size for research.",
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
              YouTube Thumbnail Downloader: HD &amp; Max Resolution, Free
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Paste a YouTube link into the{" "}
              <Link
                href="https://youtubethumbnails-downloader.com/"
                className="text-red-600 font-semibold underline underline-offset-4 hover:text-red-700"
              >
                YouTube Thumbnail Downloader
              </Link>{" "}
              and you get every thumbnail size that video has: Max Resolution
              (1280×720), SD, HQ, MQ and the tiny default, each labeled with
              its real pixel size. It handles YouTube Shorts too, and links
              from Vimeo, TikTok, Dailymotion, Facebook, X/Twitter and
              Bilibili. Free, no sign-up, no watermark, nothing to install.
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

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mx-auto mt-16 max-w-4xl rounded-2xl bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="text-lg font-bold text-gray-900">On this page</h2>

            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              <li>
                <a href="#download-youtube-thumbnail" className="text-red-600 underline underline-offset-2 hover:text-red-700">
                  Download in HD
                </a>
              </li>
              <li>
                <a href="#youtube-thumbnail-sizes" className="text-red-600 underline underline-offset-2 hover:text-red-700">
                  Thumbnail sizes
                </a>
              </li>
              <li>
                <a href="#youtube-thumbnail-url" className="text-red-600 underline underline-offset-2 hover:text-red-700">
                  Thumbnail URL format
                </a>
              </li>
              <li>
                <a href="#youtube-shorts-thumbnail" className="text-red-600 underline underline-offset-2 hover:text-red-700">
                  Shorts thumbnails
                </a>
              </li>
              <li>
                <a href="#supported-platforms" className="text-red-600 underline underline-offset-2 hover:text-red-700">
                  Other platforms
                </a>
              </li>
              <li>
                <a href="#faq" className="text-red-600 underline underline-offset-2 hover:text-red-700">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Tool benefits */}
          <section className="mx-auto mt-20 max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <div className="space-y-6 leading-8 text-gray-600">
              <p>
                <strong className="text-gray-900">
                  No broken image links:
                </strong>{" "}
                A lot of thumbnail grabbers just build a maxresdefault.jpg URL
                and hand it over, even when that file doesn't exist. Our{" "}
                <Link
                  href="https://youtubethumbnails-downloader.com/"
                  className="text-red-600 font-medium underline underline-offset-2 hover:text-red-700"
                >
                  online YouTube thumbnail downloader
                </Link>{" "}
                tests maxresdefault, sddefault, hqdefault, mqdefault and default
                against the actual video and lists only the ones that load.
              </p>

              <p>
                <strong className="text-gray-900">
                  Pixel size on every card:
                </strong>{" "}
                Each result shows its real width and height, so you know whether
                you're getting a 1280×720 HD thumbnail or a 480×360 one before
                you click. Handy when you're picking an image for a redesign, a
                blog post, a slide, or a competitor comparison.
              </p>

              <p>
                <strong className="text-gray-900">
                  One box, seven platforms:
                </strong>{" "}
                Paste a link from YouTube, YouTube Shorts, Vimeo, TikTok,
                Dailymotion, Facebook, X/Twitter or Bilibili. The site is
                detected from the URL, so there's no menu to pick from and no
                second tool to open.
              </p>
            </div>
          </section>

          {/* YouTube main topical section */}
          <section
            id="download-youtube-thumbnail"
            className="mt-20 scroll-mt-6 rounded-2xl bg-white p-8 shadow-sm md:p-10"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How to Download a YouTube Thumbnail in HD (1280×720)
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Every video you upload to YouTube gets a set of preview images
              generated automatically. They're what people see in search
              results, on the home feed, in suggested videos, in playlists and
              on channel pages. Since the thumbnail is often the first thing a
              viewer notices, plenty of people want the original file: to see
              how a competitor lays theirs out, to rebuild one of their own in
              an editor, to keep a record of past designs, or to use a
              cover image in a blog post.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              You could dig through the page source or guess the image URL by
              hand, but it's slow and often ends in a broken link. Here you
              paste the video link, the tool checks which sizes YouTube
              really stored for that upload, and you download the one you need
              as a JPG.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Download a YouTube Thumbnail in 3 Steps
            </h3>

            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-gray-600">
              <li>
                <strong className="text-gray-900">Copy the video link.</strong>{" "}
                A normal watch URL, a youtu.be short link or a Shorts URL all
                work.
              </li>
              <li>
                <strong className="text-gray-900">Paste it into{" "}
                <Link
                  href="https://youtubethumbnails-downloader.com/"
                  className="text-red-600 underline hover:text-red-700"
                >
                  youtubethumbnails-downloader.com
                </Link>.</strong>{" "}
                The platform and video ID are picked up automatically.
              </li>
              <li>
                <strong className="text-gray-900">Choose a size and download.</strong>{" "}
                Compare the cards by pixel size and save the one you want, or
                grab everything in one ZIP.
              </li>
            </ol>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Which YouTube Links Does It Accept?
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              Regular youtube.com/watch?v= links, shortened youtu.be links,
              embed URLs and youtube.com/shorts/ links all work. The tool pulls
              the video ID out of whichever one you paste, so you don't need to
              trim tracking parameters or clean the URL first.
            </p>

            <h3
              id="youtube-thumbnail-sizes"
              className="mt-10 scroll-mt-6 text-2xl font-bold text-gray-900"
            >
              YouTube Thumbnail Sizes and Resolutions
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              YouTube keeps several sizes of each thumbnail under fixed file
              names. This tool checks every one of them:
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
                      Redesigns, print, close-up study
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
                      Safe fallback, most videos have it
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      MQ
                    </td>
                    <td className="px-4 py-3">320 × 180</td>
                    <td className="px-4 py-3">
                      Small embeds and lists
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      Default
                    </td>
                    <td className="px-4 py-3">120 × 90</td>
                    <td className="px-4 py-3">
                      Tiny previews and icons
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-5 leading-8 text-gray-600">
              Max Resolution isn't there for every video. YouTube only makes
              it when the original upload was good enough. If you don't see
              that card, HQ (480×360) is the one most likely to exist.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              What Makes a YouTube Thumbnail Get Clicked
            </h3>

            <div className="mt-4 space-y-4 leading-7 text-gray-600">
              <p>
                <strong className="text-gray-900">
                  1. One thing to look at.
                </strong>{" "}
                A face, a product or a single clear scene reads at thumbnail
                size. A crowded frame doesn't.
              </p>

              <p>
                <strong className="text-gray-900">
                  2. Decide what's seen first.
                </strong>{" "}
                Size, brightness and position tell the eye where to go, so use
                them on purpose.
              </p>

              <p>
                <strong className="text-gray-900">
                  3. Fewer words, bigger.
                </strong>{" "}
                Two or three words survive on a phone screen. A sentence
                doesn't.
              </p>

              <p>
                <strong className="text-gray-900">
                  4. Contrast, but not everywhere.
                </strong>{" "}
                Make the subject and text stand apart from the background
                instead of cranking saturation on everything.
              </p>

              <p>
                <strong className="text-gray-900">
                  5. Check it small.
                </strong>{" "}
                Shrink your draft to phone size before you publish. If you
                can't read it, viewers won't either.
              </p>

              <p>
                <strong className="text-gray-900">
                  6. Keep the promise.
                </strong>{" "}
                Curiosity gets the click, but a thumbnail that misleads costs
                you watch time and trust.
              </p>

              <p>
                <strong className="text-gray-900">
                  7. Cut the decoration.
                </strong>{" "}
                If an element doesn't help the main message, it's getting in
                its way.
              </p>

              <p>
                <strong className="text-gray-900">
                  8. Study the pattern, not the pixels.
                </strong>{" "}
                Download competitor thumbnails at full size, look at their
                layout and colors, then make something of your own.
              </p>
            </div>

            <h3
              id="youtube-thumbnail-url"
              className="mt-10 scroll-mt-6 text-2xl font-bold text-gray-900"
            >
              YouTube Thumbnail URL Format (img.youtube.com)
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              Every YouTube thumbnail lives at an address built from the video
              ID. Swap VIDEO_ID for the ID of your video (the part after v= in
              a watch link):
            </p>

            <ul className="mt-4 space-y-2 leading-7 text-gray-600">
              <li>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-900">
                  https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
                </code>{" "}
                for 1280 × 720
              </li>
              <li>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-900">
                  https://img.youtube.com/vi/VIDEO_ID/sddefault.jpg
                </code>{" "}
                for 640 × 480
              </li>
              <li>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-900">
                  https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
                </code>{" "}
                for 480 × 360
              </li>
              <li>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-900">
                  https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg
                </code>{" "}
                for 320 × 180
              </li>
              <li>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-900">
                  https://img.youtube.com/vi/VIDEO_ID/default.jpg
                </code>{" "}
                for 120 × 90
              </li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              If a maxresdefault address shows a broken image, that video has
              no 1280×720 file. Pasting the link above saves you from testing
              each address by hand.
            </p>

            <h3
              id="youtube-shorts-thumbnail"
              className="mt-10 scroll-mt-6 text-2xl font-bold text-gray-900"
            >
              Download a YouTube Shorts Thumbnail
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              Shorts use the same video-ID system as regular uploads, so a
              youtube.com/shorts/ link behaves like a watch link here. Paste
              it, look at the image sizes YouTube generated for that Short, and
              download the one you need for cross-posting or your portfolio.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Works on Phone and Desktop, No Extension Needed
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              It all happens in your browser tab, whether that's a laptop, an
              Android phone, an iPhone or a tablet. No app, no browser
              extension, no account. Paste, check, download.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              If the Thumbnail Won't Download
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              When nothing loads, first check that you pasted the whole URL and
              that the video is public. Private, deleted, age-restricted and
              region-blocked videos don't return usable thumbnail data.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              If you only see a few sizes, that's normal. Not every video has a
              Max Resolution file, so go with the biggest one the tool shows
              rather than expecting all five.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Copyright and Fair Use
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              Anyone can see a thumbnail, but that doesn't make it public
              domain. The channel or creator generally owns the artwork. Use
              this tool for previewing, research and comparison, and get
              permission before you republish someone else's thumbnail or use
              it commercially.
            </p>
          </section>

          {/* Other supported platforms */}
          <section
            id="supported-platforms"
            className="mt-16 scroll-mt-6 rounded-2xl bg-white p-8 shadow-sm md:p-10"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Vimeo, TikTok, Dailymotion, Facebook, X/Twitter &amp; Bilibili
              Thumbnail Downloader
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              The same search box also recognises public Vimeo, TikTok,
              Dailymotion, Facebook, X/Twitter and Bilibili links. You don't
              pick a platform first, and you don't need a separate downloader
              for each site.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <article
                id="vimeo-thumbnail-downloader"
                className="scroll-mt-6 rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Vimeo Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Paste a public Vimeo link to get its cover image at the
                  highest resolution available. Good for design research,
                  presentations and tidying up a video library.
                 To download a Vimeo thumbnail, copy the video's page link, paste it above and save the cover image.</p>
              </article>

              <article
                id="tiktok-thumbnail-downloader"
                className="scroll-mt-6 rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  TikTok Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Drop in a public TikTok video link, check the cover frame,
                  then save it. Useful for cross-posting or planning content.
                 To download a TikTok video thumbnail, copy the video link from the app or browser and paste it above.</p>
              </article>

              <article
                id="dailymotion-thumbnail-downloader"
                className="scroll-mt-6 rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Dailymotion Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  A public Dailymotion link returns its preview image, which you
                  can look over and download straight away.
                 To download a Dailymotion thumbnail, paste the video's page URL above.</p>
              </article>

              <article
                id="facebook-video-thumbnail-downloader"
                className="scroll-mt-6 rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Facebook Video Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Works on public Facebook videos that expose thumbnail
                  metadata. Private or restricted posts won't return anything.
                 To download a Facebook video thumbnail, copy the link of the public video and paste it above.</p>
              </article>

              <article
                id="x-twitter-video-thumbnail-downloader"
                className="scroll-mt-6 rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  X/Twitter Video Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Paste the URL of a public X/Twitter post with a video in it
                  and the preview image comes back, the same way a YouTube
                  link would.
                 To download a Twitter or X video thumbnail, copy the post link and paste it above.</p>
              </article>

              <article
                id="bilibili-thumbnail-downloader"
                className="scroll-mt-6 rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Bilibili Thumbnail Downloader
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Public Bilibili links and supported short URLs return their
                  cover image so you can preview and download it.
                 To download a Bilibili thumbnail, paste the video link or a supported short URL above.</p>
              </article>

            </div>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              How the Platform Gets Detected
            </h3>

            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-gray-600">
              <li>Copy a public video or post link from any supported site.</li>
              <li>Paste it into the search box at the top of the page.</li>
              <li>The platform is worked out from the URL.</li>
              <li>The available thumbnail data is fetched for that link.</li>
              <li>Check the image and its dimensions.</li>
              <li>Download the version you need, or all of them as a ZIP.</li>
            </ol>

            <p className="mt-6 leading-8 text-gray-600">
              Each site exposes a different number of sizes, so results won't
              be identical everywhere. The tool shows what it can actually
              retrieve for your link and doesn't pretend otherwise.
            </p>
          </section>

          {/* About / purpose */}
          <section className="mt-16 rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why People Use This Thumbnail Grabber
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Getting a thumbnail used to mean right-click saving a blurry
              preview, or typing out an img.youtube.com address and hoping it
              worked. With{" "}
              <Link
                href="https://youtubethumbnails-downloader.com/"
                className="text-red-600 underline hover:text-red-700"
              >
                youtubethumbnails-downloader.com
              </Link>{" "}
              you paste a link and see every size that really exists, with its
              actual dimensions, so you pick the right file on the first try.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              There's one rule behind it: show only what can be retrieved for
              that specific video. No placeholders, and no broken links passed
              off as working thumbnails.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              People use it for thumbnail redesign research, competitor
              benchmarking, portfolio archives, blog and course covers,
              classroom projects and reference images for editing. Within
              whatever the rights holder allows, of course.
            </p>
          </section>

          {/* FAQ */}
          <section
            id="faq"
            className="mt-16 scroll-mt-6 rounded-2xl bg-white p-8 shadow-sm md:p-10"
          >
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
      <script
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
      <script
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
              "Download YouTube Thumbnail HD",
              "YouTube Thumbnail Downloader 1280x720",
              "YouTube Shorts Thumbnail Downloader",
              "Vimeo Thumbnail Downloader",
              "TikTok Thumbnail Downloader",
              "Dailymotion Thumbnail Downloader",
              "Facebook Video Thumbnail Downloader",
              "X Twitter Thumbnail Downloader",
              "Bilibili Thumbnail Downloader",
            ],
            url: "https://youtubethumbnails-downloader.com/",
            description:
              "Free browser-based YouTube thumbnail downloader that returns Max Resolution (1280x720), SD, HQ, MQ and default images with exact dimensions, plus support for public YouTube Shorts, Vimeo, TikTok, Dailymotion, Facebook, X/Twitter and Bilibili video URLs.",
            inLanguage: "en",
          }),
        }}
      />

      {/* WebApplication Schema */}
      <script
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
              "Free online thumbnail downloader for public YouTube videos (including Shorts) and supported Vimeo, TikTok, Dailymotion, Facebook, X/Twitter and Bilibili URLs, with exact pixel dimensions for every returned image.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Download YouTube thumbnails in Max Resolution 1280x720, SD, HQ, MQ and default sizes",
              "YouTube Shorts thumbnail download",
              "Exact pixel dimensions shown per thumbnail",
              "Vimeo thumbnail download",
              "TikTok thumbnail download",
              "Dailymotion thumbnail download",
              "Facebook video thumbnail download",
              "X/Twitter video thumbnail download",
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
