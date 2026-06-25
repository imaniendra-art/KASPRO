import Link from "next/link";
import { Wallet, FolderKanban, Settings } from "lucide-react";

export default function DashboardBento({ session, stats }: { session: any, stats?: any }) {
  return (
    <div className="grid grid-cols-4 gap-6 auto-rows-[160px]">
      {/* Balance Card (Large) */}
      <div className="col-span-2 row-span-2 bg-white rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform">
        <div>
          <h2 className="text-gray-500 font-medium">Total Saldo Tersedia</h2>
          <div className="text-5xl font-bold mt-2">Rp {stats?.sisaKas?.toLocaleString('id-ID') || "0"}</div>
        </div>
        <div className="flex gap-4 mt-auto">
          <Link href="/pengajuan/baru" className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">Pengajuan Baru</Link>
          <Link href="/proker" className="bg-gray-100 text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition">Proker</Link>
        </div>
      </div>

      {/* Menu 1 */}
      <Link href="/pengajuan" className="col-span-1 row-span-1 bg-blue-500 rounded-[32px] p-6 text-white flex flex-col justify-between hover:scale-[1.05] transition-transform cursor-pointer shadow-lg shadow-blue-500/30">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div className="font-bold text-lg leading-tight">Pengajuan<br/>Dana</div>
      </Link>

      {/* Menu 2 */}
      <Link href="/proker" className="col-span-1 row-span-1 bg-purple-500 rounded-[32px] p-6 text-white flex flex-col justify-between hover:scale-[1.05] transition-transform cursor-pointer shadow-lg shadow-purple-500/30">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
          <FolderKanban className="w-5 h-5 text-white" />
        </div>
        <div className="font-bold text-lg leading-tight">Program<br/>Kerja</div>
      </Link>

      {/* Stats */}
      <div className="col-span-1 row-span-1 bg-white rounded-[32px] p-6 shadow-sm flex flex-col justify-center items-center text-center">
         <div className="text-3xl font-bold text-red-500">{stats?.persentaseTerpakai || 0}%</div>
         <div className="text-sm text-gray-500">Anggaran Terpakai</div>
      </div>

      {/* Settings */}
      <Link href="/settings" className="col-span-1 row-span-1 bg-gray-900 rounded-[32px] p-6 text-white flex flex-col justify-between hover:scale-[1.05] transition-transform cursor-pointer shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div className="font-bold text-lg leading-tight">Pengaturan<br/>Aplikasi</div>
      </Link>

      {/* Recent Transactions */}
      <div className="col-span-4 row-span-2 bg-white rounded-[32px] p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Ringkasan Anggaran</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">💰</div>
              <div>
                <div className="font-bold">Total Pagu Master</div>
                <div className="text-sm text-gray-500">Anggaran yang diberikan Pimpinan</div>
              </div>
            </div>
            <div className="font-bold text-emerald-500">Rp {stats?.totalKas?.toLocaleString('id-ID') || "0"}</div>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">💸</div>
              <div>
                <div className="font-bold">Total Pengeluaran</div>
                <div className="text-sm text-gray-500">Total Pengajuan yang telah dicairkan</div>
              </div>
            </div>
            <div className="font-bold text-red-500">- Rp {stats?.totalPengeluaran?.toLocaleString('id-ID') || "0"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
