"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

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
  unavailable,
}: ThumbnailCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);

  async function downloadImage() {
    try {
      setIsDownloading(true);

      const response = await fetch(
        `/api/download?url=${encodeURIComponent(imageUrl)}`
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.jpg`;

      document.body.appendChild(link);
      link.click();
      toast.success("Download started.");

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      toast.error("Download failed.");
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  }

  async function copyImage() {
    try {
      setIsCopying(true);

      const response = await fetch(
        `/api/download?url=${encodeURIComponent(imageUrl)}`
      );

      if (!response.ok) {
        throw new Error("Copy failed");
      }

      const blob = await response.blob();

      const imageBlob = new Blob([blob], {
        type: "image/png",
      });

      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error("Clipboard API not supported");
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          [imageBlob.type]: imageBlob,
        }),
      ]);

      toast.success("Image copied successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy image.");
    } finally {
      setIsCopying(false);
    }
  }
  async function copyImageUrl() {
  try {
    await navigator.clipboard.writeText(imageUrl);
    toast.success("Image URL copied successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to copy image URL.");
  }
}

  function previewImage() {
    window.open(imageUrl, "_blank");
  }

  // Resolution-based visual size
  const imageWidth =
    title === "HD Thumbnail"
      ? "max-w-full"
      : title === "SD Thumbnail"
      ? "max-w-[90%]"
      : title === "HQ Thumbnail"
      ? "max-w-[80%]"
      : title === "MQ Thumbnail"
      ? "max-w-[70%]"
      : "max-w-[60%]";

  return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex justify-center">
  {unavailable ? (
    <div className="flex h-24 w-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100">
      <p className="text-center text-base font-semibold text-gray-700">
        HD Thumbnail Not Available
      </p>
    </div>
  ) : (
    <Image
      src={imageUrl}
      alt={`${title} - ${resolution}`}
      width={1280}
      height={720}
      sizes="(max-width:768px) 100vw, 50vw"
      loading="lazy"
      unoptimized
      className={`${imageWidth} h-auto rounded-xl border border-gray-300 object-contain`}
    />
  )}
</div>

      <div className="mt-6">
  <h3 className="text-2xl font-bold text-gray-900">
    {title}
  </h3>

  <p className="mt-2 text-base font-medium text-gray-600">
    {resolution}
  </p>
</div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={copyImage}
          disabled={isCopying}
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-50"
        >
          {isCopying ? "Copying..." : "Copy Image"}
        </button>
        <button
  onClick={copyImageUrl}
  className="rounded-lg border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
>
  Copy Image URL
</button>

        <button
          onClick={previewImage}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Preview
        </button>

        <button
          onClick={downloadImage}
          disabled={isDownloading}
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>
    </div>
  );
}