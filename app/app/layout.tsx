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
const ogImageUrl =
  "https://youtubethumbnails-downloader.com/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "YouTube Thumbnail Downloader - Download HD Thumbnails Free",
    template: "%s | YouTube Thumbnail Downloader",
  },

  description:
    "Free YouTube thumbnail downloader. Paste a link to save thumbnails in HD (1280x720), SD, HQ and MQ. Also works for Shorts, Vimeo, TikTok and more. No sign-up.",

  keywords: [
    "YouTube Thumbnail Downloader",
    "Download YouTube Thumbnail",
    "YouTube Thumbnail Grabber",
    "YouTube Thumbnail HD",
    "YouTube Thumbnail Downloader 1280x720",
    "YouTube Thumbnail URL",
    "YouTube Shorts Thumbnail Downloader",
    "Free YouTube Thumbnail Downloader Online",
    "Video Thumbnail Downloader",
    "TikTok Thumbnail Downloader",
    "Vimeo Thumbnail Downloader",
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
  category: "technology",

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
    title: "YouTube Thumbnail Downloader: HD & Max Resolution, Free",

    description:
      "Paste a YouTube link and download its thumbnail in HD (1280x720), SD, HQ or MQ. Free, no sign-up, works on phone and desktop.",

    url: "/",
    siteName,
    locale: "en_US",
    type: "website",

    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "YouTube Thumbnail Downloader",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "YouTube Thumbnail Downloader: HD & Max Resolution, Free",

    description:
      "Paste a YouTube link and download its thumbnail in HD (1280x720), SD, HQ or MQ. Free, no sign-up.",

    images: [ogImageUrl],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
      <body className="flex min-h-full flex-col bg-slate-100 text-gray-900">
        <Header />

        <div className="flex-1">{children}</div>

        <Footer />

        <Analytics />

        <GoogleAnalytics gaId="G-9QTZ25R4P4" />

        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
        >
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){
                (c[a].q=c[a].q||[]).push(arguments)
              };
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
