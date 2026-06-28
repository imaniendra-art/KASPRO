import { CheckCircle, Clock, FileText, Loader2, MessageSquare, Send, User, Wallet, XCircle, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PengajuanDetailBrutalism(props: any) {
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
    <div className="p-8 pb-20">
      <div className="mb-12">
        <button onClick={() => router.back()} className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-[#ffffff] transition-colors mb-6 bg-white text-black">
          ← KEMBALI
        </button>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">Detail</h1>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xl font-bold uppercase tracking-widest bg-black text-[#ffffff] px-4 py-1 border-[4px] border-black inline-block">ID: {p._id}</p>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
            {['Dicairkan', 'Selesai'].includes(p.status) && (
              <span className={`px-6 py-3 border-[4px] border-black font-black text-xl uppercase shadow-[4px_4px_0_0_#000] ${p.potongPaguMaster ? 'bg-[#ff00ff] text-white' : 'bg-[#ff8800] text-black'}`}>
                {p.potongPaguMaster ? 'DANA PAGU' : 'DANA NON-PAGU'}
              </span>
            )}
            <span className="bg-[#e5ff00] px-6 py-3 border-[4px] border-black font-black text-xl uppercase shadow-[4px_4px_0_0_#000]">
              STATUS: {p.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kiri: Detail & RAB */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black uppercase mb-8 border-b-[4px] border-black pb-4 text-black">Info Umum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-lg font-black uppercase mb-2 text-black">Judul Pengajuan</p>
                <p className="text-2xl font-bold text-black uppercase border-[4px] border-black bg-slate-100 p-4">{p.judul}</p>
              </div>
              <div>
                <p className="text-lg font-black uppercase mb-2 text-black">Pengusul</p>
                <p className="text-2xl font-bold text-black uppercase border-[4px] border-black bg-slate-100 p-4">
                  {p.pengusulId?.namaLengkap}{" "}
                  {(() => {
                    const info = p.pengusulId?.unitId?.namaUnit || (p.pengusulId?.divisi && p.pengusulId?.divisi !== "-" ? p.pengusulId.divisi : null) || p.pengusulId?.role;
                    return info ? <span className="text-slate-500">({info})</span> : null;
                  })()}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <p className="text-lg font-black uppercase mb-2 text-black">Deskripsi / Latar Belakang</p>
                <p className="text-xl font-bold text-black leading-relaxed bg-[#e5ff00] p-6 border-[4px] border-black">{p.deskripsi}</p>
              </div>
              {p.buktiLpj && (
                <div className="col-span-1 md:col-span-2 mt-4 border-t-[4px] border-black pt-6">
                  <p className="text-lg font-black uppercase mb-4 text-black">Bukti LPJ / Kuitansi</p>
                  <a href={p.buktiLpj} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 px-6 py-4 bg-black text-[#ffffff] hover:bg-white hover:text-black border-[4px] border-black transition-colors font-black text-xl uppercase">
                    <FileText className="w-6 h-6" />
                    LIHAT BUKTI LPJ
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black uppercase mb-8 border-b-[4px] border-black pb-4 text-black">RAB</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-[4px] border-black">
                    <th className="pb-4 text-xl font-black uppercase text-black border-r-[4px] border-black pr-4">Item</th>
                    <th className="pb-4 px-4 text-xl font-black uppercase text-black border-r-[4px] border-black">Jml</th>
                    <th className="pb-4 px-4 text-xl font-black uppercase text-black border-r-[4px] border-black whitespace-nowrap">Harga Satuan</th>
                    <th className="pb-4 pl-4 text-xl font-black uppercase text-black text-right">Total</th>
                    {isAdmin && <th className="pb-4 pl-4 text-xl font-black uppercase text-black text-right w-12"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y-[4px] divide-black">
                  {(editedRab || p.rab).map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-100">
                      <td className="py-4 pr-4 border-r-[4px] border-black text-xl font-bold text-black uppercase">
                        {(isAdmin || isKetua) ? (
                          <input type="text" value={item.namaItem} onChange={(e) => handleEditRabItem(i, 'namaItem', e.target.value)} className="w-full bg-white border-[4px] border-black px-2 py-1 focus:outline-none" />
                        ) : (
                          item.namaItem
                        )}
                        {item.lampiran && (
                          <a href={item.lampiran} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center text-[#ff003c] hover:text-black transition-colors" title="Lihat Lampiran">
                            <FileText className="w-5 h-5" />
                          </a>
                        )}
                      </td>
                      <td className="py-4 px-4 border-r-[4px] border-black text-xl font-bold text-black uppercase whitespace-nowrap">
                        {(isAdmin || isKetua) ? (
                          <div className="flex items-center gap-2">
                            <input type="number" min="1" value={item.jumlah} onChange={(e) => handleEditRabItem(i, 'jumlah', e.target.value)} onWheel={(e) => e.currentTarget.blur()} className="w-20 bg-white border-[4px] border-black px-2 py-1 focus:outline-none" />
                            <input type="text" value={item.satuan} onChange={(e) => handleEditRabItem(i, 'satuan', e.target.value)} className="w-20 bg-white border-[4px] border-black px-2 py-1 focus:outline-none" placeholder="pcs" />
                          </div>
                        ) : (
                          `${item.jumlah} ${item.satuan}`
                        )}
                      </td>
                      <td className="py-4 px-4 border-r-[4px] border-black text-xl font-bold text-black uppercase whitespace-nowrap">
                        {(isAdmin || isKetua) ? (
                          <input type="number" value={item.hargaSatuan} onChange={(e) => handleEditRabItem(i, 'hargaSatuan', e.target.value)} onWheel={(e) => e.currentTarget.blur()} className="w-32 bg-white border-[4px] border-black px-2 py-1 focus:outline-none" />
                        ) : (
                          `RP ${item.hargaSatuan.toLocaleString("id-ID")}`
                        )}
                      </td>
                      <td className="py-4 pl-4 font-black text-black text-xl text-right whitespace-nowrap">RP {item.total.toLocaleString("id-ID")}</td>
                      {isAdmin && (
                        <td className="py-4 pl-4 text-right">
                          <button onClick={() => handleDeleteRabItem(i)} className="p-2 border-[4px] border-black bg-red-500 hover:bg-black text-white transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 pt-6 border-t-[4px] border-black flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-2xl font-black uppercase text-black">Total Pengajuan</span>
              <span className="text-3xl font-black text-black bg-[#e5ff00] px-4 py-2 border-[4px] border-black">RP {p.totalNominal.toLocaleString("id-ID")}</span>
            </div>
            {p.totalDisetujui > 0 && (
              <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t-[4px] border-black pt-6">
                <span className="text-2xl font-black uppercase text-black">Total Disetujui</span>
                <span className="text-4xl font-black text-[#ffffff] bg-black px-6 py-3 border-[4px] border-black">
                  RP {p.totalDisetujui.toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Timeline & Panel Aksi */}
        <div className="space-y-8">
          <div className="bg-[#e5ff00] border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[600px]">
            <h3 className="text-2xl font-black uppercase mb-6 text-black border-b-[4px] border-black pb-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-black" /> RIWAYAT
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
              {logs.length === 0 ? (
                <p className="text-xl font-black text-black text-center mt-10 border-[4px] border-black border-dashed p-6 bg-white">BELUM ADA CATATAN.</p>
              ) : (
                <div className="space-y-6">
                  {logs.map((log: any, i: number) => (
                    <div key={i} className="bg-white border-[4px] border-black p-4">
                      <p className="text-sm font-bold text-black uppercase mb-2 border-b-[4px] border-black pb-2 inline-block">
                        {new Date(log.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                      <div className="mt-2">
                        <p className="text-lg font-black text-black uppercase flex items-center gap-2 flex-wrap">
                          <User className="w-5 h-5 text-black" /> 
                          {log.userId?.namaLengkap} 
                          <span className={`px-2 py-1 text-sm font-black border-[4px] border-black ${log.aksi === "Approve" ? "bg-black text-[#ffffff]" : log.aksi === "Reject" ? "bg-[#ff003c] text-[#ffffff]" : "bg-white text-black"}`}>
                            {log.aksi}
                          </span>
                        </p>
                        {log.catatan && (
                          <div className="mt-4 text-lg font-bold text-black flex items-start gap-3 bg-slate-100 p-3 border-[4px] border-black">
                            <MessageSquare className="w-6 h-6 text-black shrink-0" />
                            <p className="uppercase">
                              {log.tujuanCatatan !== "umum" && (
                                <span className="text-black text-sm mr-2 font-black uppercase bg-white border-[2px] border-black px-1">[{log.tujuanCatatan}]</span>
                              )}
                              {log.catatan}
                            </p>
                          </div>
                        )}
                        {log.aksi === "Upload Bukti" && p.buktiLpj && (
                          <div className="mt-4">
                            <a href={p.buktiLpj} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-[#ffffff] hover:bg-white hover:text-black border-[4px] border-black font-black uppercase text-sm transition-colors">
                              <FileText className="w-4 h-4" />
                              LIHAT BUKTI
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
              <div className="mt-6 pt-6 border-t-[4px] border-black space-y-6">
                <h4 className="text-xl font-black text-black uppercase bg-white border-[4px] border-black px-4 py-2 inline-block">PANEL KEPUTUSAN</h4>
                
                {(needsAdminAction || needsKetuaAction) && (
                  <div className="space-y-2">
                    <label className="text-lg font-black text-black block uppercase">Ubah Nominal Disetujui</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-black font-black text-xl">RP</span>
                      <input 
                        type="number" 
                        value={nominalDisetujui || p.totalNominal}
                        onChange={e => setNominalDisetujui(Number(e.target.value))}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="w-full bg-white border-[4px] border-black py-3 pl-14 pr-4 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#ffffff] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {(needsAdminAction || needsKetuaAction) && (
                  <div className="space-y-4">
                    {isKetua ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-lg font-black text-black block mb-2 uppercase">Catatan Untuk Admin</label>
                          <textarea 
                            rows={2}
                            value={catatanAdmin}
                            onChange={e => setCatatanAdmin(e.target.value)}
                            placeholder="INSTRUKSI..."
                            className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#ffffff] transition-colors uppercase"
                          />
                        </div>
                        <div>
                          <label className="text-lg font-black text-black block mb-2 uppercase">Catatan Untuk User</label>
                          <textarea 
                            rows={2}
                            value={catatanUser}
                            onChange={e => setCatatanUser(e.target.value)}
                            placeholder="PESAN..."
                            className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#ffffff] transition-colors uppercase"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <label className="text-lg font-black text-black block uppercase">Catatan Tambahan</label>
                        <textarea 
                          rows={2}
                          value={catatanUmum}
                          onChange={e => setCatatanUmum(e.target.value)}
                          placeholder="ALASAN..."
                          className="w-full bg-white border-[4px] border-black py-3 px-4 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-[#ffffff] transition-colors uppercase"
                        />
                      </>
                    )}
                  </div>
                )}


                <div className="flex flex-col gap-3">
                  {needsAdminAction && (
                    <div className="flex gap-3">
                      <button onClick={() => handleAction("Teruskan", "Menunggu Ketua")} disabled={isSubmitting} className="flex-1 bg-white text-black border-[4px] border-black hover:bg-black hover:text-[#ffffff] px-4 py-4 text-lg font-black uppercase transition-colors flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Send className="w-5 h-5"/> KE KETUA</>}
                      </button>
                      <button onClick={() => handleAction("Approve", "Dicairkan")} disabled={isSubmitting} className="flex-1 bg-black text-[#ffffff] border-[4px] border-black hover:bg-white hover:text-black px-4 py-4 text-lg font-black uppercase transition-colors flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5"/> CAIRKAN
                      </button>
                    </div>
                  )}
                  {needsKetuaAction && (
                    <button onClick={() => handleAction("Approve", "Disetujui Ketua")} disabled={isSubmitting} className="w-full bg-black text-[#ffffff] border-[4px] border-black hover:bg-white hover:text-black px-6 py-4 text-xl font-black uppercase transition-colors flex items-center justify-center gap-3">
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <><CheckCircle className="w-6 h-6"/> ACC KETUA</>}
                    </button>
                  )}
                  {needsCairAction && (
                    <button onClick={() => handleAction("Approve", "Dicairkan")} disabled={isSubmitting} className="w-full bg-black text-[#ffffff] border-[4px] border-black hover:bg-white hover:text-black px-6 py-4 text-xl font-black uppercase transition-colors flex items-center justify-center gap-3">
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Wallet className="w-6 h-6"/> CAIRKAN SEKARANG</>}
                    </button>
                  )}
                  
                  {(needsAdminAction || needsKetuaAction) && (
                    <button onClick={() => handleAction("Reject", "Ditolak")} disabled={isSubmitting} className="w-full bg-[#ff003c] text-[#ffffff] border-[4px] border-black hover:bg-black px-6 py-4 text-xl font-black uppercase transition-colors flex items-center justify-center gap-3">
                      <XCircle className="w-6 h-6"/> TOLAK
                    </button>
                  )}

                  {(p.status === 'Dicairkan' || p.status === 'Selesai') && (
                    <div className="w-full relative mt-4">
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
                        className="w-full cursor-pointer bg-black text-[#ffffff] border-[4px] border-black hover:bg-white hover:text-black px-6 py-4 text-xl font-black uppercase transition-colors flex items-center justify-center gap-3 text-center"
                      >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Upload className="w-6 h-6"/> {p.status === 'Selesai' ? 'UPLOAD ULANG BUKTI' : 'UPLOAD BUKTI LPJ'}</>}
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
