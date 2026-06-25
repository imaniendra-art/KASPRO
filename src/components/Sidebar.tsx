"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  WalletCards, 
  CheckSquare, 
  FileText, 
  PieChart, 
  LogOut,
  Wallet,
  Settings
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["user", "admin_keuangan", "wk2_keuangan", "ketua"] },
  
  // Menu Transaksional
  { name: "Program Kerja", href: "/proker", icon: FileText, roles: ["user", "admin_keuangan", "wk2_keuangan", "ketua"] },
  { name: "Pengajuan Dana", href: "/pengajuan", icon: WalletCards, roles: ["user", "admin_keuangan", "wk2_keuangan", "ketua"] },
  
  // Menu Khusus Admin
  { name: "Pengaturan Sistem", href: "/settings", icon: Settings, roles: ["admin_keuangan"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "user";

  const filteredMenus = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-72 h-screen bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col fixed left-0 top-0 z-40 transition-colors duration-300">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <img 
            src="/images/logo.png" 
            alt="Logo STIMI" 
            className="w-10 h-10 object-contain drop-shadow-md"
          />
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-gray-400 tracking-tighter leading-none">
              KASPRO
            </h1>
            <span className="text-xl font-light text-slate-400 dark:text-gray-500 tracking-widest leading-none">
              STIMI
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Menu Utama</div>
        
        {filteredMenus.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-600 dark:text-white border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
              )}
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-blue-400"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-4">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Keluar Sistem</span>
        </button>

        <div className="text-center pb-2">
          <p className="text-[10px] text-slate-400 dark:text-gray-500 font-medium tracking-wide">
            &copy; 2026 PUSDATIN STIMI
          </p>
          <p className="text-[9px] text-slate-300 dark:text-gray-600 mt-0.5">
            Sistem Informasi KASPRO v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
