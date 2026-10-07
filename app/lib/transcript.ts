import {
  YoutubeTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptNotAvailableLanguageError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError,
} from "youtube-transcript";

import { TranslationError, translateSegments } from "./translate";
import {
  SupadataError,
  fetchSupadataTranscript,
  isSupadataConfigured,
} from "./supadata";

// ---------------------------------------------------------------
// This file is the only place that knows where transcripts come from.
// To switch to a paid transcript API later, replace the body of
// fetchTranscript() and keep the return type the same.
// ---------------------------------------------------------------

export type TranscriptSegment = {
  text: string;
  /** Start time in seconds */
  start: number;
  /** Duration in seconds */
  duration: number;
};

export type LanguageOption = {
  code: string;
  name: string;
};

export type TranscriptResult = {
  /** Language code of the transcript that was returned */
  language: string | null;
  languageName: string | null;
  /** The video's own (default) caption language */
  originalLanguage: string | null;
  /** Everything YouTube offers for this video. Empty if unknown. */
  languages: LanguageOption[];
  segments: TranscriptSegment[];
};

export type VideoMeta = {
  title: string | null;
  author: string | null;
};

export type TranscriptErrorCode =
  | "invalid_url"
  | "no_captions"
  | "unavailable"
  | "blocked"
  | "language_unavailable"
  | "too_long"
  | "failed";

export class TranscriptError extends Error {
  code: TranscriptErrorCode;

  constructor(code: TranscriptErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const NO_CAPTIONS_MESSAGE =
  "No transcript is available for this video. The creator may have turned captions off.";

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const LANGUAGE_CODE_PATTERN =
  /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})?$/;

export function isValidLanguageCode(value: string) {
  return LANGUAGE_CODE_PATTERN.test(value);
}

export function extractYouTubeVideoId(
  input: string
): string | null {
  const value = input.trim();

  if (!value) {
    return null;
  }

  if (VIDEO_ID_PATTERN.test(value)) {
    return value;
  }

  let url: URL;

  try {
    url = new URL(
      /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`
    );
  } catch {
    return null;
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/^m\./, "");

  if (hostname === "youtu.be") {
    const id = url.pathname.split("/")[1];

    return id && VIDEO_ID_PATTERN.test(id) ? id : null;
  }

  if (
    hostname === "youtube.com" ||
    hostname === "music.youtube.com" ||
    hostname === "youtube-nocookie.com"
  ) {
    const queryId = url.searchParams.get("v");

    if (queryId && VIDEO_ID_PATTERN.test(queryId)) {
      return queryId;
    }

    const pathMatch = url.pathname.match(
      /^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/
    );

    return pathMatch?.[1] ?? null;
  }

  return null;
}

// ---------------------------------------------------------------
// Caption data straight from YouTube (supports language choice)
// ---------------------------------------------------------------

// Languages offered for every video. Translation into these does not
// depend on what YouTube lists for the video.
export const TRANSLATION_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "id", name: "Indonesian" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "tr", name: "Turkish" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "ko", name: "Korean" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "it", name: "Italian" },
  { code: "ur", name: "Urdu" },
  { code: "bn", name: "Bengali" },
  { code: "pl", name: "Polish" },
  { code: "uk", name: "Ukrainian" },
  { code: "nl", name: "Dutch" },
  { code: "fil", name: "Filipino" },
  { code: "ms", name: "Malay" },
  { code: "fa", name: "Persian" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "pa", name: "Punjabi" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "sw", name: "Swahili" },
  { code: "he", name: "Hebrew" },
  { code: "ro", name: "Romanian" },
  { code: "cs", name: "Czech" },
  { code: "el", name: "Greek" },
  { code: "hu", name: "Hungarian" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "bg", name: "Bulgarian" },
  { code: "sr", name: "Serbian" },
  { code: "hr", name: "Croatian" },
  { code: "sk", name: "Slovak" },
  { code: "zh-Hans", name: "Chinese (Simplified)" },
  { code: "zh-Hant", name: "Chinese (Traditional)" },
  { code: "ne", name: "Nepali" },
  { code: "si", name: "Sinhala" },
  { code: "my", name: "Burmese" },
  { code: "km", name: "Khmer" },
  { code: "am", name: "Amharic" },
  { code: "af", name: "Afrikaans" },
  { code: "kk", name: "Kazakh" },
  { code: "uz", name: "Uzbek" },
  { code: "az", name: "Azerbaijani" },
];

type CaptionTrack = {
  baseUrl: string;
  languageCode: string;
  name: string;
  isTranslatable: boolean;
};

type CaptionInfo = {
  tracks: CaptionTrack[];
  translationLanguages: LanguageOption[];
};

const INNERTUBE_API_URL =
  "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
const CAPTION_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)";
const REQUEST_TIMEOUT_MS = 10000;

type InnertubeClient = {
  name: string;
  context: Record<string, unknown>;
  userAgent: string;
};

// Tried in order until one returns caption tracks. Version numbers go
// stale over time; if all of them start failing, update them.
const INNERTUBE_CLIENTS: InnertubeClient[] = [
  {
    name: "ANDROID",
    context: {
      client: {
        clientName: "ANDROID",
        clientVersion: "20.10.38",
      },
    },
    userAgent:
      "com.google.android.youtube/20.10.38 (Linux; U; Android 14)",
  },
  {
    name: "IOS",
    context: {
      client: {
        clientName: "IOS",
        clientVersion: "20.10.4",
        deviceMake: "Apple",
        deviceModel: "iPhone16,2",
        osName: "iPhone",
        osVersion: "18.3.2.22D82",
        hl: "en",
      },
    },
    userAgent:
      "com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X;)",
  },
  {
    name: "ANDROID_VR",
    context: {
      client: {
        clientName: "ANDROID_VR",
        clientVersion: "1.62.27",
        deviceMake: "Oculus",
        deviceModel: "Quest 3",
        androidSdkVersion: 32,
        osName: "Android",
        osVersion: "12L",
        hl: "en",
      },
    },
    userAgent:
      "com.google.android.apps.youtube.vr.oculus/1.62.27 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip",
  },
];

type LookupOutcome =
  | "ok"
  | "no_captions"
  | "blocked"
  | "unavailable"
  | "error";

export type CaptionAttempt = {
  client: string;
  http: number | null;
  status: string;
  reason: string;
  trackCount: number;
  error?: string;
};

type CaptionLookup = {
  info: CaptionInfo | null;
  outcome: LookupOutcome;
  attempts: CaptionAttempt[];
};

function readText(value: unknown): string {
  if (!value || typeof value !== "object") {
    return "";
  }

  const record = value as {
    simpleText?: unknown;
    runs?: unknown;
  };

  if (typeof record.simpleText === "string") {
    return record.simpleText;
  }

  if (Array.isArray(record.runs)) {
    return record.runs
      .map((run) =>
        run &&
        typeof run === "object" &&
        typeof (run as { text?: unknown }).text === "string"
          ? (run as { text: string }).text
          : ""
      )
      .join("");
  }

  return "";
}

function parseCaptionInfo(data: unknown): CaptionInfo | null {
  const renderer = (
    data as {
      captions?: {
        playerCaptionsTracklistRenderer?: {
          captionTracks?: unknown;
          translationLanguages?: unknown;
        };
      };
    }
  )?.captions?.playerCaptionsTracklistRenderer;

  const rawTracks = renderer?.captionTracks;

  if (!Array.isArray(rawTracks) || rawTracks.length === 0) {
    return null;
  }

  const tracks: CaptionTrack[] = [];

  for (const raw of rawTracks) {
    if (
      raw &&
      typeof raw.baseUrl === "string" &&
      typeof raw.languageCode === "string"
    ) {
      tracks.push({
        baseUrl: raw.baseUrl,
        languageCode: raw.languageCode,
        name: readText(raw.name) || raw.languageCode,
        isTranslatable: raw.isTranslatable === true,
      });
    }
  }

  if (tracks.length === 0) {
    return null;
  }

  const translationLanguages: LanguageOption[] = [];

  if (Array.isArray(renderer?.translationLanguages)) {
    for (const raw of renderer.translationLanguages) {
      if (raw && typeof raw.languageCode === "string") {
        translationLanguages.push({
          code: raw.languageCode,
          name: readText(raw.languageName) || raw.languageCode,
        });
      }
    }
  }

  return { tracks, translationLanguages };
}

function classifyPlayability(
  status: string,
  reason: string,
  hasTracks: boolean
): LookupOutcome {
  if (hasTracks) {
    return "ok";
  }

  if (status === "OK") {
    return "no_captions";
  }

  if (status === "LOGIN_REQUIRED") {
    return /confirm your age|age[- ]restrict/i.test(reason)
      ? "unavailable"
      : "blocked";
  }

  if (
    status === "UNPLAYABLE" ||
    status === "ERROR" ||
    status === "CONTENT_CHECK_REQUIRED"
  ) {
    return "unavailable";
  }

  return "error";
}

async function lookupWithClient(
  client: InnertubeClient,
  videoId: string
): Promise<{
  info: CaptionInfo | null;
  outcome: LookupOutcome;
  attempt: CaptionAttempt;
}> {
  const attempt: CaptionAttempt = {
    client: client.name,
    http: null,
    status: "NO_RESPONSE",
    reason: "",
    trackCount: 0,
  };

  try {
    const response = await fetch(INNERTUBE_API_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": client.userAgent,
      },
      body: JSON.stringify({
        context: client.context,
        videoId,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    attempt.http = response.status;

    if (!response.ok) {
      attempt.status = "HTTP_ERROR";

      return {
        info: null,
        outcome: response.status === 429 ? "blocked" : "error",
        attempt,
      };
    }

    const data = await response.json();

    attempt.status =
      typeof data?.playabilityStatus?.status === "string"
        ? data.playabilityStatus.status
        : "UNKNOWN";

    attempt.reason =
      typeof data?.playabilityStatus?.reason === "string"
        ? data.playabilityStatus.reason
        : "";

    const info = parseCaptionInfo(data);

    attempt.trackCount = info ? info.tracks.length : 0;

    return {
      info,
      outcome: classifyPlayability(
        attempt.status,
        attempt.reason,
        Boolean(info)
      ),
      attempt,
    };
  } catch (error) {
    attempt.error =
      error instanceof Error ? error.name : String(error);

    return { info: null, outcome: "error", attempt };
  }
}

async function lookupCaptions(
  videoId: string
): Promise<CaptionLookup> {
  const attempts: CaptionAttempt[] = [];
  const outcomes: LookupOutcome[] = [];

  for (const client of INNERTUBE_CLIENTS) {
    const result = await lookupWithClient(client, videoId);

    attempts.push(result.attempt);
    outcomes.push(result.outcome);

    if (result.info) {
      return { info: result.info, outcome: "ok", attempts };
    }
  }

  // A client that played the video normally but found no captions is
  // the most trustworthy answer; blocked signals come next.
  const outcome =
    (["no_captions", "blocked", "unavailable", "error"] as const).find(
      (candidate) => outcomes.includes(candidate)
    ) ?? "error";

  console.warn(
    "Caption lookup failed:",
    outcome,
    JSON.stringify(attempts)
  );

  return { info: null, outcome, attempts };
}

// For troubleshooting: what did each YouTube client say?
export async function diagnoseCaptions(videoId: string) {
  const lookup = await lookupCaptions(videoId);

  return { outcome: lookup.outcome, attempts: lookup.attempts };
}

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    );
}

// Handles both caption formats YouTube serves:
//   srv3:    <p t="ms" d="ms"><s>word</s></p>
//   classic: <text start="seconds" dur="seconds">line</text>
export function parseCaptionXml(
  xml: string
): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];

  const pRegex =
    /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;

  let match: RegExpExecArray | null;

  while ((match = pRegex.exec(xml)) !== null) {
    const inner = match[3];

    let text = "";

    const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let sMatch: RegExpExecArray | null;

    while ((sMatch = sRegex.exec(inner)) !== null) {
      text += sMatch[1];
    }

    if (!text) {
      text = inner.replace(/<[^>]+>/g, "");
    }

    text = decodeEntities(text).replace(/\s+/g, " ").trim();

    if (text) {
      segments.push({
        text,
        start: parseInt(match[1], 10) / 1000,
        duration: parseInt(match[2], 10) / 1000,
      });
    }
  }

  if (segments.length > 0) {
    return segments;
  }

  const classicRegex =
    /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

  while ((match = classicRegex.exec(xml)) !== null) {
    const text = decodeEntities(match[3])
      .replace(/\s+/g, " ")
      .trim();

    if (text) {
      segments.push({
        text,
        start: parseFloat(match[1]),
        duration: parseFloat(match[2]),
      });
    }
  }

  return segments;
}

// YouTube answered every translation request with 429 in testing, so
// this is off. Set to true to try it first and fall back to our own.
const TRY_YOUTUBE_TRANSLATION = false;

function sameLanguage(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

function buildLanguageList(info: CaptionInfo) {
  const languages: LanguageOption[] = [];

  // The video's own caption tracks come first.
  for (const track of info.tracks) {
    if (!languages.some((l) => sameLanguage(l.code, track.languageCode))) {
      languages.push({
        code: track.languageCode,
        name: track.name,
      });
    }
  }

  // Then every language we can translate into.
  for (const option of TRANSLATION_LANGUAGES) {
    if (!languages.some((l) => sameLanguage(l.code, option.code))) {
      languages.push(option);
    }
  }

  return languages;
}

async function fetchTrackSegments(
  track: CaptionTrack,
  translateTo?: string
): Promise<TranscriptSegment[]> {
  let captionUrl: URL;

  try {
    captionUrl = new URL(track.baseUrl);
  } catch {
    throw new TranscriptError("failed", NO_CAPTIONS_MESSAGE);
  }

  // Only ever request captions from YouTube itself.
  if (
    captionUrl.protocol !== "https:" ||
    !captionUrl.hostname.endsWith(".youtube.com")
  ) {
    throw new TranscriptError("failed", NO_CAPTIONS_MESSAGE);
  }

  if (translateTo) {
    captionUrl.searchParams.set("tlang", translateTo);
  }

  const response = await fetch(captionUrl, {
    cache: "no-store",
    headers: {
      "User-Agent": CAPTION_USER_AGENT,
      "Accept-Language": translateTo || track.languageCode,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const body = response.ok ? await response.text() : "";

  if (translateTo) {
    console.warn(
      "YouTube caption translation request:",
      translateTo,
      "status",
      response.status,
      "bytes",
      body.length
    );
  }

  if (!response.ok) {
    throw new TranscriptError(
      "failed",
      "Could not fetch the transcript right now. Please try again later."
    );
  }

  const segments = parseCaptionXml(body);

  if (segments.length === 0) {
    throw new TranscriptError(
      "failed",
      "Could not fetch the transcript right now. Please try again later."
    );
  }

  return segments;
}

async function translateOrThrow(
  source: TranscriptSegment[],
  code: string
): Promise<TranscriptSegment[]> {
  try {
    return await translateSegments(source, code);
  } catch (error) {
    if (
      error instanceof TranslationError &&
      error.code === "too_long"
    ) {
      throw new TranscriptError(
        "too_long",
        "This transcript is too long to translate here. Try a shorter video."
      );
    }

    console.error("Translation failed:", error);

    throw new TranscriptError(
      "failed",
      "Translation isn't working right now. Please try again later."
    );
  }
}

async function fetchFromCaptionInfo(
  info: CaptionInfo,
  requestedLanguage?: string
): Promise<TranscriptResult> {
  const languages = buildLanguageList(info);
  const defaultTrack = info.tracks[0];

  let code = defaultTrack.languageCode;
  let segments: TranscriptSegment[];

  if (!requestedLanguage) {
    segments = await fetchTrackSegments(defaultTrack);
  } else {
    const ownTrack = info.tracks.find((candidate) =>
      sameLanguage(candidate.languageCode, requestedLanguage)
    );

    if (ownTrack) {
      // A caption track the video already has.
      segments = await fetchTrackSegments(ownTrack);
      code = ownTrack.languageCode;
    } else {
      const option = languages.find((l) =>
        sameLanguage(l.code, requestedLanguage)
      );

      if (!option) {
        throw new TranscriptError(
          "language_unavailable",
          "This video's transcript isn't available in that language."
        );
      }

      code = option.code;
      segments = [];

      // Attempt 1: YouTube's own automatic translation.
      const translatable = info.tracks.find(
        (candidate) => candidate.isTranslatable
      );

      const youtubeSupportsIt = info.translationLanguages.some(
        (candidate) =>
          sameLanguage(candidate.code, requestedLanguage)
      );

      if (TRY_YOUTUBE_TRANSLATION && translatable && youtubeSupportsIt) {
        try {
          segments = await fetchTrackSegments(
            translatable,
            option.code
          );
        } catch (error) {
          console.warn(
            "YouTube translation failed, using fallback:",
            error
          );
        }
      }

      // Attempt 2: translate the video's own captions ourselves.
      if (segments.length === 0) {
        const source = await fetchTrackSegments(defaultTrack);

        segments = await translateOrThrow(source, option.code);
      }
    }
  }

  return {
    language: code,
    languageName:
      languages.find((l) => sameLanguage(l.code, code))?.name ||
      code,
    originalLanguage: defaultTrack.languageCode,
    languages,
    segments,
  };
}

// ---------------------------------------------------------------
// Fallback: the youtube-transcript package (original language only)
// ---------------------------------------------------------------

function toTranscriptError(error: unknown): TranscriptError {
  if (error instanceof TranscriptError) {
    return error;
  }

  if (error instanceof YoutubeTranscriptTooManyRequestError) {
    return new TranscriptError(
      "blocked",
      "YouTube is temporarily limiting requests from our server. Please try again in a few minutes."
    );
  }

  if (error instanceof YoutubeTranscriptVideoUnavailableError) {
    return new TranscriptError(
      "unavailable",
      "This video is unavailable. It may be private, deleted, or restricted in some regions."
    );
  }

  if (
    error instanceof YoutubeTranscriptNotAvailableLanguageError
  ) {
    return new TranscriptError(
      "language_unavailable",
      "This video's transcript isn't available in that language."
    );
  }

  if (
    error instanceof YoutubeTranscriptDisabledError ||
    error instanceof YoutubeTranscriptNotAvailableError
  ) {
    return new TranscriptError(
      "no_captions",
      NO_CAPTIONS_MESSAGE
    );
  }

  console.error("Transcript fetch failed:", error);

  return new TranscriptError(
    "failed",
    "Could not fetch the transcript right now. Please try again later."
  );
}

async function fetchWithLibrary(
  videoId: string
): Promise<TranscriptResult> {
  let raw;

  try {
    raw = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (error) {
    throw toTranscriptError(error);
  }

  if (!Array.isArray(raw) || raw.length === 0) {
    throw new TranscriptError(
      "no_captions",
      NO_CAPTIONS_MESSAGE
    );
  }

  // The library returns milliseconds for one caption format and
  // seconds (usually with decimals) for the other. Whole numbers
  // everywhere means milliseconds.
  const valuesAreSeconds = raw.some(
    (item) =>
      !Number.isInteger(item.offset) ||
      !Number.isInteger(item.duration)
  );

  const divisor = valuesAreSeconds ? 1 : 1000;

  const segments: TranscriptSegment[] = raw
    .map((item) => ({
      text: item.text.replace(/\s+/g, " ").trim(),
      start: item.offset / divisor,
      duration: item.duration / divisor,
    }))
    .filter((segment) => segment.text.length > 0);

  if (segments.length === 0) {
    throw new TranscriptError(
      "no_captions",
      NO_CAPTIONS_MESSAGE
    );
  }

  const language = raw[0]?.lang ?? null;

  return {
    language,
    languageName: language,
    originalLanguage: language,
    languages: [],
    segments,
  };
}

const BLOCKED_MESSAGE =
  "YouTube is blocking requests from our server right now, so we couldn't read this video's captions. Please try again in a few minutes.";

const UNAVAILABLE_MESSAGE =
  "This video is unavailable. It may be private, deleted, age-restricted, or restricted in some regions.";

const GENERIC_FAILURE_MESSAGE =
  "Could not fetch the transcript right now. Please try again later.";

function languageNameFor(
  code: string,
  extra: LanguageOption[] = []
) {
  return (
    [...extra, ...TRANSLATION_LANGUAGES].find((l) =>
      sameLanguage(l.code, code)
    )?.name || code
  );
}

// Backup source, used only when SUPADATA_API_KEY is set.
async function fetchViaSupadata(
  videoId: string,
  requestedLanguage?: string
): Promise<TranscriptResult> {
  let base;

  try {
    base = await fetchSupadataTranscript(videoId);
  } catch (error) {
    if (
      error instanceof SupadataError &&
      error.code === "no_captions"
    ) {
      throw new TranscriptError("no_captions", NO_CAPTIONS_MESSAGE);
    }

    console.error("Supadata request failed:", error);

    throw new TranscriptError("failed", GENERIC_FAILURE_MESSAGE);
  }

  const originalCode = base.language || "en";

  const ownLanguages: LanguageOption[] = [
    { code: originalCode, name: languageNameFor(originalCode) },
    ...base.availableLanguages.map((code) => ({
      code,
      name: languageNameFor(code),
    })),
  ];

  const languages: LanguageOption[] = [];

  for (const option of [...ownLanguages, ...TRANSLATION_LANGUAGES]) {
    if (!languages.some((l) => sameLanguage(l.code, option.code))) {
      languages.push(option);
    }
  }

  let code = originalCode;
  let segments: TranscriptSegment[] = base.segments;

  if (requestedLanguage && !sameLanguage(requestedLanguage, code)) {
    const option = languages.find((l) =>
      sameLanguage(l.code, requestedLanguage)
    );

    if (!option) {
      throw new TranscriptError(
        "language_unavailable",
        "This video's transcript isn't available in that language."
      );
    }

    if (
      base.availableLanguages.some((available) =>
        sameLanguage(available, requestedLanguage)
      )
    ) {
      try {
        const other = await fetchSupadataTranscript(
          videoId,
          requestedLanguage
        );

        segments = other.segments;
      } catch (error) {
        console.error("Supadata language request failed:", error);

        throw new TranscriptError("failed", GENERIC_FAILURE_MESSAGE);
      }
    } else {
      segments = await translateOrThrow(base.segments, option.code);
    }

    code = option.code;
  }

  return {
    language: code,
    languageName: languageNameFor(code, languages),
    originalLanguage: originalCode,
    languages,
    segments,
  };
}

export async function fetchTranscript(
  videoId: string,
  requestedLanguage?: string
): Promise<TranscriptResult> {
  const lookup = await lookupCaptions(videoId);

  if (lookup.info) {
    try {
      return await fetchFromCaptionInfo(
        lookup.info,
        requestedLanguage
      );
    } catch (error) {
      if (requestedLanguage) {
        // Never silently hand back a different language.
        throw toTranscriptError(error);
      }

      console.warn(
        "Direct caption fetch failed, trying backups:",
        error
      );
    }
  }

  if (lookup.outcome === "unavailable") {
    throw new TranscriptError("unavailable", UNAVAILABLE_MESSAGE);
  }

  // Reading captions straight from YouTube did not work.
  if (isSupadataConfigured()) {
    return fetchViaSupadata(videoId, requestedLanguage);
  }

  if (requestedLanguage) {
    throw new TranscriptError(
      lookup.outcome === "blocked" ? "blocked" : "failed",
      lookup.outcome === "blocked"
        ? BLOCKED_MESSAGE
        : "Choosing a language isn't available right now. Please try again later."
    );
  }

  // The package re-reads the watch page, which can still succeed
  // when the app clients above did not. Skip it when we know
  // YouTube is blocking us.
  if (lookup.outcome !== "blocked") {
    try {
      return await fetchWithLibrary(videoId);
    } catch (error) {
      if (lookup.outcome === "error") {
        throw toTranscriptError(error);
      }
    }
  }

  if (lookup.outcome === "blocked") {
    throw new TranscriptError("blocked", BLOCKED_MESSAGE);
  }

  if (lookup.outcome === "no_captions") {
    throw new TranscriptError("no_captions", NO_CAPTIONS_MESSAGE);
  }

  throw new TranscriptError("failed", GENERIC_FAILURE_MESSAGE);
}

// Title and channel name via YouTube's public oEmbed endpoint.
// A failure here is not fatal; the transcript still works.
export async function fetchVideoMeta(
  videoId: string
): Promise<VideoMeta> {
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        watchUrl
      )}&format=json`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return { title: null, author: null };
    }

    const data = await response.json();

    return {
      title:
        typeof data?.title === "string" ? data.title : null,
      author:
        typeof data?.author_name === "string"
          ? data.author_name
          : null,
    };
  } catch {
    return { title: null, author: null };
  }
}