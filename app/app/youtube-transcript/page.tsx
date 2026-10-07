import type { Metadata } from "next";
import Link from "next/link";

import TranscriptTool from "./TranscriptTool";

const pageUrl =
  "https://youtubethumbnails-downloader.com/youtube-transcript";

export const metadata: Metadata = {
  title: {
    absolute:
      "YouTube Transcript Generator: Free Video to Text",
  },

  description:
    "Paste a YouTube link and get the video's transcript as text. Switch language, show timestamps, copy it or download a .txt file. Free, no sign-up.",

  alternates: {
    canonical: "/youtube-transcript",
  },

  openGraph: {
    title: "YouTube Transcript Generator: Free Video to Text",
    description:
      "Get the transcript of any YouTube video that has captions. Copy it or download it as a text file.",
    url: "/youtube-transcript",
    type: "website",
  },
};

const faqItems = [
  {
    question: "How do I get the transcript of a YouTube video?",
    answer:
      "Copy the video's link, paste it into the box above and press Get Transcript. The text appears below the video thumbnail, and you can copy it or download it as a .txt file.",
  },
  {
    question: "Does this work on videos without captions?",
    answer:
      "No. The transcript comes from the captions YouTube already has for the video, either uploaded by the creator or generated automatically. If a video has no captions, there's nothing to show, and this tool doesn't turn audio into text on its own.",
  },
  {
    question: "Can I see timestamps in the transcript?",
    answer:
      "Yes. Switch Timestamps to ON and every line gets the time it starts. The Copy and Download buttons follow whichever mode is active.",
  },
  {
    question: "Why does a video show an error?",
    answer:
      "The usual reasons are that captions are turned off, the video is private, deleted or restricted in some regions, or YouTube is limiting requests for a few minutes. Try again later or test another video.",
  },
  {
    question: "Which language will the transcript be in?",
    answer:
      "It starts in the video's own caption language, which is usually the language it was spoken in. A Language list above the text lets you switch to another language.",
  },
  {
    question: "Can I translate a YouTube transcript into another language?",
    answer:
      "Yes. Pick a language from the list after the transcript loads. If the creator uploaded captions in that language you get those. Otherwise the text is translated automatically, so the wording can be rough, especially when the original captions were auto-generated. Very long videos may be too long to translate.",
  },
  {
    question: "Can I reuse a transcript in my own content?",
    answer:
      "A transcript is the creator's words, so it stays their copyright. It's fine for reading, notes, research and accessibility. Ask for permission before you republish it or sell it.",
  },
];

export default function YouTubeTranscriptPage() {
  return (
    <>
      <div className="min-h-screen bg-slate-100">
        <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              YouTube Transcript Generator
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Paste a YouTube link and get the video's
              transcript as plain text, next to its thumbnail.
              Copy it, turn timestamps on, or download it as a
              .txt file. It's free and there's no sign-up.
            </p>
          </div>

          <div className="mt-12">
            <TranscriptTool />
          </div>

          <section className="mx-auto mt-20 max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How to Get a YouTube Video Transcript
            </h2>

            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-gray-600">
              <li>
                Open the video on YouTube and copy its link
                from the address bar or the Share button.
              </li>
              <li>
                Paste the link into the box at the top of this
                page and press Get Transcript.
              </li>
              <li>
                Read the text, switch timestamps on if you need
                them, then copy it or download the .txt file.
              </li>
            </ol>

            <p className="mt-6 leading-8 text-gray-600">
              Normal watch links, youtu.be short links and
              YouTube Shorts links all work. You can also paste
              the 11-character video ID on its own.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              What People Use a Video Transcript For
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              Most people want to skim a long video without
              watching all of it, pull out a quote, or keep notes
              from a lecture or tutorial. Creators use transcripts
              to write blog posts and show notes from their own
              videos, and to check captions for mistakes.
              Researchers and students search the text for the
              moment a topic comes up.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              When a Transcript Isn't Available
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              A transcript only exists when the video has
              captions. If the creator switched them off, or
              YouTube hasn't generated automatic ones yet (this
              often happens right after an upload), you'll see
              an error instead of text. Private, deleted and
              region-locked videos don't work either.
            </p>

            <h3 className="mt-10 text-2xl font-bold text-gray-900">
              Need the Video's Thumbnail Too?
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              The thumbnail shown with each transcript is a
              preview. For the full-size file in HD, SD, HQ and
              other sizes, paste the same link into the{" "}
              <Link
                href="/"
                className="font-medium text-red-600 underline underline-offset-2 hover:text-red-700"
              >
                YouTube Thumbnail Downloader
              </Link>
              .
            </p>
          </section>

          <section className="mx-auto mt-16 max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {faqItems.map((item) => (
                <article key={item.question}>
                  <h3 className="text-lg font-bold leading-7 text-gray-900">
                    {item.question}
                  </h3>

                  <p className="mt-2 leading-7 text-gray-600">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "YouTube Transcript Generator",
            url: pageUrl,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            browserRequirements:
              "Requires JavaScript and a modern HTML5-compatible browser.",
            description:
              "Free online tool that fetches the transcript of a YouTube video from its captions, with optional timestamps and a text download.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    </>
  );
}