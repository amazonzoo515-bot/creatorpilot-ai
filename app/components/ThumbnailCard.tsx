"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type ThumbnailCardProps = {
  title: string;
  resolution: string;
  imageUrl: string;
  unavailable?: boolean;
};

export default function ThumbnailCard({
  title,
  resolution,
  imageUrl,
  unavailable = false,
}: ThumbnailCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  // JPEG تصویر کو Clipboard کے لیے PNG بلاب (Blob) میں تبدیل کرنے کا فنکشن
  async function convertToPngBlob(imageBlob: Blob): Promise<Blob> {
    if (imageBlob.type === "image/png") return imageBlob;

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(imageBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas context failed"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((pngBlob) => {
          URL.revokeObjectURL(url);
          if (pngBlob) resolve(pngBlob);
          else reject(new Error("PNG conversion failed"));
        }, "image/png");
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image for PNG conversion"));
      };

      img.src = url;
    });
  }

  async function downloadImage() {
    if (unavailable) return;

    let blobUrl = "";
    try {
      setIsDownloading(true);

      const response = await fetch(
        `/api/download?url=${encodeURIComponent(imageUrl)}`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      blobUrl = window.URL.createObjectURL(blob);

      const randomString = Math.random().toString(36).substring(2, 6);
      const sanitizedTitle = title
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();

      const fileName = `${sanitizedTitle || "youtube-thumbnail"}-${randomString}.jpg`;

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started.");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Opening in new tab...");
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    } finally {
      if (blobUrl) {
        window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      }
      setIsDownloading(false);
    }
  }

  async function copyImage() {
    if (unavailable) return;

    try {
      setIsCopying(true);

      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error("Clipboard API not supported");
      }

      const response = await fetch(
        `/api/download?url=${encodeURIComponent(imageUrl)}`
      );

      if (!response.ok) throw new Error("Copy failed");

      const rawBlob = await response.blob();
      // Clipboard API کو ہمیشہ PNG کی ضرورت ہوتی ہے
      const pngBlob = await convertToPngBlob(rawBlob);

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": pngBlob,
        }),
      ]);

      toast.success("Image copied successfully!");
    } catch (error) {
      console.error("Copy image error:", error);
      toast.error("Failed to copy image to clipboard.");
    } finally {
      setIsCopying(false);
    }
  }

  async function copyImageUrl() {
    if (unavailable) return;
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast.success("Image URL copied successfully!");
    } catch (error) {
      console.error("Copy URL error:", error);
      toast.error("Failed to copy image URL.");
    }
  }

  function previewImage() {
    if (unavailable) return;
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  }

  const widthMap: Record<string, string> = {
    "HD Thumbnail": "max-w-full",
    "SD Thumbnail": "max-w-[90%]",
    "HQ Thumbnail": "max-w-[80%]",
    "MQ Thumbnail": "max-w-[70%]",
  };

  const imageWidth = widthMap[title] || "max-w-[60%]";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex justify-center">
        {unavailable ? (
          <div className="flex h-48 w-full max-w-md items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100">
            <p className="text-center text-base font-semibold text-gray-700">
              {title} Not Available
            </p>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={`${title} - ${resolution}`}
            width={1280}
            height={720}
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            unoptimized
            className={`${imageWidth} h-auto rounded-xl border border-gray-300 object-contain`}
          />
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-base font-medium text-gray-600">
          {resolution}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyImage}
          disabled={isCopying || unavailable}
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCopying ? "Copying..." : "Copy Image"}
        </button>

        <button
          type="button"
          onClick={copyImageUrl}
          disabled={unavailable}
          className="rounded-lg border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy Image URL
        </button>

        <button
          type="button"
          onClick={previewImage}
          disabled={unavailable}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Preview
        </button>

        <button
          type="button"
          onClick={downloadImage}
          disabled={isDownloading || unavailable}
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>
    </div>
  );
}