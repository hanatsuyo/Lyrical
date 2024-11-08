// middleware.ts
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // 保護対象のパス（ログイン必須のページ）
  const protectedPaths = ["/dashboard", "/song", "/mypage"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 未ログインの場合はログインページへ
  if (isProtectedPath && !session) {
    const returnTo = "registration";
    return NextResponse.redirect(
      new URL(`/api/auth/login?returnTo=${returnTo}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/song/:path*",
    "/mypage/:path*",
    "/registration",
  ],
};
