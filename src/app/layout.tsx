import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kenangan Kita",
  description: "Scrapbook digital untuk menyimpan momen berdua",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${caveat.variable}`}>
      <body className="paper-texture min-h-screen">{children}</body>
    </html>
  );
}
