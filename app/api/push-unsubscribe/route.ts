import { auth } from "@/auth";
import { unsubscribeUser } from "@/lib/push-actions";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ success: false, error: "User not authenticated" }),
        { status: 401 },
      );
    }

    const result = await unsubscribeUser();

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
