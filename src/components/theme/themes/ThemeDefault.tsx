import { Check, Monitor, Layout, Box, Sparkles, Droplet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ThemeDefault({ theme, setTheme, themes }: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto text-slate-900 dark:text-white pb-20">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Tema</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">Pilih tata letak dan tema visual untuk aplikasi KASPRO.</p>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((t: any) => {
            const isActive = theme === t.id || (!theme && t.id === "theme-default") || (theme === "system" && t.id === "theme-default") || (theme === "dark" && t.id === "theme-default") || (theme === "light" && t.id === "theme-default");
            
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-300 ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-500/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                    : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <div className={`p-3 rounded-lg ${isActive ? "bg-blue-100 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400" : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400"}`}>
                  <t.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>{t.name}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">{t.desc}</p>
                </div>
                {isActive && (
                  <div className="absolute top-5 right-5 text-blue-600 dark:text-blue-400">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
