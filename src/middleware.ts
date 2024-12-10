import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessToken, refreshSpotifyToken } from "@/app/actions/spotify";
import {
  COOKIE_SPOTIFY_ACCESS_TOKEN,
  COOKIE_SPOTIFY_EXPIRY_TOKEN,
  COOKIE_SPOTIFY_REFRESH_TOKEN,
} from "@/const/spotify";

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
    const token = request.cookies.get(COOKIE_SPOTIFY_ACCESS_TOKEN);
    const tokenExpiry = request.cookies.get(COOKIE_SPOTIFY_EXPIRY_TOKEN);
    const refreshToken = request.cookies.get(COOKIE_SPOTIFY_REFRESH_TOKEN);

    const isTokenExpired = () => {
      if (!tokenExpiry) return true;
      const expiryTime = parseInt(tokenExpiry.value);
      return Date.now() >= expiryTime;
    };

    if (!token) {
      try {
        const newToken = await getAccessToken();
        const response = NextResponse.next();

        // 新しいトークンと有効期限（1時間）を設定
        const expiryTime = Date.now() + 3500 * 1000; // 期限切れ少し前のタイムスタンプ

        response.cookies.set(
          COOKIE_SPOTIFY_ACCESS_TOKEN,
          newToken.access_token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          }
        );

        response.cookies.set(
          COOKIE_SPOTIFY_REFRESH_TOKEN,
          newToken.refresh_token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          }
        );

        response.cookies.set(
          COOKIE_SPOTIFY_EXPIRY_TOKEN,
          expiryTime.toString(),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          }
        );

        return response;
      } catch (error) {
        console.error("Failed to refresh Spotify token:", error);
        const response = NextResponse.next();
        return response;
      }
    } else if (isTokenExpired() && refreshToken) {
      try {
        const newToken = await refreshSpotifyToken(refreshToken.value);
        const response = NextResponse.next();

        // リフレッシュで取得した新しいトークンと有効期限を設定
        const expiryTime = Date.now() + 3500 * 1000;

        response.cookies.set(
          COOKIE_SPOTIFY_ACCESS_TOKEN,
          newToken.access_token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          }
        );

        // 新しいリフレッシュトークンが返された場合は更新
        if (newToken.refresh_token) {
          response.cookies.set(
            COOKIE_SPOTIFY_REFRESH_TOKEN,
            newToken.refresh_token,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            }
          );
        }

        response.cookies.set(
          COOKIE_SPOTIFY_EXPIRY_TOKEN,
          expiryTime.toString(),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          }
        );

        return response;
      } catch (error) {
        console.error("Failed to refresh Spotify token:", error);
        const response = NextResponse.next();
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
