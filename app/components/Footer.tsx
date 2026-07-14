import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              YouTube Thumbnail Downloader
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-600">
              Download YouTube thumbnails in HD, HQ, MQ, SD and Max Resolution
              instantly for free.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">

            <Link href="/" className="text-gray-600 hover:text-black">
              Home
            </Link>

            <Link href="/blog" className="text-gray-600 hover:text-black">
              Blog
            </Link>

            <Link href="/about" className="text-gray-600 hover:text-black">
              About
            </Link>

            <Link href="/privacy-policy" className="text-gray-600 hover:text-black">
              Privacy Policy
            </Link>

            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-black">
              Terms & Conditions
            </Link>

          </div>

        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © 2026 YouTube Thumbnail Downloader. All rights reserved.
        </div>

      </div>
    </footer>
  );
}