import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, FaqSection, GuideJsonLd, RelatedGuides, SITE_URL } from "../../components/GuideParts";

const PATH = "/download-youtube-thumbnail-on-phone";
const PAGE_URL = `${SITE_URL}${PATH}`;
const DATE = "2026-11-14";
const HEADLINE = "How to Download a YouTube Thumbnail on iPhone or Android (2026)";

export const metadata: Metadata = {
  title: { absolute: "How to Download a YouTube Thumbnail on iPhone or Android (Free)" },
  description:
    "Save any YouTube thumbnail to your iPhone or Android phone in HD: copy the video link, paste it into a free thumbnail downloader and save the image to Photos or Gallery. No app.",
  alternates: { canonical: PATH },
  openGraph: { title: HEADLINE, url: PATH, type: "article" },
};

const steps = [
  "In the YouTube app, open the video or Short, tap Share, then Copy link.",
  "Open youtubethumbnails-downloader.com in Safari or Chrome.",
  "Tap Paste Link (or paste into the box) and tap Get Thumbnail.",
  "Tap Download under the size you want, such as Max Resolution 1280×720.",
  "Open the downloaded image and save it to Photos (iPhone) or find it in Gallery/Downloads (Android).",
];

const faqs = [
  {
    q: "How do I download a YouTube thumbnail on my phone?",
    a: "Copy the video link from the YouTube app (Share > Copy link), paste it into a YouTube thumbnail downloader in your phone's browser and tap Download under the size you want. No app is needed.",
  },
  {
    q: "Where does the thumbnail go on iPhone?",
    a: "Safari saves downloads to the Files app in the Downloads folder. Open the image there, tap the Share button and choose Save Image to add it to Photos. You can also long-press the preview image and choose Save to Photos.",
  },
  {
    q: "Where does the thumbnail go on Android?",
    a: "Chrome saves it to your Downloads folder, and it also appears in Google Photos or your Gallery app under Downloads. You can long-press the preview image and choose Download image too.",
  },
  {
    q: "Can I download a YouTube Shorts thumbnail on my phone?",
    a: "Yes. Copy the Short's link with Share > Copy link and paste it in the same way. Links with /shorts/ work.",
  },
  {
    q: "Why is the downloaded thumbnail blurry?",
    a: "You probably saved a small size. Choose Max Resolution (1280 × 720). If that size is missing, the video only has smaller thumbnails.",
  },
  {
    q: "Do I need an app or an account?",
    a: "No. It works in Safari, Chrome, Samsung Internet and other mobile browsers, free and without sign-up.",
  },
];

export default function PhoneDownloadGuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <Breadcrumb label="Download a YouTube Thumbnail on Phone" />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        How to Download a YouTube Thumbnail on iPhone or Android
      </h1>
      <p className="mt-2 text-sm text-slate-500">Updated November 14, 2026</p>

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Quick answer</h2>
        <p className="mt-2 leading-relaxed">
          Copy the video link in the YouTube app (<strong>Share → Copy link</strong>), paste it into our{" "}
          <strong>free YouTube thumbnail downloader</strong> in your phone browser and tap <strong>Download</strong>. No
          app, no sign-up.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Open the thumbnail downloader →
        </Link>
      </div>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Step by step</h2>
        <ol className="list-decimal space-y-2 pl-6">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">On iPhone (Safari)</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>After tapping Download, Safari may ask to download the file. Tap Download.</li>
          <li>Open the Files app, go to Downloads, tap the image, then Share and Save Image to put it in Photos.</li>
          <li>Faster option: long-press the thumbnail preview and choose Save to Photos.</li>
        </ul>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">On Android (Chrome)</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Tap Download; Chrome saves the image to your Downloads folder.</li>
          <li>Open Google Photos or Gallery and look in the Downloads album.</li>
          <li>Or long-press the preview image and choose Download image.</li>
        </ul>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Which size should you save?</h2>
        <p>
          Pick <strong>Max Resolution (1280 × 720)</strong> for the sharpest image. If it&apos;s not available, choose{" "}
          <strong>SD (640 × 480)</strong> or <strong>HQ (480 × 360)</strong>. To change the size afterwards, use the{" "}
          <Link href="/youtube-thumbnail-resizer" className="text-indigo-700 underline">
            thumbnail resizer
          </Link>
          , which also works on phones.
        </p>
      </section>

      <FaqSection faqs={faqs} />
      <RelatedGuides current={PATH} />

      <p className="mt-12 text-sm text-slate-500">
        Thumbnails belong to their creators. Ask permission before reusing someone else&apos;s thumbnail. Not affiliated
        with YouTube or Google LLC.
      </p>

      <GuideJsonLd
        url={PAGE_URL}
        headline={HEADLINE}
        date={DATE}
        faqs={faqs}
        crumb="Download a YouTube Thumbnail on Phone"
        howTo={{ name: "How to download a YouTube thumbnail on a phone", steps }}
      />
    </main>
  );
}
