import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/v1/api/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.USER_TOKEN}`,
          "Token-Type": "user",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch earthquake records: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve earthquake records" },
      { status: 500 },
    );
  }
}
