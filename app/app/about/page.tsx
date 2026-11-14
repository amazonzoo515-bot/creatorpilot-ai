import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://youtubethumbnails-downloader.com";
const PAGE_URL = `${SITE_URL}/about`;
const CONTACT_EMAIL = "support@youtubethumbnails-downloader.com";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About YouTube Thumbnail Downloader by CreatorPilot: free, private tools that help creators download, resize and check YouTube thumbnails. No sign-up, no uploads.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About YouTube Thumbnail Downloader",
    description:
      "Who builds YouTube Thumbnail Downloader, what the tools do and how we keep them free and private.",
    url: "/about",
    type: "website",
  },
};

const principles = [
  {
    title: "Free, with no sign-up",
    text: "Every tool on this site works without an account, an email address or a watermark. Small ads help pay for hosting.",
  },
  {
    title: "Private by design",
    text: "The resizer runs entirely in your browser, so your images never reach our server. Thumbnails are loaded straight from YouTube's own image server.",
  },
  {
    title: "Accurate sizes",
    text: "Thumbnail sizes and upload limits are checked against YouTube Help and updated when YouTube changes them. Each guide shows the date it was last checked.",
  },
  {
    title: "Fast on any device",
    text: "The tools are built to load quickly on phones and slow connections, and they work the same on iPhone, Android, Windows and Mac.",
  },
];

const tools = [
  {
    href: "/",
    name: "YouTube Thumbnail Downloader",
    text: "Paste a YouTube, Shorts, Vimeo, TikTok, Dailymotion, Facebook, X or Bilibili link and save every thumbnail size the video has.",
  },
  {
    href: "/youtube-thumbnail-resizer",
    name: "YouTube Thumbnail Resizer",
    text: "Turn any image into a 1280×720 or 4K thumbnail, keep it under the upload limit and preview how it looks small.",
  },
  {
    href: "/youtube-thumbnail-size",
    name: "YouTube Thumbnail Size Guide",
    text: "Every YouTube image size in one place: video and Shorts thumbnails, banners, profile pictures and file limits.",
  },
  {
    href: "/chrome-extension",
    name: "Chrome Extension",
    text: "Download a thumbnail right from the YouTube video page with one click.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › About Us
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        About YouTube Thumbnail Downloader
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">
        YouTube Thumbnail Downloader is a set of free tools for YouTube creators, designers, teachers and marketers.
        It is built and run by <strong>CreatorPilot</strong>, an independent developer project focused on small,
        fast tools that do one job well.
      </p>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold text-slate-900">Why we built it</h2>
        <p>
          Getting the thumbnail of a YouTube video should take seconds, but most sites hide the download behind
          pop-ups, sign-ups or fake buttons. We wanted a clean page where you paste a link and immediately see every
          size YouTube stores for that video, labeled with its real pixel size.
        </p>
        <p>
          Creators then asked for the next step: resizing their own pictures to the exact size YouTube wants and
          keeping the file under the upload limit. That became the thumbnail resizer, followed by the size guide and
          the Chrome extension.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">How we work</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Our tools</h2>
        <ul className="space-y-3">
          {tools.map((t) => (
            <li key={t.href} className="rounded-xl border border-slate-200 bg-white p-5">
              <Link href={t.href} className="font-semibold text-indigo-700 hover:underline">
                {t.name}
              </Link>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold text-slate-900">Using thumbnails responsibly</h2>
        <p>
          Thumbnails belong to the creators who made them. Our tools are meant for things like saving your own
          thumbnails, studying designs, writing reviews and making references. Before you reuse someone
          else&apos;s thumbnail in your own content, get their permission. See our{" "}
          <Link href="/terms" className="text-indigo-700 underline">
            Terms of Service
          </Link>{" "}
          for details.
        </p>
      </section>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold text-slate-900">Get in touch</h2>
        <p>
          Found a bug, have a feature idea or a question? Email us at{" "}
          <a className="text-indigo-700 underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{" "}
          or visit the{" "}
          <Link href="/contact" className="text-indigo-700 underline">
            contact page
          </Link>
          .
        </p>
      </section>

      <p className="mt-12 text-sm text-slate-500">
        YouTube Thumbnail Downloader is not affiliated with, endorsed by or sponsored by YouTube or Google LLC.
        YouTube is a trademark of Google LLC.
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "AboutPage",
                "@id": `${PAGE_URL}#webpage`,
                url: PAGE_URL,
                name: "About YouTube Thumbnail Downloader",
                inLanguage: "en",
                isPartOf: { "@id": `${SITE_URL}/#website` },
                about: { "@id": `${SITE_URL}/#organization` },
              },
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "CreatorPilot",
                url: SITE_URL,
                logo: `${SITE_URL}/web-app-manifest-512x512.png`,
                email: CONTACT_EMAIL,
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: CONTACT_EMAIL,
                  availableLanguage: ["English"],
                },
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "YouTube Thumbnail Downloader",
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "About Us", item: PAGE_URL },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
