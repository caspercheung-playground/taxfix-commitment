import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taxfix-commitment — UI clone prototype",
  description:
    "An unofficial, non-commercial UI clone of app.taxfix.de built for personal prototyping practice. Not affiliated with or endorsed by Taxfix.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[var(--color-ink)] font-sans">
        {children}
      </body>
    </html>
  );
}
