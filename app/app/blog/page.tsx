import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "How to Download YouTube Thumbnails in HD Quality",
      slug: "#",
      description:
        "Learn how to download YouTube thumbnails in HD, HQ and Max Resolution for free.",
    },
    {
      title: "Best YouTube Thumbnail Size for More Clicks",
      slug: "#",
      description:
        "Discover the perfect YouTube thumbnail size and improve your video's click-through rate.",
    },
    {
      title: "How to Create Viral YouTube Thumbnails",
      slug: "#",
      description:
        "Simple tips and strategies to design eye-catching YouTube thumbnails that attract more viewers.",
    },
    {
      title: "YouTube Thumbnail SEO Guide",
      slug: "#",
      description:
        "Everything you need to know about YouTube thumbnail optimization for better visibility.",
    },
    {
      title: "How to Download YouTube Shorts Thumbnails",
      slug: "#",
      description:
        "Download thumbnails from YouTube Shorts in high quality within seconds.",
    },
    {
      title: "Max Resolution vs HD Thumbnail: What's the Difference?",
      slug: "#",
      description:
        "Compare YouTube thumbnail resolutions and choose the best quality for your needs.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-5xl font-extrabold text-gray-900">
          YouTube Thumbnail Blog
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          Learn everything about YouTube thumbnails, YouTube SEO, thumbnail
          design, click-through rate optimization, and content creation.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {post.title}
              </h2>

              <p className="mt-4 text-gray-600">
                {post.description}
              </p>

              <Link
                href={post.slug}
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