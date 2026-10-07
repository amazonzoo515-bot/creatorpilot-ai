import { NextRequest, NextResponse } from "next/server";

import {
  TranscriptError,
  diagnoseCaptions,
  extractYouTubeVideoId,
  fetchTranscript,
  fetchVideoMeta,
  isValidLanguageCode,
} from "../../../lib/transcript";

export const runtime = "nodejs";
export const maxDuration = 60;

// Best-effort limiter. Serverless instances do not share memory,
// so also add a rate-limit rule in the Vercel Firewall.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<
  string,
  { count: number; resetAt: number }
>();

function isRateLimited(ip: string) {
  const now = Date.now();

  if (hits.size > 5000) {
    for (const [key, value] of hits) {
      if (value.resetAt <= now) {
        hits.delete(key);
      }
    }
  }

  const entry = hits.get(ip);

  if (!entry || entry.resetAt <= now) {
    hits.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return false;
  }

  entry.count += 1;

  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function errorResponse(
  message: string,
  status: number,
  code: string
) {
  return NextResponse.json(
    { error: message, code },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return errorResponse(
      "Too many requests. Please wait a minute and try again.",
      429,
      "rate_limited"
    );
  }

  const input =
    request.nextUrl.searchParams.get("url") || "";

  if (input.length > 300) {
    return errorResponse(
      "Please enter a valid YouTube video link.",
      400,
      "invalid_url"
    );
  }

  const videoId = extractYouTubeVideoId(input);

  if (!videoId) {
    return errorResponse(
      "Please enter a valid YouTube video link.",
      400,
      "invalid_url"
    );
  }

  // Troubleshooting: /api/transcript?url=...&debug=KEY shows what each
  // YouTube client answered. Works locally, or in production when the
  // TRANSCRIPT_DEBUG_KEY environment variable matches KEY.
  const debugParam = request.nextUrl.searchParams.get("debug");

  if (debugParam !== null) {
    const debugKey = process.env.TRANSCRIPT_DEBUG_KEY;

    const allowed =
      process.env.NODE_ENV !== "production" ||
      (Boolean(debugKey) && debugParam === debugKey);

    if (allowed) {
      return NextResponse.json(await diagnoseCaptions(videoId), {
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  const languageParam =
    request.nextUrl.searchParams.get("lang")?.trim() || "";

  if (languageParam && !isValidLanguageCode(languageParam)) {
    return errorResponse(
      "That language isn't supported.",
      400,
      "language_unavailable"
    );
  }

  try {
    const [transcript, meta] = await Promise.all([
      fetchTranscript(videoId, languageParam || undefined),
      fetchVideoMeta(videoId),
    ]);

    return NextResponse.json(
      {
        videoId,
        title: meta.title,
        author: meta.author,
        language: transcript.language,
        languageName: transcript.languageName,
        originalLanguage: transcript.originalLanguage,
        languages: transcript.languages,
        segments: transcript.segments,
      },
      {
        headers: {
          // Cached copies reduce repeat requests to YouTube.
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    if (error instanceof TranscriptError) {
      const status =
        error.code === "no_captions" ||
        error.code === "unavailable" ||
        error.code === "language_unavailable"
          ? 404
          : error.code === "too_long"
            ? 413
            : error.code === "blocked"
              ? 503
              : 502;

      return errorResponse(
        error.message,
        status,
        error.code
      );
    }

    console.error("Transcript route error:", error);

    return errorResponse(
      "Could not fetch the transcript right now. Please try again later.",
      502,
      "failed"
    );
  }
}