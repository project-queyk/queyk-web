import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { phoneNumber } = body;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/v1/api/users/${session.user.id}/phone-number`,
      {
        method: "PATCH",
        body: JSON.stringify({
          phoneNumber: phoneNumber ? `+63${phoneNumber}` : "",
        }),
        headers: {
          Authorization: `Bearer ${process.env.USER_TOKEN}`,
          "Token-Type": "user",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to update user's phone number: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to update user's phone number" },
      { status: 500 },
    );
  }
}
