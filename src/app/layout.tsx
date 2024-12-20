import type { Metadata } from "next";
import type { Viewport } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { notoSansJP } from "./fonts";
import ProgressBarProvider from "@/components/ProgresssBarProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyrical",
  description: "こちらはリリカルのサイトです。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable}`}>
      <UserProvider>
        <body className="font-noto-sans-jp min-h-screen">
          <div className="overflow-x-hidden">
            <main className="pt-[64px] px-4 md:px-12">
              <ProgressBarProvider>{children}</ProgressBarProvider>
            </main>
          </div>
        </body>
      </UserProvider>
    </html>
  );
}
