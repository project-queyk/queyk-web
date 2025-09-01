import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/v1/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
        "Token-Type": "admin",
      },
    });

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
