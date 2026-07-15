import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { blogPosts, getRelatedPosts } from "@/lib/blog";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
  title: `${post.title} | YouTube Thumbnail Downloader`,
  description: post.description,

  keywords: post.keywords,

  alternates: {
    canonical: `https://youtubethumbnails-downloader.com/blog/${slug}`,
  },

  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://youtubethumbnails-downloader.com/blog/${slug}`,
    siteName: "YouTube Thumbnail Downloader",
    type: "article",

    images: [
      {
        url: "https://youtubethumbnails-downloader.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: post.title,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,

    images: [
      "https://youtubethumbnails-downloader.com/og-image.jpg",
    ],
  },
};
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = post.related
    ? getRelatedPosts(post.related)
    : [];

  return (
  <>
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          image: [
            "https://youtubethumbnails-downloader.com/og-image.jpg",
          ],
          author: {
            "@type": "Organization",
            name: "YouTube Thumbnail Downloader",
          },
          publisher: {
            "@type": "Organization",
            name: "YouTube Thumbnail Downloader",
            logo: {
              "@type": "ImageObject",
              url: "https://youtubethumbnails-downloader.com/android-chrome-512x512.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://youtubethumbnails-downloader.com/blog/${slug}`,
          },
        }),
      }}
    />
    <Script
  id="breadcrumb-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://youtubethumbnails-downloader.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://youtubethumbnails-downloader.com/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `https://youtubethumbnails-downloader.com/blog/${slug}`,
        },
      ],
    }),
  }}
/>

    <main className="min-h-screen bg-slate-100">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-16 shadow-sm">

        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-gray-700 transition hover:text-black"
          aria-label="Back"
        >
          <ArrowLeft size={30} />
        </Link>

        <h1 className="text-5xl font-extrabold text-gray-900">
          {post.title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          {post.description}
        </p>

        {post.sections.length > 0 && (
          <div className="mt-12 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-3xl font-bold text-gray-900">
                  {section.heading}
                </h2>

                <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        )}

        {post.faq.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="mt-8 space-y-6">
              {post.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-gray-200 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.question}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">
            Related Keywords
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {post.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t pt-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Related Articles
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="rounded-xl border border-gray-200 p-6 transition hover:border-blue-500 hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {related.title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {related.description}
                  </p>

                  <span className="mt-4 inline-block font-semibold text-blue-600">
                    Read Article →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
        </main>
  </>
  );
}