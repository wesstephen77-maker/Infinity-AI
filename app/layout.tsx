import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infinity AI — Empower Every Seller",
  description: "AI that helps sales pros and teams close more, faster.",
  metadataBase: new URL("https://mynewinfinityai.com"),
  openGraph: {
    title: "Infinity AI",
    description: "Empower Every Seller",
    url: "/",
    siteName: "Infinity AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity AI",
    description: "Empower Every Seller",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
