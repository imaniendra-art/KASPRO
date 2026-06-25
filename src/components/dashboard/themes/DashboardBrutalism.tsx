import Link from "next/link";
export default function DashboardBrutalism({ session, stats }: { session: any, stats?: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 divide-y-[4px] md:divide-y-0 md:divide-x-[4px] divide-black min-h-full">
      {/* Left Column: Balance & Stats */}
      <div className="p-8">
        <div className="mb-16">
          <div className="text-sm font-bold uppercase tracking-widest mb-4">Total Saldo Aktif</div>
          <div className="text-7xl font-black tracking-tighter leading-none text-balance">Rp {stats?.sisaKas?.toLocaleString('id-ID') || "0"}</div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t-[4px] border-black pt-8 mb-16">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest mb-2">Pagu Master</div>
            <div className="text-3xl font-black">Rp {stats?.totalKas?.toLocaleString('id-ID') || "0"}</div>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest mb-2">Total Pengeluaran</div>
            <div className="text-3xl font-black">Rp {stats?.totalPengeluaran?.toLocaleString('id-ID') || "0"}</div>
          </div>
        </div>

        {/* Notification Block moved here */}
        {stats?.recentPengajuan && (
          <div className="border-[4px] border-black p-8 bg-[#ff003c] text-[#ffffff] hover:bg-black transition-colors group">
            <div className="text-sm font-bold uppercase tracking-widest mb-4 border-[2px] border-[#ffffff] inline-block px-3 py-1">
              ALERT: PENGAJUAN BARU
            </div>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              {stats.recentPengajuan.judul}
            </h3>
            <div className="text-xl font-bold border-t-[4px] border-[#ffffff] pt-4">
              DARI: {stats.recentPengajuan.pengusulId?.namaLengkap} ({stats.recentPengajuan.pengusulId?.divisi || stats.recentPengajuan.pengusulId?.role})
            </div>
            <div className="text-3xl font-black mt-2">
              RP {stats.recentPengajuan.totalNominal?.toLocaleString('id-ID')}
            </div>
            <Link href="/pengajuan" className="mt-8 inline-block border-[4px] border-[#ffffff] px-6 py-3 font-black text-2xl uppercase hover:bg-white hover:text-[#ff003c] transition-colors">
              LIHAT DETAIL →
            </Link>
          </div>
        )}
      </div>

      {/* Right Column: Quick Links & Menus */}
      <div className="flex flex-col">
        <Link href="/pengajuan" className="flex-1 p-8 border-b-[4px] border-black hover:bg-black hover:text-[#ffffff] transition-colors flex flex-col justify-end group cursor-pointer bg-[#e5ff00] text-black">
          <div className="text-6xl mb-4 group-hover:translate-x-4 transition-transform">→</div>
          <div className="text-5xl font-black uppercase tracking-tighter">Pengajuan<br/>Dana</div>
        </Link>
        <Link href="/proker" className={`flex-1 p-8 hover:bg-black hover:text-[#ffffff] transition-colors flex flex-col justify-end group cursor-pointer bg-white text-black ${session?.user?.role === 'admin_keuangan' ? 'border-b-[4px] border-black' : ''}`}>
          <div className="text-6xl mb-4 group-hover:translate-x-4 transition-transform">→</div>
          <div className="text-5xl font-black uppercase tracking-tighter">Program<br/>Kerja</div>
        </Link>
        
        {session?.user?.role === "admin_keuangan" && (
          <Link href="/settings" className="flex-1 p-8 hover:bg-black hover:text-[#ffffff] transition-colors flex flex-col justify-end group cursor-pointer bg-blue-500 text-black">
            <div className="text-6xl mb-4 group-hover:translate-x-4 transition-transform">⚙</div>
            <div className="text-5xl font-black uppercase tracking-tighter">Settings</div>
          </Link>
        )}
      </div>
    </div>
  );
}
