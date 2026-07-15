"use client";

import { useRef } from "react";
import toast from "react-hot-toast";

type SearchBoxProps = {
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  onSearch: (url?: string) => void;
  loading: boolean;
};

export default function SearchBox({
  videoUrl,
  setVideoUrl,
  onSearch,
  loading,
}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();

    if (!text.trim()) {
      toast.error("Clipboard is empty.");
      return;
    }

    setVideoUrl(text);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    toast.success("Link pasted successfully.");

    onSearch(text);
  } catch {
    toast.error("Unable to access clipboard.");
  }
}

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">

      {/* Input + Paste Button */}
      <div className="relative">
        <input
  ref={inputRef}
  type="text"
  value={videoUrl}
  onChange={(e) => setVideoUrl(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !loading) {
      onSearch();
    }
  }}
  placeholder="Paste YouTube Video URL here..."
  disabled={loading}
  className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-5 pr-40 text-lg text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-gray-100"
/>

        <button
          type="button"
          onClick={handlePaste}
          disabled={loading}
          className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          📋 Paste Link
        </button>
      </div>

      {/* Get Thumbnail Button */}
      <button
        onClick={() => onSearch()}
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-black py-4 text-lg font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-700"
      >
        {loading ? (
          <>
            <svg
              className="h-6 w-6 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-100"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>

            Loading Thumbnails...
          </>
        ) : (
          "Get Thumbnail"
        )}
      </button>

    </div>
  );
}