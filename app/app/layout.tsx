import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
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
    default: "YouTube Thumbnail Image Downloader & Viewer",
    template: "%s | YouTube Thumbnail",
  },

  description:
    "Download and view YouTube thumbnail images in HD, HQ, MQ, SD and Max Resolution for free. Paste any YouTube video URL to instantly preview and download thumbnail images.",

  keywords: [
    "YouTube Thumbnail",
    "YouTube Thumbnail Downloader",
    "YouTube Thumbnail Image Downloader",
    "YouTube Thumbnail Viewer",
    "Download YouTube Thumbnail",
    "HD Thumbnail Downloader",
    "Max Resolution Thumbnail",
    "HQ Thumbnail",
    "MQ Thumbnail",
    "SD Thumbnail",
    "Thumbnail Grabber",
    "YouTube Image Downloader",
    "Download Thumbnail",
    "YouTube Tools",
  "YouTube Thumbnail",
  "YouTube Thumbnail Downloader",
  "YouTube Thumbnail Image Downloader",
  "YouTube Thumbnail Viewer",
  "Download YouTube Thumbnail",
  "Download YouTube Thumbnail Image",
  "Free YouTube Thumbnail Downloader",
  "HD YouTube Thumbnail",
  "Max Resolution Thumbnail",
  "YouTube HD Thumbnail Download",
  "YouTube Thumbnail HD",
  "YouTube Thumbnail Full HD",
  "YouTube Thumbnail 4K",
  "YouTube Shorts Thumbnail",
  "YouTube Shorts Thumbnail Downloader",
  "HQ Thumbnail",
  "MQ Thumbnail",
  "SD Thumbnail",
  "YouTube Preview Image",
  "YouTube Cover Image",
  "Thumbnail Grabber",
  "YouTube Image Downloader",
  "Video Thumbnail Downloader",
  "YouTube Tools",
  "Free YouTube Tools",
  "Thumbnail Download Tool",
  "YouTube Thumbnail Generator",
  "View YouTube Thumbnail",
  "Extract YouTube Thumbnail",
  "Download Thumbnail Online"
  ],

  authors: [
    {
      name: "YouTube Thumbnail",
      url: "https://youtubethumbnails-downloader.com",
    },
  ],

  creator: "YouTube Thumbnail",

  publisher: "YouTube Thumbnail",

  applicationName: "YouTube Thumbnail",

  verification: {
    google: "zbxUmiLJEe7CmAqc32MfkWnbvHwHJpyMkOQm_DaxFEc",
  },

  metadataBase: new URL("https://youtubethumbnails-downloader.com"),

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

  manifest: "/site.webmanifest",

  openGraph: {
    title: "YouTube Thumbnail Image Downloader & Viewer",
    description:
      "Download and view YouTube thumbnail images in HD, HQ, MQ, SD and Max Resolution for free.",
    url: "https://youtubethumbnails-downloader.com",
    siteName: "YouTube Thumbnail",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YouTube Thumbnail",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "YouTube Thumbnail Image Downloader & Viewer",
    description:
      "Download and view YouTube thumbnail images in HD, HQ, MQ, SD and Max Resolution for free.",

    images: ["/og-image.jpg"],
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
  <Header />

  <main className="flex-1">
    {children}
  </main>

  <Footer />

  <Analytics />
  <GoogleAnalytics gaId="G-9QTZ25R4P4" />

<Script id="microsoft-clarity" strategy="afterInteractive">
  {`
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xmg1cdqpm8");
  `}
</Script>
</body>
    </html>
  );
}