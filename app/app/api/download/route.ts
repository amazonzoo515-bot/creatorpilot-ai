import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing image URL", {
      status: 400,
    });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse("Image not found", {
        status: 404,
      });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "image/jpeg",

        "Cache-Control": "public,max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Server Error", {
      status: 500,
    });
  }
}