import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LayoutWrapper from "../components/LayoutWrapper";
import Providers from "../components/Providers";
import { Toaster } from "react-hot-toast";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const setting = await Setting.findOne();
    if (setting) {
      return {
        title: setting.metaTitle || setting.title || "Premium Global Trade Sourcing Hub",
        description: setting.metaDescription || "High-trust B2B sourcing and export environment.",
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error);
  }

  // Fallback metadata
  return {
    title: "Premium Global Trade Sourcing Hub",
    description: "High-trust B2B sourcing and export environment.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectDB();
  const settingDoc = await Setting.findOne();
  // We need to serialize the mongoose document to a plain JSON object before passing it to Client Components
  const settings = settingDoc ? JSON.parse(JSON.stringify(settingDoc)) : null;

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scroll-smooth scroll-pt-24`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <LayoutWrapper settings={settings}>
            {children}
          </LayoutWrapper>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
