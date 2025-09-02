import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const name = searchParams.get("name") || "";

    const queryParams = new URLSearchParams({
      page,
      pageSize,
      ...(name && { name }),
    });

    const response = await fetch(
      `${process.env.BACKEND_URL}/v1/api/users?${queryParams}`,
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
