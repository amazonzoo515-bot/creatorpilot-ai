import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        {/* Logo + Title */}
        {/* Plain <a> so clicking reloads the page and clears the tool */}
        <a
          href="/"
          aria-label="YouTube Thumbnail Downloader Home"
          className="flex items-center gap-3"
        >
          <Image
            src="/web-app-manifest-192x192.png"
            alt=""
            width={42}
            height={42}
            priority
            sizes="42px"
          />

          <span className="text-xl font-bold text-black">
            YouTube Thumbnail Downloader
          </span>
        </a>

        {/* Tools */}
        <nav aria-label="Tools">
          <ul className="flex items-center gap-5 text-sm font-semibold text-gray-700">
            <li>
              <a
                href="/"
                className="inline-block py-2 transition hover:text-red-700"
              >
                Thumbnail Downloader
              </a>
            </li>

            <li>
              <Link
                href="/youtube-thumbnail-resizer"
                className="inline-block py-2 transition hover:text-red-700"
              >
                Thumbnail Resizer
              </Link>
            </li>

            <li>
              <Link
                href="/youtube-thumbnail-size"
                className="inline-block py-2 transition hover:text-red-700"
              >
                Size Guide
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
