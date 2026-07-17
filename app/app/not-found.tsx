import Link from "next/link";

export default function NotFound() {
  return (
    <main
  role="main"
  className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
>
      <h1 className="text-6xl font-bold text-black">404</h1>

      <h2 className="mt-4 text-3xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
  href="/"
  aria-label="Go back to the homepage"
  className="mt-8 rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
>
  Go Home
</Link>
    </main>
  );
}