"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function MinimalistLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("minimalist-theme");
    if (saved === "dark") {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("minimalist-theme", next ? "dark" : "light");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pengajuan Dana", href: "/pengajuan" },
    { name: "Program Kerja", href: "/proker" },
    ...(session?.user?.role === "admin" ? [
      { name: "Pengaturan", href: "/settings" },
    ] : []),
    { name: "Bantuan & Tentang", href: "/about" },
  ];

  const roleName = session?.user?.role === "admin" ? "Admin" : session?.user?.role === "ketua" ? "Ketua" : "User";

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300 font-sans">
        
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <img src="/images/logo.png" alt="KASPRO Logo" className="w-10 h-10 object-contain" />
                  <span className="font-extrabold text-2xl md:text-3xl tracking-tight text-gray-900 dark:text-white">KASPRO</span>
                </div>
                
                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive 
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" 
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
                <Link href="/theme" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Ubah Tema
                </Link>
                
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {roleName} ({session?.user?.namaLengkap?.split(" ")[0] || "User"})
                  </div>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Keluar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-8">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 z-50 flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            // Map icons based on name
            let Icon: any = null;
            if (item.name === "Dashboard") Icon = require("lucide-react").LayoutDashboard;
            if (item.name === "Pengajuan Dana") Icon = require("lucide-react").WalletCards;
            if (item.name === "Program Kerja") Icon = require("lucide-react").FileText;
            if (item.name === "Pengaturan") Icon = require("lucide-react").Settings;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {Icon && <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />}
                <span className="text-[10px] font-medium text-center">{item.name === "Pengajuan Dana" ? "Pengajuan" : item.name === "Program Kerja" ? "Proker" : item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
