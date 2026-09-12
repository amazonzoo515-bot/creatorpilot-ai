import { NextRequest, NextResponse } from "next/server";

function isFacebookUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname === "facebook.com" ||
      hostname === "www.facebook.com" ||
      hostname === "m.facebook.com" ||
      hostname === "fb.watch"
    );
  } catch {
    return false;
  }
}

function isTwitterUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname === "x.com" ||
      hostname === "www.x.com" ||
      hostname === "twitter.com" ||
      hostname === "www.twitter.com" ||
      hostname === "mobile.twitter.com"
    );
  } catch {
    return false;
  }
}

function isVimeoUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname === "vimeo.com" ||
      hostname === "www.vimeo.com"
    );
  } catch {
    return false;
  }
}

function isTikTokUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname === "tiktok.com" ||
      hostname === "www.tiktok.com" ||
      hostname === "m.tiktok.com"
    );
  } catch {
    return false;
  }
}

function isDailymotionUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname === "dailymotion.com" ||
      hostname === "www.dailymotion.com" ||
      hostname === "dai.ly" ||
      hostname === "www.dai.ly"
    );
  } catch {
    return false;
  }
}
function getBilibiliImageCandidates(url: string): string[] {
  const candidates = new Set<string>();

  try {
    const normalized = url
      .trim()
      .replace(/\\u002F/g, "/")
      .replace(/\\u003A/gi, ":")
      .replace(/^\/\//, "https://")
      .replace(/^http:\/\//i, "https://");

    candidates.add(normalized);

    const cleanUrl = normalized.replace(/@[^/?#]+$/, "");

    // Force JPEG
    candidates.add(`${cleanUrl}@.jpg`);

    // Force WebP
    candidates.add(`${cleanUrl}@.webp`);

    // Force AVIF
    candidates.add(`${cleanUrl}@.avif`);
  } catch {
    candidates.add(url);
  }

  return Array.from(candidates);
}

function detectImageContentType(
  buffer: ArrayBuffer
): string | null {
  const bytes = new Uint8Array(buffer);

  // JPEG
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // PNG
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // GIF
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return "image/gif";
  }

  // WebP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // AVIF
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    const brand = String.fromCharCode(
      bytes[8],
      bytes[9],
      bytes[10],
      bytes[11]
    );

    if (
      brand === "avif" ||
      brand === "avis"
    ) {
      return "image/avif";
    }
  }

  return null;
}

// Bilibili video/page URL
function isBilibiliUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname === "bilibili.com" ||
      hostname === "www.bilibili.com" ||
      hostname.endsWith(".bilibili.com") ||
      hostname === "b23.tv" ||
      hostname === "www.b23.tv"
    );
  } catch {
    return false;
  }
}

// Bilibili thumbnail/image CDN URL
function isBilibiliImageUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname.endsWith(".hdslb.com") ||
      hostname.endsWith(".biliimg.com")
    );
  } catch {
    return false;
  }
}

function extractTwitterTweetId(url: string) {
  try {
    const parsedUrl = new URL(url);

    const match = parsedUrl.pathname.match(
      /\/status\/(\d+)/
    );

    return match?.[1] || null;
  } catch {
    return null;
  }
}

function extractBilibiliVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);

    const bvMatch = parsedUrl.pathname.match(
      /\/video\/(BV[a-zA-Z0-9]+)/
    );

    if (bvMatch?.[1]) {
      return bvMatch[1];
    }

    const directBvMatch = parsedUrl.pathname.match(
      /(BV[a-zA-Z0-9]+)/
    );

    return directBvMatch?.[1] || null;
  } catch {
    return null;
  }
}

function extractDailymotionVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (
      hostname === "dai.ly" ||
      hostname === "www.dai.ly"
    ) {
      return (
        parsedUrl.pathname
          .slice(1)
          .split("/")[0] || null
      );
    }

    const match = parsedUrl.pathname.match(
      /\/video\/([^/?]+)/
    );

    return match?.[1] || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const check = searchParams.get("check");
  const videoId = searchParams.get("id");
  const imageUrl = searchParams.get("url");

  // --------------------------------
  // Vimeo
  // --------------------------------

  if (imageUrl && isVimeoUrl(imageUrl)) {
    try {
      const response = await fetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
          imageUrl
        )}&maxwidth=1280`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "Vimeo video not found",
          },
          { status: 404 }
        );
      }

      const data = await response.json();

      if (!data.thumbnail_url) {
        return NextResponse.json(
          {
            error: "Vimeo thumbnail not available",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        platform: "vimeo",
        title: data.title || "Vimeo Video",
        thumbnailUrl: data.thumbnail_url,
        thumbnailWidth:
          data.thumbnail_width || null,
        thumbnailHeight:
          data.thumbnail_height || null,
        videoId: data.video_id || null,
      });
    } catch (error) {
      console.error(
        "Vimeo oEmbed error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch Vimeo thumbnail",
        },
        { status: 500 }
      );
    }
  }

  // --------------------------------
  // TikTok
  // --------------------------------

  if (imageUrl && isTikTokUrl(imageUrl)) {
    try {
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(
          imageUrl
        )}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "TikTok video not found",
          },
          { status: 404 }
        );
      }

      const data = await response.json();

      if (!data.thumbnail_url) {
        return NextResponse.json(
          {
            error:
              "TikTok thumbnail not available",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        platform: "tiktok",
        title: data.title || "TikTok Video",
        authorName:
          data.author_name || null,
        thumbnailUrl: data.thumbnail_url,
        thumbnailWidth:
          data.thumbnail_width || null,
        thumbnailHeight:
          data.thumbnail_height || null,
      });
    } catch (error) {
      console.error(
        "TikTok oEmbed error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch TikTok thumbnail",
        },
        { status: 500 }
      );
    }
  }

         // --------------------------------
  // Facebook thumbnail
  // --------------------------------

  if (imageUrl && isFacebookUrl(imageUrl)) {
    try {
      const normalizedUrl = imageUrl.trim();

      const apiUrl =
        `https://mediasaver.link/api/?url=${encodeURIComponent(
          normalizedUrl
        )}`;

      const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          "Facebook extraction service status:",
          response.status
        );

        return NextResponse.json(
          {
            error:
              "Facebook extraction service failed",
          },
          { status: 502 }
        );
      }

      const data = await response.json();

      if (data?.error) {
        console.error(
          "Facebook extraction service error:",
          data
        );

        return NextResponse.json(
          {
            error:
              data.message ||
              "Facebook thumbnail could not be extracted",
          },
          { status: 404 }
        );
      }

      const mediaUrls = Array.isArray(data?.data)
        ? data.data.filter(
            (item: unknown): item is string =>
              typeof item === "string" &&
              item.length > 0
          )
        : [];

        const imageCandidates = mediaUrls.filter(
          (url: string) =>
            /\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(url)
        );

        const thumbnailUrl =
        imageCandidates[0] ||
        mediaUrls.find((url: string) =>
          /image|thumbnail|cover|jpg|jpeg|png|webp/i.test(
            url
          )
        );

      if (!thumbnailUrl) {
        return NextResponse.json(
          {
            error:
              "Facebook thumbnail is not available from the extraction service",
          },
          { status: 404 }
        );
      }

      // Verify that the returned image is actually reachable.
      const imageResponse = await fetch(
        thumbnailUrl,
        {
          method: "HEAD",
          cache: "no-store",
        }
      );

      if (!imageResponse.ok) {
        return NextResponse.json(
          {
            error:
              "Facebook thumbnail image could not be verified",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        platform: "facebook",
        title: "Facebook Video Thumbnail",
        thumbnailUrl,
        thumbnailWidth: null,
        thumbnailHeight: null,
      });
    } catch (error) {
      console.error(
        "Facebook thumbnail error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch Facebook thumbnail",
        },
        { status: 502 }
      );
    }
  }
    // --------------------------------
  // X / Twitter thumbnail
  // --------------------------------

  if (imageUrl && isTwitterUrl(imageUrl)) {
    try {
      const tweetId = extractTwitterTweetId(imageUrl);

      if (!tweetId) {
        return NextResponse.json(
          {
            error: "Invalid X/Twitter URL",
          },
          { status: 400 }
        );
      }

      const token = (
        (Number(tweetId) / 1e15) *
        Math.PI
      )
        .toString(36)
        .replace(/(0+|\.)/g, "");

      const apiUrl =
        `https://cdn.syndication.twimg.com/tweet-result` +
        `?id=${encodeURIComponent(tweetId)}` +
        `&token=${encodeURIComponent(token)}` +
        `&lang=en`;

      const response = await fetch(apiUrl, {
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(
          "X/Twitter extraction service status:",
          response.status
        );

        return NextResponse.json(
          {
            error: "X/Twitter post could not be fetched",
          },
          { status: 404 }
        );
      }

      const data = await response.json();

      const mediaDetails = Array.isArray(data?.mediaDetails)
        ? data.mediaDetails
        : Array.isArray(data?.quoted_tweet?.mediaDetails)
          ? data.quoted_tweet.mediaDetails
          : [];

      const media = mediaDetails.find(
        (item: unknown) => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const candidate = item as {
            media_url_https?: unknown;
            type?: unknown;
          };

          return (
            typeof candidate.media_url_https === "string" &&
            candidate.media_url_https.length > 0 &&
            (candidate.type === "photo" ||
              candidate.type === "video" ||
              candidate.type === "animated_gif")
          );
        }
      ) as
        | {
            media_url_https?: string;
            original_info?: {
              width?: number;
              height?: number;
            };
          }
        | undefined;

      if (!media?.media_url_https) {
        return NextResponse.json(
          {
            error:
              "No thumbnail image was found on this X/Twitter post",
          },
          { status: 404 }
        );
      }

      const thumbnailWidth =
        Number(media.original_info?.width) || null;

      const thumbnailHeight =
        Number(media.original_info?.height) || null;

      return NextResponse.json({
        platform: "twitter",
        title: data.text
          ? data.text.slice(0, 100)
          : "X/Twitter Post",
        thumbnailUrl: media.media_url_https,
        thumbnailWidth,
        thumbnailHeight,
        videoId: tweetId,
      });
    } catch (error) {
      console.error(
        "X/Twitter thumbnail error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch X/Twitter thumbnail",
        },
        { status: 502 }
      );
    }
  }
  
          // --------------------------------
  // Bilibili thumbnail
  // --------------------------------

  if (imageUrl && isBilibiliUrl(imageUrl)) {
    try {
      let resolvedUrl = imageUrl.trim();

      // Resolve b23.tv short links.
      if (
        new URL(resolvedUrl).hostname
          .toLowerCase() === "b23.tv"
      ) {
        const redirectResponse = await fetch(
          resolvedUrl,
          {
            method: "GET",
            redirect: "follow",
            cache: "no-store",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language":
                "en-US,en;q=0.9",
            },
          }
        );

        resolvedUrl =
          redirectResponse.url || resolvedUrl;
      }

      const bilibiliVideoId =
        extractBilibiliVideoId(resolvedUrl);

      if (!bilibiliVideoId) {
        return NextResponse.json(
          {
            error:
              "Could not resolve the Bilibili video ID",
          },
          { status: 404 }
        );
      }

      let thumbnailUrl: string | null = null;
      let title = "Bilibili Video";
      const thumbnailWidth: number | null = null;
      const thumbnailHeight: number | null = null;

      // --------------------------------
      // Method 1: Public API
      // --------------------------------

      try {
        const apiUrl =
          "https://api.bilibili.com/x/web-interface/view" +
          `?bvid=${encodeURIComponent(
            bilibiliVideoId
          )}`;

        const apiResponse = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
            Referer: "https://www.bilibili.com/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
            "Accept-Language":
              "en-US,en;q=0.9",
          },
        });

        const apiData = await apiResponse.json();

        if (
          apiResponse.ok &&
          apiData?.code === 0 &&
          apiData?.data
        ) {
          thumbnailUrl =
            typeof apiData.data.pic === "string"
              ? apiData.data.pic
              : null;

          title =
            typeof apiData.data.title === "string" &&
            apiData.data.title
              ? apiData.data.title
              : "Bilibili Video";
        } else {
          console.warn(
            "Bilibili API fallback:",
            apiData?.code,
            apiData?.message
          );
        }
      } catch (apiError) {
        console.warn(
          "Bilibili API request failed:",
          apiError
        );
      }

      // --------------------------------
      // Method 2: Bilibili page HTML
      // --------------------------------

      if (!thumbnailUrl) {
        try {
          const pageResponse = await fetch(
            resolvedUrl,
            {
              method: "GET",
              redirect: "follow",
              cache: "no-store",
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language":
                  "en-US,en;q=0.9",
                Referer:
                  "https://www.bilibili.com/",
              },
            }
          );

          console.log(
            "Bilibili page status:",
            pageResponse.status,
            pageResponse.url
          );

          if (pageResponse.ok) {
            const html =
              await pageResponse.text();

            // ------------------------------
            // 2A. __INITIAL_STATE__
            // ------------------------------

            const initialStateMatch =
              html.match(
                /window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\})\s*;?\s*\(function/i
              );

            if (initialStateMatch?.[1]) {
              try {
                const initialState =
                  JSON.parse(
                    initialStateMatch[1]
                  );

                const videoData =
                  initialState?.videoData;

                if (videoData) {
                  if (
                    typeof videoData.pic === "string" &&
                    videoData.pic
                  ) {
                    thumbnailUrl =
                      videoData.pic;
                  }

                  if (
                    typeof videoData.title === "string" &&
                    videoData.title
                  ) {
                    title =
                      videoData.title;
                  }
                }
              } catch (stateError) {
                console.warn(
                  "Bilibili initial state parse failed:",
                  stateError
                );
              }
            }

            // ------------------------------
            // 2B. JSON-LD
            // ------------------------------

            if (!thumbnailUrl) {
              const jsonLdMatches = [
                ...html.matchAll(
                  /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
                ),
              ];

              for (const match of jsonLdMatches) {
                try {
                  const jsonLd =
                    JSON.parse(
                      match[1]
                    );

                  const items = Array.isArray(
                    jsonLd
                  )
                    ? jsonLd
                    : [jsonLd];

                  for (const item of items) {
                    const image =
                      typeof item?.image ===
                      "string"
                        ? item.image
                        : Array.isArray(
                              item?.image
                            )
                          ? item.image[0]
                          : null;

                    if (
                      typeof image === "string" &&
                      image
                    ) {
                      thumbnailUrl = image;
                    }

                    if (
                      typeof item?.name ===
                        "string" &&
                      item.name
                    ) {
                      title = item.name;
                    }

                    if (thumbnailUrl) {
                      break;
                    }
                  }
                } catch {
                  // Ignore invalid JSON-LD blocks.
                }

                if (thumbnailUrl) {
                  break;
                }
              }
            }

            // ------------------------------
            // 2C. Meta fallbacks
            // ------------------------------

            if (!thumbnailUrl) {
              const imageCandidates = [
                html.match(
                  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
                ),
                html.match(
                  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
                ),
                html.match(
                  /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
                ),
                html.match(
                  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
                ),
              ];

              for (const match of imageCandidates) {
                if (match?.[1]) {
                  thumbnailUrl = match[1];
                  break;
                }
              }
            }

            // ------------------------------
            // 2D. Title fallback
            // ------------------------------

            if (title === "Bilibili Video") {
              const titleMatches = [
                html.match(
                  /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
                ),
                html.match(
                  /<title[^>]*>([^<]+)<\/title>/i
                ),
              ];

              for (const match of titleMatches) {
                if (match?.[1]) {
                  title = match[1]
                    .replace(
                      /\s*-\s*哔哩哔哩\s*$/i,
                      ""
                    )
                    .trim();

                  break;
                }
              }
            }
          }
        } catch (pageError) {
          console.warn(
            "Bilibili page extraction failed:",
            pageError
          );
        }
      }

      if (!thumbnailUrl) {
        return NextResponse.json(
          {
            error:
              "Bilibili thumbnail could not be extracted",
          },
          { status: 404 }
        );
      }

      // Normalize escaped / protocol-relative URLs.
      thumbnailUrl = thumbnailUrl
        .replace(/\\u002F/g, "/")
        .replace(/\\u003A/gi, ":")
        .replace(/^\/\//, "https://");

      return NextResponse.json({
        platform: "bilibili",
        title,
        videoId: bilibiliVideoId,
        thumbnailUrl,
        thumbnailWidth,
        thumbnailHeight,
      });
    } catch (error) {
      console.error(
        "Bilibili thumbnail error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch Bilibili thumbnail",
        },
        { status: 502 }
      );
    }
  }
  
  // --------------------------------
  // Dailymotion
  // --------------------------------

  if (
    imageUrl &&
    isDailymotionUrl(imageUrl)
  ) {
    try {
      const dailymotionVideoId =
        extractDailymotionVideoId(
          imageUrl
        );

      if (!dailymotionVideoId) {
        return NextResponse.json(
          {
            error:
              "Invalid Dailymotion URL",
          },
          { status: 400 }
        );
      }

      const fields = [
        "id",
        "title",
        "width",
        "height",
        "thumbnail_url",
        "thumbnail_1080_url",
        "thumbnail_720_url",
        "thumbnail_480_url",
        "thumbnail_360_url",
        "thumbnail_240_url",
        "thumbnail_180_url",
        "thumbnail_120_url",
        "thumbnail_62_url",
        "thumbnail_60_url",
      ].join(",");

      const apiUrl =
        `https://api.dailymotion.com/video/${dailymotionVideoId}` +
        `?fields=${encodeURIComponent(fields)}`;

      const response = await fetch(apiUrl, {
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            error:
              "Dailymotion video not found",
          },
          { status: 404 }
        );
      }

      const data = await response.json();

      const sourceWidth = Number(data.width);
      const sourceHeight = Number(data.height);

      const thumbnailFields = [
        {
          key: "thumbnail_1080_url",
          height: 1080,
        },
        {
          key: "thumbnail_720_url",
          height: 720,
        },
        {
          key: "thumbnail_480_url",
          height: 480,
        },
        {
          key: "thumbnail_360_url",
          height: 360,
        },
        {
          key: "thumbnail_240_url",
          height: 240,
        },
        {
          key: "thumbnail_180_url",
          height: 180,
        },
        {
          key: "thumbnail_120_url",
          height: 120,
        },
        {
          key: "thumbnail_62_url",
          height: 62,
        },
        {
          key: "thumbnail_60_url",
          height: 60,
        },
      ];

      const thumbnails: Array<{
        name: string;
        resolution: string;
        url: string;
        available: boolean;
      }> = [];

      const seenUrls = new Set<string>();

      for (const field of thumbnailFields) {
        const thumbnailUrl =
          data[field.key];

        if (
          typeof thumbnailUrl !==
            "string" ||
          !thumbnailUrl
        ) {
          continue;
        }

        if (seenUrls.has(thumbnailUrl)) {
          continue;
        }

        seenUrls.add(thumbnailUrl);

        let width = 0;
        const height = field.height;

        if (
          sourceWidth > 0 &&
          sourceHeight > 0
        ) {
          width = Math.round(
            (sourceWidth /
              sourceHeight) *
              height
          );
        }

        const resolution =
          width > 0
            ? `${width} × ${height}`
            : `${height}px height`;

        thumbnails.push({
          name: `${height}p Thumbnail`,
          resolution,
          url: thumbnailUrl,
          available: true,
        });
      }

      // Original / raw thumbnail
      if (
        typeof data.thumbnail_url ===
          "string" &&
        data.thumbnail_url &&
        !seenUrls.has(
          data.thumbnail_url
        )
      ) {
        const rawResolution =
          sourceWidth > 0 &&
          sourceHeight > 0
            ? `${sourceWidth} × ${sourceHeight}`
            : "Original Size";

        thumbnails.push({
          name: "Original Thumbnail",
          resolution: rawResolution,
          url: data.thumbnail_url,
          available: true,
        });
      }

      if (thumbnails.length === 0) {
        return NextResponse.json(
          {
            error:
              "No Dailymotion thumbnails are available",
          },
          { status: 404 }
        );
      }

      // Highest resolution first.
      thumbnails.sort((a, b) => {
        const getArea = (
          resolution: string
        ) => {
          const match =
            resolution.match(
              /(\d+)\s*×\s*(\d+)/
            );

          if (!match) {
            return 0;
          }

          return (
            Number(match[1]) *
            Number(match[2])
          );
        };

        return (
          getArea(b.resolution) -
          getArea(a.resolution)
        );
      });

      return NextResponse.json({
        platform: "dailymotion",
        title:
          data.title ||
          "Dailymotion Video",
        videoId: dailymotionVideoId,
        thumbnails,
      });
    } catch (error) {
      console.error(
        "Dailymotion thumbnail error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch Dailymotion thumbnails",
        },
        { status: 500 }
      );
    }
  }

  // --------------------------------
  // YouTube HD availability
  // --------------------------------

  if (check === "true" && videoId) {
    const hdUrl =
      `https://img.youtube.com/vi/` +
      `${videoId}/maxresdefault.jpg`;

    try {
      const response = await fetch(
        hdUrl,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return NextResponse.json({
          hdAvailable: false,
        });
      }

      const buffer = Buffer.from(
        await response.arrayBuffer()
      );

      const hdAvailable =
        buffer.length > 30000;

      return NextResponse.json({
        hdAvailable,
      });
    } catch {
      return NextResponse.json({
        hdAvailable: false,
      });
    }
  }

  // --------------------------------
// Image proxy / download
// --------------------------------

if (!imageUrl) {
  return new NextResponse(
    "Missing image URL",
    {
      status: 400,
    }
  );
}

try {
  const isBilibiliImage =
    isBilibiliImageUrl(imageUrl);

  const candidates = isBilibiliImage
    ? getBilibiliImageCandidates(imageUrl)
    : [imageUrl];

  let lastStatus = 404;

  for (const candidate of candidates) {
    try {
      const targetUrl = new URL(candidate);

      const headers: HeadersInit = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/jpeg,image/png,image/*,*/*;q=0.8",
      };

      if (isBilibiliImage) {
        headers.Referer =
          "https://www.bilibili.com/";
        headers.Origin =
          "https://www.bilibili.com";
      }

      const response = await fetch(
        targetUrl,
        {
          method: "GET",
          cache: "no-store",
          redirect: "follow",
          headers,
        }
      );

      lastStatus = response.status;

      if (!response.ok) {
        console.warn(
          "Image candidate failed:",
          response.status,
          candidate
        );
        continue;
      }

      const buffer =
        await response.arrayBuffer();

      if (buffer.byteLength < 100) {
        console.warn(
          "Image candidate too small:",
          buffer.byteLength,
          candidate
        );
        continue;
      }

      const detectedContentType =
        detectImageContentType(buffer);

      const responseContentType =
        response.headers.get(
          "content-type"
        );

      const contentType =
        detectedContentType ||
        (
          responseContentType?.startsWith(
            "image/"
          )
            ? responseContentType
            : null
        );

      if (!contentType) {
        console.warn(
          "Response is not a valid image:",
          responseContentType,
          candidate
        );
        continue;
      }

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(
            buffer.byteLength
          ),
          "Cache-Control":
            "public, max-age=86400, s-maxage=86400",
          "X-Content-Type-Options":
            "nosniff",
        },
      });
    } catch (candidateError) {
      console.warn(
        "Image candidate request failed:",
        candidate,
        candidateError
      );
    }
  }

  return new NextResponse(
    "Image not found",
    {
      status:
        lastStatus >= 400
          ? lastStatus
          : 404,
    }
  );
} catch (error) {
  console.error(
    "Image proxy error:",
    error
  );

  return new NextResponse(
    "Failed to fetch image",
    {
      status: 500,
    }
  );
}
}