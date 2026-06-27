"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function BrutalismLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role || "user";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", roles: ["user", "admin", "ketua"] },
    { name: "Program Kerja", href: "/proker", roles: ["user", "admin", "ketua"] },
    { name: "Pengajuan Dana", href: "/pengajuan", roles: ["user", "admin", "ketua"] },
    { name: "Pengaturan Sistem", href: "/settings", roles: ["admin"] },
  ];

  const filteredMenus = menuItems.filter(item => item.roles.includes(userRole));

  const { data: activePeriode } = useQuery({
    queryKey: ["activePeriode"],
    queryFn: async () => {
      const res = await fetch("/api/periode");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data?.find((p: any) => p.isActive);
    }
  });

  return (
    <div className="bg-white text-black h-[calc(100vh-2rem)] border-[12px] border-black m-4 relative flex flex-col font-sans overflow-hidden theme-brutalism-wrapper">
      <header className="border-b-[4px] border-black px-8 py-6 flex justify-between items-end shrink-0">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1">System</div>
          <div className="flex items-end gap-4">
            <Link href="/dashboard" className="font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none hover:opacity-50 transition-opacity">KASPRO</Link>
            {activePeriode && (
              <div className="hidden md:flex border-[3px] md:border-[4px] border-black px-4 py-1.5 bg-[#e5ff00] font-black text-lg md:text-xl uppercase shadow-[4px_4px_0_0_#000] transform -translate-y-2 md:-translate-y-3">
                PERIODE {activePeriode.semester} {activePeriode.tahunAjaran}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 lg:gap-6 items-center flex-wrap justify-end">
          <Link href="/theme" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors" title="Pengaturan Tema">
            <Palette className="w-5 h-5" />
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 border-2 border-black bg-red-500 text-white hover:bg-red-600 transition-colors" title="Keluar">
            <LogOut className="w-5 h-5" />
          </button>
          
          <div className="text-xl lg:text-2xl font-bold uppercase ml-2 lg:ml-4 border-l-[4px] border-black pl-4 lg:pl-6">
            USER: {session?.user?.namaLengkap?.split(" ")[0] || "ADMIN"}
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto">
        {children}
      </main>

      <div className="border-t-[4px] border-black overflow-hidden py-3 bg-[#e5ff00] text-black whitespace-nowrap mt-auto shrink-0">
        <div className="font-bold uppercase tracking-widest text-sm inline-block animate-[marquee_20s_linear_infinite]">
          TRANSAKSI TERBARU: ALAT TULIS (-450K) • PENCAIRAN PROKER A (-2.5M) • PEMASUKAN DANA (+10M) • TRANSAKSI TERBARU: ALAT TULIS (-450K)
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        /* Make sure inside children they inherit correct text color instead of Tailwind's text-white */
        .theme-brutalism-wrapper .text-white { color: black !important; }
        .theme-brutalism-wrapper .bg-\\[\\#0a0a0a\\] { background-color: white !important; }
        .theme-brutalism-wrapper .bg-white\\/5 { background-color: rgba(0,0,0,0.05) !important; border-color: rgba(0,0,0,0.1) !important; }
        .theme-brutalism-wrapper .border-white\\/10 { border-color: rgba(0,0,0,0.1) !important; }
        .theme-brutalism-wrapper .border-white\\/5 { border-color: rgba(0,0,0,0.05) !important; }
        .theme-brutalism-wrapper .text-gray-400 { color: #4b5563 !important; }
      `}} />
    </div>
  );
}
