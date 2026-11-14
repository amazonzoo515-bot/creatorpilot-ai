import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, FaqSection, GuideJsonLd, RelatedGuides, SITE_URL, SpecTable } from "../../components/GuideParts";

const PATH = "/youtube-banner-size";
const PAGE_URL = `${SITE_URL}${PATH}`;
const DATE = "2026-11-14";
const HEADLINE = "YouTube Banner Size (2026): 2560x1440, Safe Area and Mobile Size";

export const metadata: Metadata = {
  title: { absolute: "YouTube Banner Size 2026: 2560x1440 + Safe Area (1546x423)" },
  description:
    "YouTube banner size: 2560x1440 px (16:9), minimum 2048x1152, max 6MB. Keep text in the 1546x423 safe area so it shows on mobile, desktop and TV. Channel art guide.",
  alternates: { canonical: PATH },
  openGraph: { title: HEADLINE, url: PATH, type: "article" },
};

const steps = [
  "Design your banner at 2560 × 1440 pixels.",
  "Put your channel name, logo and tagline inside the central 1546 × 423 safe area.",
  "Save it as a JPG or PNG under 6 MB.",
  "In YouTube Studio, open Customization, then Branding.",
  "Under Banner image, click Change or Upload, adjust the crop preview and click Done, then Publish.",
];

const faqs = [
  {
    q: "What is the YouTube banner size?",
    a: "Upload 2560 × 1440 pixels (16:9). The minimum is 2048 × 1152 and the file must be 6 MB or smaller.",
  },
  {
    q: "What is the YouTube banner safe area?",
    a: "The safe area is the center part that appears on every device: 1235 × 338 pixels at the 2048 × 1152 minimum size, which is about 1546 × 423 pixels on a 2560 × 1440 banner. Keep all text and logos inside it.",
  },
  {
    q: "What is the YouTube banner size for mobile?",
    a: "Phones show only the central safe area of your banner, about 1546 × 423 pixels of a 2560 × 1440 upload. You still upload one 2560 × 1440 image; YouTube crops it per device.",
  },
  {
    q: "Why is my YouTube banner cut off?",
    a: "Because important text or logos sit outside the central safe area. YouTube crops banners differently on TV, desktop and mobile, so only the center is guaranteed to show everywhere.",
  },
  {
    q: "What file formats can I use for a YouTube banner?",
    a: "JPG, PNG, BMP or a non-animated GIF, up to 6 MB.",
  },
  {
    q: "Is YouTube channel art the same as a banner?",
    a: "Yes. Channel art, channel banner and cover image all mean the same header image at the top of your channel.",
  },
  {
    q: "How do I resize an image to 2560x1440?",
    a: "Use our free resizer: choose your image, enter a custom size of 2560 × 1440, pick Crop or Fit and download. It runs in your browser, so nothing is uploaded.",
  },
];

export default function BannerSizePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <Breadcrumb label="YouTube Banner Size" />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        YouTube Banner Size (2026): Channel Art Dimensions
      </h1>
      <p className="mt-2 text-sm text-slate-500">Updated November 14, 2026 · Checked against YouTube Help</p>

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Quick answer</h2>
        <p className="mt-2 leading-relaxed">
          The YouTube banner size is <strong>2560 × 1440 pixels</strong> (16:9), with a minimum of{" "}
          <strong>2048 × 1152</strong> and a maximum file size of <strong>6 MB</strong>. Keep text and logos inside the
          central <strong>1546 × 423 px safe area</strong> so they show on phones, computers and TVs.
        </p>
        <Link
          href="/youtube-thumbnail-resizer"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Resize an image to 2560×1440 →
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">YouTube banner specs</h2>
        <SpecTable
          head={["Spec", "Value"]}
          rows={[
            ["Recommended size", "2560 × 1440 px"],
            ["Minimum size", "2048 × 1152 px"],
            ["Aspect ratio", "16:9"],
            ["Safe area (all devices)", "1546 × 423 px on 2560 × 1440 (1235 × 338 at minimum size)"],
            ["Max file size", "6 MB"],
            ["Formats", "JPG, PNG, BMP, non-animated GIF"],
          ]}
        />
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Banner size on TV, desktop and mobile</h2>
        <p>
          You upload one image, and YouTube shows a different part of it on each screen. TVs show the full 2560 × 1440
          image. Computers show a wide strip across the middle. Phones show only the center safe area. That&apos;s why the
          safe area matters more than anything else in your design.
        </p>
        <div className="mx-auto mt-4 max-w-xl">
          <div className="relative aspect-video w-full rounded-lg border-2 border-slate-400 bg-slate-200">
            <span className="absolute left-2 top-2 text-xs font-semibold text-slate-600">TV: full 2560 × 1440</span>
            <div className="absolute inset-x-0 top-1/2 h-[29%] -translate-y-1/2 border-y-2 border-dashed border-indigo-400 bg-indigo-100/60">
              <span className="absolute left-2 top-1 text-xs font-semibold text-indigo-700">Desktop strip</span>
            </div>
            <div className="absolute left-1/2 top-1/2 h-[29%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded border-2 border-emerald-500 bg-emerald-100/80">
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-800">
                Safe area 1546 × 423
              </span>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">Approximate layout. Keep text inside the green area.</p>
        </div>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to upload a YouTube banner</h2>
        <ol className="list-decimal space-y-2 pl-6">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Banner design tips</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Use the outer area for background color or pattern only.</li>
          <li>Keep the channel name large; phones show the banner very small.</li>
          <li>On desktop your profile picture sits near the banner, so match their colors.</li>
          <li>Check the device preview in YouTube Studio before publishing.</li>
        </ul>
        <p>
          Need your profile picture too? See the{" "}
          <Link href="/youtube-profile-picture-size" className="text-indigo-700 underline">
            YouTube profile picture size guide
          </Link>
          .
        </p>
      </section>

      <FaqSection faqs={faqs} />
      <RelatedGuides current={PATH} />

      <p className="mt-12 text-sm text-slate-500">
        Source: YouTube Help (channel banner guidelines). Not affiliated with YouTube or Google LLC.
      </p>

      <GuideJsonLd
        url={PAGE_URL}
        headline={HEADLINE}
        date={DATE}
        faqs={faqs}
        crumb="YouTube Banner Size"
        howTo={{ name: "How to upload a YouTube banner", steps }}
      />
    </main>
  );
}
