import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
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

    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-16 shadow-sm">

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

      </article>
    </main>
  );
}