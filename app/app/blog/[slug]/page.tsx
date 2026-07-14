import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const post = blogPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <article className="rounded-2xl bg-white p-10 shadow-sm">

          <h1 className="text-5xl font-extrabold text-gray-900">
            {post.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {post.description}
          </p>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Keywords
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {post.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

        </article>
      </section>
    </main>
  );
}