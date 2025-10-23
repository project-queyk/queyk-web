import { NextResponse } from "next/server";

import { auth } from "@/auth";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ success: false, error: "User not authenticated" }),
        { status: 401 },
      );
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/v1/api/iot/device/reset`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
          "Token-Type": "admin",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to reboot IoT device: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to reboot IoT device" },
      { status: 500 },
    );
  }
}
