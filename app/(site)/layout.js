import { Cormorant_Garamond, Jost } from "next/font/google";
import { readContent } from "@/lib/content";
import "./site.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display"
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans"
});

export async function generateMetadata() {
  const { settings } = await readContent();
  return {
    title: settings.seoTitle || "Capguide Travel — Discover Cappadocia",
    description: settings.seoDescription || "Capguide Travel — Tours, adventures, experiences and workshops in Cappadocia. Plan your experience on WhatsApp.",
    icons: { icon: settings.faviconImg || "/icon.png" }
  };
}

export const viewport = { themeColor: "#D9611F" };

export default function SiteLayout({ children }) {
  return <div className={`site-shell ${cormorant.variable} ${jost.variable}`}>{children}</div>;
}
