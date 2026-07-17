import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Blog",
  description:
    "Read guides about YouTube thumbnails, YouTube SEO, thumbnail design, click-through rate optimization and content creation.",

  alternates: {
    canonical: "https://youtubethumbnails-downloader.com/blog",
  },

  openGraph: {
    title: "YouTube Thumbnail Blog",
    description:
      "Read guides about YouTube thumbnails, YouTube SEO and content creation.",
    url: "https://youtubethumbnails-downloader.com/blog",
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
    title: "YouTube Thumbnail Blog",
    description:
      "Read guides about YouTube thumbnails, SEO and content creation.",
    images: ["/og-image.jpg"],
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16">

        <Link
          href="/"
          className="mb-8 inline-flex items-center text-gray-700 transition hover:text-black"
          aria-label="Back"
        >
          <ArrowLeft size={30} />
        </Link>

        <h1 className="text-5xl font-extrabold text-gray-900">
          YouTube Thumbnail Blog
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          Learn everything about YouTube thumbnails, YouTube SEO, thumbnail
          design, click-through rate optimization, and content creation.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {post.title}
              </h2>

              <p className="mt-4 text-gray-600">
                {post.description}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-block font-semibold text-blue-600 hover:underline"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>

      </section>
    </main>
  );
}