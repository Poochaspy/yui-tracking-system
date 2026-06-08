import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YUI Tracking System",
  description: "ERPNext-inspired tracking system for employees and trainees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {/* Header placeholder for mobile / profile */}
            <header className="h-16 glass-panel border-b border-b-white/10 flex items-center justify-between px-6 sticky top-0 z-10 md:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                YUI Tracking
              </h1>
            </header>
            <div className="p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
