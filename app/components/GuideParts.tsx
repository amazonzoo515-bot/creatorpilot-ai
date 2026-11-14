import Link from "next/link";

export const SITE_URL = "https://youtubethumbnails-downloader.com";

export type Faq = { q: string; a: string };

export function Breadcrumb({ label }: { label: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <Link href="/" className="hover:underline">
        Home
      </Link>{" "}
      › {label}
    </nav>
  );
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Frequently asked questions</h2>
      <div className="mt-6 space-y-5">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="text-lg font-semibold text-slate-900">{f.q}</h3>
            <p className="mt-1 leading-relaxed text-slate-700">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SpecTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse bg-white text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((r) => (
            <tr key={r.join("|")}>
              {r.map((c, i) => (
                <td key={i} className={i === 0 ? "px-4 py-3 font-medium" : "px-4 py-3"}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RelatedGuides({ current }: { current: string }) {
  const links = [
    { href: "/youtube-thumbnail-size", label: "YouTube Thumbnail Size (all sizes)" },
    { href: "/youtube-shorts-thumbnail-size", label: "YouTube Shorts Thumbnail Size" },
    { href: "/youtube-banner-size", label: "YouTube Banner Size" },
    { href: "/youtube-profile-picture-size", label: "YouTube Profile Picture Size" },
    { href: "/download-youtube-thumbnail-on-phone", label: "Download a YouTube Thumbnail on iPhone or Android" },
    { href: "/youtube-thumbnail-resizer", label: "YouTube Thumbnail Resizer (free tool)" },
  ].filter((l) => l.href !== current);
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-900">Related guides and tools</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-indigo-700 hover:underline">
              {l.label} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GuideJsonLd({
  url,
  headline,
  date,
  faqs,
  crumb,
  howTo,
}: {
  url: string;
  headline: string;
  date: string;
  faqs: Faq[];
  crumb: string;
  howTo?: { name: string; steps: string[] };
}) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline,
      url,
      mainEntityOfPage: url,
      datePublished: date,
      dateModified: date,
      inLanguage: "en",
      image: `${SITE_URL}/og-image.png`,
      author: { "@type": "Organization", name: "CreatorPilot", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "CreatorPilot",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/web-app-manifest-512x512.png` },
      },
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
        { "@type": "ListItem", position: 2, name: crumb, item: url },
      ],
    },
  ];
  if (howTo) {
    graph.push({
      "@type": "HowTo",
      name: howTo.name,
      step: howTo.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
