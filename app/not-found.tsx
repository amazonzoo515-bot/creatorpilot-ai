import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-7xl font-extrabold text-gray-900">
          404
        </h1>

        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}