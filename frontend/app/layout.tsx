import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechForward Inc. - AI Company",
  description: "AI-powered virtual software company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        <nav className="border-b border-gray-800 bg-gray-900 px-6 py-3 flex items-center gap-6">
          <span className="font-bold text-white text-lg">⚡ TechForward Inc.</span>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">ダッシュボード</Link>
          <Link href="/org-chart" className="text-sm text-gray-400 hover:text-white transition-colors">組織図</Link>
          <Link href="/documents" className="text-sm text-gray-400 hover:text-white transition-colors">ドキュメント</Link>
          <Link href="/dispatch" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            🕐 Dispatch
          </Link>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
