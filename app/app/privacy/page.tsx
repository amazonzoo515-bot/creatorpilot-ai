import type { Metadata } from "next";

const SITE_URL = "https://youtubethumbnails-downloader.com";
const CONTACT_EMAIL = "support@youtubethumbnails-downloader.com";
const LAST_UPDATED = "November 12, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | CreatorPilot Thumbnail Downloader Extension",
  description:
    "Privacy policy for the CreatorPilot Thumbnail Downloader browser extension. The extension does not collect, store, sell or share any personal data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "Summary",
    body: (
      <p>
        The CreatorPilot – Thumbnail Downloader for YouTube browser extension does not collect, store, sell or share
        any personal data. Everything the extension does happens inside your own browser.
      </p>
    ),
  },
  {
    heading: "What the extension does",
    body: (
      <p>
        The extension adds a Thumbnail button to YouTube video pages, a popup window and a right-click menu option.
        These let you download or copy the thumbnail image of a YouTube video in the size you choose.
      </p>
    ),
  },
  {
    heading: "Data we do not collect",
    body: (
      <>
        <p>The extension does not collect or send to us or to anyone else:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Personal information such as your name, email address or age</li>
          <li>Your browsing history or the pages you visit</li>
          <li>Your clicks, keystrokes or other activity</li>
          <li>Your location or IP address</li>
          <li>Any passwords, payment details or messages</li>
        </ul>
        <p>The extension has no analytics, no tracking code and no user accounts.</p>
      </>
    ),
  },
  {
    heading: "How the extension works with your data",
    body: (
      <ul className="list-disc space-y-1 pl-6">
        <li>
          To show thumbnails, the extension reads the video ID from the address of the YouTube tab you have open. This
          happens only in your browser and the ID is never saved or sent to us.
        </li>
        <li>
          Thumbnail images are loaded directly from YouTube&apos;s image server (i.ytimg.com), operated by Google. That
          request is handled by Google under Google&apos;s own privacy policy.
        </li>
        <li>
          Downloaded images are saved by your browser to your computer. Copied images and links go to your clipboard.
          We never receive them.
        </li>
      </ul>
    ),
  },
  {
    heading: "Permissions the extension uses",
    body: (
      <ul className="list-disc space-y-1 pl-6">
        <li>
          <strong>downloads</strong>: to save the thumbnail image you choose to your computer.
        </li>
        <li>
          <strong>contextMenus</strong>: to add the &quot;Download YouTube thumbnail&quot; option to the right-click
          menu.
        </li>
        <li>
          <strong>Access to youtube.com</strong>: to show the Thumbnail button on video pages and read the video ID of
          the open tab.
        </li>
        <li>
          <strong>Access to i.ytimg.com</strong>: to check which thumbnail sizes exist and to fetch the image you
          download or copy.
        </li>
      </ul>
    ),
  },
  {
    heading: "Our website",
    body: (
      <p>
        When you install or uninstall the extension, or click one of its links, our website ({SITE_URL.replace("https://", "")})
        opens in a new tab. That visit is a normal website visit. Our hosting provider, Cloudflare, may process
        standard technical data such as your IP address to deliver and protect the website.
      </p>
    ),
  },
  {
    heading: "Children",
    body: (
      <p>The extension is not directed at children under 13 and does not knowingly collect data from anyone.</p>
    ),
  },
  {
    heading: "Changes to this policy",
    body: (
      <p>
        If the extension ever starts handling data differently, we will update this page and the date below before the
        change takes effect.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: (
      <p>
        Questions about this policy? Email{" "}
        <a className="text-indigo-600 underline hover:text-indigo-800" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-lg text-slate-600">CreatorPilot – Thumbnail Downloader for YouTube (browser extension)</p>
      <p className="mt-1 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-8">
        {sections.map(({ heading, body }) => (
          <section key={heading} className="space-y-3 leading-relaxed">
            <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
            {body}
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-slate-500">
        CreatorPilot is not affiliated with, endorsed by or sponsored by YouTube or Google LLC. YouTube is a trademark of
        Google LLC.
      </p>
    </main>
  );
}