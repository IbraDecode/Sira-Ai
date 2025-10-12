import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIRA AI - Multi-Agent Chat System",
  description: "SIRA AI by Ibra Decode - Powerful AI chat workspace with Gemini API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
