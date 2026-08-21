import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://youtubethumbnails-downloader.com";
const siteName = "YouTube Thumbnail Downloader";
const ogImage = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "YouTube Thumbnail",
    template: "%s | YouTube Thumbnail Downloader",
  },

  description:
    "Download YouTube thumbnails online in HD, HQ, MQ, SD and the highest available resolution. Paste a public YouTube video URL to preview and download its thumbnail instantly.",

    keywords: [
      "YouTube Thumbnail",
      "YouTube Thumbnail Downloader",
      "YouTube Thumbnail Grabber",
      "YouTube Thumbnail Image Downloader",
      "YouTube Thumbnail Viewer",
      "Download YouTube Thumbnail",
      "Download YouTube Thumbnail Image",
      "Free YouTube Thumbnail Downloader",
      "YouTube Thumbnail Downloader Online",
      "YouTube Thumbnail from URL",
      "YouTube Thumbnail URL",
      "Extract YouTube Thumbnail",
      "HD YouTube Thumbnail",
      "HQ YouTube Thumbnail",
      "MQ YouTube Thumbnail",
      "SD YouTube Thumbnail",
      "Max Resolution Thumbnail",
      "YouTube Thumbnail HD",
      "YouTube Thumbnail Full HD",
      "YouTube Thumbnail 4K",
      "YouTube HD Thumbnail Download",
      "YouTube Shorts Thumbnail",
      "YouTube Shorts Thumbnail Downloader",
      "YouTube Image Downloader",
      "Video Thumbnail Downloader",
      "Thumbnail Grabber",
      "Thumbnail Download Tool",
      "Download Thumbnail Online",
      "View YouTube Thumbnail",
      "Free YouTube Tools",
      "YouTube Tools",
      "YouTube Thumbnail Extractor",
      "YouTube Thumbnail Saver",
      "Save YouTube Thumbnail",
      "YouTube Thumbnail Download Tool",
      "YouTube Thumbnail Preview",
    ],

  authors: [
    {
      name: siteName,
      url: siteUrl,
    },
  ],

  creator: siteName,
  publisher: siteName,
  applicationName: siteName,

  verification: {
    google: "zbxUmiLJEe7CmAqc32MfkWnbvHwHJpyMkOQm_DaxFEc",
  },

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    title: "YouTube Thumbnail Downloader – HD, HQ & Max Resolution",
    description:
      "Download and preview YouTube thumbnail images in HD, HQ, MQ, SD and the highest available resolution for free.",
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "YouTube Thumbnail Downloader",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "YouTube Thumbnail Downloader – HD & Max Resolution",
    description:
      "Download YouTube thumbnails online from public video URLs in the highest available quality.",
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  alternateName: [
    "YouTube Thumbnail Downloader",
    "YouTube Thumbnail Viewer",
    "YouTube Thumbnail Grabber",
  ],
  url: siteUrl,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  description:
    "Online YouTube thumbnail downloader that lets users preview and download available thumbnail images from public YouTube video URLs.",
  image: `${siteUrl}${ogImage}`,
  publisher: {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />

        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <Analytics />

        <GoogleAnalytics gaId="G-9QTZ25R4P4" />

        <Script
          id="adsterra-social-bar"
          src="https://pl30481669.effectivecpmnetwork.com/24/b8/39/24b83957780a91c60af2b01750125c6a.js"
          strategy="afterInteractive"
        />

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);
              t.async=1;
              t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xmg1cdqpm8");
          `}
        </Script>
      </body>
    </html>
  );
}