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
  title: "ARDRAM TRACKER",
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
            <header className="h-16 glass-panel border-b border-b-white/10 flex items-center justify-between px-4 sticky top-0 z-10 md:hidden">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center shrink-0" id="mobile-logo-placeholder">
                  <span className="text-[8px] text-gray-400 font-medium">LOGO</span>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  ARDRAM TRACKER
                </h1>
              </div>
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
