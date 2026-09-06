import "./globals.css";

export const metadata = {
  title: "Capguide Travel",
  description: "Capguide Travel — Cappadocia tours, adventures, experiences and workshops."
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
