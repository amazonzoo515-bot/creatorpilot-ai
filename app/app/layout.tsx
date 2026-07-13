import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "YouTube Thumbnail Downloader - Download HD, HQ & Max Resolution Thumbnails",
    template: "%s | YouTube Thumbnail Downloader",
  },

  description:
    "Download YouTube thumbnails in Max Resolution, HD, HQ, MQ, SD and Default quality. Paste any public YouTube video URL and instantly download high-quality thumbnail images.",

  keywords: [
    "YouTube Thumbnail Downloader",
    "Download YouTube Thumbnail",
    "HD Thumbnail Downloader",
    "YouTube Thumbnail HD",
    "Max Resolution Thumbnail",
    "HQ Thumbnail",
    "MQ Thumbnail",
    "SD Thumbnail",
    "Thumbnail Grabber",
    "YouTube Image Downloader",
    "Download Thumbnail",
    "YouTube Tools",
  ],

  authors: [
    {
      name: "YouTube Thumbnail Downloader",
      url: "https://youtubethumbnails-downloader.com",
    },
  ],

  creator: "YouTube Thumbnail Downloader",

  publisher: "YouTube Thumbnail Downloader",

  metadataBase: new URL("https://youtubethumbnails-downloader.com"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title:
      "YouTube Thumbnail Downloader - Download HD, HQ & Max Resolution Thumbnails",
    description:
      "Download YouTube thumbnails in Max Resolution, HD, HQ, MQ, SD and Default quality instantly.",
    url: "https://youtubethumbnails-downloader.com",
    siteName: "YouTube Thumbnail Downloader",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "YouTube Thumbnail Downloader - Download HD, HQ & Max Resolution Thumbnails",
    description:
      "Download YouTube thumbnails instantly in Max Resolution, HD, HQ, MQ, SD and Default quality.",
  },

  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}