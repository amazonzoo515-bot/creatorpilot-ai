"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  MAX_THUMBNAIL_BYTES,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
  encodeUnderLimit,
  formatBytes,
  encodeBmp,
  FORMAT_EXTENSION,
  FORMAT_LABEL,
  getDrawRects,
  parseSize,
  MAX_CUSTOM_SIZE,
  MIN_CUSTOM_SIZE,
  type FitMode,
  type OutputFormat,
} from "../../lib/thumbnail-resize";

type Source = {
  img: HTMLImageElement;
  url: string;
  name: string;
  width: number;
  height: number;
};

type Result = {
  blob: Blob;
  url: string;
  quality: number | null;
  withinLimit: boolean;
};

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SOURCE_BYTES = 30 * 1024 * 1024;

const SMALL_PREVIEWS = [
  { label: "Large", width: 320 },
  { label: "Medium", width: 220 },
  { label: "Tiny", width: 140 },
];

const FIT_OPTIONS: { value: FitMode; title: string; text: string }[] = [
  {
    value: "crop",
    title: "Crop to fill",
    text: "Keeps proportions and trims the edges. Best for photos with faces.",
  },
  {
    value: "pad",
    title: "Fit with bars",
    text: "Keeps the whole image and fills the rest with a color.",
  },
  {
    value: "stretch",
    title: "Stretch",
    text: "Forces the image to 16:9. Can look distorted.",
  },
];

const SIZE_PRESETS = [
  { label: "YouTube thumbnail", note: "16:9 · 1280×720", width: 1280, height: 720 },
  { label: "YouTube 4K thumbnail", note: "16:9 · 3840×2160", width: 3840, height: 2160 },
  { label: "Full HD", note: "16:9 · 1920×1080", width: 1920, height: 1080 },
  { label: "Square post", note: "1:1 · 1080×1080", width: 1080, height: 1080 },
  { label: "Shorts / Reels / TikTok", note: "9:16 · 1080×1920", width: 1080, height: 1920 },
  { label: "Shorts 4K vertical", note: "9:16 · 2160×3840", width: 2160, height: 3840 },
  { label: "Portrait post", note: "4:5 · 1080×1350", width: 1080, height: 1350 },
  { label: "Link preview (Facebook, LinkedIn)", note: "1.91:1 · 1200×630", width: 1200, height: 630 },
  { label: "X / Twitter header", note: "3:1 · 1500×500", width: 1500, height: 500 },
  { label: "YouTube channel banner", note: "16:9 · 2560×1440", width: 2560, height: 1440 },
  { label: "YouTube profile picture", note: "1:1 · 800×800", width: 800, height: 800 },
];

// A small live preview of the image in one of the preset shapes.
function SizePreview({
  source,
  width,
  height,
  mode,
  focus,
  barColor,
}: {
  source: Source;
  width: number;
  height: number;
  mode: FitMode;
  focus: number;
  barColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const longest = 110;
  const cssScale = longest / Math.max(width, height);
  const cssWidth = Math.max(1, Math.round(width * cssScale));
  const cssHeight = Math.max(1, Math.round(height * cssScale));

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    // Drawn at 2x so it stays sharp on phone screens.
    canvas.width = cssWidth * 2;
    canvas.height = cssHeight * 2;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = mode === "pad" ? barColor : "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const rects = getDrawRects(
      source.width,
      source.height,
      mode,
      focus,
      canvas.width,
      canvas.height
    );

    context.drawImage(
      source.img,
      rects.sx,
      rects.sy,
      rects.sw,
      rects.sh,
      rects.dx,
      rects.dy,
      rects.dw,
      rects.dh
    );
  }, [source, width, height, mode, focus, barColor, cssWidth, cssHeight]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="rounded bg-gray-100"
      style={{ width: cssWidth, height: cssHeight }}
    />
  );
}

function loadImage(file: File): Promise<Source> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        img,
        url,
        name: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load failed"));
    };

    img.src = url;
  });
}

export default function ThumbnailResizer() {
  const [source, setSource] = useState<Source | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [mode, setMode] = useState<FitMode>("crop");
  const [focus, setFocus] = useState(50);
  const [barColor, setBarColor] = useState("#000000");
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [showBadge, setShowBadge] = useState(true);
  const [sizeMode, setSizeMode] = useState<"youtube" | "custom">("youtube");
  const [customWidth, setCustomWidth] = useState("1920");
  const [customHeight, setCustomHeight] = useState("1080");
  const [limitOn, setLimitOn] = useState(false);
  const [limitKb, setLimitKb] = useState("2000");
  const [moreFormats, setMoreFormats] = useState(false);
  const [doneKey, setDoneKey] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const sourceUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  async function handleFile(file: File | null | undefined) {
    if (!file) {
      return;
    }

    setError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(
        "That file type isn't supported. Please use a JPG, PNG, WEBP or GIF image."
      );
      return;
    }

    if (file.size > MAX_SOURCE_BYTES) {
      setError("That image is too large. Please use one under 30 MB.");
      return;
    }

    try {
      const loaded = await loadImage(file);

      if (sourceUrlRef.current) {
        URL.revokeObjectURL(sourceUrlRef.current);
      }

      sourceUrlRef.current = loaded.url;

      setFocus(50);
      setSource(loaded);
    } catch {
      setError(
        "This image couldn't be opened. Try saving it as a JPG or PNG first."
      );
    }
  }

  // Allow pasting a screenshot straight from the clipboard.
  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const files = event.clipboardData?.files;

      if (files && files.length > 0 && files[0].type.startsWith("image/")) {
        void handleFile(files[0]);
      }
    }

    window.addEventListener("paste", onPaste);

    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const isCustom = sizeMode === "custom";
  const parsedWidth = parseSize(customWidth);
  const parsedHeight = parseSize(customHeight);
  const parsedLimitKb = Number(limitKb);
  const limitValid =
    Number.isFinite(parsedLimitKb) && parsedLimitKb >= 10;

  // The size and file-size limit that are actually used right now.
  const targetWidth = isCustom ? parsedWidth : THUMBNAIL_WIDTH;
  const targetHeight = isCustom ? parsedHeight : THUMBNAIL_HEIGHT;
  const maxBytes = !isCustom
    ? MAX_THUMBNAIL_BYTES
    : limitOn && limitValid
      ? Math.round(parsedLimitKb * 1000)
      : Number.POSITIVE_INFINITY;
  const hasLimit = Number.isFinite(maxBytes);

  // Identifies the current settings. While the finished key differs from it,
  // the image is still being processed.
  const settingsKey = [
    source?.url ?? "",
    mode,
    focus,
    barColor,
    format,
    targetWidth ?? "x",
    targetHeight ?? "x",
    String(maxBytes),
  ].join("|");

  const processing =
    Boolean(source) &&
    targetWidth !== null &&
    targetHeight !== null &&
    doneKey !== settingsKey;

  // Draw, resize and shrink the file whenever a setting changes.
  useEffect(() => {
    if (!source || !targetWidth || !targetHeight) {
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      const canvas = document.createElement("canvas");

      canvas.width = targetWidth!;
      canvas.height = targetHeight!;

      const context = canvas.getContext("2d");

      if (!context) {
        setError("Your browser can't process images here.");
        setDoneKey(settingsKey);
        return;
      }

      context.fillStyle = mode === "pad" ? barColor : "#ffffff";
      context.fillRect(0, 0, targetWidth!, targetHeight!);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      const rects = getDrawRects(
        source.width,
        source.height,
        mode,
        focus,
        targetWidth!,
        targetHeight!
      );

      context.drawImage(
        source.img,
        rects.sx,
        rects.sy,
        rects.sw,
        rects.sh,
        rects.dx,
        rects.dy,
        rects.dw,
        rects.dh
      );

      const encoded = await encodeUnderLimit(
        (type, quality) => {
          // Browsers can't save BMP from a canvas, so it is written by hand.
          if (type === "image/bmp") {
            const data = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );

            return Promise.resolve(
              encodeBmp(data.width, data.height, data.data)
            );
          }

          return new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, type, quality)
          );
        },
        format,
        maxBytes
      );

      if (cancelled) {
        return;
      }

      if (!encoded) {
        setError(
          format === "webp"
            ? "Your browser can't create WebP files. Please use JPG or PNG."
            : "Something went wrong while resizing. Please try again."
        );
        setDoneKey(settingsKey);
        return;
      }

      const url = URL.createObjectURL(encoded.blob);

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
      }

      resultUrlRef.current = url;

      setResult({
        blob: encoded.blob,
        url,
        quality: encoded.quality,
        withinLimit: encoded.withinLimit,
      });

      setDoneKey(settingsKey);
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    }, [
    source,
    mode,
    focus,
    barColor,
    format,
    targetWidth,
    targetHeight,
    maxBytes,
    settingsKey,
  ]);

  // Release image memory when leaving the page.
  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) {
        URL.revokeObjectURL(sourceUrlRef.current);
      }

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
      }
    };
  }, []);

  function reset() {
    if (sourceUrlRef.current) {
      URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = null;
    }

    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }

    setSource(null);
    setResult(null);
    setError("");
  }

  const ratio = source ? source.width / source.height : 0;
  const targetRatio =
    targetWidth && targetHeight
      ? targetWidth / targetHeight
      : THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT;
  const isSixteenByNine = Math.abs(ratio - targetRatio) < 0.02;
  const isWider = ratio > targetRatio;

  const extension = FORMAT_EXTENSION[format];
  const formatLabel = FORMAT_LABEL[format];
  const isLossy = format === "jpeg" || format === "webp";
  const showMoreFormats =
    moreFormats || format === "webp" || format === "bmp";
  const fileName = isCustom
    ? `resized-${targetWidth ?? "custom"}x${targetHeight ?? "custom"}.${extension}`
    : `youtube-thumbnail-1280x720.${extension}`;
  const sizeError =
    isCustom && (!parsedWidth || !parsedHeight)
      ? `Enter a width and height between ${MIN_CUSTOM_SIZE} and ${MAX_CUSTOM_SIZE} px.`
      : isCustom && limitOn && !limitValid
        ? "Enter a maximum file size of at least 10 KB."
        : "";

  if (!source) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <label
          htmlFor="thumbnail-file"
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleFile(event.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white px-6 py-16 text-center shadow-sm transition ${
            dragging
              ? "border-red-600 bg-red-50"
              : "border-gray-300 hover:border-red-400"
          }`}
        >
          <span className="text-lg font-semibold text-gray-900">
            Drop an image here, or click to choose one
          </span>

          <span className="mt-2 text-sm text-gray-600">
            You can also paste a screenshot with Ctrl+V. JPG, PNG, WEBP
            or GIF.
          </span>

          <span className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white">
            Choose image
          </span>

          <span className="mt-4 text-xs text-gray-500">
            Your image stays in your browser and is never uploaded.
          </span>

          <input
            id="thumbnail-file"
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Preview */}
        <section
          aria-label="Resized thumbnail"
          className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
        >
          <div
            className="relative w-full overflow-hidden rounded-xl bg-gray-100"
            style={{ aspectRatio: `${targetRatio}` }}
          >
            {result && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.url}
                alt={`Your resized ${targetWidth} by ${targetHeight} image`}
                className="h-full w-full object-cover"
              />
            )}

            {result && showBadge && !isCustom && (
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white">
                12:34
              </span>
            )}

            {processing && (
              <div
                role="status"
                className="absolute inset-0 flex items-center justify-center bg-white/70"
              >
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-red-600" />
              </div>
            )}
          </div>

          {result && (
            <div className="mt-4 text-sm leading-6 text-gray-700">
              <p>
                <strong className="text-gray-900">Result:</strong>{" "}
                {targetWidth} × {targetHeight} px ·{" "}
                {formatBytes(result.blob.size)}
                {result.quality !== null &&
                  ` · ${formatLabel} quality ${Math.round(result.quality * 100)}%`}
              </p>

              {!hasLimit ? null : result.withinLimit ? (
                <p className="font-medium text-green-700">
                  {isCustom
                    ? `Under your ${formatBytes(maxBytes)} limit.`
                    : "Under 2 MB, so it uploads on any device, including from a phone."}
                </p>
              ) : (
                <p className="font-medium text-red-700">
                  {!isLossy
                    ? `This ${formatLabel} file is over ${formatBytes(
                        maxBytes
                      )}. Switch to JPG to make it smaller.`
                    : isCustom
                      ? "Even at the lowest quality this file is over your limit. Try a smaller size or a higher limit."
                      : "Even at the lowest quality this file is still over 2 MB."}
                </p>
              )}

              <p className="text-gray-600">
                Original: {source.width} × {source.height} px
                {targetWidth !== null &&
                  source.width < targetWidth &&
                  `. The image is smaller than ${targetWidth} px wide, so it was enlarged and may look a bit soft.`}
              </p>
            </div>
          )}

          {result && !isCustom && (
            <div className="mt-6">
              <h3 className="text-base font-bold text-gray-900">
                How it looks small
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Check that your text and faces still read at the sizes
                viewers actually see.
              </p>

              <div className="mt-4 flex flex-wrap items-end gap-5">
                {SMALL_PREVIEWS.map((preview) => (
                  <figure key={preview.label}>
                    <div
                      className="relative overflow-hidden rounded-lg bg-gray-100"
                      style={{
                        width: preview.width,
                        maxWidth: "100%",
                        aspectRatio: "16 / 9",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      {showBadge && (
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-semibold text-white">
                          12:34
                        </span>
                      )}
                    </div>

                    <figcaption className="mt-1 text-xs text-gray-500">
                      {preview.label} ({preview.width} px)
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {result && isCustom && (
            <div className="mt-6">
              <h3 className="text-base font-bold text-gray-900">
                Other popular sizes
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                See how your image fits each shape, then tap one to
                use that size.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SIZE_PRESETS.map((preset) => {
                  const selected =
                    parsedWidth === preset.width &&
                    parsedHeight === preset.height;

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        if (preset.width === 1280 && preset.height === 720) {
                          setSizeMode("youtube");
                          return;
                        }

                        setCustomWidth(String(preset.width));
                        setCustomHeight(String(preset.height));
                      }}
                      aria-pressed={selected}
                      className={`flex flex-col items-center rounded-xl border p-3 text-center transition ${
                        selected
                          ? "border-red-600 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex h-[110px] items-center justify-center">
                        <SizePreview
                          source={source}
                          width={preset.width}
                          height={preset.height}
                          mode={mode}
                          focus={focus}
                          barColor={barColor}
                        />
                      </div>

                      <span className="mt-2 text-xs font-semibold text-gray-900">
                        {preset.label}
                      </span>

                      <span className="text-xs text-gray-500">
                        {preset.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Controls */}
        <section
          aria-label="Resize settings"
          className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
        >
          <fieldset className="mb-6">
            <legend className="text-base font-bold text-gray-900">
              Output size
            </legend>

            <div className="mt-3 flex gap-2">
              {(
                [
                  ["youtube", "YouTube 1280×720"],
                  ["custom", "Custom size"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSizeMode(value)}
                  aria-pressed={sizeMode === value}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    sizeMode === value
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {isCustom && (
              <div className="mt-4">
                <div className="flex items-end gap-3">
                  <div>
                    <label
                      htmlFor="custom-width"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Width (px)
                    </label>
                    <input
                      id="custom-width"
                      type="number"
                      inputMode="numeric"
                      min={MIN_CUSTOM_SIZE}
                      max={MAX_CUSTOM_SIZE}
                      value={customWidth}
                      onChange={(event) => setCustomWidth(event.target.value)}
                      className="mt-1 w-28 rounded-lg border border-gray-300 px-3 py-2 text-base sm:text-sm"
                    />
                  </div>

                  <span className="pb-2 text-gray-500">×</span>

                  <div>
                    <label
                      htmlFor="custom-height"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Height (px)
                    </label>
                    <input
                      id="custom-height"
                      type="number"
                      inputMode="numeric"
                      min={MIN_CUSTOM_SIZE}
                      max={MAX_CUSTOM_SIZE}
                      value={customHeight}
                      onChange={(event) => setCustomHeight(event.target.value)}
                      className="mt-1 w-28 rounded-lg border border-gray-300 px-3 py-2 text-base sm:text-sm"
                    />
                  </div>
                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={limitOn}
                    onChange={(event) => setLimitOn(event.target.checked)}
                    className="accent-red-600"
                  />
                  Keep the file under a size limit
                </label>

                {limitOn && (
                  <div className="mt-2 flex items-center gap-2 pl-6">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={10}
                      value={limitKb}
                      onChange={(event) => setLimitKb(event.target.value)}
                      aria-label="Maximum file size in KB"
                      className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-base sm:text-sm"
                    />
                    <span className="text-sm text-gray-600">KB</span>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  Allowed: {MIN_CUSTOM_SIZE} to {MAX_CUSTOM_SIZE} px. The size
                  limit works with JPG and WebP.
                </p>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="text-base font-bold text-gray-900">
              How should it fit?
            </legend>

            {!isSixteenByNine && (
              <p className="mt-1 text-sm text-gray-600">
                Your image doesn&apos;t match the output shape, so choose
                how to handle the difference.
              </p>
            )}

            <div className="mt-3 space-y-2">
              {FIT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`block cursor-pointer rounded-xl border p-3 transition ${
                    mode === option.value
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="fit-mode"
                    value={option.value}
                    checked={mode === option.value}
                    onChange={() => setMode(option.value)}
                    className="mr-2 accent-red-600"
                  />

                  <span className="font-semibold text-gray-900">
                    {option.title}
                  </span>

                  <span className="mt-1 block pl-6 text-sm text-gray-600">
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === "crop" && !isSixteenByNine && (
            <div className="mt-5">
              <label
                htmlFor="crop-focus"
                className="block text-sm font-semibold text-gray-900"
              >
                Crop position ({isWider ? "left to right" : "top to bottom"})
              </label>

              <input
                id="crop-focus"
                type="range"
                min={0}
                max={100}
                value={focus}
                onChange={(event) => setFocus(Number(event.target.value))}
                className="mt-2 w-full accent-red-600"
              />
            </div>
          )}

          {mode === "pad" && (
            <div className="mt-5">
              <label
                htmlFor="bar-color"
                className="block text-sm font-semibold text-gray-900"
              >
                Bar color
              </label>

              <input
                id="bar-color"
                type="color"
                value={barColor}
                onChange={(event) => setBarColor(event.target.value)}
                className="mt-2 h-10 w-20 cursor-pointer rounded border border-gray-300"
              />
            </div>
          )}

          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-900">
              File type
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  "jpeg",
                  "png",
                  ...(showMoreFormats ? (["webp", "bmp"] as const) : []),
                ] as OutputFormat[]
              ).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormat(value)}
                  aria-pressed={format === value}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    format === value
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {FORMAT_LABEL[value]}
                </button>
              ))}

              {!showMoreFormats && (
                <button
                  type="button"
                  onClick={() => setMoreFormats(true)}
                  aria-expanded={false}
                  className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  More formats
                </button>
              )}
            </div>

            {(format === "webp" || format === "bmp") && (
              <p className="mt-2 text-xs text-gray-500">
                {format === "webp"
                  ? "WebP makes small files, but YouTube's thumbnail upload lists JPG and PNG only. Use JPG or PNG for YouTube."
                  : "BMP files are large because they aren't compressed, and YouTube's thumbnail upload lists JPG and PNG only."}
              </p>
            )}
          </div>

          {!isCustom && (
            <>
              <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={showBadge}
                  onChange={(event) => setShowBadge(event.target.checked)}
                  className="accent-red-600"
                />
                Show a video-length badge in the preview
              </label>

              <p className="mt-1 pl-6 text-xs text-gray-500">
                YouTube places the video length in the bottom-right corner,
                so keep text away from there.
              </p>
            </>
          )}

          {(error || sizeError) && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error || sizeError}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {result && !sizeError ? (
              <a
                href={result.url}
                download={fileName}
                className="rounded-xl bg-red-600 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-red-700"
              >
                Download thumbnail
              </a>
            ) : (
              <span className="rounded-xl bg-gray-200 px-6 py-3 text-center text-base font-semibold text-gray-500">
                Preparing...
              </span>
            )}

            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Choose another image
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Everything happens in your browser. Need a thumbnail from an
            existing video first? Try the{" "}
            <Link
              href="/"
              className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              YouTube Thumbnail Downloader
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
