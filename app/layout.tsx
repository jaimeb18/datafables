import type { Metadata } from "next";
import { Nunito, Pixelify_Sans, Silkscreen } from "next/font/google";
import "./globals.css";
import AchievementToast from "@/components/AchievementToast";
import AchievementPanel from "@/components/AchievementPanel";
import ShopPanel from "@/components/ShopPanel";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400", "500", "600", "700"],
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  variable: "--font-stardew",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "DataFables",
  description: "AI-powered educational stories for kids — Gemini + ElevenLabs + Snowflake + SafetyKit + Actian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${pixelifySans.variable} ${silkscreen.variable} font-nunito antialiased`}>
        {children}
        <AchievementPanel />
        <ShopPanel />
        <AchievementToast />
      </body>
    </html>
  );
}
