import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://youtubethumbnails-downloader.com";
const PAGE_URL = `${SITE_URL}/terms`;
const CONTACT_EMAIL = "support@youtubethumbnails-downloader.com";
const LAST_UPDATED = "November 14, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for YouTube Thumbnail Downloader: acceptable use, copyright of thumbnails, no warranty, limitation of liability and contact details.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. Agreement",
    body: (
      <p>
        These Terms of Service apply to youtubethumbnails-downloader.com and its tools, including the thumbnail
        downloader, the thumbnail resizer and the CreatorPilot browser extension (together, the &quot;Service&quot;),
        operated by CreatorPilot (&quot;we&quot;, &quot;us&quot;). By using the Service you agree to these terms. If you
        do not agree, please do not use the Service.
      </p>
    ),
  },
  {
    heading: "2. What the Service does",
    body: (
      <p>
        The Service shows and lets you save publicly available thumbnail images of online videos, and lets you resize
        your own images in your browser. We do not host the thumbnails; they are loaded from the original platform,
        such as YouTube&apos;s image server. Images you resize are processed on your own device and are not uploaded to
        us.
      </p>
    ),
  },
  {
    heading: "3. Copyright and acceptable use",
    body: (
      <>
        <p>
          Thumbnails are owned by the people who created them. Downloading a thumbnail does not give you any rights to
          it. You are responsible for how you use any image you save. You agree:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>to use thumbnails only where you have the right to, such as your own thumbnails, or with the owner&apos;s permission, or where the law allows (for example commentary, review or education);</li>
          <li>not to use the Service to infringe copyright, trademarks or other rights;</li>
          <li>not to use the Service for anything unlawful, misleading or harmful;</li>
          <li>not to overload, scrape, attack or interfere with the Service or try to bypass its limits.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "4. Third-party platforms",
    body: (
      <p>
        The Service works with content from third-party platforms like YouTube, Vimeo and TikTok. We are not
        affiliated with, endorsed by or sponsored by those platforms. Your use of their content is also subject to
        their own terms. YouTube is a trademark of Google LLC.
      </p>
    ),
  },
  {
    heading: "5. Ads and links",
    body: (
      <p>
        The Service is free and may show ads, including ads served by Google, and links to other websites. We are not
        responsible for the content, products or privacy practices of third-party sites or advertisers.
      </p>
    ),
  },
  {
    heading: "6. No warranty",
    body: (
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot;. We do not guarantee that it will always
        work, be error-free, or that a particular thumbnail size will be available for every video. Platforms may change
        how they store thumbnails at any time.
      </p>
    ),
  },
  {
    heading: "7. Limitation of liability",
    body: (
      <p>
        To the fullest extent allowed by law, we are not liable for any indirect, incidental or consequential damages,
        or for any loss of data, profits or content, arising from your use of the Service or of any image obtained
        through it.
      </p>
    ),
  },
  {
    heading: "8. Copyright notices",
    body: (
      <p>
        If you believe content shown through the Service infringes your rights, email{" "}
        <a className="text-indigo-700 underline" href={`mailto:${CONTACT_EMAIL}?subject=Copyright%20notice`}>
          {CONTACT_EMAIL}
        </a>{" "}
        with the page URL, a description of the work and your contact details. We will review and respond promptly.
      </p>
    ),
  },
  {
    heading: "9. Privacy",
    body: (
      <p>
        How the browser extension handles data is described in our{" "}
        <Link href="/privacy" className="text-indigo-700 underline">
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    heading: "10. Changes",
    body: (
      <p>
        We may update these terms from time to time. The date below shows the latest version. Continuing to use the
        Service after a change means you accept the updated terms.
      </p>
    ),
  },
  {
    heading: "11. Contact",
    body: (
      <p>
        Questions about these terms? Email{" "}
        <a className="text-indigo-700 underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        or use our{" "}
        <Link href="/contact" className="text-indigo-700 underline">
          contact page
        </Link>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › Terms of Service
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Terms of Service</h1>
      <p className="mt-1 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-8">
        {sections.map(({ heading, body }) => (
          <section key={heading} className="space-y-3 leading-relaxed">
            <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
            {body}
          </section>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            url: PAGE_URL,
            name: "Terms of Service",
            dateModified: "2026-11-14",
            inLanguage: "en",
            isPartOf: { "@type": "WebSite", name: "YouTube Thumbnail Downloader", url: SITE_URL },
          }),
        }}
      />
    </main>
  );
}
