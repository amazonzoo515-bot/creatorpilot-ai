import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Terms & Conditions for YouTube Thumbnail Downloader.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl bg-white p-10 shadow-sm">

          <Link
            href="/"
            className="mb-8 inline-block text-3xl font-bold text-gray-700 transition hover:text-black"
            aria-label="Back to Home"
          >
            ←
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Terms & Conditions
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            By using YouTube Thumbnail Downloader, you agree to the following
            terms and conditions. Please read them carefully before using our
            website.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Use of the Service
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            This website is provided for personal and educational use. Users are
            responsible for ensuring they comply with YouTube's Terms of Service
            and all applicable copyright laws.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Intellectual Property
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            All trademarks, logos and brand names belong to their respective
            owners. This website does not claim ownership of any third-party
            content.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Disclaimer
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            This tool is provided "as is" without warranties of any kind. We are
            not responsible for any misuse of this website.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-gray-900">
            Changes to These Terms
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            We may update these Terms & Conditions at any time without prior
            notice. Continued use of the website means you accept the updated
            terms.
          </p>

          <p className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
            Last updated: July 2026
          </p>

        </div>
      </section>
    </main>
  );
}