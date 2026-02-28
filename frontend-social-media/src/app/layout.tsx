import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chirp — Social Feed",
  description: "Test social media platform for ContentShield moderation demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
