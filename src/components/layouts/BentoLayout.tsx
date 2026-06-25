"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BentoLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="bg-[#f2f2f7] text-black min-h-screen font-sans flex flex-col theme-bento-wrapper">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-10 py-6 max-w-6xl mx-auto w-full shrink-0">
        <Link href="/dashboard" className="font-bold text-2xl tracking-tighter hover:opacity-70 transition-opacity">KASPRO</Link>
        <div className="flex items-center gap-6">
          <Link href="/pengajuan" className="text-sm font-medium hover:text-blue-600 transition-colors">Pengajuan</Link>
          <Link href="/proker" className="text-sm font-medium hover:text-blue-600 transition-colors">Proker</Link>
          <div className="flex items-center gap-4 pl-6 border-l border-gray-300">
            <div className="text-sm font-medium text-gray-500">{session?.user?.namaLengkap || "Admin"}</div>
            <div className="w-10 h-10 bg-black rounded-full text-white flex items-center justify-center font-bold">
              {(session?.user?.namaLengkap || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-10 pb-12">
        {children}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .theme-bento-wrapper .text-white { color: black !important; }
        .theme-bento-wrapper .bg-\\[\\#0a0a0a\\] { background-color: #f2f2f7 !important; }
        .theme-bento-wrapper .bg-white\\/5 { background-color: white !important; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
        .theme-bento-wrapper .border-white\\/10 { border-color: rgba(0,0,0,0.05) !important; }
        .theme-bento-wrapper .border-white\\/5 { border-color: rgba(0,0,0,0.05) !important; }
        .theme-bento-wrapper .text-gray-400 { color: #6b7280 !important; }
      `}} />
    </div>
  );
}
