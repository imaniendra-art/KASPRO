import Link from "next/link";
import { useState } from "react";
import { Eye, MessageSquare, X } from "lucide-react";

export default function DashboardBrutalism({ session, stats }: { session: any, stats?: any }) {
  const isUser = session?.user?.role === "tendik";

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

  // Combine notifications from proker and pengajuan
  const notifications: any[] = [];
  if (stats?.riwayatProker) {
    stats.riwayatProker.forEach((p: any) => {
      if (['Divalidasi Keuangan', 'Ditolak', 'Returned'].includes(p.status)) {
        notifications.push({
          id: p._id,
          tanggal: p.updatedAt || p.createdAt,
          judul: p.judul,
          jenis: 'PROGRAM KERJA',
          status: p.status,
          pesan: p.catatan || '-',
          link: '/proker'
        });
      }
    });
  }
  if (stats?.riwayatPengajuan) {
    stats.riwayatPengajuan.forEach((p: any) => {
      if (['Dicairkan', 'Ditolak', 'Returned'].includes(p.status)) {
        notifications.push({
          id: p._id,
          tanggal: p.updatedAt || p.createdAt,
          judul: p.judul,
          jenis: 'PENGAJUAN DANA',
          status: p.status,
          pesan: p.pesan || '-',
          link: '/pengajuan'
        });
      }
    });
  }
  // Sort notifications by date descending
  notifications.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  // Collect Admin Alerts
  const adminAlerts: any[] = [];
  if (!isUser) {
    if (stats?.pendingProkerList) {
      stats.pendingProkerList.forEach((p: any) => {
        adminAlerts.push({
          id: p._id,
          tanggal: p.updatedAt || p.createdAt,
          judul: p.judul,
          jenis: 'VALIDASI PROKER',
          dari: p.pengusulId?.namaLengkap || 'User',
          divisi: p.pengusulId?.divisi || p.pengusulId?.role,
          nominal: p.estimasiAnggaran || p.totalAnggaran || 0,
          link: '/proker'
        });
      });
    }
    if (stats?.pendingPengajuanList) {
      stats.pendingPengajuanList.forEach((p: any) => {
        adminAlerts.push({
          id: p._id,
          tanggal: p.updatedAt || p.createdAt,
          judul: p.judul,
          jenis: 'PENGAJUAN BARU',
          dari: p.pengusulId?.namaLengkap || 'User',
          divisi: p.pengusulId?.divisi || p.pengusulId?.role,
          nominal: p.totalNominal || 0,
          link: '/pengajuan'
        });
      });
    }
    if (stats?.pendingBuktiList) {
      stats.pendingBuktiList.forEach((p: any) => {
        adminAlerts.push({
          id: `bukti-${p._id}`,
          tanggal: p.updatedAt || p.createdAt,
          judul: p.judul,
          jenis: 'BUKTI/LPJ MASUK',
          dari: p.pengusulId?.namaLengkap || 'User',
          divisi: p.pengusulId?.divisi || p.pengusulId?.role,
          nominal: p.totalDisetujui || p.totalNominal || 0,
          link: `/pengajuan/${p._id}`
        });
      });
    }
    adminAlerts.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 divide-y-[4px] md:divide-y-0 md:divide-x-[4px] divide-black min-h-full">
      {/* Left Column: Balance, Stats, Notifications, History */}
      <div className="p-8">
        <div className="mb-16">
          <div className="text-sm font-bold uppercase tracking-widest mb-4">
            {isUser ? "Rencana Proker" : "Total Saldo Aktif"}
          </div>
          <div className="text-7xl font-black tracking-tighter leading-none text-balance break-all">
            Rp {isUser ? (stats?.rencanaProker?.toLocaleString('id-ID') || "0") : (stats?.sisaKas?.toLocaleString('id-ID') || "0")}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t-[4px] border-black pt-8 mb-16">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest mb-2">
              {isUser ? "Total Diajukan" : "Pagu Master"}
            </div>
            <div className="text-3xl font-black break-words">
              Rp {isUser ? (stats?.totalDiajukan?.toLocaleString('id-ID') || "0") : (stats?.totalKas?.toLocaleString('id-ID') || "0")}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest mb-2">
              {isUser ? "Dana Proker Cair" : "Total Pengeluaran Proker"}
            </div>
            <div className="text-3xl font-black break-words">
              Rp {isUser ? (stats?.danaCair?.toLocaleString('id-ID') || "0") : (stats?.totalPengeluaran?.toLocaleString('id-ID') || "0")}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest mb-2 text-[#ff003c]">
              {isUser ? "Dana Non-Pagu Cair" : "Total Pengeluaran Non-Pagu"}
            </div>
            <div className="text-3xl font-black break-words text-[#ff003c]">
              Rp {isUser ? (stats?.danaCairNonPagu?.toLocaleString('id-ID') || "0") : (stats?.totalPengeluaranNonPagu?.toLocaleString('id-ID') || "0")}
            </div>
          </div>
        </div>

        {/* Admin Notification Block (Carousel/Scroll) */}
        {!isUser && (
          <div className="mb-16">
            {adminAlerts.length > 0 ? (
              <>
                {/* Thin scrollbar style for desktop users */}
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    height: 12px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #000;
                    border: 2px solid #000;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5ff00;
                    border: 2px solid #000;
                  }
                `}</style>
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 custom-scrollbar">
                  {adminAlerts.map((alert, idx) => (
                    <div key={idx} className="shrink-0 w-full snap-center border-[4px] border-black p-8 bg-[#ff003c] text-[#ffffff] hover:bg-black transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-sm font-bold uppercase tracking-widest border-[2px] border-[#ffffff] inline-block px-3 py-1">
                          ALERT: {alert.jenis}
                        </div>
                        <div className="text-sm font-bold border-[2px] border-white px-2">
                          {idx + 1}/{adminAlerts.length}
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                        {alert.judul}
                      </h3>
                      <div className="text-xl font-bold border-t-[4px] border-[#ffffff] pt-4">
                        DARI: {alert.dari} ({alert.divisi})
                      </div>
                      <div className="text-3xl font-black mt-2">
                        RP {alert.nominal?.toLocaleString('id-ID')}
                      </div>
                      <Link href={alert.link} className="mt-8 inline-block border-[4px] border-[#ffffff] px-6 py-3 font-black text-2xl uppercase hover:bg-white hover:text-[#ff003c] transition-colors shadow-[6px_6px_0_0_#fff]">
                        LIHAT DETAIL →
                      </Link>
                    </div>
                  ))}
                </div>
                {adminAlerts.length > 1 && (
                  <div className="text-center font-bold text-sm tracking-widest uppercase mt-2">
                    &larr; GESER (SCROLL) UNTUK MELIHAT NOTIFIKASI LAINNYA &rarr;
                  </div>
                )}
              </>
            ) : (
              <div className="border-[4px] border-black p-8 bg-[#ff003c] text-[#ffffff] flex flex-col items-center justify-center text-center shadow-[6px_6px_0_0_#000] min-h-[250px]">
                <div className="text-sm font-bold uppercase tracking-widest mb-4 border-[2px] border-[#ffffff] inline-block px-3 py-1">
                  INFO
                </div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none opacity-90">
                  BELUM ADA PENGAJUAN / NOTIFIKASI BARU
                </h3>
              </div>
            )}
          </div>
        )}

        {isUser && stats?.recentReturnedProker && (
          <div className="border-[4px] border-black p-8 bg-[#ff003c] text-[#ffffff] hover:bg-black transition-colors group mb-16">
            <div className="text-sm font-bold uppercase tracking-widest mb-4 border-[2px] border-[#ffffff] inline-block px-3 py-1">
              ALERT: PROKER {stats.recentReturnedProker.status.toUpperCase()}
            </div>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              {stats.recentReturnedProker.judul}
            </h3>
            <div className="text-xl font-bold border-t-[4px] border-[#ffffff] pt-4">
              CATATAN ADMIN: {stats.recentReturnedProker.catatan}
            </div>
            <Link href="/proker" className="mt-8 inline-block border-[4px] border-[#ffffff] px-6 py-3 font-black text-2xl uppercase hover:bg-white hover:text-[#ff003c] transition-colors">
              REVISI SEKARANG →
            </Link>
          </div>
        )}

        {/* History Tables & User Notifications (ONLY FOR USER) */}
        {isUser && (
          <div className="space-y-12">
            {/* Riwayat Pengajuan & Proses LPJ */}
            <div className="border-t-[4px] border-black pt-8">
              <h2 className="text-2xl font-black uppercase mb-6">Riwayat Pengajuan & Proses LPJ</h2>
            {stats?.riwayatPengajuan?.length === 0 ? (
              <div className="text-center py-8 font-bold text-lg border-[4px] border-dashed border-black">BELUM ADA RIWAYAT PENGAJUAN</div>
            ) : (
              <div className="overflow-x-auto border-[4px] border-black">
                <table className="w-full text-left whitespace-nowrap border-collapse">
                  <thead className="bg-black text-[#e5ff00] border-b-[4px] border-black">
                    <tr>
                      <th className="p-3 font-black uppercase border-r-[4px] border-white text-[#e5ff00]">KEGIATAN</th>
                      <th className="p-3 font-black uppercase border-r-[4px] border-white text-center text-[#e5ff00]">RAB</th>
                      <th className="p-3 font-black uppercase border-r-[4px] border-white text-right text-[#e5ff00]">ACC</th>
                      <th className="p-3 font-black uppercase border-r-[4px] border-white text-[#e5ff00]">STATUS</th>
                      <th className="p-3 font-black uppercase text-center text-[#e5ff00]">BUKTI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-[4px] divide-black">
                    {stats?.riwayatPengajuan?.slice(0, 4).map((item: any) => (
                      <tr key={item._id} className="hover:bg-[#e5ff00] transition-colors">
                        <td className="p-3 font-bold border-r-[4px] border-black max-w-[200px] truncate" title={item.judul}>{item.judul}</td>
                        <td className="p-3 border-r-[4px] border-black text-center">
                          <button onClick={() => openModal('rab', { judul: item.judul, rab: item.rab || [] })} className="border-[2px] border-black p-1 hover:bg-black hover:text-[#e5ff00] transition-colors">
                            <Eye className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                        <td className="p-3 font-black text-right border-r-[4px] border-black bg-[#00ff88]">
                          RP {(item.totalDisetujui || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 border-r-[4px] border-black">
                          <span className="inline-block border-[2px] border-black px-2 font-black uppercase bg-white text-xs">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {item.buktiLpj ? (
                            <a href={item.buktiLpj} target="_blank" rel="noopener noreferrer" className="inline-block border-[2px] border-black bg-white px-2 py-1 font-black uppercase hover:bg-black hover:text-[#e5ff00] transition-colors text-xs">
                              LIHAT BUKTI
                            </a>
                          ) : (
                            <span className="font-bold">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Kolom Notifikasi (Cards Slim) */}
          <div className="border-t-[4px] border-black pt-8">
            <h2 className="text-2xl font-black uppercase mb-6">NOTIFIKASI TERKINI</h2>
            <div className="flex flex-col gap-4">
              {notifications.length === 0 ? (
                <div className="text-center py-4 font-bold text-sm border-[4px] border-dashed border-black">BELUM ADA NOTIFIKASI</div>
              ) : (
                notifications.slice(0, 2).map((notif: any, idx: number) => {
                  const isError = notif.status === 'Ditolak' || notif.status === 'Returned';
                  return (
                    <div key={idx} className={`border-[3px] border-black p-4 ${isError ? 'bg-[#ff003c] text-white' : 'bg-[#00ff88] text-black'} shadow-[4px_4px_0_0_#000] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-black uppercase border-[2px] border-black px-2 py-0.5 bg-white text-black text-xs shadow-[2px_2px_0_0_#000]">
                            {notif.status}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest truncate">
                            {notif.jenis} • {new Date(notif.tanggal).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <h3 className="text-xl font-black uppercase truncate">{notif.judul}</h3>
                        <div className="text-sm font-bold truncate opacity-90">
                          PESAN: {notif.pesan}
                        </div>
                      </div>
                      <Link href={notif.link} className="shrink-0 border-[3px] border-black px-4 py-2 font-black text-sm uppercase hover:bg-black hover:text-[#e5ff00] transition-colors bg-white text-black shadow-[4px_4px_0_0_#000]">
                        CEK →
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Right Column: Quick Links & Menus */}
      <div className="flex flex-col">
        <Link href="/pengajuan" className="flex-1 p-8 border-b-[4px] border-black hover:bg-black hover:text-[#e5ff00] transition-colors flex flex-col justify-end group cursor-pointer bg-[#e5ff00] text-black min-h-[300px]">
          <div className="text-6xl mb-4 group-hover:translate-x-4 transition-transform">→</div>
          <div className="text-5xl font-black uppercase tracking-tighter">Pengajuan<br/>Dana</div>
        </Link>
        <Link href="/proker" className={`flex-1 p-8 hover:bg-black hover:text-[#e5ff00] transition-colors flex flex-col justify-end group cursor-pointer bg-white text-black min-h-[300px] ${session?.user?.role === 'keuangan' ? 'border-b-[4px] border-black' : ''}`}>
          <div className="text-6xl mb-4 group-hover:translate-x-4 transition-transform">→</div>
          <div className="text-5xl font-black uppercase tracking-tighter">Program<br/>Kerja</div>
        </Link>
        
        {session?.user?.role === "keuangan" && (
          <Link href="/settings" className="flex-1 p-8 hover:bg-black hover:text-[#e5ff00] transition-colors flex flex-col justify-end group cursor-pointer bg-blue-500 text-black min-h-[300px]">
            <div className="text-6xl mb-4 group-hover:translate-x-4 transition-transform">⚙</div>
            <div className="text-5xl font-black uppercase tracking-tighter">Settings</div>
          </Link>
        )}
      </div>

      {/* Modals for Riwayat */}
      {activeModal === 'rab' && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-[6px] border-black shadow-[12px_12px_0_0_#e5ff00] w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b-[6px] border-black bg-black text-[#e5ff00] shrink-0">
              <h3 className="text-2xl font-black uppercase">RAB - {modalData.judul}</h3>
              <button onClick={closeModal} className="hover:text-[#ff003c] transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              {modalData.rab?.length > 0 ? (
                <div className="overflow-x-auto border-[4px] border-black">
                  <table className="w-full text-left whitespace-nowrap border-collapse">
                    <thead className="bg-black text-[#e5ff00] border-b-[4px] border-black">
                      <tr>
                        <th className="p-4 font-black uppercase border-r-[4px] border-white text-[#e5ff00]">ITEM</th>
                        <th className="p-4 font-black uppercase border-r-[4px] border-white text-center text-[#e5ff00]">VOL</th>
                        <th className="p-4 font-black uppercase border-r-[4px] border-white text-center text-[#e5ff00]">SATUAN</th>
                        <th className="p-4 font-black uppercase border-r-[4px] border-white text-right text-[#e5ff00]">HARGA SATUAN</th>
                        <th className="p-4 font-black uppercase text-right text-[#e5ff00]">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-[4px] divide-black">
                      {modalData.rab.map((r: any, i: number) => (
                        <tr key={i} className="hover:bg-[#e5ff00] transition-colors">
                          <td className="p-4 font-bold border-r-[4px] border-black">{r.nama}</td>
                          <td className="p-4 font-black border-r-[4px] border-black text-center">{r.jumlah}</td>
                          <td className="p-4 font-bold border-r-[4px] border-black text-center">{r.satuan}</td>
                          <td className="p-4 font-black border-r-[4px] border-black text-right">RP {r.hargaSatuan?.toLocaleString('id-ID')}</td>
                          <td className="p-4 font-black text-right bg-[#00ff88]">RP {r.total?.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-[4px] border-black">
                      <tr>
                        <td colSpan={4} className="p-4 text-right font-black uppercase text-xl border-r-[4px] border-black">TOTAL KESELURUHAN:</td>
                        <td className="p-4 text-right font-black text-3xl bg-black text-[#e5ff00]">
                          RP {modalData.rab.reduce((acc: number, curr: any) => acc + curr.total, 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 font-bold text-xl border-[4px] border-dashed border-black">TIDAK ADA DATA RAB</div>
              )}
              <button onClick={closeModal} className="mt-8 border-[4px] border-black bg-black text-[#e5ff00] px-8 py-4 font-black text-xl uppercase hover:bg-[#e5ff00] hover:text-black transition-colors w-full">
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
