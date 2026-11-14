import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, FaqSection, GuideJsonLd, RelatedGuides, SITE_URL, SpecTable } from "../../components/GuideParts";

const PATH = "/youtube-profile-picture-size";
const PAGE_URL = `${SITE_URL}${PATH}`;
const DATE = "2026-11-14";
const HEADLINE = "YouTube Profile Picture Size (2026): 800x800, Circle Crop and File Limits";

export const metadata: Metadata = {
  title: { absolute: "YouTube Profile Picture Size 2026: 800x800 (PFP & Channel Icon)" },
  description:
    "YouTube profile picture size: 800x800 px square, shown as a 98x98 circle. JPG, PNG, BMP or non-animated GIF up to 15MB. How to change your YouTube PFP and keep it sharp.",
  alternates: { canonical: PATH },
  openGraph: { title: HEADLINE, url: PATH, type: "article" },
};

const steps = [
  "Make a square image, ideally 800 × 800 pixels.",
  "Keep your face or logo centered so the circle crop doesn't cut it.",
  "In YouTube Studio, open Customization, then Branding.",
  "Under Picture, click Change, pick your image, adjust the circle and click Done.",
  "Click Publish.",
];

const faqs = [
  {
    q: "What size should a YouTube profile picture be?",
    a: "Use a square image of 800 × 800 pixels. YouTube displays it as a circle at 98 × 98 pixels on your channel page, and even smaller next to comments and videos.",
  },
  {
    q: "What is the YouTube PFP size in pixels?",
    a: "Upload 800 × 800 px. The image is shown as a 98 × 98 px circle, so a large square image keeps it sharp on high-resolution screens.",
  },
  {
    q: "What file types and size are allowed?",
    a: "JPG, PNG, BMP or non-animated GIF files up to 15 MB. An 800 × 800 PNG is normally well under 1 MB.",
  },
  {
    q: "Why does my profile picture look cut off?",
    a: "YouTube crops the square image into a circle, so the corners are hidden. Keep your face or logo in the middle with some space around it.",
  },
  {
    q: "Can I use a GIF as my YouTube profile picture?",
    a: "Only a non-animated GIF. Animated profile pictures are not supported.",
  },
  {
    q: "Is the YouTube profile picture the same as my Google account picture?",
    a: "Your channel picture is shown on YouTube, and for some accounts it is linked to your Google Account photo. Change it in YouTube Studio under Customization > Branding.",
  },
  {
    q: "How do I make an image square at 800x800?",
    a: "Use our free resizer: choose your image, enter a custom size of 800 × 800, pick Crop to fill the square and download. Nothing is uploaded.",
  },
];

export default function ProfilePictureSizePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <Breadcrumb label="YouTube Profile Picture Size" />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        YouTube Profile Picture Size (2026)
      </h1>
      <p className="mt-2 text-sm text-slate-500">Updated November 14, 2026 · Checked against YouTube Help</p>

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Quick answer</h2>
        <p className="mt-2 leading-relaxed">
          The YouTube profile picture size is <strong>800 × 800 pixels</strong> (1:1 square). YouTube shows it as a{" "}
          <strong>98 × 98 circle</strong>. Use <strong>JPG, PNG, BMP or non-animated GIF</strong> up to{" "}
          <strong>15 MB</strong>, and keep your face or logo in the center.
        </p>
        <Link
          href="/youtube-thumbnail-resizer"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Make an 800×800 image →
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Profile picture specs</h2>
        <SpecTable
          head={["Spec", "Value"]}
          rows={[
            ["Recommended size", "800 × 800 px"],
            ["Aspect ratio", "1:1 (square)"],
            ["Displayed as", "Circle, 98 × 98 px on the channel page"],
            ["Formats", "JPG, PNG, BMP, non-animated GIF"],
            ["Max file size", "15 MB"],
          ]}
        />
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How the circle crop works</h2>
        <div className="flex flex-wrap items-center gap-8">
          <div className="relative h-40 w-40 bg-slate-200">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 bg-emerald-100/70" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-800">
              Visible
            </span>
          </div>
          <p className="max-w-md">
            You upload a square, but only the circle is shown. The four corners (gray) are hidden everywhere on YouTube.
            Center the subject and avoid text near the edges.
          </p>
        </div>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to change your YouTube profile picture</h2>
        <ol className="list-decimal space-y-2 pl-6">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tips for a profile picture that stands out</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Use a close-up face or a simple logo; it appears tiny next to comments and in subscriptions.</li>
          <li>Pick a solid, contrasting background color.</li>
          <li>Skip small text; it won&apos;t be readable at small sizes.</li>
          <li>
            Match the colors of your{" "}
            <Link href="/youtube-banner-size" className="text-indigo-700 underline">
              channel banner
            </Link>{" "}
            for a consistent look.
          </li>
        </ul>
      </section>

      <FaqSection faqs={faqs} />
      <RelatedGuides current={PATH} />

      <p className="mt-12 text-sm text-slate-500">
        Source: YouTube Help (channel branding). Not affiliated with YouTube or Google LLC.
      </p>

      <GuideJsonLd
        url={PAGE_URL}
        headline={HEADLINE}
        date={DATE}
        faqs={faqs}
        crumb="YouTube Profile Picture Size"
        howTo={{ name: "How to change your YouTube profile picture", steps }}
      />
    </main>
  );
}
