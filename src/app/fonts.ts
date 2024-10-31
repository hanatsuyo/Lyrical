import { Noto_Sans_JP } from "next/font/google";

export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});
