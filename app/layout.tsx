import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContentAI — 30-Day AI Content Calendar Creator",
  description:
    "Generate a complete 30-day social media content calendar in minutes using a 3-agent AI pipeline. Platform-specific posts for Instagram, Twitter, LinkedIn, TikTok, and YouTube.",
  keywords: "AI content calendar, social media planning, content strategy, Instagram posts, AI copywriter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
