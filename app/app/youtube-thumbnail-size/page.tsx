import type { Metadata } from "next";
import Link from "next/link";

import { RelatedGuides } from "../../components/GuideParts";

const SITE_URL = "https://youtubethumbnails-downloader.com";
const PAGE_URL = `${SITE_URL}/youtube-thumbnail-size`;
const UPDATED_ISO = "2026-11-14";
const UPDATED_TEXT = "November 14, 2026";

export const metadata: Metadata = {
  title: {
    absolute: "YouTube Thumbnail Size 2026: 3840x2160, 1280x720 & 50MB Limit",
  },
  description:
    "YouTube thumbnail size for 2026: 3840x2160 recommended, 1280x720 standard, 16:9, min 640px wide, 50MB on desktop or 2MB on phone. Plus Shorts, banner and profile sizes.",
  alternates: { canonical: "/youtube-thumbnail-size" },
  openGraph: {
    title: "YouTube Thumbnail Size 2026: Every Dimension and Limit",
    description:
      "Thumbnail, Shorts, banner and profile picture sizes, file limits and formats in one table. Checked against YouTube Help.",
    url: "/youtube-thumbnail-size",
    type: "article",
  },
};

const uploadSizes = [
  { type: "Video thumbnail (recommended)", size: "3840 × 2160", ratio: "16:9", limit: "50 MB computer · 2 MB phone", note: "Sharpest on TVs and large screens" },
  { type: "Video thumbnail (standard HD)", size: "1280 × 720", ratio: "16:9", limit: "50 MB computer · 2 MB phone", note: "Still the safe everyday size" },
  { type: "Minimum thumbnail width", size: "640 px wide", ratio: "16:9", limit: "–", note: "Smaller images are rejected" },
  { type: "Shorts thumbnail", size: "2160 × 3840", ratio: "9:16", limit: "50 MB (computer only)", note: "Minimum height 640 px" },
  { type: "Channel banner", size: "2560 × 1440", ratio: "16:9", limit: "6 MB", note: "Min 2048 × 1152, keep text in the 1546 × 423 center" },
  { type: "Profile picture", size: "800 × 800", ratio: "1:1", limit: "15 MB", note: "Shown as a 98 × 98 circle" },
];

const storedSizes = [
  { name: "Max Resolution", file: "maxresdefault.jpg", size: "1280 × 720", note: "Only when the uploaded thumbnail or video is HD" },
  { name: "Standard (SD)", file: "sddefault.jpg", size: "640 × 480", note: "4:3 frame, may include black bars" },
  { name: "High Quality (HQ)", file: "hqdefault.jpg", size: "480 × 360", note: "4:3 frame, available for almost every video" },
  { name: "Medium Quality (MQ)", file: "mqdefault.jpg", size: "320 × 180", note: "16:9, no bars" },
  { name: "Default", file: "default.jpg", size: "120 × 90", note: "Tiny preview" },
];

const faqs = [
  {
    q: "What is the best YouTube thumbnail size in 2026?",
    a: "YouTube now recommends 3840 × 2160 pixels (4K) at a 16:9 aspect ratio. 1280 × 720 is still accepted everywhere and is the safe choice if your image isn't large enough for 4K. The minimum width is 640 pixels.",
  },
  {
    q: "What is the YouTube thumbnail file size limit?",
    a: "Up to 50 MB when you upload from a computer (videos, Shorts and podcasts). From the YouTube mobile app the limit is 2 MB for video thumbnails and 10 MB for podcast thumbnails.",
  },
  {
    q: "When did YouTube raise the thumbnail limit from 2MB to 50MB?",
    a: "YouTube announced the change in late October 2025 so it could show 4K thumbnails on TVs, and it rolled out to all creators in March 2026. Uploads from the mobile app still have the 2 MB limit.",
  },
  {
    q: "Is 1280x720 still a good YouTube thumbnail size?",
    a: "Yes. 1280 × 720 is the classic HD size, it's well under the 2 MB phone limit as a JPG, and it looks sharp on phones and laptops. Use 3840 × 2160 when your source image is big enough and you upload from a computer.",
  },
  {
    q: "What is the YouTube thumbnail aspect ratio?",
    a: "16:9 for regular videos, the same shape as the video player. Shorts thumbnails are vertical, 9:16.",
  },
  {
    q: "What size is a YouTube Shorts thumbnail?",
    a: "2160 × 3840 pixels (9:16) with a minimum height of 640 pixels. Custom Shorts thumbnails can only be added in YouTube Studio on a computer.",
  },
  {
    q: "Which file format should I use, JPG or PNG?",
    a: "Both work. JPG files are much smaller, which matters if you upload from your phone (2 MB limit). PNG is fine for desktop uploads and graphics with sharp text.",
  },
  {
    q: "Why can't I upload a custom thumbnail?",
    a: "Custom thumbnails require a verified YouTube account (phone verification). Other common causes are a file over the size limit, an image narrower than 640 pixels or an unsupported format.",
  },
  {
    q: "What size is a downloaded YouTube thumbnail?",
    a: "When you download a thumbnail from YouTube, the largest stored size is usually 1280 × 720 (maxresdefault.jpg). Smaller versions are 640 × 480, 480 × 360, 320 × 180 and 120 × 90.",
  },
  {
    q: "How do I make my image the right YouTube thumbnail size?",
    a: "Use the free YouTube thumbnail resizer: choose your image, pick 1280 × 720 or 4K, choose Crop or Fit, and download a JPG that stays under the upload limit.",
  },
];

export default function ThumbnailSizeGuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › YouTube Thumbnail Size
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        YouTube Thumbnail Size (2026): Dimensions, Ratio &amp; File Limits
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Updated {UPDATED_TEXT} · Checked against YouTube Help
      </p>

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Quick answer</h2>
        <p className="mt-2 leading-relaxed">
          The best YouTube thumbnail size is <strong>3840 × 2160 pixels</strong> (16:9). The standard HD size{" "}
          <strong>1280 × 720</strong> still works everywhere. Thumbnails must be at least <strong>640 px wide</strong>,
          in <strong>JPG or PNG</strong>, and up to <strong>50 MB</strong> from a computer or <strong>2 MB</strong> from
          the YouTube phone app.
        </p>
        <Link
          href="/youtube-thumbnail-resizer"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Resize an image to 1280×720 or 4K →
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">All YouTube image sizes at a glance</h2>
        <p className="mt-2 text-slate-600">Sizes in pixels. Limits are the maximum file size YouTube accepts.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse bg-white text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Ratio</th>
                <th className="px-4 py-3">Max file size</th>
                <th className="px-4 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {uploadSizes.map((r) => (
                <tr key={r.type}>
                  <td className="px-4 py-3 font-medium">{r.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.size}</td>
                  <td className="px-4 py-3">{r.ratio}</td>
                  <td className="px-4 py-3">{r.limit}</td>
                  <td className="px-4 py-3 text-slate-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">1280×720 or 3840×2160: which should you use?</h2>
        <p>
          For years YouTube recommended 1280 × 720 with a 2 MB limit. In October 2025 YouTube announced it would raise
          the limit to 50 MB so it could show 4K thumbnails on the big screen, and the higher limit reached all creators
          in March 2026. YouTube Help now recommends 3840 × 2160.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Use 3840 × 2160</strong> when your design is made at 4K or larger and you upload from a computer.
            It looks noticeably sharper on TVs.
          </li>
          <li>
            <strong>Use 1280 × 720</strong> when your source image is smaller, when you upload from your phone, or when
            you just want a fast, safe file. Upscaling a small image to 4K adds no real detail.
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Aspect ratio and minimum size</h2>
        <p>
          Video thumbnails use a <strong>16:9</strong> aspect ratio, the same widescreen shape as the player. Any 16:9
          size works as long as it&apos;s at least 640 pixels wide: 1280 × 720, 1920 × 1080, 2560 × 1440 or 3840 × 2160.
          A square or vertical picture won&apos;t fill the frame, so crop it to 16:9 first or place it on a background.
        </p>
        <p>
          Viewers mostly see thumbnails tiny, in search results and next to other videos. Keep text to a few big words
          and make sure faces are still readable at phone size.
        </p>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">YouTube Shorts thumbnail size</h2>
        <p>
          Shorts thumbnails are vertical: <strong>2160 × 3840 pixels</strong> at <strong>9:16</strong>, with a minimum
          height of 640 pixels. You can currently add a custom Shorts thumbnail only in YouTube Studio on a computer, and
          your channel must be verified. Full details:{" "}
          <Link href="/youtube-shorts-thumbnail-size" className="text-indigo-700 underline">
            YouTube Shorts thumbnail size
          </Link>
          .
        </p>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Banner and profile picture size</h2>
        <p>
          <strong>Channel banner:</strong> upload 2560 × 1440 pixels (minimum 2048 × 1152, up to 6 MB). YouTube crops
          banners differently on TV, desktop and mobile, so keep text and logos inside the central safe area:{" "}
          <strong>1546 × 423</strong> on a 2560 × 1440 banner (1235 × 338 at the minimum size).
        </p>
        <p>
          <strong>Profile picture:</strong> use a square image such as 800 × 800 pixels (up to 15 MB). It&apos;s shown as
          a 98 × 98 circle, so keep your face or logo in the middle.
        </p>
        <p>
          More detail:{" "}
          <Link href="/youtube-banner-size" className="text-indigo-700 underline">
            YouTube banner size
          </Link>{" "}
          and{" "}
          <Link href="/youtube-profile-picture-size" className="text-indigo-700 underline">
            YouTube profile picture size
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Sizes you get when you download a thumbnail</h2>
        <p className="mt-2 leading-relaxed text-slate-600">
          YouTube re-encodes every thumbnail into fixed sizes. These are the files a{" "}
          <Link href="/" className="text-indigo-700 underline">
            YouTube thumbnail downloader
          </Link>{" "}
          can save:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse bg-white text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {storedSizes.map((r) => (
                <tr key={r.file}>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.file}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.size}</td>
                  <td className="px-4 py-3 text-slate-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to add a custom thumbnail</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Verify your YouTube account by phone (needed for custom thumbnails).</li>
          <li>
            Make your image 1280 × 720 or 3840 × 2160 with the{" "}
            <Link href="/youtube-thumbnail-resizer" className="text-indigo-700 underline">
              thumbnail resizer
            </Link>
            .
          </li>
          <li>Open YouTube Studio, go to Content and click the video.</li>
          <li>Under Thumbnail, choose Upload file, pick your image and click Save.</li>
        </ol>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Thumbnail tips that help clicks</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Start with a sharp image at least 1280 px wide.</li>
          <li>Use three to five large words at most.</li>
          <li>Keep faces and text near the center so nothing gets cropped.</li>
          <li>Avoid the bottom-right corner, where YouTube shows the video length.</li>
          <li>Use strong contrast so the thumbnail stands out in a busy feed.</li>
          <li>Make the thumbnail match what the video delivers.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-6 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg font-semibold text-slate-900">{f.q}</h3>
              <p className="mt-1 leading-relaxed text-slate-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <RelatedGuides current="/youtube-thumbnail-size" />

      <p className="mt-12 text-sm text-slate-500">
        Sources: YouTube Help (custom thumbnails, channel banner and profile picture pages) and YouTube&apos;s 2025–2026
        announcements on 4K thumbnails. Not affiliated with YouTube or Google LLC.
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: "YouTube Thumbnail Size (2026): Dimensions, Ratio & File Limits",
                url: PAGE_URL,
                mainEntityOfPage: PAGE_URL,
                datePublished: UPDATED_ISO,
                dateModified: UPDATED_ISO,
                inLanguage: "en",
                image: `${SITE_URL}/og-image.png`,
                author: { "@type": "Organization", name: "CreatorPilot", url: SITE_URL },
                publisher: {
                  "@type": "Organization",
                  name: "CreatorPilot",
                  url: SITE_URL,
                  logo: { "@type": "ImageObject", url: `${SITE_URL}/web-app-manifest-512x512.png` },
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "YouTube Thumbnail Size", item: PAGE_URL },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
