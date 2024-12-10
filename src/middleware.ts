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
    const tokenExpiry = request.cookies.get("spotify_token_expiry");

    const isTokenExpired = () => {
      if (!tokenExpiry) return true;
      const expiryTime = parseInt(tokenExpiry.value);
      console.log("expire");
      return Date.now() >= expiryTime;
    };

    // トークンが存在しないか期限切れの場合
    if (!token || isTokenExpired()) {
      try {
        const newToken = await getAccessToken();
        const response = NextResponse.next();

        // 新しいトークンと有効期限（1時間）を設定
        const expiryTime = Date.now() + 3500 * 1000; //　期限切れ少し前のタイムスタンプ

        response.cookies.set("spotify_access_token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        response.cookies.set("spotify_token_expiry", expiryTime.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return response;
      } catch (error) {
        console.error("Failed to refresh Spotify token:", error);
        // トークン取得に失敗した場合は既存のCookieを削除
        const response = NextResponse.next();
        response.cookies.delete("spotify_access_token");
        response.cookies.delete("spotify_token_expiry");
        return response;
      }
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
