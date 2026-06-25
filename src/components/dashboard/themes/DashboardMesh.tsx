import Link from "next/link";
import { Wallet, FolderKanban, TrendingUp, Users } from "lucide-react";

export default function DashboardMesh({ session, stats }: { session: any, stats?: any }) {
  return (
    <div className="w-full">
      {/* Top Hero Section */}
      <div className="mb-16">
        <h1 className="text-6xl font-black tracking-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400">
            Halo, {session?.user?.namaLengkap?.split(" ")[0] || "Admin"}
          </span>
        </h1>
        <p className="text-xl text-white/60 font-medium max-w-2xl">
          Berikut adalah ringkasan kas dan program kerja yang sedang berjalan.
        </p>
      </div>

      {/* The Menus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Link href="/pengajuan" className="group bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2rem] hover:bg-white/20 transition-all cursor-pointer block">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pengajuan Dana</h2>
          <p className="text-white/60">Catat pemasukan dan pengeluaran</p>
        </Link>
        
        <Link href="/proker" className="group bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2rem] hover:bg-white/20 transition-all cursor-pointer block">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-violet-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Program Kerja</h2>
          <p className="text-white/60">Pantau progres dan dana proker</p>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8">
          <div className="text-white/50 text-sm font-bold uppercase tracking-wider mb-2">Total Saldo Aktif</div>
          <div className="text-4xl font-black text-white text-balance">Rp {stats?.sisaKas?.toLocaleString('id-ID') || "0"}</div>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 flex items-center justify-between">
          <div>
            <div className="text-white/50 text-sm font-bold uppercase tracking-wider mb-2">Total Pengeluaran</div>
            <div className="text-3xl font-black text-white">Rp {stats?.totalPengeluaran?.toLocaleString('id-ID') || "0"}</div>
          </div>
          <TrendingUp className="w-12 h-12 text-rose-400/50" />
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 flex items-center justify-between">
          <div>
            <div className="text-white/50 text-sm font-bold uppercase tracking-wider mb-2">Persentase Terpakai</div>
            <div className="text-4xl font-black text-white">{stats?.persentaseTerpakai || 0}%</div>
          </div>
          <Users className="w-12 h-12 text-blue-400/50" />
        </div>
      </div>
    </div>
  );
}
