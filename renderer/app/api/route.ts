import { NextResponse } from "next/server";

const METADATA_URL = "https://start.spring.io/metadata/client";
const ACCEPT = "application/vnd.initializr.v2.3+json";
export const dynamic = "force-static";

export async function GET() {
  try {
    const response = await fetch(METADATA_URL, {
      method: "GET",
      headers: {
        Accept: ACCEPT,
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Failed to fetch metadata from start.spring.io",
          status: response.status,
        },
        {
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to reach start.spring.io metadata endpoint",
      },
      {
        status: 502,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  });
}
