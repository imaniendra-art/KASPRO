import { FolderKanban, Loader2, Plus, Send, Trash2, Pencil, CheckCircle, XCircle, MessageSquare, AlertCircle, X, Eye, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft": return "bg-slate-500/10 text-slate-500 dark:bg-gray-500/10 dark:text-gray-400 border-slate-500/20";
    case "Menunggu Validasi": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "Divalidasi Keuangan": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "Ditolak": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    default: return "bg-slate-500/10 text-slate-500 dark:bg-gray-500/10 dark:text-gray-400 border-slate-500/20";
  }
};

export default function ProkerDefault(props: any) {
  const {
    data, isLoading, error, session,
    isCreating, setIsCreating,
    judul, setJudul, deskripsi, setDeskripsi,
    rab, setRab, handleRabChange, addRabItem, removeRabItem,
    submitting, handleCreate, ajukanKeKeuangan, hapusDraft, handleValidasi, openEditModal
  } = props;

  const [activeModal, setActiveModal] = useState<any>(null);
  const [valAnggaran, setValAnggaran] = useState<number>(0);
  const [valCatatan, setValCatatan] = useState("");
  const [viewRabModal, setViewRabModal] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  const openValidasiModal = (item: any) => {
    setActiveModal(item);
    setValAnggaran(item.estimasiAnggaran);
    setValCatatan("");
  };

  const closeValidasiModal = () => {
    setActiveModal(null);
  };

  const submitValidasi = (status: string) => {
    if (handleValidasi) {
      handleValidasi(activeModal._id, status, valAnggaran, valCatatan).then(() => {
        closeValidasiModal();
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Program Kerja</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">Kelola rencana kegiatan dan estimasi anggaran divisi Anda.</p>
        </div>
        
        {session?.user?.role === "tendik" && (
          <div className="flex gap-3">
            <button 
              onClick={props.kirimSemuaAjuan}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 w-max"
            >
              <Send className="w-5 h-5" />
              <span>Kirim Semua Ajuan</span>
            </button>
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 w-max"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Draf Proker</span>
            </button>
          </div>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Buat Draf Proker Baru</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400">Nama Program Kerja</label>
                <button 
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" /> Info
                </button>
              </div>

              {showInfo && (
                <div className="mb-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl text-sm text-blue-800 dark:text-blue-200 animate-in fade-in slide-in-from-top-2">
                  <p className="font-semibold mb-1 flex items-center gap-2"><Info className="w-4 h-4"/> Panduan Penamaan Program Kerja</p>
                  <ul className="list-disc list-outside ml-5 space-y-1 mt-2 mb-3">
                    <li>Program kerja bertujuan untuk <strong>menunjang pengembangan institusi dan mendukung IKU</strong> (Indikator Kinerja Utama).</li>
                    <li><strong>Dilarang keras menggunakan kata "Pengadaan"</strong>. Proker bukanlah sekadar pembelian barang.</li>
                    <li>Fokuslah pada <strong>kegiatan</strong> atau peningkatan performa. Barang yang dibeli adalah penunjang kegiatan tersebut (bukan tujuan utamanya).</li>
                    <li>Kegiatan yang diusulkan harus memberikan <strong>dampak atau output yang jelas dan terukur</strong> bagi kemajuan institusi.</li>
                    <li>Anggaran belanja harus <strong>rasional, efisien, dan diketik secara mendetail</strong> ke dalam Rencana Anggaran Biaya (RAB).</li>
                  </ul>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {/* Kolom Benar */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-500/20">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Contoh Benar
                      </p>
                      <div className="space-y-2.5 text-xs text-emerald-900 dark:text-emerald-100">
                        <div>
                          <p className="font-semibold">"Peningkatan Performa Pelayanan Prodi"</p>
                          <p className="text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Item RAB: Beli printer, tinta, kertas, dll.</p>
                        </div>
                        <div className="h-px bg-emerald-200/50 dark:bg-emerald-500/20"></div>
                        <div>
                          <p className="font-semibold">"Peningkatan Proses Belajar Mengajar"</p>
                          <p className="text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Item RAB: Proyektor, papan tulis interaktif, dll.</p>
                        </div>
                        <div className="h-px bg-emerald-200/50 dark:bg-emerald-500/20"></div>
                        <div>
                          <p className="font-semibold">"Optimalisasi Layanan Digital Kampus"</p>
                          <p className="text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Item RAB: Lisensi software, server, jasa teknisi.</p>
                        </div>
                      </div>
                    </div>

                    {/* Kolom Salah */}
                    <div className="bg-red-50/50 dark:bg-red-500/10 p-3 rounded-xl border border-red-200/50 dark:border-red-500/20">
                      <p className="font-bold text-red-700 dark:text-red-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Contoh Salah
                      </p>
                      <div className="space-y-2.5 text-xs text-red-900 dark:text-red-100">
                        <div>
                          <p className="font-semibold line-through opacity-80">"Pengadaan Komputer Lab"</p>
                          <p className="text-red-700/80 dark:text-red-400/80 mt-0.5 mt-1">
                            ❌ Menggunakan kata "pengadaan" dan tidak mencerminkan output kegiatan.
                            <br/><br/>
                            ✅ <span className="text-emerald-600 dark:text-emerald-400 font-medium">Seharusnya:</span> "Peningkatan Fasilitas Praktikum Komputer Mahasiswa".
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <input 
                type="text" value={judul} onChange={e => setJudul(e.target.value)} required
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Harap baca info terlebih dahulu... (Contoh: Peningkatan Performa Pelayanan Prodi)" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Tujuan / Deskripsi</label>
              <textarea 
                value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required rows={3}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Jelaskan secara singkat tujuan dan output kegiatan..." 
              />
            </div>
            {/* RAB Table Input */}
            <div className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Rencana Anggaran Biaya (RAB)</h3>
                <button
                  type="button"
                  onClick={addRabItem}
                  className="flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah Baris
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-left">
                      <th className="pb-3 text-xs font-medium text-slate-500 dark:text-gray-400 w-1/3">Nama Item</th>
                      <th className="pb-3 text-xs font-medium text-slate-500 dark:text-gray-400 w-24">Jumlah</th>
                      <th className="pb-3 text-xs font-medium text-slate-500 dark:text-gray-400 w-24">Satuan</th>
                      <th className="pb-3 text-xs font-medium text-slate-500 dark:text-gray-400 w-40">Harga Satuan</th>
                      <th className="pb-3 text-xs font-medium text-slate-500 dark:text-gray-400 w-40">Total</th>
                      <th className="pb-3 text-xs font-medium text-slate-500 dark:text-gray-400 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {rab.map((item: any, index: number) => (
                      <tr key={index} className="group">
                        <td className="py-3 pr-2">
                          <input
                            type="text"
                            required
                            value={item.namaItem}
                            onChange={(e) => handleRabChange(index, "namaItem", e.target.value)}
                            placeholder="Contoh: Honor Narasumber"
                            className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 pr-2">
                          <input
                            type="number"
                            min="1"
                            required
                            value={item.jumlah}
                            onChange={(e) => handleRabChange(index, "jumlah", Number(e.target.value))}
                            className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 pr-2">
                          <input
                            type="text"
                            required
                            value={item.satuan}
                            onChange={(e) => handleRabChange(index, "satuan", e.target.value)}
                            placeholder="Orang/Paket"
                            className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 pr-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                            <input
                              type="number"
                              min="0"
                              required
                              value={item.hargaSatuan}
                              onChange={(e) => handleRabChange(index, "hargaSatuan", Number(e.target.value))}
                              className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-8 pr-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="py-3 pr-2 text-sm font-medium text-slate-900 dark:text-white">
                          Rp {item.total.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeRabItem(index)}
                            disabled={rab.length === 1}
                            className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end items-center gap-4">
                  <span className="text-slate-500 dark:text-gray-400 font-medium text-sm">Total Estimasi RAB:</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    Rp {rab.reduce((acc: number, curr: any) => acc + curr.total, 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsCreating(false)} className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white px-4">Batal</button>
            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
              {submitting ? "Menyimpan..." : "Simpan Draf"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-sm dark:shadow-none">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-gray-400">Memuat program kerja...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 dark:text-red-400">Gagal memuat data: {(error as Error).message}</div>
        ) : data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-gray-400">
            <FolderKanban className="w-12 h-12 mb-4 opacity-50" />
            <p>Belum ada program kerja yang dibuat.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Program Kerja</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Deskripsi / Tujuan</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Estimasi Awal</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Sisa Pagu (Valid)</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {data.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white">{item.judul}</p>
                      {session?.user?.role === "tendik" === false && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Oleh: {item.pengusulId?.namaLengkap}</p>}
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-gray-400 max-w-xs">
                      <div className="truncate" title={item.deskripsi}>{item.deskripsi}</div>
                      {item.catatan && (
                        <div className="mt-2 text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 p-2 rounded-lg border border-amber-200 dark:border-amber-500/20">
                          <span className="font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Catatan Admin:</span>
                          {item.catatan}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-500 dark:text-gray-400 flex items-center gap-3">
                      <span>Rp {item.estimasiAnggaran.toLocaleString('id-ID')}</span>
                      {(item.rab && item.rab.length > 0) && (
                        <button 
                          onClick={() => setViewRabModal(item)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 rounded-md transition-colors"
                          title="Lihat Rincian RAB"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      Rp {item.sisaAnggaran.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-3">
                      {session?.user?.role === "tendik" && item.status === "Draft" && (
                        <>
                          <button onClick={() => openEditModal(item)} className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1">
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => hapusDraft(item._id)} className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Hapus
                          </button>
                        </>
                      )}
                      
                      {["keuangan", "ketua"].includes(session?.user?.role) && item.status === "Menunggu Validasi" && (
                        <button onClick={() => openValidasiModal(item)} className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors">
                          Validasi Ajuan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Validasi Proker */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-500" />
                Validasi Program Kerja
              </h3>
              <button onClick={closeValidasiModal} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ajuan User</p>
                <p className="font-bold text-slate-900 dark:text-white">{activeModal.judul}</p>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{activeModal.deskripsi}</p>
                <div className="mt-3 text-sm">
                  <span className="text-slate-500">Estimasi Awal:</span> <span className="font-semibold text-slate-900 dark:text-white">Rp {activeModal.estimasiAnggaran.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Ubah Nominal (Jika perlu)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">Rp</span>
                  <input 
                    type="number" 
                    value={valAnggaran} 
                    onChange={e => setValAnggaran(Number(e.target.value))}
                    className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> Komentar / Penjelasan
                </label>
                <textarea 
                  value={valCatatan}
                  onChange={e => setValCatatan(e.target.value)}
                  placeholder="Beri alasan jika ditolak atau dikembalikan..."
                  rows={3}
                  className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                ></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1a1a1a] flex flex-wrap justify-end gap-3">
              <button 
                onClick={closeValidasiModal}
                className="px-5 py-2.5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl font-medium transition-colors"
              >
                Batal
              </button>
              
              <button 
                onClick={() => submitValidasi("Draft")}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 rounded-xl font-medium transition-colors"
              >
                <AlertCircle className="w-4 h-4" /> Kembalikan
              </button>

              <button 
                onClick={() => submitValidasi("Ditolak")}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 rounded-xl font-medium transition-colors"
              >
                <XCircle className="w-4 h-4" /> Tolak
              </button>

              <button 
                onClick={() => submitValidasi("Divalidasi Keuangan")}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 rounded-xl font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> ACC Proker
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal View RAB */}
      {viewRabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Rincian RAB Proker
              </h3>
              <button onClick={() => setViewRabModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Judul Proker</p>
                <p className="font-bold text-slate-900 dark:text-white">{viewRabModal.judul}</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400">
                    <tr>
                      <th className="p-4 font-semibold">Nama Item</th>
                      <th className="p-4 font-semibold">Volume</th>
                      <th className="p-4 font-semibold">Satuan</th>
                      <th className="p-4 font-semibold">Harga Satuan</th>
                      <th className="p-4 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {viewRabModal.rab?.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                        <td className="p-4 text-slate-900 dark:text-white">{r.namaItem}</td>
                        <td className="p-4 text-slate-600 dark:text-gray-400">{r.jumlah}</td>
                        <td className="p-4 text-slate-600 dark:text-gray-400">{r.satuan}</td>
                        <td className="p-4 text-slate-600 dark:text-gray-400">Rp {r.hargaSatuan?.toLocaleString('id-ID')}</td>
                        <td className="p-4 font-medium text-slate-900 dark:text-white text-right">Rp {r.total?.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-black/20">
                    <tr>
                      <td colSpan={4} className="p-4 text-right font-bold text-slate-600 dark:text-gray-400">Total Keseluruhan:</td>
                      <td className="p-4 text-right font-bold text-blue-600 dark:text-blue-400">
                        Rp {viewRabModal.estimasiAnggaran?.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1a1a1a] flex justify-end">
              <button 
                onClick={() => setViewRabModal(null)}
                className="px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 rounded-xl font-medium transition-colors"
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
