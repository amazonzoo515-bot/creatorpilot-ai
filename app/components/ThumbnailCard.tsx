"use client";

import { useState } from "react";

type ThumbnailCardProps = {
  title: string;
  resolution: string;
  imageUrl: string;
};

export default function ThumbnailCard({
  title,
  resolution,
  imageUrl,
}: ThumbnailCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

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

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
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

      alert("Image copied successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to copy image.");
    } finally {
      setIsCopying(false);
    }
  }

  function previewImage() {
    window.open(imageUrl, "_blank");
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
      <img
        src={imageUrl}
        alt={title}
        className="w-full rounded-xl border border-gray-300"
      />

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