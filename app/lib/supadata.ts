// ---------------------------------------------------------------
// Optional backup source for transcripts: the Supadata API.
//
// It is only used when SUPADATA_API_KEY is set in the environment, and
// only after reading captions directly from YouTube has failed.
// Check the current request/response format in Supadata's docs
// before relying on this in production.
// ---------------------------------------------------------------

export type SupadataSegment = {
    text: string;
    /** Start time in seconds */
    start: number;
    /** Duration in seconds */
    duration: number;
  };
  
  export type SupadataResult = {
    segments: SupadataSegment[];
    language: string | null;
    availableLanguages: string[];
  };
  
  export type SupadataErrorCode =
    | "no_captions"
    | "rate_limited"
    | "failed";
  
  export class SupadataError extends Error {
    code: SupadataErrorCode;
  
    constructor(code: SupadataErrorCode, message: string) {
      super(message);
      this.code = code;
    }
  }
  
  const ENDPOINT = "https://api.supadata.ai/v1/youtube/transcript";
  const REQUEST_TIMEOUT_MS = 20000;
  
  export function isSupadataConfigured() {
    return Boolean(process.env.SUPADATA_API_KEY);
  }
  
  async function requestSupadataTranscript(
    videoId: string,
    language?: string
  ): Promise<SupadataResult> {
    const apiKey = process.env.SUPADATA_API_KEY;
  
    if (!apiKey) {
      throw new SupadataError("failed", "Supadata is not configured");
    }
  
    const url = new URL(ENDPOINT);
  
    url.searchParams.set(
      "url",
      `https://www.youtube.com/watch?v=${videoId}`
    );
  
    // Existing captions only. Generating a transcript from audio
    // would use up many more credits.
    url.searchParams.set("mode", "native");
  
    if (language) {
      url.searchParams.set("lang", language);
    }
  
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "x-api-key": apiKey,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  
    if (response.status === 429) {
      throw new SupadataError(
        "rate_limited",
        "Supadata rate limit or credit limit reached"
      );
    }
  
    if (response.status === 404 || response.status === 206) {
      throw new SupadataError(
        "no_captions",
        "Supadata found no transcript"
      );
    }
  
    if (!response.ok) {
      throw new SupadataError(
        "failed",
        `Supadata returned ${response.status}`
      );
    }
  
    const data = await response.json();
  
    const segments: SupadataSegment[] = [];
  
    if (Array.isArray(data?.content)) {
      for (const item of data.content) {
        const text =
          typeof item?.text === "string"
            ? item.text.replace(/\s+/g, " ").trim()
            : "";
  
        if (text) {
          segments.push({
            text,
            start: (Number(item.offset) || 0) / 1000,
            duration: (Number(item.duration) || 0) / 1000,
          });
        }
      }
    } else if (typeof data?.content === "string" && data.content) {
      segments.push({ text: data.content.trim(), start: 0, duration: 0 });
    }
  
    if (segments.length === 0) {
      throw new SupadataError(
        "no_captions",
        "Supadata returned an empty transcript"
      );
    }
  
    return {
      segments,
      language: typeof data?.lang === "string" ? data.lang : null,
      availableLanguages: Array.isArray(data?.availableLangs)
        ? data.availableLangs.filter(
            (code: unknown): code is string =>
              typeof code === "string"
          )
        : [],
    };
  }
  
  // ---------------------------------------------------------------
  // Credits are limited, so remember recent answers. This memory lives
  // inside one server instance only; it helps but is not a guarantee.
  // ---------------------------------------------------------------
  
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  const CACHE_MAX_ENTRIES = 200;
  
  const cache = new Map<
    string,
    { expiresAt: number; result: SupadataResult }
  >();
  
  export async function fetchSupadataTranscript(
    videoId: string,
    language?: string
  ): Promise<SupadataResult> {
    const key = `${videoId}:${language ?? ""}`;
    const now = Date.now();
  
    const hit = cache.get(key);
  
    if (hit && hit.expiresAt > now) {
      return hit.result;
    }
  
    const result = await requestSupadataTranscript(
      videoId,
      language
    );
  
    if (cache.size >= CACHE_MAX_ENTRIES) {
      const oldest = cache.keys().next().value;
  
      if (oldest !== undefined) {
        cache.delete(oldest);
      }
    }
  
    cache.set(key, { expiresAt: now + CACHE_TTL_MS, result });
  
    return result;
  }