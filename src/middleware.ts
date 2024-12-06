// middleware.ts
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessToken } from "@/app/actions/spotify";

export async function middleware(request: NextRequest) {
  // Auth0セッションチェック
  const session = await getSession();
  const protectedPaths = ["/dashboard", "/song", "/mypage"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    const returnTo = "registration";
    return NextResponse.redirect(
      new URL(`/api/auth/login?returnTo=${returnTo}`, request.url)
    );
  }
  // Spotifyトークンチェック
  if (session) {
    const token = request.cookies.get("spotify_access_token");
    if (!token) {
      const newToken = await getAccessToken();
      const response = NextResponse.next();
      response.cookies.set("spotify_access_token", newToken);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/(default)/:path*",
    "/dashboard/:path*",
    "/song/:path*",
    "/mypage/:path*",
    "/registration",
  ],
};
