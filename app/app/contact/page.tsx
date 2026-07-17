import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",

  description:
    "Get in touch with YouTube Thumbnail Downloader for questions, feedback, business inquiries, or support.",

  alternates: {
    canonical: "https://youtubethumbnails-downloader.com/contact",
  },

  openGraph: {
    title: "Contact Us | YouTube Thumbnail Downloader",
    description:
      "Get in touch with YouTube Thumbnail Downloader for questions, feedback, business inquiries, or support.",
    url: "https://youtubethumbnails-downloader.com/contact",
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
    title: "Contact Us | YouTube Thumbnail Downloader",
    description:
      "Get in touch with YouTube Thumbnail Downloader for questions, feedback, business inquiries, or support.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl bg-white p-10 shadow-sm">

          <Link
            href="/"
            className="mb-8 inline-block text-3xl font-bold text-gray-700 transition hover:text-black"
            aria-label="Back to Home"
          >
            ←
          </Link>

          <h1 className="text-5xl font-extrabold text-gray-900">
            Contact Us
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            Thank you for visiting YouTube Thumbnail Downloader.
            If you have any questions, suggestions, feedback, or business
            inquiries, feel free to contact us using the email below.
          </p>

          <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Email
            </h2>

            <a
  href="mailto:amazonzoo515@gmail.com"
  className="mt-4 inline-block text-lg font-medium text-blue-600 break-all hover:underline"
>
  amazonzoo515@gmail.com
</a>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Business Inquiries
            </h2>

            <p className="mt-4 text-gray-600 leading-8">
              We welcome partnership opportunities, collaboration requests,
              and general business inquiries. Please contact us via email,
              and we will review your message as soon as possible.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Important Note
            </h2>

            <p className="mt-4 text-gray-600 leading-8">
              Our website provides a free tool to download publicly available
              YouTube thumbnails. We are not affiliated with or endorsed by
              YouTube or Google.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}