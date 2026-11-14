import Link from "next/link";

const toolLinks = [
  { href: "/", label: "YouTube Thumbnail Downloader" },
  { href: "/youtube-thumbnail-resizer", label: "Thumbnail Resizer" },
  { href: "/youtube-thumbnail-size", label: "Thumbnail Size Guide" },
  { href: "/chrome-extension", label: "Chrome Extension" },
];

const guideLinks = [
  { href: "/youtube-shorts-thumbnail-size", label: "Shorts Thumbnail Size" },
  { href: "/youtube-banner-size", label: "YouTube Banner Size" },
  { href: "/youtube-profile-picture-size", label: "Profile Picture Size" },
  { href: "/download-youtube-thumbnail-on-phone", label: "Download on iPhone/Android" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-900">YouTube Thumbnail Downloader</h2>
          <p className="mt-2 max-w-md text-sm text-gray-600 md:max-w-sm">
            Download YouTube thumbnails in HD, SD, HQ, MQ and Max Resolution, resize images to 1280×720 or 4K, and
            check every YouTube image size. Free, by CreatorPilot.
          </p>
        </div>

        <nav aria-label="Tools" className="text-center md:text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Tools</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {toolLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gray-900 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Guides" className="text-center md:text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Guides</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {guideLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gray-900 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="text-center md:text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gray-900 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-gray-100 px-6 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} YouTube Thumbnail Downloader by CreatorPilot. Not affiliated with YouTube or
        Google LLC.
      </div>
    </footer>
  );
}
