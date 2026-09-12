import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import QueryProviders from "@/providers/transtack/QueryProvider";

export const metadata: Metadata = {
  title: "Pordo - E-Commerce Admin & Manual Order Hub",
  description: "Sellzy-style dashboard for Bangladesh e-commerce management and POS",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b1320",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <QueryProviders>
            {children}
          </QueryProviders>
        </Providers>
      </body>
    </html>
  );
}
