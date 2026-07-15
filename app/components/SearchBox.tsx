"use client";

type SearchBoxProps = {
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  onSearch: () => void;
};

export default function SearchBox({
  videoUrl,
  setVideoUrl,
  onSearch,
}: SearchBoxProps) {
  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        placeholder="Paste YouTube Video URL here..."
        className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
      />

      <button
        onClick={onSearch}
        className="mt-5 w-full rounded-xl bg-black py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
      >
        Get Thumbnail
      </button>
    </div>
  );
}