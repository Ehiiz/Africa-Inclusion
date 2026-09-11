import localFont from "next/font/local";

/**
 * Helvetica Now Display — licensed, self-hosted. Only the seven faces the site
 * uses are loaded; the full family lives in design/fonts/.
 */
export const helveticaNowDisplay = localFont({
  src: [
    { path: "./fonts/HelveticaNowDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNowDisplay-RegIta.woff2", weight: "400", style: "italic" },
    { path: "./fonts/HelveticaNowDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/HelveticaNowDisplay-MedIta.woff2", weight: "500", style: "italic" },
    { path: "./fonts/HelveticaNowDisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/HelveticaNowDisplay-BoldIta.woff2", weight: "700", style: "italic" },
    { path: "./fonts/HelveticaNowDisplay-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-hnd",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});
