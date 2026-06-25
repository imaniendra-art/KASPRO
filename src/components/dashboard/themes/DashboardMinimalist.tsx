import { Wallet, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardMinimalist({ session, stats }: { session: any, stats?: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Selamat datang, {session?.user?.namaLengkap?.split(" ")[0] || "Admin"}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview sistem anggaran dan program kerja hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Sisa Pagu", value: `Rp ${stats?.sisaKas?.toLocaleString('id-ID') || "0"}`, icon: Wallet },
          { title: "Total Pengeluaran", value: `Rp ${stats?.totalPengeluaran?.toLocaleString('id-ID') || "0"}`, icon: Clock },
          { title: "Persentase Terpakai", value: `${stats?.persentaseTerpakai || 0}%`, icon: CheckCircle },
          { title: "Total Pagu Master", value: `Rp ${stats?.totalKas?.toLocaleString('id-ID') || "0"}`, icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</h3>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-400 dark:text-gray-300">
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Alert / Recent Activity */}
      {stats?.recentPengajuan && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Alert: Pengajuan Baru
            </h2>
            <Link href={`/pengajuan/${stats.recentPengajuan._id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Lihat Semua →
            </Link>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">{stats.recentPengajuan.judul}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Dari: {stats.recentPengajuan.pengusulId?.namaLengkap} ({stats.recentPengajuan.pengusulId?.divisi || "Umum"})
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Nominal</div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">Rp {stats.recentPengajuan.totalNominal?.toLocaleString('id-ID')}</div>
            </div>
            <div>
              <Link href={`/pengajuan/${stats.recentPengajuan._id}`} className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-block whitespace-nowrap">
                Lihat Detail Pengajuan
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
