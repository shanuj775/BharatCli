import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BHARAT CLIMATE TWIN v2.0 AI",
  description: "AI-powered digital twin of India's climate for adaptation and decision intelligence."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


