import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://youtubethumbnails-downloader.com";
const PAGE_URL = `${SITE_URL}/contact`;
const CONTACT_EMAIL = "support@youtubethumbnails-downloader.com";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact YouTube Thumbnail Downloader by email for bug reports, feature requests, copyright notices, advertising or questions about the Chrome extension.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact YouTube Thumbnail Downloader",
    description: "Email us for support, bug reports, feature ideas or copyright questions.",
    url: "/contact",
    type: "website",
  },
};

const topics = [
  {
    title: "A thumbnail won't download",
    subject: "Bug report",
    text: "Include the video link you pasted, the size you clicked and your browser and device (for example Chrome on Android).",
  },
  {
    title: "Feature request",
    subject: "Feature request",
    text: "Tell us what you were trying to do and which tool would help. Many of our features started as user emails.",
  },
  {
    title: "Chrome extension help",
    subject: "Chrome extension",
    text: "Tell us your Chrome version and what happens when you click the Thumbnail button or the extension icon.",
  },
  {
    title: "Copyright or removal request",
    subject: "Copyright notice",
    text: "We don't host thumbnails; they load from the original platform. If you believe something on our site infringes your rights, send the page URL and details and we will respond promptly.",
  },
  {
    title: "Advertising or partnerships",
    subject: "Partnership",
    text: "For sponsorships, tool integrations or other business enquiries, tell us about your company and idea.",
  },
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › Contact Us
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Contact Us</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">
        The fastest way to reach us is by email. We read every message and usually reply within 1–2 business days.
      </p>

      <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Email</p>
        <a
          href={mailto("Question about YouTube Thumbnail Downloader")}
          className="mt-1 block break-all text-xl font-bold text-slate-900 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        <a
          href={mailto("Question about YouTube Thumbnail Downloader")}
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Send us an email
        </a>
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">What can we help with?</h2>
        <p className="text-slate-600">Pick a topic to open an email with the subject already filled in.</p>
        <ul className="space-y-3">
          {topics.map((t) => (
            <li key={t.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <a href={mailto(t.subject)} className="font-semibold text-indigo-700 hover:underline">
                {t.title}
              </a>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold text-slate-900">Before you write</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Max Resolution missing?</strong> Some videos, mostly older or low-resolution uploads, simply don&apos;t
            have a 1280×720 thumbnail. Use the next largest size shown.
          </li>
          <li>
            <strong>Private or deleted video?</strong> Thumbnails of private, deleted or age-restricted videos may not be
            available to anyone.
          </li>
          <li>
            <strong>Need a different size?</strong> Use the{" "}
            <Link href="/youtube-thumbnail-resizer" className="text-indigo-700 underline">
              thumbnail resizer
            </Link>{" "}
            or check the{" "}
            <Link href="/youtube-thumbnail-size" className="text-indigo-700 underline">
              YouTube thumbnail size guide
            </Link>
            .
          </li>
        </ul>
      </section>

      <p className="mt-12 text-sm text-slate-500">
        We will never ask for your YouTube password. YouTube Thumbnail Downloader is not affiliated with YouTube or
        Google LLC.
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ContactPage",
                "@id": `${PAGE_URL}#webpage`,
                url: PAGE_URL,
                name: "Contact YouTube Thumbnail Downloader",
                inLanguage: "en",
                isPartOf: { "@id": `${SITE_URL}/#website` },
                about: { "@id": `${SITE_URL}/#organization` },
              },
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "CreatorPilot",
                url: SITE_URL,
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: CONTACT_EMAIL,
                  availableLanguage: ["English"],
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "Contact Us", item: PAGE_URL },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
