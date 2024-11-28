import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Header from "@/components/Header";
import { notoSansJP } from "./fonts";
import ProgressBarProvider from "@/components/ProgresssBarProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyrical",
  description: "こちらはリリカルのサイトです。",
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
            <main className="pt-[64px] px-6 md:px-12">
              <ProgressBarProvider>{children}</ProgressBarProvider>
            </main>
          </div>
        </body>
      </UserProvider>
    </html>
  );
}
