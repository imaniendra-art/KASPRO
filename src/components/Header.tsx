"use client";

import { useSession } from "next-auth/react";
import { Search, UserCircle, Calendar, Sun, Moon, Palette, X, Key, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setIsUpdating(true);
    setMessage({ text: "", type: "" });
    try {
      const payload: any = { username: editUsername };
      if (editPassword) {
        payload.password = editPassword;
      }
      
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ text: "Profil berhasil diperbarui. Refresh halaman untuk melihat perubahan jika perlu.", type: "success" });
        setEditPassword("");
      } else {
        setMessage({ text: data.error || "Gagal memperbarui profil", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Terjadi kesalahan", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const openProfile = () => {
    setEditUsername(session?.user?.username || "");
    setEditPassword("");
    setMessage({ text: "", type: "" });
    setShowProfileModal(true);
  };

  return (
    <>
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
          <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {session?.user?.namaLengkap || "Loading..."}
            </p>
            <p className="text-xs text-blue-400 capitalize mt-1">
              {session?.user?.role || "Role"} • {session?.user?.unitName && session?.user?.unitName !== "-" ? session.user.unitName : session?.user?.divisi}
            </p>
          </div>
          <div 
            className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={openProfile}
            title="Pengaturan Profil"
          >
            <UserCircle className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>
      </header>

      {/* Profil Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pengaturan Akun</h3>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleProfileSave} className="p-6 space-y-4">
              {message.text && (
                <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20'}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Username
                </label>
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-500" />
                  Password Baru <span className="text-slate-400 text-xs font-normal">(opsional)</span>
                </label>
                <input 
                  type="password" 
                  value={editPassword} 
                  onChange={e => setEditPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak diubah"
                  className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
