import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/v1/api/users/${userId}/role`,
      {
        method: "PATCH",
        body: JSON.stringify({
          role: role,
        }),
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
          "Token-Type": "admin",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.message ||
            `Failed to update user role: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update user role",
      },
      { status: 500 },
    );
  }
}
