"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 flex items-center justify-between px-8 transition-all">
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white/10 transition-all">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Cari proker atau pengajuan..." 
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-semibold text-white leading-tight">
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
