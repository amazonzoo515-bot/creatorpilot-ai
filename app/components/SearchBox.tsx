"use client";

import toast from "react-hot-toast";

type SearchBoxProps = {
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
};

export default function SearchBox({
  videoUrl,
  setVideoUrl,
  onSearch,
  loading,
}: SearchBoxProps) {

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();

      if (!text.trim()) {
        toast.error("Clipboard is empty.");
        return;
      }

      setVideoUrl(text);
      toast.success("Link pasted successfully.");
    } catch {
      toast.error("Unable to access clipboard.");
    }
  }

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
      <input
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
        className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-black disabled:cursor-not-allowed disabled:bg-gray-100"
      />

      <button
        onClick={onSearch}
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