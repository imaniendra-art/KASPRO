import { FolderKanban, Loader2, Plus, Send, Trash2, Pencil, CheckCircle, XCircle, MessageSquare, AlertCircle, X, Eye, Info, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";

export default function ProkerBrutalism(props: any) {
  const {
    data, isLoading, error, session,
    isCreating, setIsCreating,
    judul, setJudul, deskripsi, setDeskripsi,
    target, setTarget, sasaran, setSasaran, pesertaMitra, setPesertaMitra,
    waktuMulai, setWaktuMulai, waktuSelesai, setWaktuSelesai,
    baseLine, setBaseLine, capaian, setCapaian,
    rab, setRab, handleRabChange, addRabItem, removeRabItem,
    submitting, handleCreate, ajukanKeKeuangan, kirimSemuaAjuan, hapusDraft, handleValidasi, openEditModal
  } = props;
  
  const isKetua = session?.user?.role === "ketua";

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const groupedData = useMemo(() => {
    if (!isKetua || !data) return null;
    
    return data.reduce((acc: any, item: any) => {
      const pengusulInfo = item.pengusulId;
      const unitName = pengusulInfo?.unitId?.namaUnit || pengusulInfo?.divisi || pengusulInfo?.role || "-";
      const nama = pengusulInfo?.namaLengkap || "Tanpa Nama";
      const groupKey = `${nama} (${unitName})`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = {
          namaLengkap: nama,
          divisi: unitName,
          totalProker: 0,
          totalAnggaran: 0,
          items: []
        };
      }
      
      acc[groupKey].items.push(item);
      acc[groupKey].totalProker += 1;
      acc[groupKey].totalAnggaran += (item.estimasiAnggaran || 0);
      
      return acc;
    }, {});
  }, [data, isKetua]);

  const [activeModal, setActiveModal] = useState<any>(null);
  const [valAnggaran, setValAnggaran] = useState<number>(0);
  const [valCatatan, setValCatatan] = useState("");
  const [valRab, setValRab] = useState<any[]>([]);
  const [viewRabModal, setViewRabModal] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  const openValidasiModal = (item: any) => {
    setActiveModal(item);
    setValAnggaran(item.estimasiAnggaran);
    setValCatatan("");
    setValRab(JSON.parse(JSON.stringify(item.rab || [])));
  };

  const handleValRabChange = (index: number, field: string, value: any) => {
    const newRab = [...valRab];
    newRab[index][field] = value;
    if (field === "jumlah" || field === "hargaSatuan") {
      newRab[index].total = Number(newRab[index].jumlah || 0) * Number(newRab[index].hargaSatuan || 0);
    }
    setValRab(newRab);
    
    const newTotal = newRab.reduce((acc, curr) => acc + curr.total, 0);
    setValAnggaran(newTotal);
  };

  const handleWaktuChange = (type: 'start' | 'end', val: string) => {
    const start = type === 'start' ? val : waktuMulai;
    const end = type === 'end' ? val : waktuSelesai;
    setWaktuMulai(start);
    setWaktuSelesai(end);
    if (start && end) {
      // Logic handled in page.tsx usually, but we update the raw states here
    }
  };

  const closeValidasiModal = () => {
    setActiveModal(null);
  };

  const submitValidasi = async (status: string) => {
    if (!activeModal) return;
    try {
      await handleValidasi(activeModal._id, status, valAnggaran, valCatatan, valRab);
      closeValidasiModal();
    } catch (err) {
      // Error ditangani di parent
    }
  };

  return (
    <div className="p-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard" className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-white transition-colors mb-6 bg-white text-black">
            ← KEMBALI KE DASHBOARD
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">PROKER</h1>
          <p className="text-xl font-bold uppercase tracking-widest mt-4">Program Kerja & Anggaran</p>
        </div>
        
        {session?.user?.role === "user" && (
          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={kirimSemuaAjuan}
              className="border-[4px] border-black px-8 py-4 bg-[#e5ff00] text-black font-black text-2xl uppercase hover:bg-black hover:text-[#e5ff00] transition-colors text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] flex items-center justify-center gap-3"
            >
              <Send className="w-8 h-8" /> KIRIM SEMUA AJUAN
            </button>
            <button 
              onClick={() => {
                if (!props.hasActivePeriode) {
                   alert("TIDAK BISA MEMBUAT PROKER: BELUM ADA PERIODE ANGGARAN YANG AKTIF!");
                   return;
                }
                setIsCreating(!isCreating);
              }}
              disabled={!props.hasActivePeriode}
              className={`border-[4px] border-black px-8 py-4 ${props.hasActivePeriode ? 'bg-[#ff003c] text-white hover:bg-black hover:text-[#ff003c] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]' : 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]'} font-black text-2xl uppercase transition-colors text-center flex items-center justify-center gap-3 group`}
              title={!props.hasActivePeriode ? "Belum ada periode anggaran aktif" : ""}
            >
              <Plus className={`w-8 h-8 ${props.hasActivePeriode ? 'group-hover:text-[#ff003c]' : ''} transition-colors`} />
              <span className={`${props.hasActivePeriode ? 'group-hover:text-[#ff003c]' : ''} transition-colors`}>{isCreating ? "BATAL BUAT" : "BUAT DRAF BARU"}</span>
            </button>
          </div>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#e5ff00] border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
          <h2 className="text-4xl font-black uppercase mb-8 border-b-[4px] border-black pb-4 text-black">DRAF BARU</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <label className="block text-xl font-black uppercase text-black">Nama Program Kerja</label>
                <button 
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-2 border-[3px] border-black bg-white px-3 py-1 font-bold hover:bg-black hover:text-white transition-colors uppercase text-sm"
                >
                  <Info className="w-4 h-4" /> INFO
                </button>
              </div>

              {showInfo && (
                <div className="mb-4 p-6 bg-white border-[4px] border-black shadow-[4px_4px_0_0_#000]">
                  <p className="font-black text-2xl uppercase border-b-[3px] border-black pb-2 mb-4 flex items-center gap-2">
                    <Info className="w-6 h-6"/> PANDUAN PENAMAAN
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-bold text-lg mb-6">
                    <li>PROGRAM KERJA BERTUJUAN UNTUK <span className="bg-[#ff003c] text-white px-1">MENUNJANG PENGEMBANGAN INSTITUSI DAN MENDUKUNG IKU</span> (INDIKATOR KINERJA UTAMA).</li>
                    <li><span className="bg-black text-[#ff003c] px-1">DILARANG KERAS</span> MENGGUNAKAN KATA "PENGADAAN". PROKER BUKANLAH SEKADAR PEMBELIAN BARANG.</li>
                    <li>FOKUSLAH PADA <span className="bg-[#e5ff00] px-1 border-2 border-black">KEGIATAN ATAU PENINGKATAN PERFORMA</span>. BARANG YANG DIBELI ADALAH PENUNJANG KEGIATAN TERSEBUT (BUKAN TUJUAN UTAMANYA).</li>
                    <li>KEGIATAN YANG DIUSULKAN HARUS MEMBERIKAN DAMPAK ATAU OUTPUT YANG JELAS DAN TERUKUR BAGI KEMAJUAN INSTITUSI.</li>
                    <li>ANGGARAN BELANJA HARUS RASIONAL, EFISIEN, DAN DIKETIK SECARA MENDETAIL KE DALAM RENCANA ANGGARAN BIAYA (RAB).</li>
                  </ul>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-[3px] border-black p-4 bg-[#00ff88]">
                      <p className="font-black text-xl mb-4 flex items-center gap-2 border-b-[2px] border-black pb-2">
                        <CheckCircle className="w-6 h-6" /> CONTOH BENAR
                      </p>
                      <div className="space-y-4 font-bold">
                        <div>
                          <p>"Peningkatan Performa Pelayanan Prodi"</p>
                          <p className="text-sm mt-1 bg-white border-2 border-black p-1 inline-block">Item RAB: Beli printer, tinta, kertas, dll.</p>
                        </div>
                        <div>
                          <p>"Peningkatan Proses Belajar Mengajar"</p>
                          <p className="text-sm mt-1 bg-white border-2 border-black p-1 inline-block">Item RAB: Proyektor, papan tulis interaktif, dll.</p>
                        </div>
                        <div>
                          <p>"Optimalisasi Layanan Digital Kampus"</p>
                          <p className="text-sm mt-1 bg-white border-2 border-black p-1 inline-block">Item RAB: Lisensi software, server, jasa teknisi.</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-[3px] border-black p-4 bg-[#ff003c] text-white">
                      <p className="font-black text-xl mb-4 flex items-center gap-2 border-b-[2px] border-white pb-2">
                        <XCircle className="w-6 h-6" /> CONTOH SALAH
                      </p>
                      <div className="font-bold">
                        <p className="line-through text-2xl opacity-80">"Pengadaan Komputer Lab"</p>
                        <p className="mt-4 bg-black p-2 text-sm text-[#ff003c]">❌ MENGGUNAKAN KATA "PENGADAAN" DAN TIDAK MENCERMINKAN OUTPUT KEGIATAN.</p>
                        <p className="mt-2 bg-white text-black p-2 border-2 border-black text-sm">✅ SEHARUSNYA: "Peningkatan Fasilitas Praktikum Komputer Mahasiswa".</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <input 
                type="text" value={judul} onChange={e => setJudul(e.target.value)} required
                className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                placeholder="BACA INFO DAHULU! (CONTOH: PENINGKATAN PERFORMA...)" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xl font-black uppercase mb-2 text-black">Tujuan / Deskripsi</label>
                <textarea 
                  value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required rows={3}
                  className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                  placeholder="TUJUAN PROGRAM" 
                />
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Capaian</label>
                  <input 
                    type="text" value={capaian} onChange={e => setCapaian(e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                    placeholder="CAPAIAN YANG DIHARAPKAN..." 
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Base Line (%)</label>
                  <div className="relative">
                    <input 
                      type="number" min="0" max="100" value={baseLine} onChange={e => setBaseLine(Number(e.target.value))}
                      className="w-full bg-white border-[4px] border-black py-4 px-6 pr-12 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                      placeholder="0" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-xl">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xl font-black uppercase mb-2 text-black">Target (%)</label>
                <div className="relative">
                  <input 
                    type="number" min="0" max="100" value={target} onChange={e => setTarget(Number(e.target.value))}
                    className="w-full bg-white border-[4px] border-black py-4 px-6 pr-12 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                    placeholder="100" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-xl">%</span>
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Mulai Pelaksanaan</label>
                  <input 
                    type="date" value={waktuMulai} onChange={e => handleWaktuChange('start', e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2 text-black">Akhir (Opsional)</label>
                  <input 
                    type="date" value={waktuSelesai} onChange={e => handleWaktuChange('end', e.target.value)}
                    className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xl font-black uppercase mb-2 text-black">Sasaran</label>
                <input 
                  type="text" value={sasaran} onChange={e => setSasaran(e.target.value)}
                  className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                  placeholder="SASARAN PROGRAM..." 
                />
              </div>
              <div>
                <label className="block text-xl font-black uppercase mb-2 text-black">Peserta / Mitra</label>
                <input 
                  type="text" value={pesertaMitra} onChange={e => setPesertaMitra(e.target.value)}
                  className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                  placeholder="PESERTA ATAU MITRA..." 
                />
              </div>
            </div>

            {/* RAB Table Input */}
            <div className="bg-white border-[4px] border-black p-6 shadow-[4px_4px_0_0_#000]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b-[4px] border-black pb-4">
                <h3 className="text-2xl font-black uppercase text-black">RENCANA ANGGARAN (RAB)</h3>
                <button
                  type="button"
                  onClick={addRabItem}
                  className="flex items-center gap-2 border-[3px] border-black px-4 py-2 font-black hover:bg-black hover:text-white transition-colors uppercase bg-[#00ff88]"
                >
                  <Plus className="w-5 h-5" /> TAMBAH BARIS
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b-[4px] border-black text-left bg-black">
                      <th className="p-3 font-black uppercase border-r-[3px] border-white text-[#e5ff00] w-1/3">NAMA ITEM</th>
                      <th className="p-3 font-black uppercase border-r-[3px] border-white text-[#e5ff00] w-24">JML</th>
                      <th className="p-3 font-black uppercase border-r-[3px] border-white text-[#e5ff00] w-32">SATUAN</th>
                      <th className="p-3 font-black uppercase border-r-[3px] border-white text-[#e5ff00] w-48">HARGA SATUAN</th>
                      <th className="p-3 font-black uppercase border-r-[3px] border-white text-[#e5ff00] w-48">TOTAL</th>
                      <th className="p-3 font-black uppercase text-center text-[#e5ff00] w-24">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rab.map((item: any, index: number) => (
                      <tr key={index} className="border-b-[3px] border-black hover:bg-gray-100 transition-colors">
                        <td className="p-2 border-r-[3px] border-black">
                          <input
                            type="text" required value={item.namaItem}
                            onChange={(e) => handleRabChange(index, "namaItem", e.target.value)}
                            placeholder="NAMA BARANG"
                            className="w-full bg-white border-[3px] border-black p-2 font-bold focus:bg-black focus:text-white outline-none"
                          />
                        </td>
                        <td className="p-2 border-r-[3px] border-black">
                          <input
                            type="number" min="1" required value={item.jumlah}
                            onChange={(e) => handleRabChange(index, "jumlah", Number(e.target.value))}
                            className="w-full bg-white border-[3px] border-black p-2 font-bold focus:bg-black focus:text-white outline-none"
                          />
                        </td>
                        <td className="p-2 border-r-[3px] border-black">
                          <input
                            type="text" required value={item.satuan}
                            onChange={(e) => handleRabChange(index, "satuan", e.target.value)}
                            placeholder="PC/PAKET"
                            className="w-full bg-white border-[3px] border-black p-2 font-bold focus:bg-black focus:text-white outline-none"
                          />
                        </td>
                        <td className="p-2 border-r-[3px] border-black relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black">RP</span>
                          <input
                            type="number" min="0" required value={item.hargaSatuan}
                            onChange={(e) => handleRabChange(index, "hargaSatuan", Number(e.target.value))}
                            className="w-full bg-white border-[3px] border-black p-2 pl-12 font-bold focus:bg-black focus:text-white outline-none"
                          />
                        </td>
                        <td className="p-3 border-r-[3px] border-black font-black text-lg whitespace-nowrap">
                          RP {item.total.toLocaleString("id-ID")}
                        </td>
                        <td className="p-2 text-center border-l-[3px] border-black">
                          <button
                            type="button"
                            onClick={() => removeRabItem(index)}
                            disabled={rab.length === 1}
                            className="p-3 border-[3px] border-black bg-black text-[#ff003c] hover:bg-[#ff003c] hover:text-black transition-colors mx-auto block disabled:opacity-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6 flex justify-end items-center gap-6 bg-black p-4">
                  <span className="font-black text-xl uppercase text-[#e5ff00]">TOTAL RAB:</span>
                  <span className="text-3xl font-black text-[#e5ff00]">
                    RP {rab.reduce((acc: number, curr: any) => acc + curr.total, 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="submit" disabled={submitting} className="border-[4px] border-black bg-black text-[#e5ff00] px-12 py-4 font-black text-2xl uppercase hover:bg-[#e5ff00] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shadow-[4px_4px_0_0_#fff]">
              {submitting ? "MENYIMPAN..." : "SIMPAN DRAF"}
            </button>
          </div>
        </form>
      )}

      <div className="border-[4px] border-black bg-white text-black shadow-[8px_8px_0_0_#000]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
            <p className="text-2xl font-black uppercase">MEMUAT DATA...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-[#ff003c] text-white font-black text-2xl uppercase border-b-[4px] border-black">
            GAGAL MEMUAT: {(error as Error).message}
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="p-20 text-center text-4xl font-black uppercase">
            BELUM ADA PROKER.
          </div>
        ) : (
          (() => {
            const renderTable = (tableData: any[]) => (
              <div className="overflow-x-auto border-[4px] border-black bg-white shadow-[8px_8px_0_0_#000]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-[4px] border-black bg-[#e5ff00]">
                      <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black">PROGRAM KERJA</th>
                      <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black">TUJUAN</th>
                      <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black whitespace-nowrap">ANGGARAN</th>
                      <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black whitespace-nowrap">SISA PAGU</th>
                      <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black">STATUS</th>
                      <th className="p-6 text-xl font-black uppercase text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-[4px] divide-black">
                    {tableData.map((item: any) => (
                      <tr key={item._id} className="hover:bg-slate-100 transition-colors group">
                        <td className="p-6 border-r-[4px] border-black max-w-[300px]">
                          <p className="text-2xl font-black uppercase leading-tight mb-2">{item.judul}</p>
                          {session?.user?.role !== "user" && (
                            <p className="text-sm font-bold uppercase bg-black text-[#e5ff00] inline-block px-2 py-1">
                              OLEH: {item.pengusulId?.namaLengkap} ({item.pengusulId?.unitId?.namaUnit || item.pengusulId?.divisi || item.pengusulId?.role || "-"})
                            </p>
                          )}
                          {((session?.user?.role === "user" && item.status !== "Draft") || (["admin", "ketua"].includes(session?.user?.role) && item.status !== "Menunggu Validasi")) && (
                            <button onClick={() => setViewRabModal(item)} className="mt-4 border-[3px] border-black bg-[#00ff88] px-4 py-2 text-sm font-black uppercase hover:bg-black hover:text-[#00ff88] transition-colors shadow-[4px_4px_0_0_#000] flex items-center gap-2">
                              <Eye className="w-4 h-4" /> LIHAT RAB
                            </button>
                          )}
                        </td>
                        <td className="p-6 border-r-[4px] border-black max-w-[300px]">
                          <div className="text-lg font-bold uppercase line-clamp-3 leading-snug">{item.deskripsi}</div>
                          {item.catatan && (
                            <div className="mt-4 bg-[#ff003c] text-white p-3 border-[3px] border-black shadow-[4px_4px_0_0_#000]">
                              <span className="font-black flex items-center gap-2 mb-1 text-sm"><AlertCircle className="w-4 h-4" /> CATATAN ADMIN:</span>
                              <span className="font-bold text-sm uppercase">{item.catatan}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-6 border-r-[4px] border-black text-2xl font-black uppercase bg-[#e5ff00] whitespace-nowrap">
                          RP {item.estimasiAnggaran.toLocaleString('id-ID')}
                        </td>
                        <td className="p-6 border-r-[4px] border-black text-3xl font-black uppercase bg-[#00ff88] whitespace-nowrap">
                          RP {item.sisaAnggaran.toLocaleString('id-ID')}
                        </td>
                        <td className="p-6 border-r-[4px] border-black">
                          <span className="inline-block border-[4px] border-black px-4 py-2 text-lg font-black uppercase bg-white shadow-[4px_4px_0_0_#000]">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-6 text-right h-full align-middle">
                          <div className="flex flex-col items-end justify-center gap-3 min-h-[120px]">
                            {session?.user?.role === "user" && (
                              <>
                                <button onClick={() => openEditModal(item)} className="border-[4px] border-black bg-white text-black px-6 py-2 text-lg font-black uppercase hover:bg-black hover:text-[#e5ff00] transition-colors shadow-[4px_4px_0_0_#000] group">
                                  <Pencil className="w-6 h-6 mx-auto group-hover:text-[#e5ff00] transition-colors" />
                                </button>
                                <button onClick={() => hapusDraft(item._id)} className="border-[4px] border-black bg-black text-[#ff003c] px-6 py-2 hover:bg-[#ff003c] hover:text-black transition-colors shadow-[4px_4px_0_0_#000]" title="HAPUS">
                                  <Trash2 className="w-6 h-6 mx-auto" />
                                </button>
                              </>
                            )}
                            
                            {["admin", "ketua"].includes(session?.user?.role) && item.status === "Menunggu Validasi" && (
                              <button onClick={() => openValidasiModal(item)} className="border-[4px] border-black bg-black text-[#e5ff00] px-6 py-4 text-xl font-black uppercase hover:bg-[#ff003c] hover:text-white transition-colors shadow-[6px_6px_0_0_#000]">
                                VALIDASI
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            
            if (isKetua && groupedData) {
              return (
                <div className="flex flex-col">
                  {Object.entries(groupedData).map(([key, group]: [string, any]) => {
                    const isExpanded = expandedGroup === key;
                    return (
                      <div key={key} className="border-b-[4px] border-black last:border-b-0">
                        <div 
                          onClick={() => setExpandedGroup(isExpanded ? null : key)}
                          className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] mb-4 cursor-pointer hover:bg-[#e5ff00] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#000] transition-all gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-black">{isExpanded ? "[-]" : "[+]"}</span>
                            <div>
                              <p className="text-3xl font-black uppercase">{group.namaLengkap}</p>
                              <p className="text-xl font-bold uppercase">{group.divisi}</p>
                            </div>
                          </div>
                          <div className="flex flex-col md:text-right gap-1 md:gap-0">
                            <p className="text-xl font-bold uppercase">{group.totalProker} PROGRAM KERJA</p>
                            <p className="text-3xl font-black uppercase text-[#ff003c]">RP {group.totalAnggaran.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="mb-8">
                            {renderTable(group.items)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
            return renderTable(data);
          })()
        )}
      </div>

      {/* MODAL VALIDASI PROKER */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-[6px] border-black shadow-[12px_12px_0_0_#e5ff00] w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between p-6 border-b-[4px] border-black bg-[#e5ff00]">
              <h3 className="text-3xl font-black text-black flex items-center gap-3 uppercase">
                <FolderKanban className="w-8 h-8" />
                VALIDASI PROKER
              </h3>
              <button onClick={closeValidasiModal} className="border-[3px] border-black bg-white p-2 hover:bg-[#ff003c] hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 bg-white">
              <div className="border-[4px] border-black p-6 shadow-[6px_6px_0_0_#000] bg-[#f0f0f0]">
                <p className="text-sm font-black text-black uppercase tracking-widest mb-2 bg-white inline-block px-2 border-2 border-black">AJUAN PROKER</p>
                <p className="text-3xl font-black text-black uppercase mb-4 leading-none">{activeModal.judul}</p>
                <p className="text-lg font-bold text-black border-l-[4px] border-black pl-4 py-2 bg-white">{activeModal.deskripsi}</p>
                <div className="mt-6 pt-4 border-t-[4px] border-black text-xl">
                  <span className="font-bold">ESTIMASI AWAL:</span> <span className="font-black text-2xl bg-black text-[#e5ff00] px-3 py-1 ml-2 shadow-[4px_4px_0_0_#ff003c]">RP {activeModal.estimasiAnggaran.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold border-t-[4px] border-black pt-4">
                  <div className="border-[2px] border-black p-3 bg-white">
                    <span className="text-gray-500 uppercase tracking-widest block text-xs">Capaian</span>
                    <span>{activeModal.capaian || "-"}</span>
                  </div>
                  <div className="border-[2px] border-black p-3 bg-white">
                    <span className="text-gray-500 uppercase tracking-widest block text-xs">Target & Baseline</span>
                    <span>{activeModal.baseLine || 0}% &rarr; {activeModal.target || 0}%</span>
                  </div>
                  <div className="border-[2px] border-black p-3 bg-white">
                    <span className="text-gray-500 uppercase tracking-widest block text-xs">Waktu Pelaksanaan</span>
                    <span>{activeModal.waktuPelaksanaan ? String(activeModal.waktuPelaksanaan).split(',').join(' s/d ') : "-"}</span>
                  </div>
                  <div className="border-[2px] border-black p-3 bg-white">
                    <span className="text-gray-500 uppercase tracking-widest block text-xs">Sasaran</span>
                    <span>{activeModal.sasaran || "-"}</span>
                  </div>
                  <div className="border-[2px] border-black p-3 bg-white md:col-span-2">
                    <span className="text-gray-500 uppercase tracking-widest block text-xs">Peserta / Mitra</span>
                    <span>{activeModal.pesertaMitra || "-"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xl font-black uppercase mb-2 mt-6">RAB (BISA DIUBAH ADMIN)</label>
                <div className="overflow-x-auto border-[4px] border-black bg-white shadow-[6px_6px_0_0_#000]">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b-[4px] border-black text-left bg-black text-[#e5ff00]">
                        <th className="p-2 font-black uppercase border-r-[3px] border-white w-1/3">NAMA ITEM</th>
                        <th className="p-2 font-black uppercase border-r-[3px] border-white w-16">JML</th>
                        <th className="p-2 font-black uppercase border-r-[3px] border-white w-20">SATUAN</th>
                        <th className="p-2 font-black uppercase border-r-[3px] border-white">HARGA</th>
                        <th className="p-2 font-black uppercase">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valRab.map((item: any, index: number) => (
                        <tr key={index} className="border-b-[3px] border-black">
                          <td className="p-1 border-r-[3px] border-black">
                            <input type="text" value={item.namaItem} onChange={e => handleValRabChange(index, "namaItem", e.target.value)} className="w-full border-[2px] border-black p-1 font-bold text-sm outline-none" />
                          </td>
                          <td className="p-1 border-r-[3px] border-black">
                            <input type="number" value={item.jumlah} onChange={e => handleValRabChange(index, "jumlah", Number(e.target.value))} className="w-full border-[2px] border-black p-1 font-bold text-sm outline-none" />
                          </td>
                          <td className="p-1 border-r-[3px] border-black">
                            <input type="text" value={item.satuan} onChange={e => handleValRabChange(index, "satuan", e.target.value)} className="w-full border-[2px] border-black p-1 font-bold text-sm outline-none" />
                          </td>
                          <td className="p-1 border-r-[3px] border-black">
                            <input type="number" value={item.hargaSatuan} onChange={e => handleValRabChange(index, "hargaSatuan", Number(e.target.value))} className="w-full border-[2px] border-black p-1 font-bold text-sm outline-none" />
                          </td>
                          <td className="p-2 font-black text-sm whitespace-nowrap">
                            RP {item.total.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <label className="block text-xl font-black uppercase mb-2 mt-6">UBAH NOMINAL TOTAL (JIKA PERLU)</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-black font-black text-2xl">RP</span>
                  <input 
                    type="number" 
                    value={valAnggaran} 
                    onChange={e => setValAnggaran(Number(e.target.value))}
                    className="w-full bg-[#e5ff00] border-[4px] border-black py-4 pl-16 pr-6 text-2xl font-black text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xl font-black uppercase mb-2 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" /> KOMENTAR ADMIN
                </label>
                <textarea 
                  value={valCatatan}
                  onChange={e => setValCatatan(e.target.value)}
                  placeholder="WAJIB DIISI JIKA DITOLAK/DIKEMBALIKAN"
                  rows={4}
                  className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                ></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t-[4px] border-black bg-black flex flex-wrap justify-end gap-4">
              <button 
                onClick={closeValidasiModal}
                className="px-8 py-4 bg-white border-[4px] border-black font-black text-xl uppercase hover:bg-gray-200 transition-colors"
              >
                BATAL
              </button>
              
              <button 
                onClick={() => submitValidasi("Draft")}
                className="px-8 py-4 bg-[#e5ff00] border-[4px] border-black font-black text-xl uppercase hover:bg-white transition-colors flex items-center gap-3"
              >
                <AlertCircle className="w-6 h-6" /> PENDING
              </button>

              <button 
                onClick={() => submitValidasi("Ditolak")}
                className="px-8 py-4 bg-[#ff003c] text-white border-[4px] border-white font-black text-xl uppercase hover:bg-white hover:text-black hover:border-black transition-colors flex items-center gap-3"
              >
                <XCircle className="w-6 h-6" /> TOLAK
              </button>

              <button 
                onClick={() => submitValidasi("Divalidasi Keuangan")}
                className="px-8 py-4 bg-[#00ff88] border-[4px] border-black font-black text-xl uppercase hover:bg-white transition-colors flex items-center gap-3 shadow-[6px_6px_0_0_#fff]"
              >
                <CheckCircle className="w-6 h-6" /> ACC PROKER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW RAB */}
      {viewRabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-[6px] border-black shadow-[16px_16px_0_0_#00ff88] w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b-[4px] border-black bg-black text-white">
              <h3 className="text-3xl font-black flex items-center gap-3 uppercase">
                <Eye className="w-8 h-8 text-[#00ff88]" />
                RINCIAN RAB PROKER
              </h3>
              <button onClick={() => setViewRabModal(null)} className="border-[3px] border-white p-2 hover:bg-[#ff003c] transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="mb-8 p-6 bg-[#e5ff00] border-[4px] border-black shadow-[6px_6px_0_0_#000]">
                <p className="text-sm font-black text-black uppercase tracking-widest bg-white border-[2px] border-black inline-block px-2 mb-2">JUDUL PROKER</p>
                <p className="text-4xl font-black text-black leading-none uppercase">{viewRabModal.judul}</p>
              </div>

              <div className="overflow-x-auto border-[4px] border-black bg-white shadow-[6px_6px_0_0_#000]">
                <table className="w-full text-left whitespace-nowrap border-collapse">
                  <thead className="bg-black border-b-[4px] border-black">
                    <tr>
                      <th className="p-4 font-black uppercase border-r-[3px] border-white text-[#e5ff00]">ITEM</th>
                      <th className="p-4 font-black uppercase border-r-[3px] border-white text-[#e5ff00] text-center">VOL</th>
                      <th className="p-4 font-black uppercase border-r-[3px] border-white text-[#e5ff00] text-center">SAT</th>
                      <th className="p-4 font-black uppercase border-r-[3px] border-white text-[#e5ff00] text-right">HARGA/SAT</th>
                      <th className="p-4 font-black uppercase text-[#e5ff00] text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-[3px] divide-black">
                    {viewRabModal.rab?.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#f0f0f0] transition-colors">
                        <td className="p-4 font-bold uppercase border-r-[3px] border-black">{r.namaItem}</td>
                        <td className="p-4 font-black border-r-[3px] border-black text-center">{r.jumlah}</td>
                        <td className="p-4 font-bold border-r-[3px] border-black text-center uppercase">{r.satuan}</td>
                        <td className="p-4 font-bold border-r-[3px] border-black text-right">RP {r.hargaSatuan?.toLocaleString('id-ID')}</td>
                        <td className="p-4 font-black text-right text-xl bg-[#e5ff00]">RP {r.total?.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-[4px] border-black">
                    <tr>
                      <td colSpan={4} className="p-6 text-right font-black uppercase text-xl">TOTAL KESELURUHAN:</td>
                      <td className="p-6 text-right font-black text-3xl text-[#00ff88] bg-black whitespace-nowrap">
                        RP {viewRabModal.estimasiAnggaran?.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t-[4px] border-black bg-[#f0f0f0] flex justify-end">
              <button 
                onClick={() => setViewRabModal(null)}
                className="px-10 py-4 bg-black text-[#e5ff00] border-[4px] border-black font-black text-2xl uppercase hover:bg-[#e5ff00] hover:text-black hover:shadow-[6px_6px_0_0_#000] transition-all"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
