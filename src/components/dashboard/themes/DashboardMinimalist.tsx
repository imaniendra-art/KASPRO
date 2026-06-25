import { Wallet, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardMinimalist({ session, stats }: { session: any, stats?: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Selamat datang, {session?.user?.namaLengkap?.split(" ")[0] || "Admin"}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview sistem anggaran dan program kerja hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Sisa Pagu", value: `Rp ${stats?.sisaKas?.toLocaleString('id-ID') || "0"}`, icon: Wallet },
          { title: "Total Pengeluaran Proker", value: `Rp ${stats?.totalPengeluaran?.toLocaleString('id-ID') || "0"}`, icon: Clock },
          { title: "Total Pengeluaran Non-Pagu", value: `Rp ${stats?.totalPengeluaranNonPagu?.toLocaleString('id-ID') || "0"}`, icon: Clock },
          { title: "Persentase Terpakai", value: `${stats?.persentaseTerpakai || 0}%`, icon: CheckCircle },
          { title: "Total Pagu Master", value: `Rp ${stats?.totalKas?.toLocaleString('id-ID') || "0"}`, icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center items-start relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 w-full mb-3">
              <div className="p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium leading-tight flex-1 whitespace-nowrap truncate" title={stat.title}>{stat.title}</p>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap truncate w-full" title={stat.value}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Unified Slim Notifications Panel */}
      {(stats?.pendingProkerList?.length > 0 || stats?.pendingPengajuanList?.length > 0) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Tindakan Diperlukan
            </h2>
          </div>
          <div className="space-y-3">
            {[...(stats?.pendingProkerList || []).map((p: any) => ({ ...p, _type: 'proker' })), ...(stats?.pendingPengajuanList || []).map((p: any) => ({ ...p, _type: 'pengajuan' }))]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((item: any) => (
                <div key={`${item._type}-${item._id}`} className={`flex items-center justify-between p-3 border-l-4 ${item._type === 'proker' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'} rounded-r-md`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {item._type === 'proker' ? 'Validasi Proker: ' : 'Pengajuan Baru: '} {item.judul}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Dari: {item.pengusulId?.namaLengkap} • Rp {(item.estimasiAnggaran || item.totalNominal || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <Link href={item._type === 'proker' ? '/proker' : `/pengajuan/${item._id}`} className={`ml-4 text-xs font-medium px-3 py-1.5 rounded-md text-white whitespace-nowrap ${item._type === 'proker' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {item._type === 'proker' ? 'Validasi' : 'Tinjau'}
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Riwayat Pencairan */}
      {stats?.riwayatPengajuan && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Riwayat Pencairan Keuangan
          </h2>
          <div className="space-y-3">
            {stats.riwayatPengajuan.filter((p: any) => ['Dicairkan', 'Selesai'].includes(p.status)).length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada riwayat pencairan.</p>
            ) : (
              stats.riwayatPengajuan
                .filter((p: any) => ['Dicairkan', 'Selesai'].includes(p.status))
                .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 5)
                .map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.judul}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {(item.totalDisetujui || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
