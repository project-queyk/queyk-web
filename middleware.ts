import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth(async (request: NextRequest) => {
  const url = request.nextUrl;

  if (url.pathname === "/api/auth/signin" && url.searchParams.has("error")) {
    const error = url.searchParams.get("error");
    return NextResponse.redirect(new URL(`/error?error=${error}`, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!public|_next|api).*)"],
};
