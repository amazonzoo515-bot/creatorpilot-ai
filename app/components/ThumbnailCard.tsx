"use client";

import Image from "next/image";
import { useId, useState } from "react";
import toast from "react-hot-toast";

type ThumbnailCardProps = {
  title: string;
  resolution: string;
  imageUrl: string;
  unavailable?: boolean;
};

type DownloadFormat = "jpg" | "png" | "webp";

const FORMAT_MIME: Record<DownloadFormat, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export default function ThumbnailCard({
  title,
  resolution,
  imageUrl,
  unavailable = false,
}: ThumbnailCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [format, setFormat] = useState<DownloadFormat>("jpg");
  const formatId = useId();
  // The 720p file is often the same size as 1080p, so it is shown a bit smaller.
  const imageScale = resolution === "720p" ? 0.85 : 1;
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  async function convertImageBlob(
    imageBlob: Blob,
    mime: string
  ): Promise<Blob> {
    if (imageBlob.type === mime) {
      return imageBlob;
    }

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(imageBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Canvas context failed"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (converted) => {
            URL.revokeObjectURL(objectUrl);

            if (converted) {
              resolve(converted);
            } else {
              reject(new Error("Image conversion failed"));
            }
          },
          mime,
          0.95
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(
          new Error("Failed to load image for PNG conversion")
        );
      };

      img.src = objectUrl;
    });
  }

  function convertToPngBlob(imageBlob: Blob): Promise<Blob> {
    return convertImageBlob(imageBlob, "image/png");
  }

  async function downloadImage() {
    if (unavailable) return;

    let blobUrl = "";

    try {
      setIsDownloading(true);

      const response = await fetch(
        `/api/download?url=${encodeURIComponent(imageUrl)}`
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const originalBlob = await response.blob();

      // JPG keeps the original file untouched. PNG and WebP are converted.
      const blob =
        format === "jpg"
          ? originalBlob
          : await convertImageBlob(originalBlob, FORMAT_MIME[format]);

      if (format !== "jpg" && blob.type !== FORMAT_MIME[format]) {
        toast.error(
          "This browser can't save that format. Please choose JPG or PNG."
        );
        return;
      }

      blobUrl = window.URL.createObjectURL(blob);

      const randomString = Math.random()
        .toString(36)
        .substring(2, 6);

      const sanitizedTitle = title
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();

      const fileName = `${
        sanitizedTitle || "thumbnail"
      }-${resolution}-${randomString}.${format}`;

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started.");
    } catch (error) {
      console.error("Download error:", error);

      toast.error(
        "Download failed. Opening the image instead..."
      );

      window.open(
        imageUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      if (blobUrl) {
        window.setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 1000);
      }

      setIsDownloading(false);
    }
  }

  async function copyImage() {
    if (unavailable) return;

    try {
      setIsCopying(true);

      if (
        !navigator.clipboard ||
        !window.ClipboardItem
      ) {
        throw new Error(
          "Clipboard API is not supported"
        );
      }

      const response = await fetch(
        `/api/download?url=${encodeURIComponent(imageUrl)}`
      );

      if (!response.ok) {
        throw new Error("Copy failed");
      }

      const rawBlob = await response.blob();
      const pngBlob = await convertToPngBlob(rawBlob);

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": pngBlob,
        }),
      ]);

      toast.success("Image copied successfully!");
    } catch (error) {
      console.error("Copy image error:", error);

      toast.error(
        "Failed to copy image to clipboard."
      );
    } finally {
      setIsCopying(false);
    }
  }

  async function copyImageUrl() {
    if (unavailable) return;

    try {
      await navigator.clipboard.writeText(imageUrl);

      toast.success(
        "Image URL copied successfully!"
      );
    } catch (error) {
      console.error("Copy URL error:", error);

      toast.error(
        "Failed to copy image URL."
      );
    }
  }

  function previewImage() {
    if (unavailable) return;

    window.open(
      imageUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div
      className="mx-auto max-w-full"
      style={{ width: size ? `min(${size.w}px, 100%)` : "100%" }}
    >
      <div className="flex justify-center">
        {unavailable ? (
          <div className="flex h-48 w-full min-w-72 items-center justify-center border border-dashed border-gray-300 bg-gray-100">
            <p className="text-center text-base font-semibold text-gray-700">
              {resolution} Not Available
            </p>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={`${resolution} YouTube thumbnail`}
            width={size?.w ?? 1280}
            height={size?.h ?? 720}
            loading="lazy"
            unoptimized
            onLoad={(event) => {
              const img = event.currentTarget;

              if (img.naturalWidth && img.naturalHeight) {
                setSize({ w: img.naturalWidth, h: img.naturalHeight });
              }
            }}
            style={{ width: `${imageScale * 100}%`, height: "auto" }}
            className="block"
          />
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-center text-lg font-bold text-gray-900">
          {resolution}
        </h3>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={copyImage}
          disabled={isCopying || unavailable}
          aria-label={`Copy ${resolution} image`}
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCopying ? "Copying..." : "Copy Image"}
        </button>

        <button
          type="button"
          onClick={copyImageUrl}
          disabled={unavailable}
          aria-label={`Copy ${resolution} image URL`}
          className="rounded-lg border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy Image URL
        </button>

        <button
          type="button"
          onClick={previewImage}
          disabled={unavailable}
          aria-label={`Preview ${resolution}`}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Preview
        </button>

        <label htmlFor={formatId} className="sr-only">
          Download format for {resolution}
        </label>

        <select
          id={formatId}
          value={format}
          onChange={(event) =>
            setFormat(event.target.value as DownloadFormat)
          }
          disabled={unavailable}
          className="rounded-lg border border-gray-300 bg-white px-3 py-3 font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>

        <button
          type="button"
          onClick={downloadImage}
          disabled={isDownloading || unavailable}
          aria-label={`Download ${resolution}`}
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDownloading
            ? "Downloading..."
            : "Download"}
        </button>
      </div>
    </div>
  );
}