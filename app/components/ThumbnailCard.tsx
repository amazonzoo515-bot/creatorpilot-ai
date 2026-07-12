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

  // ⬇ Download Function
  async function downloadImage() {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/download?url=${encodeURIComponent(imageUrl)}`);
      if (!response.ok) throw new Error('Download failed');
      
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
      console.error("Download error:", error);
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  }

  // 📋 Copy Image Function (Fixed & English Alerts)
  async function copyImage() {
    try {
      setIsCopying(true);
      const response = await fetch(`/api/download?url=${encodeURIComponent(imageUrl)}`);
      if (!response.ok) throw new Error('Fetch failed');
      
      const blob = await response.blob();
      
      // کچھ براؤزرز کلپ بورڈ پر صرف PNG امیج سپورٹ کرتے ہیں، اس لیے یہاں ٹائپ فورس کر رہے ہیں
      const imageBlob = new Blob([blob], { type: 'image/png' });
      
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 
            [imageBlob.type]: imageBlob 
          }),
        ]);
        alert("Image copied successfully!");
      } else {
        throw new Error("Clipboard API not supported in this environment");
      }
    } catch (error) {
      console.error("Copy error:", error);
      alert("Failed to copy image. Your browser or development environment restricts clipboard access.");
    } finally {
      setIsCopying(false);
    }
  }

  function previewImage() {
    window.open(imageUrl, "_blank");
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full rounded-xl border border-gray-300"
      />

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-gray-600">{resolution}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyImage}
            disabled={isCopying}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-50"
          >
            {isCopying ? "⏳ Copying..." : "📋 Copy Image"}
          </button>

          <button
            onClick={previewImage}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            👁 Preview
          </button>

          <button
            onClick={downloadImage}
            disabled={isDownloading}
            className="rounded-lg bg-black px-5 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isDownloading ? "⏳ Downloading..." : "⬇ Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
