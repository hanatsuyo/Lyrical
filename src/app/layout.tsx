import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Header from "@/app/components/Header";
import { notoSansJP } from "./fonts";
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
          <Header />
          <main className="pt-[64px]">{children}</main>
        </body>
      </UserProvider>
    </html>
  );
}
