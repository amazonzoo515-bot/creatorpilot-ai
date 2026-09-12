import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo + Title */}
        <Link
          href="/"
          aria-label="YouTube Thumbnail Downloader Home"
          className="flex items-center gap-3"
        >
          <Image
            src="/web-app-manifest-192x192.png"
            alt="YouTube Thumbnail Downloader"
            width={42}
            height={42}
            priority
            sizes="42px"
          />

          <div>
            <h2 className="text-xl font-bold text-black">
              YouTube Thumbnail Downloader
            </h2>
          </div>
        </Link>
      </div>
    </header>
  );
}