import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate && !endDate) {
      return NextResponse.json(
        {
          error:
            "Invalid date range: requires at least one date (startDate or endDate)",
        },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/v1/api/readings?startDate=${startDate}&endDate=${endDate}&platform=web`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
          "Token-Type": "admin",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch readings: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve readings" },
      { status: 500 },
    );
  }
}
