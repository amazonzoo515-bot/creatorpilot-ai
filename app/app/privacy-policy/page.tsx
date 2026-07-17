import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for YouTube Thumbnail Downloader.",
    alternates: {
  canonical: "https://youtubethumbnails-downloader.com/privacy-policy",
},
openGraph: {
  title: "Privacy Policy | YouTube Thumbnail Downloader",
  description:
    "Read the Privacy Policy for YouTube Thumbnail Downloader.",
  url: "https://youtubethumbnails-downloader.com/privacy-policy",
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
  title: "Privacy Policy | YouTube Thumbnail Downloader",
  description:
    "Read the Privacy Policy for YouTube Thumbnail Downloader.",
  images: ["/og-image.jpg"],
},

};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl bg-white p-10 shadow-sm">

          <Link
            href="/"
            className="mb-8 inline-block text-3xl font-bold text-gray-700 transition hover:text-black"
            aria-label="Back to Home"
          >
            ←
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Privacy Policy
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your privacy is important to us. This Privacy Policy explains how
            YouTube Thumbnail Downloader collects, uses and protects your
            information when you use our website.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Information We Collect
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            We do not require users to create an account or provide personal
            information to use this website. Basic technical information such as
            browser type and anonymous analytics may be collected to improve our
            services.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Cookies
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            Our website may use cookies to improve user experience and website
            performance. You can disable cookies in your browser settings at any
            time.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Third-Party Services
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            We may use trusted third-party services such as analytics providers
            to understand website usage and improve performance.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Contact Us
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
  If you have any questions regarding this Privacy Policy, please{" "}
  <Link
    href="/contact"
    className="text-blue-600 hover:underline"
  >
    contact us
  </Link>
  .
</p>

          <p className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
            Last updated: July 2026
          </p>

        </div>
      </section>
    </main>
  );
}