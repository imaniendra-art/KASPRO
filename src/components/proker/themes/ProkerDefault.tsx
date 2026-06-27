import { FolderKanban, Loader2, Plus, Send, Trash2, Pencil, CheckCircle, XCircle, MessageSquare, AlertCircle, X, Eye, Info } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
    capaian, setCapaian, baseLine, setBaseLine, target, setTarget,
    waktuPelaksanaan, setWaktuPelaksanaan, sasaran, setSasaran, pesertaMitra, setPesertaMitra,
    rab, setRab, handleRabChange, addRabItem, removeRabItem,
    submitting, handleCreate, ajukanKeKeuangan, hapusDraft, handleValidasi, openEditModal
  } = props;

  const [expandedProkerId, setExpandedProkerId] = useState<string | null>(null);

  const formatWaktuPelaksanaan = (waktuStr: string) => {
    if (!waktuStr) return "-";
    const parts = waktuStr.split(",");
    const startDate = new Date(parts[0]);
    if (isNaN(startDate.getTime())) return waktuStr;
    const endDate = parts[1] ? new Date(parts[1]) : null;
    const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return endDate && endDate.getTime() !== startDate.getTime()
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : formatDate(startDate);
  };
  const [valAnggaran, setValAnggaran] = useState<number>(0);
  const [valCatatan, setValCatatan] = useState("");
  const [valRab, setValRab] = useState<any[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");

  React.useEffect(() => {
    if (waktuPelaksanaan && waktuPelaksanaan.includes(",")) {
      const [start, end] = waktuPelaksanaan.split(",");
      setWaktuMulai(start || "");
      setWaktuSelesai(end || "");
    } else {
      setWaktuMulai(waktuPelaksanaan || "");
      setWaktuSelesai("");
    }
  }, [waktuPelaksanaan]);

  const handleWaktuChange = (type: 'start' | 'end', val: string) => {
    const start = type === 'start' ? val : waktuMulai;
    const end = type === 'end' ? val : waktuSelesai;
    setWaktuMulai(start);
    setWaktuSelesai(end);
    if (start && end) {
      setWaktuPelaksanaan(`${start},${end}`);
    } else if (start) {
      setWaktuPelaksanaan(start);
    } else if (end) {
      setWaktuPelaksanaan(end);
    } else {
      setWaktuPelaksanaan("");
    }
  };

  const toggleExpanded = (item: any) => {
    if (expandedProkerId === item._id) {
      setExpandedProkerId(null);
    } else {
      setExpandedProkerId(item._id);
      setValAnggaran(item.estimasiAnggaran);
      setValCatatan("");
      setValRab(item.rab ? JSON.parse(JSON.stringify(item.rab)) : []);
    }
  };

  const handleValRabChange = (index: number, field: string, value: string | number) => {
    const updated = [...valRab];
    updated[index][field] = value;
    if (field === 'jumlah' || field === 'hargaSatuan') {
      const vol = Number(updated[index].jumlah) || 0;
      const hrg = Number(updated[index].hargaSatuan) || 0;
      updated[index].total = vol * hrg;
    }
    setValRab(updated);
    const newTotal = updated.reduce((sum, r) => sum + (Number(r.total) || 0), 0);
    setValAnggaran(newTotal);
  };

  const removeValRabItem = (index: number) => {
    const updated = [...valRab];
    updated.splice(index, 1);
    setValRab(updated);
    const newTotal = updated.reduce((sum, r) => sum + (Number(r.total) || 0), 0);
    setValAnggaran(newTotal);
  };

  const submitValidasi = (id: string, status: string) => {
    if (handleValidasi) {
      handleValidasi(id, status, valAnggaran, valCatatan, valRab).then(() => {
        setExpandedProkerId(null);
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
        
        {session?.user?.role === "user" && (
          <div className="flex gap-3">
            <button 
              onClick={props.kirimSemuaAjuan}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 w-max"
            >
              <Send className="w-5 h-5" />
              <span>Kirim Semua Ajuan</span>
            </button>
            <button 
              onClick={() => {
                if (!props.hasActivePeriode) {
                   alert("Tidak bisa membuat proker: Belum ada Periode Anggaran yang aktif. Harap hubungi Admin Keuangan.");
                   return;
                }
                setIsCreating(!isCreating);
              }}
              disabled={!props.hasActivePeriode}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg w-max ${props.hasActivePeriode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-purple-500/20 hover:shadow-purple-500/40' : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 shadow-none'}`}
              title={!props.hasActivePeriode ? "Belum ada periode anggaran aktif" : ""}
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
            {/* Row 1: Deskripsi, Capaian, Base Line */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Deskripsi</label>
                <input 
                  type="text" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Deskripsi singkat kegiatan..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Capaian</label>
                <input 
                  type="text" value={capaian} onChange={e => setCapaian(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Capaian yang diharapkan..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Base Line (%)</label>
                <div className="relative">
                  <input 
                    type="number" min="0" max="100" value={baseLine} onChange={e => setBaseLine(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="0" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
            </div>
            {/* Row 2: Target, Waktu Pelaksanaan, Sasaran */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Target (%)</label>
                <div className="relative">
                  <input 
                    type="number" min="0" max="100" value={target} onChange={e => setTarget(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="100" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Mulai Pelaksanaan</label>
                  <input 
                    type="date" value={waktuMulai} onChange={e => handleWaktuChange('start', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Akhir Pelaksanaan (Opsional)</label>
                  <input 
                    type="date" value={waktuSelesai} onChange={e => handleWaktuChange('end', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Sasaran</label>
                <input 
                  type="text" value={sasaran} onChange={e => setSasaran(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Sasaran program kerja..." 
                />
              </div>
            </div>
            {/* Row 3 partial: Peserta/Mitra */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1.5">Peserta / Mitra</label>
                <input 
                  type="text" value={pesertaMitra} onChange={e => setPesertaMitra(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Peserta atau mitra terlibat..." 
                />
              </div>
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
        ) : (!data || data.length === 0) ? (
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
                {data.map((item: any) => {
                  const isAdminValidating = ["admin", "ketua"].includes(session?.user?.role) && item.status === "Menunggu Validasi";
                  return (
                  <React.Fragment key={item._id}>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white">{item.judul}</p>
                      {session?.user?.role !== "user" && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Oleh: {item.pengusulId?.namaLengkap} ({item.pengusulId?.unitId?.namaUnit || item.pengusulId?.divisi || item.pengusulId?.role || "-"})
                        </p>
                      )}
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
                    <td className="p-4 font-medium text-slate-500 dark:text-gray-400">
                      <span>Rp {item.estimasiAnggaran.toLocaleString('id-ID')}</span>
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
                      {session?.user?.role === "user" && item.status === "Draft" && (
                        <>
                          <button onClick={() => openEditModal(item)} className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1">
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => hapusDraft(item._id)} className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Hapus
                          </button>
                        </>
                      )}
                      {((session?.user?.role === "user" && item.status !== "Draft") || (["admin", "ketua"].includes(session?.user?.role) && item.status !== "Menunggu Validasi")) && (
                        <button onClick={() => toggleExpanded(item)} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" /> {expandedProkerId === item._id ? "Tutup" : "Lihat Rincian"}
                        </button>
                      )}
                      
                      {isAdminValidating && (
                        <button onClick={() => toggleExpanded(item)} className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors">
                          {expandedProkerId === item._id ? "Tutup Rincian" : "Validasi Ajuan"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedProkerId === item._id && (
                    <tr className="bg-slate-50/50 dark:bg-white/[0.01]">
                      <td colSpan={6} className="p-0 border-b border-slate-200 dark:border-white/10">
                        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                          
                          {/* Rincian Proker */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-[#1a1a1a] p-5 rounded-xl border border-slate-200 dark:border-white/10">
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Capaian</p>
                              <p className="text-sm text-slate-900 dark:text-white">{item.capaian || "-"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Base Line & Target</p>
                              <p className="text-sm text-slate-900 dark:text-white">{item.baseLine || 0}% &rarr; {item.target || 0}%</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Waktu Pelaksanaan</p>
                              <p className="text-sm text-slate-900 dark:text-white">{formatWaktuPelaksanaan(item.waktuPelaksanaan)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sasaran</p>
                              <p className="text-sm text-slate-900 dark:text-white">{item.sasaran || "-"}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Peserta / Mitra</p>
                              <p className="text-sm text-slate-900 dark:text-white">{item.pesertaMitra || "-"}</p>
                            </div>
                          </div>

                          {/* RAB */}
                          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Rincian Anggaran Biaya (RAB)</h4>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400">
                                  <tr>
                                    <th className="p-3 font-semibold">Nama Item</th>
                                    <th className="p-3 font-semibold w-24">Volume</th>
                                    <th className="p-3 font-semibold w-24">Satuan</th>
                                    <th className="p-3 font-semibold w-40">Harga Satuan</th>
                                    <th className="p-3 font-semibold text-right">Total</th>
                                    {isAdminValidating && <th className="p-3 font-semibold w-10"></th>}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                  {valRab?.map((r: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                                      <td className="p-3 text-slate-900 dark:text-white">
                                        {isAdminValidating ? (
                                          <input type="text" value={r.namaItem} onChange={e => handleValRabChange(idx, 'namaItem', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 focus:border-blue-500 outline-none px-1 py-1" />
                                        ) : r.namaItem}
                                      </td>
                                      <td className="p-3 text-slate-600 dark:text-gray-400">
                                        {isAdminValidating ? (
                                          <input type="number" value={r.jumlah} onChange={e => handleValRabChange(idx, 'jumlah', Number(e.target.value))} className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 focus:border-blue-500 outline-none px-1 py-1" />
                                        ) : r.jumlah}
                                      </td>
                                      <td className="p-3 text-slate-600 dark:text-gray-400">
                                        {isAdminValidating ? (
                                          <input type="text" value={r.satuan} onChange={e => handleValRabChange(idx, 'satuan', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 focus:border-blue-500 outline-none px-1 py-1" />
                                        ) : r.satuan}
                                      </td>
                                      <td className="p-3 text-slate-600 dark:text-gray-400">
                                        {isAdminValidating ? (
                                          <input type="number" value={r.hargaSatuan} onChange={e => handleValRabChange(idx, 'hargaSatuan', Number(e.target.value))} className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 focus:border-blue-500 outline-none px-1 py-1" />
                                        ) : `Rp ${r.hargaSatuan?.toLocaleString('id-ID')}`}
                                      </td>
                                      <td className="p-3 font-medium text-slate-900 dark:text-white text-right">Rp {r.total?.toLocaleString('id-ID')}</td>
                                      {isAdminValidating && (
                                        <td className="p-3">
                                          <button onClick={() => removeValRabItem(idx)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10">
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-slate-50 dark:bg-black/20">
                                  <tr>
                                    <td colSpan={4} className="p-3 text-right font-bold text-slate-600 dark:text-gray-400">Total RAB{isAdminValidating ? ' (Otomatis)' : ''}:</td>
                                    <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                                      Rp {valAnggaran?.toLocaleString('id-ID')}
                                    </td>
                                    {isAdminValidating && <td></td>}
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>

                          {/* Validasi Form */}
                          {["admin", "ketua"].includes(session?.user?.role) && item.status === "Menunggu Validasi" && (
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-blue-500" /> Form Validasi
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Sesuaikan Nominal</label>
                                  <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">Rp</span>
                                    <input 
                                      type="number" 
                                      value={valAnggaran} 
                                      onChange={e => setValAnggaran(Number(e.target.value))}
                                      className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" /> Catatan Admin
                                  </label>
                                  <input 
                                    type="text"
                                    value={valCatatan}
                                    onChange={e => setValCatatan(e.target.value)}
                                    placeholder="Alasan ditolak / direvisi..."
                                    className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-blue-200/50 dark:border-blue-800/30">
                                <button 
                                  onClick={() => submitValidasi(item._id, "Draft")}
                                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 rounded-xl text-sm font-medium transition-colors"
                                >
                                  <AlertCircle className="w-4 h-4" /> Kembalikan
                                </button>
                                <button 
                                  onClick={() => submitValidasi(item._id, "Ditolak")}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 rounded-xl text-sm font-medium transition-colors"
                                >
                                  <XCircle className="w-4 h-4" /> Tolak
                                </button>
                                <button 
                                  onClick={() => submitValidasi(item._id, "Divalidasi Keuangan")}
                                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 rounded-xl text-sm font-medium transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" /> ACC Proker
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
