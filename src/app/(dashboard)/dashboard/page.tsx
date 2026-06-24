"use client";

import { useSession } from "next-auth/react";
import { Wallet, TrendingUp, CheckCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Selamat datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{session?.user?.namaLengkap?.split(" ")[0]}!</span>
        </h1>
        <p className="text-gray-400 mt-1">Ini adalah ringkasan aktivitas dan pengajuan Anda hari ini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Pengajuan", value: "12", icon: Wallet, color: "from-blue-500 to-cyan-500" },
          { title: "Menunggu Validasi", value: "3", icon: Clock, color: "from-orange-500 to-amber-500" },
          { title: "Disetujui Bulan Ini", value: "8", icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
          { title: "Total Pencairan", value: "Rp 45.000.000", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white shadow-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
