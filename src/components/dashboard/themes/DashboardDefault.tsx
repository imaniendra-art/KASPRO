import { Wallet, TrendingUp, CheckCircle, Clock, BellRing, ArrowRight, FileText, CheckSquare, List, Eye, MessageSquare, X, FolderKanban } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const formatWaktuPelaksanaan = (waktuStr: string) => {
  if (!waktuStr) return <span className="text-slate-400">-</span>;
  
  const parts = waktuStr.split(",");
  
  const startDate = new Date(parts[0]);
  if (isNaN(startDate.getTime())) {
    return <span>{waktuStr}</span>;
  }
  
  const endDate = parts[1] ? new Date(parts[1]) : null;
  
  const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const displayStr = endDate && endDate.getTime() !== startDate.getTime()
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : formatDate(startDate);
    
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const start = new Date(startDate);
  start.setHours(0,0,0,0);
  
  const end = endDate ? new Date(endDate) : new Date(startDate);
  end.setHours(0,0,0,0);
  
  let countdownText = "";
  let badgeColor = "";
  
  if (today.getTime() < start.getTime()) {
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    countdownText = `H-${diffDays} Hari`;
    badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30";
  } else if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) {
    countdownText = "Sedang Berjalan";
    badgeColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30";
  } else {
    countdownText = `Selesai`;
    badgeColor = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
  }

  return (
    <div className="flex flex-col gap-1.5 items-start">
      <span className="font-medium text-slate-800 dark:text-slate-200">{displayStr}</span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeColor}`}>
        {countdownText}
      </span>
    </div>
  );
};

export default function DashboardDefault({ session, stats }: { session: any, stats?: any }) {
  const isUser = session?.user?.role === "user";
  const isAdmin = session?.user?.role === "admin";
  
  // Modal state
  const [activeModal, setActiveModal] = useState<'pesan' | 'rab' | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: 'pesan' | 'rab', data: any) => {
    setModalData(data);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const adminCards = [
    { title: "Sisa Pagu Master", value: `Rp ${stats?.sisaKas?.toLocaleString('id-ID') || "0"}`, icon: Wallet, color: "from-blue-500 to-cyan-500" },
    { title: "Total Pengeluaran Proker", value: `Rp ${stats?.totalPengeluaran?.toLocaleString('id-ID') || "0"}`, icon: Clock, color: "from-orange-500 to-amber-500" },
    { title: "Total Pengeluaran Non-Pagu", value: `Rp ${stats?.totalPengeluaranNonPagu?.toLocaleString('id-ID') || "0"}`, icon: Clock, color: "from-red-500 to-rose-500" },
    { title: "Persentase Terpakai", value: `${stats?.persentaseTerpakai || 0}%`, icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
    { title: "Total Pagu Master", value: `Rp ${stats?.totalKas?.toLocaleString('id-ID') || "0"}`, icon: TrendingUp, color: "from-purple-500 to-pink-500" },
  ];

  const userCards = [
    { title: "Rencana Proker", value: `Rp ${stats?.rencanaProker?.toLocaleString('id-ID') || "0"}`, icon: FileText, color: "from-blue-500 to-cyan-500" },
    { title: "Total Diajukan", value: `Rp ${stats?.totalDiajukan?.toLocaleString('id-ID') || "0"}`, icon: List, color: "from-orange-500 to-amber-500" },
    { title: "Dana Proker Cair", value: `Rp ${stats?.danaCair?.toLocaleString('id-ID') || "0"}`, icon: CheckSquare, color: "from-emerald-500 to-teal-500" },
    { title: "Dana Non-Pagu Cair", value: `Rp ${stats?.danaCairNonPagu?.toLocaleString('id-ID') || "0"}`, icon: CheckSquare, color: "from-red-500 to-rose-500" },
    { title: "Notif Proses", value: `${stats?.notifProses || 0} Pengajuan`, icon: BellRing, color: "from-purple-500 to-pink-500" },
  ];

  const cardsToRender = isUser ? userCards : adminCards;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Selamat datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">{session?.user?.namaLengkap?.split(" ")[0] || "User"}!</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">
          {isUser ? "Pantau aktivitas pengajuan dan pencairan dana Anda." : "Ini adalah ringkasan aktivitas dan pengajuan hari ini."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cardsToRender.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/30 dark:hover:border-white/20 transition-all duration-300 shadow-sm dark:shadow-none">
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${stat.color} rounded-full blur-[60px] opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity`}></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-base font-medium text-slate-500 dark:text-gray-400 mb-2">{stat.title}</p>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conditional Bottom Section */}
      {isUser ? (
        <div className="space-y-8">
          {/* User Notification Card for Returned/Rejected Proker */}
          {stats?.recentReturnedProker && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2rem] p-1 shadow-[0_0_40px_rgba(245,158,11,0.3)] group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[1.8rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-transform duration-300 group-hover:scale-[0.99]">
                  <div className="flex items-start gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500 blur-xl opacity-50 rounded-full animate-ping"></div>
                      <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                        <FolderKanban className="w-7 h-7" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Proker {stats.recentReturnedProker.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {stats.recentReturnedProker.judul}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
                        <span className="font-semibold">Catatan Admin:</span> {stats.recentReturnedProker.catatan}
                      </p>
                    </div>
                  </div>
                  <Link href="/proker" className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 px-6 py-3.5 rounded-xl font-semibold transition-colors w-full md:w-auto shrink-0 shadow-lg">
                    Revisi Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Riwayat Proker (Summary) */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-none overflow-x-auto relative">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Status Program Kerja Utama</h2>
            {stats?.riwayatProker?.length === 0 ? (
              <div className="text-center py-10 text-slate-500 dark:text-gray-400">Belum ada program kerja.</div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400">
                  <tr>
                    <th className="p-4 rounded-l-xl font-semibold">Program Kerja</th>
                    <th className="p-4 font-semibold">Rencana Pelaksanaan</th>
                    <th className="p-4 font-semibold text-right">Estimasi Awal</th>
                    <th className="p-4 font-semibold text-right">Sisa Pagu (Valid)</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 rounded-r-xl font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {stats?.riwayatProker?.map((proker: any) => (
                    <tr key={proker._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{proker.judul}</td>
                      <td className="p-4 align-top">{formatWaktuPelaksanaan(proker.waktuPelaksanaan)}</td>
                      <td className="p-4 text-right text-slate-500 dark:text-gray-400">Rp {proker.estimasiAnggaran?.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-right font-semibold text-blue-600 dark:text-blue-400">Rp {proker.sisaAnggaran?.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${proker.status === 'Divalidasi Keuangan' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                            proker.status === 'Ditolak' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}
                        >
                          {proker.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {proker.status === 'Divalidasi Keuangan' ? (
                          <Link 
                            href={`/pengajuan/baru?prokerId=${proker._id}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm hover:shadow"
                          >
                            Ajukan Anggaran
                          </Link>
                        ) : (
                          <span className="text-slate-400 dark:text-gray-500 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-none overflow-x-auto relative">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Riwayat Pengajuan & Proses LPJ</h2>
          {stats?.riwayatPengajuan?.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-gray-400">Belum ada riwayat pengajuan.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400">
                <tr>
                  <th className="p-4 rounded-l-xl font-semibold">No</th>
                  <th className="p-4 font-semibold">Tanggal</th>
                  <th className="p-4 font-semibold">Kegiatan</th>
                  <th className="p-4 font-semibold text-center">Info/Pesan</th>
                  <th className="p-4 font-semibold text-center">RAB</th>
                  <th className="p-4 font-semibold">Nominal ACC</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 rounded-r-xl font-semibold text-center">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {stats?.riwayatPengajuan?.map((item: any, idx: number) => {
                  const latestPesan = item.pesan || null;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 text-slate-500 dark:text-gray-400">{idx + 1}</td>
                      <td className="p-4 text-slate-900 dark:text-gray-300">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{item.judul}</td>
                      <td className="p-4 text-center">
                        {latestPesan ? (
                          <button 
                            onClick={() => openModal('pesan', { judul: item.judul, pesan: latestPesan })}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 rounded-lg transition-colors inline-flex"
                            title="Lihat Pesan"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => openModal('rab', { judul: item.judul, rab: item.rab || [] })}
                          className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 rounded-lg transition-colors inline-flex"
                          title="Lihat RAB"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-4 font-medium text-blue-600 dark:text-blue-400">Rp {(item.totalDisetujui || 0).toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${item.status === 'Dicairkan' || item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                            item.status === 'Ditolak' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {item.buktiLpj ? (
                          <a 
                            href={item.buktiLpj} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-lg transition-colors inline-flex"
                            title="Lihat Bukti"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          </div>
        </div>
      ) : (
        /* Notification Cards for Admin */
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {stats?.pendingProkerList?.slice(0, 5).map((proker: any) => (
            <div key={proker._id} className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] p-1 shadow-[0_0_40px_rgba(16,185,129,0.3)] group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-20 blur-[50px] rounded-full animate-pulse"></div>
  
              <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[1.8rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-transform duration-300 group-hover:scale-[0.99]">
                <div className="flex items-start gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50 rounded-full animate-ping"></div>
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-4 rounded-2xl shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                      <FolderKanban className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Validasi Proker
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
                        {new Date(proker.updatedAt || proker.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {proker.judul}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                      Diajukan oleh <span className="font-semibold text-slate-900 dark:text-white">{proker.pengusulId?.namaLengkap}</span> {
                        (() => {
                          const info = proker.pengusulId?.unitId?.namaUnit || (proker.pengusulId?.divisi && proker.pengusulId.divisi !== "-" ? proker.pengusulId.divisi : null) || proker.pengusulId?.role;
                          return info ? `(${info})` : "";
                        })()
                      }
                      sejumlah estimasi <span className="font-semibold text-emerald-600 dark:text-emerald-400">Rp {proker.estimasiAnggaran?.toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                </div>
  
                <Link href="/proker" className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 px-6 py-3.5 rounded-xl font-semibold transition-colors w-full md:w-auto shrink-0 shadow-lg">
                  Validasi Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}

          {stats?.pendingPengajuanList?.slice(0, 5).map((pengajuan: any) => (
            <div key={pengajuan._id} className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] p-1 shadow-[0_0_40px_rgba(59,130,246,0.3)] group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-20 blur-[50px] rounded-full animate-pulse"></div>
  
              <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[1.8rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-transform duration-300 group-hover:scale-[0.99]">
                <div className="flex items-start gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full animate-ping"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 text-white p-4 rounded-2xl shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                      <BellRing className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Pengajuan Baru
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
                        {new Date(pengajuan.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {pengajuan.judul}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                      Diajukan oleh <span className="font-semibold text-slate-900 dark:text-white">{pengajuan.pengusulId?.namaLengkap}</span> {
                        (() => {
                          const info = pengajuan.pengusulId?.unitId?.namaUnit || (pengajuan.pengusulId?.divisi && pengajuan.pengusulId.divisi !== "-" ? pengajuan.pengusulId.divisi : null) || pengajuan.pengusulId?.role;
                          return info ? `(${info})` : "";
                        })()
                      }
                      sejumlah <span className="font-semibold text-blue-600 dark:text-blue-400">Rp {pengajuan.totalNominal?.toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                </div>
  
                <Link href={`/pengajuan/${pengajuan._id}`} className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 px-6 py-3.5 rounded-xl font-semibold transition-colors w-full md:w-auto shrink-0 shadow-lg">
                  Tinjau Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeModal === 'pesan' ? 'Pesan Reviewer' : 'Detail RAB'}
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Terkait Kegiatan</span>
                <p className="text-slate-900 dark:text-white font-medium">{modalData?.judul}</p>
              </div>

              {activeModal === 'pesan' && (
                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 p-5 rounded-xl">
                  <p className="text-slate-700 dark:text-gray-300 italic whitespace-pre-wrap">
                    "{modalData?.pesan}"
                  </p>
                </div>
              )}

              {activeModal === 'rab' && (
                <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl">
                  {modalData?.rab?.length > 0 ? (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/10">
                        <tr>
                          <th className="p-3 font-semibold">Item</th>
                          <th className="p-3 font-semibold text-center">Jumlah</th>
                          <th className="p-3 font-semibold text-right">Harga Satuan</th>
                          <th className="p-3 font-semibold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {modalData.rab.map((r: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                            <td className="p-3 text-slate-900 dark:text-gray-300 font-medium">{r.namaItem}</td>
                            <td className="p-3 text-slate-600 dark:text-gray-400 text-center">{r.jumlah} {r.satuan}</td>
                            <td className="p-3 text-slate-600 dark:text-gray-400 text-right">Rp {r.hargaSatuan?.toLocaleString('id-ID')}</td>
                            <td className="p-3 font-medium text-blue-600 dark:text-blue-400 text-right">Rp {r.total?.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/10 font-bold">
                        <tr>
                          <td colSpan={3} className="p-3 text-right text-slate-900 dark:text-white">Total RAB:</td>
                          <td className="p-3 text-right text-blue-600 dark:text-blue-400">
                            Rp {modalData.rab.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-500">Tidak ada data RAB untuk pengajuan ini.</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1a1a1a] flex justify-end">
              <button 
                onClick={closeModal}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 text-white rounded-xl font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
