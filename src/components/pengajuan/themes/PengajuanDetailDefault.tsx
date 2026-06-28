import { ArrowLeft, CheckCircle, Clock, FileText, Loader2, MessageSquare, Send, User, Wallet, XCircle, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Review Admin": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Menunggu Ketua": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Disetujui Ketua": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Dicairkan": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Ditolak": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Selesai": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function PengajuanDetailDefault(props: any) {
  const {
    p, logs,
    isAdmin, isKetua,
    needsAdminAction, needsKetuaAction, needsCairAction,
    catatanUmum, setCatatanUmum,
    catatanAdmin, setCatatanAdmin,
    catatanUser, setCatatanUser,
    nominalDisetujui, setNominalDisetujui,
    isSubmitting, handleAction, handleUploadBukti,
    editedRab, handleEditRabItem, handleDeleteRabItem
  } = props;
  
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Detail Pengajuan</h1>
            <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">ID: {p._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {['Dicairkan', 'Selesai'].includes(p.status) && (
            <span className={`px-4 py-1.5 rounded-full border font-medium text-sm ${p.potongPaguMaster ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400' : 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400'}`}>
              {p.potongPaguMaster ? 'Dana Pagu' : 'Dana Non-Pagu'}
            </span>
          )}
          <span className={`px-4 py-1.5 rounded-full border font-medium text-sm ${getStatusColor(p.status)}`}>
            Status: {p.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri: Detail & RAB */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Informasi Umum</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Judul Pengajuan</p>
                <p className="font-medium text-slate-900 dark:text-white">{p.judul}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Pengusul</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {p.pengusulId?.namaLengkap}{" "}
                  {(() => {
                    const info = p.pengusulId?.unitId?.namaUnit || (p.pengusulId?.divisi && p.pengusulId?.divisi !== "-" ? p.pengusulId.divisi : null) || p.pengusulId?.role;
                    return info ? <span className="text-slate-500 dark:text-gray-500">({info})</span> : null;
                  })()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Deskripsi / Latar Belakang</p>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5">{p.deskripsi}</p>
              </div>
              {p.buktiLpj && (
                <div className="col-span-2 mt-2">
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Bukti LPJ / Kuitansi</p>
                  <a href={p.buktiLpj} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl transition-colors text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    <span>Lihat Bukti</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Rincian Anggaran (RAB)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400">Item</th>
                    <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400">Jml</th>
                    <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400">Harga Satuan</th>
                    <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 text-right">Total</th>
                    {(isAdmin || isKetua) && <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 w-10"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {(editedRab || p.rab).map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {(isAdmin || isKetua) ? (
                          <input type="text" value={item.namaItem} onChange={(e) => handleEditRabItem(i, 'namaItem', e.target.value)} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        ) : (
                          item.namaItem
                        )}
                        {item.lampiran && (
                          <a href={item.lampiran} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" title="Lihat Lampiran">
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-gray-300 text-sm">
                        {(isAdmin || isKetua) ? (
                          <div className="flex items-center gap-1">
                            <input type="number" min="1" value={item.jumlah} onChange={(e) => handleEditRabItem(i, 'jumlah', e.target.value)} onWheel={(e) => e.currentTarget.blur()} className="w-16 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <input type="text" value={item.satuan} onChange={(e) => handleEditRabItem(i, 'satuan', e.target.value)} className="w-16 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="pcs" />
                          </div>
                        ) : (
                          `${item.jumlah} ${item.satuan}`
                        )}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-gray-300 text-sm">
                        {(isAdmin || isKetua) ? (
                          <input type="number" value={item.hargaSatuan} onChange={(e) => handleEditRabItem(i, 'hargaSatuan', e.target.value)} onWheel={(e) => e.currentTarget.blur()} className="w-24 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        ) : (
                          `Rp ${item.hargaSatuan.toLocaleString("id-ID")}`
                        )}
                      </td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white text-sm text-right">Rp {item.total.toLocaleString("id-ID")}</td>
                      {(isAdmin || isKetua) && (
                        <td className="py-3 text-right">
                          <button onClick={() => handleDeleteRabItem(i)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
              <span className="text-slate-500 dark:text-gray-400 font-medium">Total Pengajuan Awal</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">Rp {p.totalNominal.toLocaleString("id-ID")}</span>
            </div>
            {p.totalDisetujui > 0 && (
              <div className="mt-2 flex justify-between items-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Total Akhir Disetujui</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Rp {p.totalDisetujui.toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Timeline & Panel Aksi */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md h-full max-h-[600px] flex flex-col shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400" /> Riwayat Persetujuan
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {logs.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-gray-500 text-center mt-10">Belum ada catatan aktivitas.</p>
              ) : (
                <div className="relative border-l border-slate-200 dark:border-white/10 ml-3 space-y-6">
                  {logs.map((log: any, i: number) => (
                    <div key={i} className="pl-6 relative">
                      <span className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-[#0a0a0a] ${
                        log.aksi === "Approve" ? "bg-emerald-500" : 
                        log.aksi === "Reject" ? "bg-red-500" : 
                        "bg-blue-500"
                      }`}></span>
                      
                      <p className="text-xs text-slate-500 dark:text-gray-500 mb-1">
                        {new Date(log.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                      <div className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-xl p-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 dark:text-gray-400" /> 
                          {log.userId?.namaLengkap} 
                          <span className="text-xs font-normal text-slate-500 dark:text-gray-500 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/5">
                            {log.aksi}
                          </span>
                        </p>
                        {log.catatan && (
                          <div className="mt-2 text-sm text-slate-600 dark:text-gray-300 flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                            <p>
                              {log.tujuanCatatan !== "umum" && (
                                <span className="text-blue-600 dark:text-blue-400 text-xs mr-1 font-semibold uppercase">[{log.tujuanCatatan}]: </span>
                              )}
                              {log.catatan}
                            </p>
                          </div>
                        )}
                        {log.aksi === "Upload Bukti" && p.buktiLpj && (
                          <div className="mt-3">
                            <a href={p.buktiLpj} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium transition-colors border border-slate-200 dark:border-white/10">
                              <FileText className="w-3.5 h-3.5" />
                              Lihat Bukti
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel Aksi */}
            {(needsAdminAction || needsKetuaAction || needsCairAction || p.status === 'Dicairkan' || p.status === 'Selesai') && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Panel Keputusan / Aksi</h4>
                
                {(needsAdminAction || needsKetuaAction) && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 dark:text-gray-400 block font-medium">Ubah Nominal Disetujui (Opsional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 dark:text-gray-500 text-sm">Rp</span>
                      <input 
                        type="number" 
                        value={nominalDisetujui || p.totalNominal}
                        onChange={e => setNominalDisetujui(Number(e.target.value))}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-8 pr-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {(needsAdminAction || needsKetuaAction) && (
                  <div className="space-y-3">
                    {isKetua ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 dark:text-gray-400 block mb-2 font-medium">Catatan Khusus Admin Keuangan</label>
                          <textarea 
                            rows={3}
                            value={catatanAdmin}
                            onChange={e => setCatatanAdmin(e.target.value)}
                            placeholder="Instruksi untuk pencairan dll..."
                            className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-gray-400 block mb-2 font-medium">Catatan Khusus User (Pengusul)</label>
                          <textarea 
                            rows={3}
                            value={catatanUser}
                            onChange={e => setCatatanUser(e.target.value)}
                            placeholder="Pesan untuk pengusul..."
                            className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <label className="text-xs text-slate-500 dark:text-gray-400 block font-medium">Catatan Tambahan</label>
                        <textarea 
                          rows={2}
                          value={catatanUmum}
                          onChange={e => setCatatanUmum(e.target.value)}
                          placeholder="Masukkan alasan atau pesan..."
                          className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </>
                    )}
                  </div>
                )}


                <div className="flex flex-wrap gap-2 pt-2">
                  {needsAdminAction && (
                    <>
                      <button onClick={() => handleAction("Teruskan", "Menunggu Ketua")} disabled={isSubmitting} className="flex-1 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-600/30 hover:bg-blue-100 dark:hover:bg-blue-600/30 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Send className="w-4 h-4"/> Ke Ketua</>}
                      </button>
                      <button onClick={() => handleAction("Approve", "Dicairkan")} disabled={isSubmitting} className="flex-1 bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-600/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4"/> Cairkan
                      </button>
                    </>
                  )}
                  {needsKetuaAction && (
                    <button onClick={() => handleAction("Approve", "Disetujui Ketua")} disabled={isSubmitting} className="flex-1 bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-600/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <><CheckCircle className="w-4 h-4"/> ACC Ketua</>}
                    </button>
                  )}
                  {needsCairAction && (
                    <button onClick={() => handleAction("Approve", "Dicairkan")} disabled={isSubmitting} className="w-full bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-600/30 hover:bg-purple-100 dark:hover:bg-purple-600/30 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Wallet className="w-4 h-4"/> Cairkan Sekarang</>}
                    </button>
                  )}
                  
                  {(needsAdminAction || needsKetuaAction) && (
                    <button onClick={() => handleAction("Reject", "Ditolak")} disabled={isSubmitting} className="flex-none bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-600/30 hover:bg-red-100 dark:hover:bg-red-600/30 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center">
                      <XCircle className="w-4 h-4"/>
                    </button>
                  )}

                  {(p.status === 'Dicairkan' || p.status === 'Selesai') && (
                    <div className="w-full relative mt-2">
                      <input
                        type="file"
                        id="upload-bukti-detail"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => handleUploadBukti(e.target.files?.[0] || null)}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="upload-bukti-detail"
                        className="w-full cursor-pointer bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-600/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Upload className="w-4 h-4"/> {p.status === 'Selesai' ? 'Upload Ulang Bukti LPJ' : 'Upload Bukti LPJ / Kuitansi'}</>}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
