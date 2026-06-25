"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function MeshLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="bg-black text-white min-h-screen relative overflow-x-hidden font-sans flex flex-col theme-mesh-wrapper">
      {/* Complex Mesh Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-rose-500/40 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/40 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[80%] h-[80%] bg-violet-600/30 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 w-full flex-1 flex flex-col">
        <header className="flex justify-between items-center mb-16 shrink-0">
          <Link href="/dashboard" className="font-extrabold text-2xl tracking-widest text-white/90 hover:text-white transition-colors">KASPRO</Link>
          <div className="flex items-center gap-6">
            <Link href="/pengajuan" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Pengajuan</Link>
            <Link href="/proker" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Proker</Link>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-sm font-medium text-white/80">{session?.user?.namaLengkap?.split(" ")[0] || "Admin"}</div>
            <Link href="/settings" className="w-10 h-10 rounded-full border border-white/20 overflow-hidden backdrop-blur-md flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </Link>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Mesh background is already dark, so it's naturally compatible with dark mode classes. No heavy overrides needed. */
        .theme-mesh-wrapper .bg-[#0a0a0a] { background-color: transparent !important; }
        .theme-mesh-wrapper .bg-white\\/5 { background-color: rgba(0,0,0,0.4) !important; backdrop-filter: blur(24px) !important; }
      `}} />
    </div>
  );
}
