import type { Metadata } from "next";
import Link from "next/link";

import ThumbnailResizer from "./ThumbnailResizer";

const siteUrl = "https://youtubethumbnails-downloader.com";
const pageUrl = `${siteUrl}/youtube-thumbnail-resizer`;

export const metadata: Metadata = {
  title: {
    absolute:
      "YouTube Thumbnail Resizer: 1280x720 or 4K, Under 2MB (Free)",
  },

  description:
    "Free YouTube thumbnail resizer. Resize any image to 1280x720 or 4K (3840x2160), keep it under 2MB, and make Shorts or custom sizes. No upload.",

  alternates: {
    canonical: "/youtube-thumbnail-resizer",
  },

  openGraph: {
    title: "YouTube Thumbnail Resizer: 1280x720 or 4K, Under 2MB",
    description:
      "Resize an image to the right YouTube thumbnail size, shrink it under 2MB and preview it small. Free, private, no sign-up.",
    url: "/youtube-thumbnail-resizer",
    type: "website",
  },
};

const sizeRows = [
  {
    use: "Standard thumbnail",
    size: "1280 × 720",
    ratio: "16:9",
    note: "Works everywhere. Under 2 MB, so it uploads from a phone too.",
  },
  {
    use: "4K thumbnail",
    size: "3840 × 2160",
    ratio: "16:9",
    note: "The size YouTube Help recommends now. Computer uploads can be up to 50 MB; phone uploads stay at 2 MB.",
  },
  {
    use: "Shorts (vertical)",
    size: "2160 × 3840",
    ratio: "9:16",
    note: "YouTube Help lists this size for vertical thumbnails. Smaller 9:16 sizes such as 1080 × 1920 also work.",
  },
  {
    use: "Channel banner",
    size: "2560 × 1440",
    ratio: "16:9",
    note: "Minimum 2048 × 1152. Keep text and logos inside the central safe area of about 1546 × 423 px. File up to 6 MB.",
  },
  {
    use: "Profile picture",
    size: "800 × 800",
    ratio: "1:1",
    note: "YouTube shows it as a circle, so keep the subject centred with room around the edges.",
  },
];

const faqItems = [
  {
    question: "What size should a YouTube thumbnail be?",
    answer:
      "The classic size is 1280 × 720 pixels at 16:9, and it still works everywhere. YouTube Help now recommends 3840 × 2160 (4K) at the same 16:9 ratio. The minimum width is 640 pixels, and the file must be a JPG or PNG. Pick 1280 × 720 for safe, small files or 4K for the sharpest result on big screens.",
  },
  {
    question: "What is the YouTube thumbnail file size limit?",
    answer:
      "Uploads from a phone are limited to 2 MB, and uploads from a computer can be larger (up to 50 MB according to YouTube Help). Keeping the file under 2 MB works on every device, which is why this tool defaults to that.",
  },
  {
    question: "How do I make my YouTube thumbnail under 2MB?",
    answer:
      "Resize it to 1280 × 720 and save it as a JPG. This tool lowers the JPG quality step by step until the file fits, and it shows you the final size. A PNG cannot be shrunk that way, so switch to JPG if a PNG is too big.",
  },
  {
    question: "How do I resize an image to 1280x720?",
    answer:
      "Drop your image into the tool and keep the YouTube 1280×720 option selected. Choose Crop to fill, Fit with bars or Stretch if the picture isn't 16:9, then download the result.",
  },
  {
    question: "Why does YouTube say my thumbnail is too large or won't upload it?",
    answer:
      "The usual causes are a file over the limit for your device, a picture narrower than 640 pixels, or a file type other than JPG or PNG. Resizing to 1280 × 720 and saving a JPG under 2 MB clears up almost all of these.",
  },
  {
    question: "What size is a YouTube Shorts thumbnail?",
    answer:
      "Shorts are vertical at 9:16. YouTube Help lists 2160 × 3840 as the recommended size, and 1080 × 1920 is a common smaller size. Choose Custom size here and tap a Shorts option to make either one. What you can set for Shorts inside YouTube Studio can change, so check there too.",
  },
  {
    question: "Is my image uploaded anywhere?",
    answer:
      "No. The resizing happens in your browser on your own device, and the picture isn't sent to our server. That makes it fine for thumbnails of videos you haven't published yet.",
  },
  {
    question: "Which fit option should I pick?",
    answer:
      "Crop to fill is the best choice for photos, especially with faces, because nothing gets stretched. Choose Fit with bars when you can't lose any part of the image, and use Stretch only when a small distortion doesn't matter.",
  },
  {
    question: "Does resizing make my thumbnail blurry?",
    answer:
      "Making an image smaller keeps it sharp. Making a small image bigger can make it look soft, because the tool has to invent pixels. If your image is narrower than the output size, the tool tells you so.",
  },
  {
    question: "Does it work on a phone, and is it free?",
    answer:
      "Yes to both. It runs in any modern mobile browser, there is no sign-up and no watermark. Some iPhone HEIC photos won't open in every browser, so convert those to JPG first.",
  },
  {
    question: "Can I resize any image, not just a YouTube thumbnail?",
    answer:
      "Yes. Choose Custom size, type any width and height from 16 to 4000 pixels, and download a JPG, PNG, WebP or BMP. You can crop, add bars or stretch, and set a file-size limit for JPG and WebP. It works for website images, social posts, store photos and forms that ask for a certain size.",
  },
  {
    question: "How do I resize an image to under 100 KB (or any size in KB)?",
    answer:
      "Choose Custom size, tick Keep the file under a size limit, enter the number of KB (for example 100), and pick JPG or WebP. The tool lowers the quality until the file fits. If a very large photo still won't fit, make its width and height smaller as well, because fewer pixels means a smaller file.",
  },
  {
    question: "What size is a YouTube channel banner?",
    answer:
      "2560 × 1440 pixels, with a minimum of 2048 × 1152 and a file size up to 6 MB. Only the middle part (about 1546 × 423 pixels) is visible on every device, so keep text and logos inside it.",
  },
  {
    question: "Why is my YouTube banner cut off?",
    answer:
      "YouTube shows different parts of the banner on phones, tablets, computers and TVs. Anything outside the central safe area of about 1546 × 423 pixels can be cropped. Resize to 2560 × 1440 and keep important content in the middle.",
  },
  {
    question: "What size is a YouTube profile picture?",
    answer:
      "800 × 800 pixels is the recommended size. YouTube displays it as a circle, so keep the face or logo in the centre. Pick the 800 × 800 profile picture card under Custom size.",
  },
  {
    question: "Do I need a verified account to add a custom thumbnail?",
    answer:
      "Yes. YouTube asks you to verify your account (usually with a phone number) before you can upload custom thumbnails. You can do it in YouTube Studio.",
  },
  {
    question: "Can I resize several images at once?",
    answer:
      "Not at the moment. The tool handles one image at a time. Drop in the next image when you finish the first.",
  },
  {
    question: "Does YouTube resize thumbnails automatically?",
    answer:
      "YouTube scales thumbnails down for different screens, but it doesn't fix the shape for you. A picture that isn't 16:9 can end up cropped or surrounded by bars, so it is better to fit it yourself before uploading.",
  },
  {
    question: "Can I resize a thumbnail I downloaded from another video?",
    answer:
      "Yes. Save it with the YouTube Thumbnail Downloader, then drop the file here. Keep in mind that other people's thumbnails belong to their creators, so ask before reusing one.",
  },
];

export default function YouTubeThumbnailResizerPage() {
  return (
    <>
      <div className="min-h-screen bg-slate-100">
        <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-red-800 hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-gray-900">
                YouTube Thumbnail Resizer
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              YouTube Thumbnail Resizer
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Resize any image to the YouTube thumbnail size: 1280 × 720, or
              4K at 3840 × 2160. Get the file under 2 MB, check how it
              looks small, and save it as JPG or PNG. You can also make
              Shorts, square and custom sizes. It&apos;s free, and your image
              never leaves your browser.
            </p>
          </div>

          <div className="mt-12">
            <ThumbnailResizer />
          </div>

          <section className="mx-auto mt-20 max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <div className="rounded-xl bg-red-50 p-5">
              <h2 className="text-xl font-bold text-gray-900">
                Quick Answer
              </h2>

              <p className="mt-2 leading-7 text-gray-700">
                A YouTube thumbnail should be 1280 × 720 pixels (16:9) as a
                JPG or PNG under 2 MB, which uploads from any device.
                YouTube Help now recommends 3840 × 2160 (4K) for computer
                uploads, with files up to 50 MB and a minimum width of 640
                pixels. This free tool resizes any image to either size in
                your browser, keeps the file small and also makes custom
                sizes for Shorts, square posts and banners.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Last updated November 2026. Source:{" "}
                <a
                  href="https://support.google.com/youtube/answer/72431"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
                >
                  YouTube Help, Add video thumbnails
                </a>
                .
              </p>
            </div>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              YouTube Thumbnail Size: Quick Reference
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              These are the sizes people ask about most. The tool above can
              make every one of them: keep the YouTube 1280×720 option for
              the standard size, or choose Custom size for the rest.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-900">
                    <th scope="col" className="py-3 pr-4 font-bold">
                      Use
                    </th>
                    <th scope="col" className="py-3 pr-4 font-bold">
                      Size (px)
                    </th>
                    <th scope="col" className="py-3 pr-4 font-bold">
                      Ratio
                    </th>
                    <th scope="col" className="py-3 font-bold">
                      Notes
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-600">
                  {sizeRows.map((row) => (
                    <tr key={row.use} className="border-b border-gray-100">
                      <th
                        scope="row"
                        className="py-3 pr-4 font-semibold text-gray-900"
                      >
                        {row.use}
                      </th>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {row.size}
                      </td>
                      <td className="py-3 pr-4">{row.ratio}</td>
                      <td className="py-3 leading-6">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              For every thumbnail: minimum width 640 pixels, JPG or PNG
              file. YouTube changes these numbers now and then, so confirm
              them on YouTube Help when it matters.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              How to Resize an Image to 1280x720 for YouTube
            </h2>

            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-gray-600">
              <li>
                Drop your image into the box, choose it from your device,
                or paste a screenshot with Ctrl+V.
              </li>
              <li>
                Keep YouTube 1280×720 selected. If the picture isn&apos;t 16:9,
                pick how it should fit. For photos, Crop to fill is usually
                the right call. Slide the crop position until the important
                part is in frame.
              </li>
              <li>
                Look at the small previews to make sure text and faces still
                read clearly.
              </li>
              <li>
                Download the result as a JPG or PNG and upload it in
                YouTube Studio.
              </li>
            </ol>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              How to Get a YouTube Thumbnail Under 2MB
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Photos and busy graphics can easily pass 2 MB at full size.
              Saving as JPG is the fix, because JPG can trade a little
              quality for a much smaller file. The tool does this for you.
              It starts at high quality and lowers it step by step until
              the file fits, so you keep as much detail as possible. The
              result panel shows the final size and the quality it used. A
              PNG keeps every pixel but can&apos;t be shrunk like this, so use
              JPG when a PNG comes out too large.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              1280x720 or 4K (3840x2160)?
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Both are 16:9, so nothing is cropped when you switch. 1280 ×
              720 gives a small file that uploads from any device, which
              makes it the safe choice. 3840 × 2160 holds more detail and
              looks crisper on large screens and TVs, but the file is
              bigger, and uploads from a phone are still capped at 2 MB. If
              you upload from a computer and care about sharpness, choose
              Custom size and tap YouTube 4K thumbnail. If you ever need
              it smaller, tick the size limit box and enter 2000 KB.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              Why Is My YouTube Thumbnail Too Large or Not Uploading?
            </h2>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-gray-600">
              <li>
                The file is over the limit for your device. Phones allow 2
                MB, so shrink it below that.
              </li>
              <li>
                The picture is narrower than 640 pixels. Resize it up to
                1280 × 720.
              </li>
              <li>
                The file type isn&apos;t JPG or PNG. WebP, BMP and HEIC are not
                on YouTube&apos;s list, so convert them.
              </li>
              <li>
                The picture isn&apos;t 16:9, so YouTube crops it in ways you
                didn&apos;t plan. Fit it yourself with the options above.
              </li>
            </ul>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              Crop, Bars or Stretch?
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              A phone photo is often 4:3, and a screenshot can be almost
              any shape. To fill a 16:9 frame you have to lose something.
              Cropping trims the edges and keeps the picture natural.
              Bars keep every pixel of the original but leave empty bands
              on the sides or top and bottom. Stretching fills the frame
              without losing anything, but faces and text get squashed, so
              use it rarely.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              JPG, PNG or WebP?
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              For YouTube, use JPG or PNG, since those are the types it
              lists. JPG gives the smallest files and is right for photos.
              PNG stays perfectly sharp, which suits flat graphics and
              text, but the files are larger. WebP and BMP are under More
              formats for other uses, such as a website image, and are not
              meant for YouTube uploads.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              Check Your Thumbnail Small Before You Publish
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Most viewers see your thumbnail as a small image in search
              results, a sidebar or a phone feed. Text that looks fine at
              full size can turn to mush there. The previews under your
              result show the thumbnail at a few smaller sizes. YouTube
              also puts the video length in the bottom-right corner, so
              the badge toggle helps you keep important text out of that
              spot.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              Resize Any Image Online, Not Just Thumbnails
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              The same tool works as a free image resizer. Choose Custom
              size, type the width and height in pixels, and download.
              Your photo stays on your device the whole time. People use it
              to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-gray-600">
              <li>Resize an image to exact pixels for a website, blog or online store.</li>
              <li>Fit a photo to a social post: square, portrait, vertical or link preview.</li>
              <li>Reduce the file size of an image to a number of KB, as some forms and sites require.</li>
              <li>Convert an image between JPG, PNG, WebP and BMP.</li>
              <li>Keep proportions with Fit with bars, or fill the frame with Crop to fill.</li>
            </ul>

            <p className="mt-4 leading-8 text-gray-600">
              What it doesn&apos;t do yet: resize by percentage, use
              centimetres or inches, or process many images at once.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              Need Square, Vertical or Banner Sizes?
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Choose Custom size to enter any width and height from 16 to
              4000 pixels, or tap a ready-made shape: Shorts, Reels and
              TikTok vertical, square and portrait posts, Facebook and
              LinkedIn link previews, a YouTube channel banner or a
              profile picture. Each card previews your own image in that
              shape before you download.
            </p>

            <h2 className="mt-14 text-3xl font-bold tracking-tight text-gray-900">
              Need the Thumbnail of an Existing Video?
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              To save a video&apos;s thumbnail in HD first, paste its link into
              the{" "}
              <Link
                href="/"
                className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
              >
                YouTube Thumbnail Downloader
              </Link>
              , then bring the file here if you need to resize it.
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
            name: "YouTube Thumbnail Resizer",
            url: pageUrl,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            browserRequirements:
              "Requires JavaScript and a modern HTML5-compatible browser.",
            description:
              "Free online tool that resizes an image to 1280x720 or 4K for YouTube, keeps it under 2 MB, previews it at small sizes and exports custom sizes, all in the browser.",
            featureList: [
              "Resize to 1280x720 or 3840x2160",
              "Keep the file under 2 MB",
              "Crop, fit with bars or stretch",
              "Custom sizes for Shorts, square and banners",
              "Export as JPG, PNG, WebP or BMP",
              "Resize any image to a custom size in pixels",
              "Reduce image file size to a chosen number of KB",
              "Runs in the browser, nothing is uploaded",
            ],
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "YouTube Thumbnail Resizer: 1280x720 or 4K, Under 2MB (Free)",
            url: pageUrl,
            dateModified: "2026-11-09",
            inLanguage: "en",
            about: "Resizing images to YouTube thumbnail size and custom sizes",
            isPartOf: { "@type": "WebSite", name: "YouTube Thumbnail Downloader", url: siteUrl },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "YouTube Thumbnail Resizer",
                item: pageUrl,
              },
            ],
          }),
        }}
      />
    </>
  );
}
