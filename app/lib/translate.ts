// ---------------------------------------------------------------
// Free machine translation for transcript text.
//
// This uses Google's public (unofficial) translate endpoint, which has
// no key and no published limits. It can slow down, rate-limit, or
// change without notice. To switch to an official provider (DeepL,
// Azure Translator, Google Cloud Translation), replace the body of
// translateBatch() and keep everything else the same.
// ---------------------------------------------------------------

export type TranslationErrorCode = "too_long" | "failed";

export class TranslationError extends Error {
  code: TranslationErrorCode;

  constructor(code: TranslationErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const ENDPOINT =
  "https://translate.googleapis.com/translate_a/single";

// Limit by encoded size so the GET URL stays safe for any script
// (Hindi or Urdu text is about 9 bytes per character once encoded).
const MAX_CHUNK_ENCODED_LENGTH = 4500;
const MAX_TOTAL_CHARS = 40000;
const CONCURRENCY = 3;
const REQUEST_TIMEOUT_MS = 7000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 500;
const TOTAL_TIME_BUDGET_MS = 45000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Our language codes (YouTube style) -> codes the translate endpoint expects.
function toTargetCode(code: string) {
  const lower = code.toLowerCase();

  if (lower.startsWith("zh")) {
    return /hant|tw|hk|mo/.test(lower) ? "zh-TW" : "zh-CN";
  }

  if (lower === "he") {
    return "iw";
  }

  if (lower === "fil") {
    return "tl";
  }

  return lower.split("-")[0];
}

async function translateBatch(
  lines: string[],
  targetCode: string
): Promise<string> {
  const url =
    `${ENDPOINT}?client=gtx&sl=auto` +
    `&tl=${encodeURIComponent(toTargetCode(targetCode))}` +
    `&dt=t&q=${encodeURIComponent(lines.join("\n"))}`;

  let lastProblem = "unknown";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_DELAY_MS * attempt);
    }

    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      // Rate limits and server hiccups are worth another try.
      if (response.status === 429 || response.status >= 500) {
        lastProblem = `status ${response.status}`;
        console.warn(
          "Translation request will retry:",
          lastProblem,
          `(attempt ${attempt + 1})`
        );
        continue;
      }

      if (!response.ok) {
        throw new TranslationError(
          "failed",
          `Translation service returned ${response.status}`
        );
      }

      const json = await response.json();

      const parts: unknown[] = Array.isArray(json?.[0])
        ? json[0]
        : [];

      return parts
        .map((part) =>
          Array.isArray(part) && typeof part[0] === "string"
            ? part[0]
            : ""
        )
        .join("");
    } catch (error) {
      if (error instanceof TranslationError) {
        throw error;
      }

      // Timeouts and network errors are also retried.
      lastProblem =
        error instanceof Error ? error.name : String(error);

      console.warn(
        "Translation request will retry:",
        lastProblem,
        `(attempt ${attempt + 1})`
      );
    }
  }

  throw new TranslationError(
    "failed",
    `Translation request failed after ${MAX_ATTEMPTS} attempts (${lastProblem})`
  );
}

async function translateLines(
  lines: string[],
  targetCode: string
): Promise<string[]> {
  const joined = await translateBatch(lines, targetCode);

  const output = joined.split("\n");

  if (
    output.length === lines.length + 1 &&
    output[output.length - 1].trim() === ""
  ) {
    output.pop();
  }

  if (output.length === lines.length) {
    return output.map((line) => line.trim());
  }

  // Line count drifted. Translate the lines one by one instead.
  const result: string[] = [];

  for (const line of lines) {
    const single = await translateBatch([line], targetCode);

    result.push(single.replace(/\n/g, " ").trim());
  }

  return result;
}

export async function translateSegments<
  T extends { text: string }
>(segments: T[], targetCode: string): Promise<T[]> {
  const totalChars = segments.reduce(
    (sum, segment) => sum + segment.text.length,
    0
  );

  if (totalChars > MAX_TOTAL_CHARS) {
    throw new TranslationError(
      "too_long",
      "This transcript is too long to translate here."
    );
  }

  // Group segments into chunks of limited encoded size.
  const chunks: number[][] = [];
  let current: number[] = [];
  let currentSize = 0;

  segments.forEach((segment, index) => {
    const size = encodeURIComponent(segment.text).length + 3;

    if (
      current.length > 0 &&
      currentSize + size > MAX_CHUNK_ENCODED_LENGTH
    ) {
      chunks.push(current);
      current = [];
      currentSize = 0;
    }

    current.push(index);
    currentSize += size;
  });

  if (current.length > 0) {
    chunks.push(current);
  }

  const translated: string[] = new Array(segments.length).fill(
    ""
  );

  const deadline = Date.now() + TOTAL_TIME_BUDGET_MS;
  let nextChunk = 0;

  async function worker() {
    while (nextChunk < chunks.length) {
      if (Date.now() > deadline) {
        throw new TranslationError(
          "failed",
          "Translation took too long"
        );
      }

      const chunkIndex = nextChunk++;
      const indexes = chunks[chunkIndex];

      const result = await translateLines(
        indexes.map((i) => segments[i].text),
        targetCode
      );

      indexes.forEach((segmentIndex, position) => {
        translated[segmentIndex] = result[position] || "";
      });
    }
  }

  try {
    await Promise.all(
      Array.from(
        { length: Math.min(CONCURRENCY, chunks.length) },
        () => worker()
      )
    );
  } catch (error) {
    if (error instanceof TranslationError) {
      throw error;
    }

    throw new TranslationError(
      "failed",
      `Translation failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  return segments
    .map((segment, index) => ({
      ...segment,
      text: translated[index] || segment.text,
    }))
    .filter((segment) => segment.text.length > 0);
}