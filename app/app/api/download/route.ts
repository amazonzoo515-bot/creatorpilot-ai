import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const check = searchParams.get("check");
  const videoId = searchParams.get("id");
  const imageUrl = searchParams.get("url");

  // -----------------------------
  // Check if HD thumbnail exists
  // -----------------------------
  if (check === "true" && videoId) {
    const hdUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    try {
      const response = await fetch(hdUrl, {
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json({
          hdAvailable: false,
        });
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      // Placeholder image is very small
      const hdAvailable = buffer.length > 30000;

      return NextResponse.json({
        hdAvailable,
      });
    } catch {
      return NextResponse.json({
        hdAvailable: false,
      });
    }
  }

  // -----------------------------
  // Download image
  // -----------------------------
  if (!imageUrl) {
    return new NextResponse("Missing image URL", {
      status: 400,
    });
  }

  try {
    const response = await fetch(imageUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("Image not found", {
        status: 404,
      });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error(error);

    return new NextResponse("Failed to fetch image", {
      status: 500,
    });
  }
}