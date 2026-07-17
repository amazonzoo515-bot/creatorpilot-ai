import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",

  description:
    "Learn more about YouTube Thumbnail Downloader, our mission, and how our free tool helps users download YouTube thumbnails in Max Resolution, HD, HQ, MQ, SD, and Default quality.",

  alternates: {
    canonical: "https://youtubethumbnails-downloader.com/about",
  },

  openGraph: {
    title: "About Us | YouTube Thumbnail Downloader",
    description:
      "Learn more about YouTube Thumbnail Downloader and our mission.",
    url: "https://youtubethumbnails-downloader.com/about",
    siteName: "YouTube Thumbnail Downloader",
    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Us | YouTube Thumbnail Downloader",
    description:
      "Learn more about YouTube Thumbnail Downloader and our mission.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl bg-white p-10 shadow-sm">

          <Link
            href="/"
            className="mb-8 inline-block text-3xl font-bold text-gray-700 transition hover:text-black"
            aria-label="Back to Home"
          >
            ←
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900">
            About YouTube Thumbnail Downloader
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
  YouTube Thumbnail Downloader is a free online tool designed to help
  creators, designers, marketers and viewers download public YouTube
  thumbnail images in multiple resolutions within seconds. The tool works
  on desktop, mobile, and tablet devices without requiring registration or
  software installation.
</p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <div className="rounded-xl border border-gray-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                🚀 Our Mission
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Our mission is to provide a fast, reliable and free thumbnail
                downloading experience without unnecessary complexity.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                ⚡ Fast & Easy
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Simply paste a YouTube video URL and instantly access every
                available thumbnail size.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                🌎 Available Everywhere
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Works smoothly on desktop, mobile and tablet devices without
                requiring software installation.
              </p>
            </div>

          </div>

          <h2 className="mt-14 text-3xl font-bold text-gray-900">
            Why Choose Our Tool?
          </h2>

          <ul className="mt-6 space-y-4 text-gray-600 leading-8">
            <li>✅ Download Max Resolution thumbnails.</li>
            <li>✅ Supports HD, HQ, MQ, SD and Default quality.</li>
            <li>✅ Compatible with YouTube Shorts.</li>
            <li>✅ Completely free to use.</li>
            <li>✅ No signup required.</li>
            <li>✅ Fast, secure and user-friendly.</li>
          </ul>

          <h2 className="mt-14 text-3xl font-bold text-gray-900">
  Our Goal
</h2>

<p className="mt-4 leading-8 text-gray-600">
  We continuously improve our tools to provide creators with a better
  experience. Our focus is on simplicity, speed, accessibility and
  reliability for everyone.
</p>

<p className="mt-8 leading-8 text-gray-600">
  Have questions or feedback? Visit our{" "}
  <Link
    href="/contact"
    className="text-blue-600 hover:underline"
  >
    Contact Us
  </Link>{" "}
  page.
</p>

<p className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
  Last updated: July 2026
</p>

        </div>
      </section>
    </main>
  );
}