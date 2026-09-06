import { Jost, Cormorant_Garamond } from "next/font/google";
import "./admin.css";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["600"], variable: "--font-display" });

export const metadata = {
  title: "Capguide Travel — Yönetim Paneli",
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }) {
  return <div className={`admin-shell ${jost.variable} ${cormorant.variable}`}>{children}</div>;
}
