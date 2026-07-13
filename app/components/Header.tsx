import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/android-chrome-192x192.png"
            alt="YouTube Thumbnail Downloader"
            width={42}
            height={42}
            priority
          />

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              YouTube Thumbnail Downloader
            </h2>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-black">
            Home
          </Link>

          <Link href="/blog" className="text-gray-700 hover:text-black">
            Blog
          </Link>

          <Link href="/about" className="text-gray-700 hover:text-black">
            About
          </Link>

          <Link href="/contact" className="text-gray-700 hover:text-black">
            Contact
          </Link>
        </nav>

      </div>
    </header>
  );
}