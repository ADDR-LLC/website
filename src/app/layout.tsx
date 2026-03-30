import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ADDR | Smarter Systems for Smarter Solutions",
  description: "Advanced Design Development & Research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen flex flex-col pt-16`}>
        <Navbar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
