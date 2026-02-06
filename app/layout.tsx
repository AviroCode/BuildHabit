import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habit OS - Your Personal Habit Tracker",
  description: "A behavioral psychology-based habit tracker built on Atomic Habits principles",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
