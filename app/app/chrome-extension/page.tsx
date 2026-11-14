import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://youtubethumbnails-downloader.com";
const PAGE_URL = `${SITE_URL}/chrome-extension`;
const CONTACT_EMAIL = "support@youtubethumbnails-downloader.com";

// Set to true once the Chrome Web Store listing is approved and public.
const EXTENSION_LIVE = false;
const STORE_URL = "https://chromewebstore.google.com/detail/elpelnjaakhopdnmbhlmfejlnlkkklah";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader Chrome Extension (Free)",
  description:
    "Free Chrome extension to download YouTube thumbnails in one click. Adds a Thumbnail button under every video, works on Shorts, saves HD 1280x720. No data collected.",
  alternates: { canonical: "/chrome-extension" },
  openGraph: {
    title: "YouTube Thumbnail Downloader Chrome Extension",
    description:
      "Download any YouTube thumbnail in HD straight from the video page. Free, no account, no data collected.",
    url: "/chrome-extension",
    type: "website",
  },
};

const features = [
  {
    title: "Thumbnail button under every video",
    text: "A Thumbnail button appears below the video title on YouTube. Click it to see the preview and every available size.",
  },
  {
    title: "Works on YouTube Shorts",
    text: "On Shorts, a small floating button gives you the same thumbnail menu.",
  },
  {
    title: "Best quality in one click",
    text: "The extension checks which sizes exist and downloads the largest one first: Max Resolution 1280×720, then SD, HQ, MQ and default.",
  },
  {
    title: "Right-click download",
    text: "Right-click a YouTube video link or page and choose “Download YouTube thumbnail (best quality)”.",
  },
  {
    title: "Popup for any link",
    text: "Paste any YouTube link into the toolbar popup to download a thumbnail, copy its image or copy its URL.",
  },
  {
    title: "Private and lightweight",
    text: "No account, no analytics, no tracking. The extension only talks to YouTube's own image server.",
  },
];

const steps = [
  "Click Add to Chrome and confirm.",
  "Open any YouTube video or Short.",
  "Click the Thumbnail button under the title (or the floating button on Shorts).",
  "Pick a size and click Download. The image is saved as youtube-thumbnail-[video-id]-[size].jpg.",
];

const faqs = [
  {
    q: "Is the YouTube thumbnail Chrome extension free?",
    a: "Yes. It's completely free, with no account, no ads inside the extension and no limits.",
  },
  {
    q: "Does the extension collect my data?",
    a: "No. It doesn't collect, store or send any personal data or browsing history. Read the full privacy policy for details.",
  },
  {
    q: "What permissions does it need and why?",
    a: "“downloads” to save the image you choose, “contextMenus” for the right-click option, and access to youtube.com and i.ytimg.com to show the button and load thumbnails.",
  },
  {
    q: "Does it work in Edge, Brave or Opera?",
    a: "Yes. Microsoft Edge, Brave and Opera can install extensions from the Chrome Web Store.",
  },
  {
    q: "Why is Max Resolution missing for some videos?",
    a: "Some videos, especially older or low-resolution uploads, don't have a 1280×720 thumbnail. The extension then offers the next largest size.",
  },
  {
    q: "Do I need the extension to download thumbnails?",
    a: "No. You can always paste a link into the online YouTube thumbnail downloader. The extension just saves a step when you're already on YouTube.",
  },
];

function InstallButton() {
  if (EXTENSION_LIVE) {
    return (
      <a
        href={`${STORE_URL}?utm_source=site&utm_medium=extension_page`}
        target="_blank"
        rel="noopener"
        className="inline-block rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-indigo-700"
      >
        Add to Chrome – it&apos;s free
      </a>
    );
  }
  return (
    <div className="inline-block rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-900">
      The extension is in review on the Chrome Web Store and will be available here soon. Meanwhile, use the{" "}
      <Link href="/" className="font-semibold underline">
        online thumbnail downloader
      </Link>
      .
    </div>
  );
}

export default function ChromeExtensionPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › Chrome Extension
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        YouTube Thumbnail Downloader Chrome Extension
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">
        Download any YouTube thumbnail in HD without leaving the video. The free CreatorPilot extension adds a
        Thumbnail button under every video and Short, so the 1280×720 image is one click away.
      </p>
      <div className="mt-6">
        <InstallButton />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Features</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to use it</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 leading-relaxed">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Extension or website?</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse overflow-hidden rounded-xl bg-white text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3"> </th>
                <th className="px-4 py-3">Chrome extension</th>
                <th className="px-4 py-3">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-3 font-medium">Best for</td>
                <td className="px-4 py-3">Saving thumbnails while you browse YouTube</td>
                <td className="px-4 py-3">Phones, tablets and any browser</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Copy/paste a link</td>
                <td className="px-4 py-3">Not needed</td>
                <td className="px-4 py-3">Yes</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Other platforms</td>
                <td className="px-4 py-3">YouTube only</td>
                <td className="px-4 py-3">YouTube, Vimeo, TikTok, Dailymotion, Facebook, X, Bilibili</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Resize to 1280×720 / 4K</td>
                <td className="px-4 py-3">Opens the resizer</td>
                <td className="px-4 py-3">
                  <Link href="/youtube-thumbnail-resizer" className="text-indigo-700 underline">
                    Built in
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-6 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg font-semibold text-slate-900">{f.q}</h3>
              <p className="mt-1 leading-relaxed text-slate-700">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600">
          Read the{" "}
          <Link href="/privacy" className="text-indigo-700 underline">
            extension privacy policy
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Chrome%20extension`} className="text-indigo-700 underline">
            {CONTACT_EMAIL}
          </a>{" "}
          for help.
        </p>
      </section>

      <p className="mt-12 text-sm text-slate-500">
        Not affiliated with, endorsed by or sponsored by YouTube or Google LLC. YouTube and Chrome are trademarks of
        Google LLC.
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                name: "CreatorPilot – Thumbnail Downloader for YouTube",
                applicationCategory: "BrowserApplication",
                operatingSystem: "Chrome, Edge, Brave, Opera",
                url: PAGE_URL,
                ...(EXTENSION_LIVE ? { downloadUrl: STORE_URL, installUrl: STORE_URL } : {}),
                description:
                  "Free browser extension that adds a Thumbnail button to YouTube videos and Shorts to download thumbnails in HD.",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: { "@type": "Organization", name: "CreatorPilot", url: SITE_URL },
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "Chrome Extension", item: PAGE_URL },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
