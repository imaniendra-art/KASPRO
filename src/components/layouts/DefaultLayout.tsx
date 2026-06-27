"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, WalletCards, Settings } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "user";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "ketua", "user"] },
    { name: "Proker", href: "/proker", icon: FileText, roles: ["admin", "ketua", "user"] },
    { name: "Pengajuan", href: "/pengajuan", icon: WalletCards, roles: ["admin", "ketua", "user"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
  ];

  const filteredMenus = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white flex theme-default-wrapper transition-colors duration-300 pb-20 md:pb-0">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen w-full max-w-full overflow-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative w-full overflow-x-hidden">
           <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
           <div className="relative z-10 w-full">
              {children}
           </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50 flex justify-around items-center h-16 px-2">
        {filteredMenus.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-gray-400"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
