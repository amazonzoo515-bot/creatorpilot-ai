import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, FaqSection, GuideJsonLd, RelatedGuides, SITE_URL, SpecTable } from "../../components/GuideParts";

const PATH = "/youtube-shorts-thumbnail-size";
const PAGE_URL = `${SITE_URL}${PATH}`;
const DATE = "2026-11-14";
const HEADLINE = "YouTube Shorts Thumbnail Size (2026): 2160x3840, 9:16 and How to Add One";

export const metadata: Metadata = {
  title: { absolute: "YouTube Shorts Thumbnail Size 2026: 2160x3840 (9:16) + How to Add" },
  description:
    "YouTube Shorts thumbnail size: 2160x3840 px (9:16), min 640 px tall, JPG or PNG up to 50MB. How to add a custom Shorts thumbnail in YouTube Studio, plus safe-zone tips.",
  alternates: { canonical: PATH },
  openGraph: { title: HEADLINE, url: PATH, type: "article" },
};

const steps = [
  "Make your image 2160 × 3840 (or 1080 × 1920) in a 9:16 vertical shape.",
  "Open YouTube Studio on a computer and click Content, then the Shorts tab.",
  "Click your Short to open its details.",
  "Under Thumbnail, choose Upload file and pick your image.",
  "Click Save.",
];

const faqs = [
  {
    q: "What size is a YouTube Shorts thumbnail?",
    a: "YouTube recommends 2160 × 3840 pixels at a 9:16 vertical aspect ratio, with a minimum height of 640 pixels. 1080 × 1920 is also 9:16 and works well if your source image is smaller.",
  },
  {
    q: "Is a Shorts thumbnail vertical or horizontal?",
    a: "Vertical, 9:16, the same shape as the Short itself. When a Short appears in places like search or the home feed, YouTube may crop it, so keep faces and text near the center.",
  },
  {
    q: "Can I add a custom thumbnail to YouTube Shorts?",
    a: "Yes. Custom Shorts thumbnails are added in YouTube Studio on a computer, and your account must be verified. In the phone app you can only pick a frame from the video.",
  },
  {
    q: "What is the file size limit for a Shorts thumbnail?",
    a: "Up to 50 MB in YouTube Studio on a computer, in JPG or PNG. A 2160 × 3840 JPG is normally only a few megabytes.",
  },
  {
    q: "Why can't I see the custom thumbnail option for my Short?",
    a: "Use YouTube Studio in a desktop browser, not the mobile app, and make sure your channel is phone-verified. Some features roll out gradually, so the option may appear later for some channels.",
  },
  {
    q: "Where does a Shorts thumbnail show up?",
    a: "Not while people swipe through the Shorts feed, because Shorts autoplay there. The thumbnail matters in search results, on your channel's Shorts tab, in suggestions and when the Short is shared.",
  },
  {
    q: "Can I use a horizontal 1280x720 image as a Shorts thumbnail?",
    a: "It's better to convert it to 9:16 first. Use our thumbnail resizer with Fit mode to place the horizontal image on a vertical blurred background without cutting anything off.",
  },
  {
    q: "How do I download the thumbnail of a YouTube Short?",
    a: "Paste the Shorts link into our YouTube thumbnail downloader. It reads the video ID from the /shorts/ link and shows every size YouTube stores for it.",
  },
];

export default function ShortsThumbnailSizePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <Breadcrumb label="YouTube Shorts Thumbnail Size" />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        YouTube Shorts Thumbnail Size (2026)
      </h1>
      <p className="mt-2 text-sm text-slate-500">Updated November 14, 2026 · Checked against YouTube Help</p>

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Quick answer</h2>
        <p className="mt-2 leading-relaxed">
          The YouTube Shorts thumbnail size is <strong>2160 × 3840 pixels</strong> with a <strong>9:16</strong> vertical
          aspect ratio and a minimum height of <strong>640 pixels</strong>. Upload a <strong>JPG or PNG</strong> (up to
          50 MB) in <strong>YouTube Studio on a computer</strong>. Your channel must be verified.
        </p>
        <Link
          href="/youtube-thumbnail-resizer"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Resize an image to 9:16 for Shorts →
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Shorts thumbnail specs</h2>
        <SpecTable
          head={["Spec", "Value"]}
          rows={[
            ["Recommended size", "2160 × 3840 px"],
            ["Also works", "1080 × 1920 px (same 9:16 shape)"],
            ["Aspect ratio", "9:16 (vertical)"],
            ["Minimum height", "640 px"],
            ["Formats", "JPG or PNG"],
            ["Max file size", "50 MB (YouTube Studio on a computer)"],
            ["Where to upload", "YouTube Studio on desktop; account must be verified"],
          ]}
        />
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Shorts thumbnail vs regular thumbnail</h2>
        <SpecTable
          head={["", "Shorts thumbnail", "Regular video thumbnail"]}
          rows={[
            ["Shape", "9:16 vertical", "16:9 horizontal"],
            ["Recommended size", "2160 × 3840", "3840 × 2160 (or 1280 × 720)"],
            ["Minimum", "640 px tall", "640 px wide"],
            ["Upload from phone app", "No (pick a frame only)", "Yes, up to 2 MB"],
          ]}
        />
        <p>
          Don&apos;t upload a 16:9 image to a Short without converting it. Either crop it to 9:16 or place it on a vertical
          background so nothing important is cut off.
        </p>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to add a custom thumbnail to YouTube Shorts</h2>
        <ol className="list-decimal space-y-2 pl-6">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p>
          On the phone app you can still choose a frame from your Short and add text, but uploading your own image needs
          YouTube Studio on a computer.
        </p>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Design tips for Shorts thumbnails</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Keep faces and words in the middle third. YouTube can crop vertical thumbnails on some surfaces.</li>
          <li>Use 2–4 big words. Shorts thumbnails are seen tiny on the channel Shorts tab and in search.</li>
          <li>Leave the top and bottom edges clear of text.</li>
          <li>Use a frame or image that matches what happens in the Short.</li>
        </ul>
      </section>

      <FaqSection faqs={faqs} />
      <RelatedGuides current={PATH} />

      <p className="mt-12 text-sm text-slate-500">
        Source: YouTube Help (custom thumbnails). Not affiliated with YouTube or Google LLC.
      </p>

      <GuideJsonLd
        url={PAGE_URL}
        headline={HEADLINE}
        date={DATE}
        faqs={faqs}
        crumb="YouTube Shorts Thumbnail Size"
        howTo={{ name: "How to add a custom thumbnail to YouTube Shorts", steps }}
      />
    </main>
  );
}
