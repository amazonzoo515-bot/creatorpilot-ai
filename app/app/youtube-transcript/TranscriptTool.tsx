"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Segment = {
  text: string;
  start: number;
  duration: number;
};

type LanguageOption = {
  code: string;
  name: string;
};

type TranscriptData = {
  videoId: string;
  title: string | null;
  author: string | null;
  language: string | null;
  languageName: string | null;
  originalLanguage: string | null;
  languages: LanguageOption[];
  segments: Segment[];
};

// Languages shown first in the list (when YouTube offers them for the
// video). Roughly ordered by how much YouTube is used worldwide; this is
// a judgement call, not an official ranking.
const POPULAR_LANGUAGE_CODES = [
  "en",
  "hi",
  "es",
  "pt",
  "id",
  "ar",
  "ru",
  "ja",
  "tr",
  "de",
  "fr",
  "ko",
  "vi",
  "th",
  "it",
  "ur",
  "bn",
  "pl",
  "uk",
  "nl",
  "fil",
  "ms",
  "fa",
  "ta",
  "te",
  "mr",
  "gu",
  "pa",
  "kn",
  "ml",
  "sw",
  "iw",
  "he",
  "ro",
  "cs",
  "el",
  "hu",
  "sv",
  "zh-Hans",
  "zh-Hant",
  "zh-CN",
  "zh-TW",
  "ne",
  "si",
  "my",
];

// Some caption tracks come back with just a code as their name.
// Turn codes like "es" or "zh-Hant" into readable names.
function readableName(language: LanguageOption) {
  if (language.name.toLowerCase() !== language.code.toLowerCase()) {
    return language.name;
  }

  try {
    const names = new Intl.DisplayNames(["en"], {
      type: "language",
    });

    return names.of(language.code) || language.name;
  } catch {
    return language.name;
  }
}

function groupLanguages(
  languages: LanguageOption[],
  originalCode: string | null
) {
  const original = originalCode
    ? languages.find((l) => l.code === originalCode)
    : undefined;

  const used = new Set<string>(original ? [original.code] : []);
  const popular: LanguageOption[] = [];

  for (const code of POPULAR_LANGUAGE_CODES) {
    const match = languages.find(
      (l) => l.code.toLowerCase() === code.toLowerCase()
    );

    if (match && !used.has(match.code)) {
      popular.push(match);
      used.add(match.code);
    }
  }

  const others = languages
    .filter((l) => !used.has(l.code))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { original, popular, others };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatTimestamp(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}

function buildText(
  segments: Segment[],
  withTimestamps: boolean
) {
  if (withTimestamps) {
    return segments
      .map(
        (segment) =>
          `[${formatTimestamp(segment.start)}] ${segment.text}`
      )
      .join("\n");
  }

  return segments.map((segment) => segment.text).join(" ");
}

function toFileName(data: TranscriptData) {
  const base = (data.title || data.videoId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const languageSuffix = data.language
    ? `-${data.language.toLowerCase()}`
    : "";

  return `${base || data.videoId}${languageSuffix}-transcript.txt`;
}

export default function TranscriptTool() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [languageLoading, setLanguageLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [languageError, setLanguageError] = useState("");
  const [pendingLanguage, setPendingLanguage] = useState<
    string | null
  >(null);
  const cache = useRef(new Map<string, TranscriptData>());
  const [data, setData] = useState<TranscriptData | null>(null);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [copied, setCopied] = useState(false);

  // language is only set when the visitor picks one from the list.
  async function loadTranscript(
    input: string,
    language?: string
  ) {
    const cacheKey = language ? `${input}:${language}` : null;

    if (cacheKey && cache.current.has(cacheKey)) {
      setLanguageError("");
      setData(cache.current.get(cacheKey) as TranscriptData);
      setPendingLanguage(null);
      return;
    }

    if (language) {
      setLanguageLoading(true);
    } else {
      setLoading(true);
      setData(null);
    }

    setError("");
    setLanguageError("");
    setCopied(false);

    try {
      const query =
        `url=${encodeURIComponent(input)}` +
        (language
          ? `&lang=${encodeURIComponent(language)}`
          : "");

      const response = await fetch(`/api/transcript?${query}`);

      const result = await response.json();

      if (!response.ok) {
        const message =
          result?.error ||
          "Could not fetch the transcript right now.";

        if (language) {
          setLanguageError(message);
        } else {
          setError(message);
        }

        return;
      }

      const transcript = result as TranscriptData;

      if (cacheKey) {
        cache.current.set(cacheKey, transcript);
      }

      setData(transcript);
    } catch {
      const message =
        "Something went wrong. Check your connection and try again.";

      if (language) {
        setLanguageError(message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
      setLanguageLoading(false);
      setPendingLanguage(null);
    }
  }

  async function handleSubmit(
    event: React.SyntheticEvent
  ) {
    event.preventDefault();

    const input = videoUrl.trim();

    if (!input) {
      setError("Please paste a YouTube video link.");
      return;
    }

    await loadTranscript(input);
  }

  function handleLanguageChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!data) {
      return;
    }

    const code = event.target.value;

    if (code === data.language) {
      return;
    }

    const option = data.languages.find((l) => l.code === code);

    setPendingLanguage(option ? readableName(option) : code);

    void loadTranscript(data.videoId, code);
  }

  // Links from the thumbnail page arrive as /youtube-transcript?url=...
  const autoRan = useRef(false);

  useEffect(() => {
    if (autoRan.current) {
      return;
    }

    autoRan.current = true;

    const initialUrl = new URLSearchParams(
      window.location.search
    ).get("url");

    if (initialUrl && initialUrl.trim()) {
      setVideoUrl(initialUrl.trim());
      void loadTranscript(initialUrl.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCopy() {
    if (!data) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        buildText(data.segments, showTimestamps)
      );

      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Copy failed. Select the text and copy it manually."
      );
    }
  }

  function handleDownload() {
    if (!data) {
      return;
    }

    const blob = new Blob(
      [buildText(data.segments, showTimestamps)],
      { type: "text/plain;charset=utf-8" }
    );

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = toFileName(data);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);
  }

  const groups = data
    ? groupLanguages(data.languages, data.originalLanguage)
    : null;

  const isOtherLanguage =
    data !== null &&
    data.originalLanguage !== null &&
    data.language !== null &&
    data.language !== data.originalLanguage;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-4 shadow-sm md:p-6"
      >
        <label
          htmlFor="transcript-url"
          className="sr-only"
        >
          YouTube video link
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="transcript-url"
            type="text"
            inputMode="url"
            value={videoUrl}
            onChange={(event) =>
              setVideoUrl(event.target.value)
            }
            placeholder="Paste a YouTube link here"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Get Transcript"}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </form>

      {data && (
        <section
          aria-label="Transcript result"
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8"
        >
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {data.title
              ? `Transcript of ${data.title}`
              : "Video transcript"}
          </h2>

          {data.author && (
            <p className="mt-1 text-sm text-gray-600">
              Channel: {data.author}
            </p>
          )}

          <div className="mt-5 overflow-hidden rounded-xl bg-gray-100">
            <div className="aspect-video w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${data.videoId}/hqdefault.jpg`}
                alt={
                  data.title
                    ? `Thumbnail of ${data.title}`
                    : "Video thumbnail"
                }
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Need the thumbnail image itself? Use the{" "}
            <Link
              href="/"
              className="font-medium text-red-600 underline underline-offset-2 hover:text-red-700"
            >
              YouTube Thumbnail Downloader
            </Link>
            .
          </p>

          {groups && data.languages.length > 1 && (
            <div className="mt-6">
              <label
                htmlFor="transcript-language"
                className="block text-sm font-semibold text-gray-900"
              >
                Language
              </label>

              <select
                id="transcript-language"
                value={data.language ?? ""}
                onChange={handleLanguageChange}
                disabled={languageLoading}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 disabled:opacity-60 sm:max-w-sm"
              >
                {groups.original && (
                  <optgroup label="Captions on this video">
                    <option value={groups.original.code}>
                      {readableName(groups.original)}
                    </option>
                  </optgroup>
                )}

                {groups.popular.length > 0 && (
                  <optgroup label="Popular languages">
                    {groups.popular.map((language) => (
                      <option
                        key={language.code}
                        value={language.code}
                      >
                        {readableName(language)}
                      </option>
                    ))}
                  </optgroup>
                )}

                {groups.others.length > 0 && (
                  <optgroup label="All other languages">
                    {groups.others.map((language) => (
                      <option
                        key={language.code}
                        value={language.code}
                      >
                        {readableName(language)}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {languageError && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {languageError}
                </p>
              )}

              {isOtherLanguage && !languageLoading && (
                <p className="mt-2 text-sm text-gray-600">
                  This isn't one of the video's own caption
                  tracks, so it was machine-translated and the
                  wording may be rough in places.
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              {copied ? "Copied" : "Copy"}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Download .txt
            </button>

            <button
              type="button"
              onClick={() =>
                setShowTimestamps((current) => !current)
              }
              aria-pressed={showTimestamps}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Timestamps {showTimestamps ? "ON" : "OFF"}
            </button>
          </div>

          <div
            dir="auto"
            className="mt-6 max-h-[32rem] overflow-y-auto rounded-xl border border-gray-200 p-5 text-base leading-8 text-gray-800"
          >
            {showTimestamps ? (
              <ul className="space-y-2">
                {data.segments.map((segment, index) => (
                  <li
                    key={`${segment.start}-${index}`}
                    dir="auto"
                  >
                    <span
                      dir="ltr"
                      className="mr-3 font-mono text-sm text-red-600"
                    >
                      {formatTimestamp(segment.start)}
                    </span>
                    {segment.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p dir="auto">
                {data.segments
                  .map((segment) => segment.text)
                  .join(" ")}
              </p>
            )}
          </div>
        </section>
      )}

      {languageLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/85 px-6 backdrop-blur-sm"
        >
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-red-600" />

          <p className="mt-5 text-lg font-semibold text-gray-900">
            Translating
            {pendingLanguage ? ` to ${pendingLanguage}` : ""}...
          </p>

          <p className="mt-1 max-w-xs text-center text-sm text-gray-600">
            Please wait. Longer videos can take up to 30 seconds.
          </p>
        </div>
      )}
    </div>
  );
}