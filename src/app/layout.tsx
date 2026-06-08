import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARDRAM TRACKER",
  description: "Enterprise tracking system for employees and trainees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-10 md:hidden shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-300 flex items-center justify-center shrink-0" id="mobile-logo-placeholder">
                  <span className="text-[8px] text-slate-400 font-bold">LOGO</span>
                </div>
                <h1 className="text-lg font-bold text-slate-800">
                  ARDRAM TRACKER
                </h1>
              </div>
            </header>
            <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
