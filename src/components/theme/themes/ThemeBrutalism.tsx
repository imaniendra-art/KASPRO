import { Check } from "lucide-react";
import Link from "next/link";

export default function ThemeBrutalism({ theme, setTheme, themes }: any) {
  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <div className="mb-12">
        <Link href="/dashboard" className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-[#ffffff] transition-colors mb-6 bg-white text-black">
          ← KEMBALI KE DASHBOARD
        </Link>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Tema</h1>
        <p className="text-xl font-bold uppercase tracking-widest mt-4">PILIH TATA LETAK & VISUAL</p>
      </div>

      <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase mb-8 border-b-[4px] border-black pb-4">TEMA TERSEDIA</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((t: any) => {
            const isActive = theme === t.id || (!theme && t.id === "theme-default") || (theme === "system" && t.id === "theme-default") || (theme === "dark" && t.id === "theme-default") || (theme === "light" && t.id === "theme-default");
            
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border-[4px] border-black transition-colors text-left ${
                  isActive 
                    ? "bg-[#e5ff00] hover:bg-[#d4ec00]" 
                    : "bg-white hover:bg-black hover:text-[#ffffff] group"
                }`}
              >
                <div className={`p-4 border-[4px] border-black ${isActive ? "bg-black text-[#ffffff]" : "bg-white text-black group-hover:bg-[#ffffff] group-hover:text-black"}`}>
                  <t.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-black text-2xl uppercase ${isActive ? "text-black" : "text-black group-hover:text-[#ffffff]"}`}>{t.name}</h3>
                  <p className={`font-bold mt-2 uppercase ${isActive ? "text-black" : "text-black group-hover:text-[#ffffff]"}`}>{t.desc}</p>
                </div>
                {isActive && (
                  <div className="absolute top-6 right-6 border-[4px] border-black bg-black text-[#ffffff] p-1">
                    <Check className="w-6 h-6" />
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
