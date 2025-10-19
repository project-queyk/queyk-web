import { NextRequest } from "next/server";

import { subscribeUser } from "@/lib/push-actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription } = body;

    if (!subscription) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing subscription" }),
        { status: 400 },
      );
    }

    const result = await subscribeUser(subscription);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error)?.message || "Unknown error",
      }),
      { status: 500 },
    );
  }
}
