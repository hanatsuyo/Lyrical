import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Header from "@/app/components/Header";
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
    <html lang="ja">
      <UserProvider>
        <body className="pt-[64px]">
          <Header />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
