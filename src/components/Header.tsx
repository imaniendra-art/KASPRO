"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, UserCircle, Calendar, Sun, Moon, Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: periodes } = useQuery({
    queryKey: ["periode"],
    queryFn: async () => {
      const res = await fetch("/api/periode");
      if (!res.ok) return [];
      return (await res.json()).data;
    }
  });

  const activePeriode = periodes?.find((p: any) => p.isActive);

  return (
    <header className="h-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-30 flex items-center justify-between px-8 transition-colors duration-300">
      <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white transition-all">
        <Search className="w-4 h-4 text-slate-400 dark:text-gray-400" />
        <input 
          type="text" 
          placeholder="Cari proker atau pengajuan..." 
          className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder-slate-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="flex items-center gap-6">
        {activePeriode && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            Semester {activePeriode.semester} - {activePeriode.tahunAjaran}
          </div>
        )}
        
        {mounted && (
          <div className="flex items-center gap-2 border-r border-slate-200 dark:border-white/10 pr-4 mr-2">
            <Link 
              href="/theme"
              className="relative p-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all"
              title="Pengaturan Tema"
            >
              <Palette className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative p-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all"
              title="Ganti Light/Dark Mode"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        )}

        <button className="relative p-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-white/10">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {session?.user?.namaLengkap || "Loading..."}
            </p>
            <p className="text-xs text-blue-400 capitalize">
              {session?.user?.role?.replace("_", " ") || "Role"} • {session?.user?.divisi}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg cursor-pointer hover:scale-105 transition-transform">
            <UserCircle className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>
    </header>
  );
}
