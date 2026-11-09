// Pure helpers for the YouTube thumbnail resizer. Nothing here touches
// the DOM, so it can be tested on its own.

export const THUMBNAIL_WIDTH = 1280;
export const THUMBNAIL_HEIGHT = 720;

// A little under 2 MB so rounding never pushes the file over YouTube's limit.
export const MAX_THUMBNAIL_BYTES = 1_950_000;

// Limits for the custom size option. 4000 px keeps memory use safe on phones.
export const MIN_CUSTOM_SIZE = 16;
export const MAX_CUSTOM_SIZE = 4000;

// Turns text typed in a size box into a whole number, or null if it is not usable.
export function parseSize(value: string): number | null {
  const number = Math.round(Number(value));

  if (
    !Number.isFinite(number) ||
    number < MIN_CUSTOM_SIZE ||
    number > MAX_CUSTOM_SIZE
  ) {
    return null;
  }

  return number;
}

export type FitMode = "crop" | "pad" | "stretch";
export type OutputFormat = "jpeg" | "png" | "webp" | "bmp";

export const FORMAT_LABEL: Record<OutputFormat, string> = {
  jpeg: "JPG",
  png: "PNG",
  webp: "WebP",
  bmp: "BMP",
};

export const FORMAT_EXTENSION: Record<OutputFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  bmp: "bmp",
};

// Formats that can trade quality for a smaller file.
const LOSSY_MIME: Partial<Record<OutputFormat, string>> = {
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export type DrawRects = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

// Works out which part of the source image goes where on the 1280x720 canvas.
// focus (0 to 100) picks which part is kept when cropping.
export function getDrawRects(
  imageWidth: number,
  imageHeight: number,
  mode: FitMode,
  focus: number,
  width: number = THUMBNAIL_WIDTH,
  height: number = THUMBNAIL_HEIGHT
): DrawRects {
  if (mode === "stretch") {
    return {
      sx: 0,
      sy: 0,
      sw: imageWidth,
      sh: imageHeight,
      dx: 0,
      dy: 0,
      dw: width,
      dh: height,
    };
  }

  if (mode === "pad") {
    const scale = Math.min(width / imageWidth, height / imageHeight);
    const dw = imageWidth * scale;
    const dh = imageHeight * scale;

    return {
      sx: 0,
      sy: 0,
      sw: imageWidth,
      sh: imageHeight,
      dx: (width - dw) / 2,
      dy: (height - dh) / 2,
      dw,
      dh,
    };
  }

  const scale = Math.max(width / imageWidth, height / imageHeight);
  const sw = width / scale;
  const sh = height / scale;
  const position = Math.min(100, Math.max(0, focus)) / 100;

  return {
    sx: (imageWidth - sw) * position,
    sy: (imageHeight - sh) * position,
    sw,
    sh,
    dx: 0,
    dy: 0,
    dw: width,
    dh: height,
  };
}

export type EncodeResult = {
  blob: Blob;
  /** JPG quality that was used, or null for PNG */
  quality: number | null;
  withinLimit: boolean;
};

type ToBlob = (
  type: string,
  quality?: number
) => Promise<Blob | null>;

// JPG and WebP: lowers the quality step by step until the file fits.
// PNG and BMP cannot be tuned this way, so they are encoded once and checked.
export async function encodeUnderLimit(
  toBlob: ToBlob,
  format: OutputFormat,
  maxBytes: number = MAX_THUMBNAIL_BYTES
): Promise<EncodeResult | null> {
  const lossyType = LOSSY_MIME[format];

  if (!lossyType) {
    const blob = await toBlob(format === "png" ? "image/png" : "image/bmp");

    return blob
      ? { blob, quality: null, withinLimit: blob.size <= maxBytes }
      : null;
  }

  const first = await toBlob(lossyType, 0.92);

  // Some browsers quietly return a PNG when they cannot make a WebP.
  if (!first || (first.type && first.type !== lossyType)) {
    return null;
  }

  if (first.size <= maxBytes) {
    return { blob: first, quality: 0.92, withinLimit: true };
  }

  let low = 0.3;
  let high = 0.92;
  let best: { blob: Blob; quality: number } | null = null;

  for (let step = 0; step < 7; step++) {
    const middle = (low + high) / 2;
    const blob = await toBlob(lossyType, middle);

    if (!blob) {
      break;
    }

    if (blob.size <= maxBytes) {
      best = { blob, quality: middle };
      low = middle;
    } else {
      high = middle;
    }
  }

  if (best) {
    return { ...best, withinLimit: true };
  }

  const smallest = await toBlob(lossyType, 0.3);

  return smallest
    ? {
        blob: smallest,
        quality: 0.3,
        withinLimit: smallest.size <= maxBytes,
      }
    : null;
}

// Browsers cannot save BMP from a canvas, so this writes a 24-bit BMP by hand.
export function encodeBmp(
  width: number,
  height: number,
  rgba: Uint8ClampedArray
): Blob {
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const dataSize = rowSize * height;
  const buffer = new ArrayBuffer(54 + dataSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d);
  view.setUint32(2, 54 + dataSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, dataSize, true);
  view.setUint32(38, 2835, true);
  view.setUint32(42, 2835, true);

  for (let y = 0; y < height; y++) {
    const sourceRow = height - 1 - y;
    const target = 54 + y * rowSize;

    for (let x = 0; x < width; x++) {
      const i = (sourceRow * width + x) * 4;

      bytes[target + x * 3] = rgba[i + 2];
      bytes[target + x * 3 + 1] = rgba[i + 1];
      bytes[target + x * 3 + 2] = rgba[i];
    }
  }

  return new Blob([buffer], { type: "image/bmp" });
}

export function formatBytes(bytes: number) {
  if (bytes < 1000) {
    return `${bytes} B`;
  }

  if (bytes < 1_000_000) {
    return `${Math.round(bytes / 1000)} KB`;
  }

  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}