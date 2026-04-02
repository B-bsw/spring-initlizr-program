import { NextResponse } from "next/server";

const STARTER_ZIP_URL =
  "https://start.spring.io/starter.zip?type=gradle-project&language=java&bootVersion=4.0.5&baseDir=demo&groupId=com.example&artifactId=demo&packageName=com.example.demo&packaging=jar&javaVersion=21&configurationFileFormat=properties";

export const dynamic = "force-static";

export async function GET() {
  try {
    const response = await fetch(STARTER_ZIP_URL, {
      method: "GET",
      headers: {
        Accept: "application/zip",
      },
      cache: "force-cache",
    });

    if (!response.ok || !response.body) {
      return NextResponse.json(
        {
          message: "Failed to fetch starter zip from start.spring.io",
          status: response.status,
        },
        {
          status: response.status || 502,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/zip",
        "Content-Disposition":
          response.headers.get("Content-Disposition") ??
          'attachment; filename="starter.zip"',
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to reach start.spring.io starter endpoint",
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
