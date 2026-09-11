import type { Metadata } from "next";
import { helveticaNowDisplay } from "./fonts";
import "./globals.css";

/**
 * Absolute URLs for Open Graph images. Set NEXT_PUBLIC_SITE_URL to the real
 * domain; Vercel preview deployments fall back to their own URL.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Afri Inclusion Advisory — Building trusted digital finance for Africa",
    template: "%s — Afri Inclusion Advisory",
  },
  description:
    "Afri Inclusion Advisory helps financial institutions, fintechs, governments and " +
    "development organisations turn digital infrastructure into active, trusted, everyday " +
    "financial services.",
  icons: { icon: "/assets/img/favicon.png", apple: "/assets/img/favicon.png" },
  openGraph: {
    type: "website",
    title: "Afri Inclusion Advisory",
    description:
      "Building trusted digital finance for Africa — moving people from being registered " +
      "to being financially active.",
    images: ["/assets/img/hero-merchant.jpg"],
  },
};

export const viewport = { themeColor: "#168447" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={helveticaNowDisplay.variable}>
      <body>{children}</body>
    </html>
  );
}
