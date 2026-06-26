import React, { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Loader2, Info, CheckCircle, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProkerMinimalist(props: any) {
  const {
    data, isLoading, error,
    isCreating, setIsCreating,
    judul, setJudul, deskripsi, setDeskripsi,
    capaian, setCapaian, baseLine, setBaseLine, target, setTarget,
    waktuPelaksanaan, setWaktuPelaksanaan, sasaran, setSasaran, pesertaMitra, setPesertaMitra,
    rab, setRab, handleRabChange, addRabItem, removeRabItem,
    submitting, handleCreate, ajukanKeKeuangan, kirimSemuaAjuan, hapusDraft, handleValidasi, openEditModal
  } = props;

  const { data: session } = useSession();
  const isKetua = session?.user?.role === "ketua";
  const isAdmin = session?.user?.role === "admin";
  const isUser = session?.user?.role === "user";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [showInfo, setShowInfo] = useState(false);

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
    setWaktuPelaksanaan(end ? `${start},${end}` : start);
  };

  const groupedData = data?.reduce((acc: any, proker: any) => {
    const pengusulName = proker.pengusulId?.namaLengkap 
      ? `${proker.pengusulId?.namaLengkap} (${proker.pengusulId?.unitId?.namaUnit || proker.pengusulId?.divisi || proker.pengusulId?.role || "-"})` 
      : 'Tanpa Nama Pengusul';
    if (!acc[pengusulName]) {
      acc[pengusulName] = [];
    }
    acc[pengusulName].push(proker);
    return acc;
  }, {}) || {};

  const toggleExpanded = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [valAnggaran, setValAnggaran] = useState<number>(0);
  const [valCatatan, setValCatatan] = useState("");
  const [valRab, setValRab] = useState<any[]>([]);

  const openValidationForm = (proker: any) => {
    setValidatingId(proker._id);
    setValAnggaran(proker.estimasiAnggaran);
    setValCatatan(proker.catatan || "");
    setValRab(JSON.parse(JSON.stringify(proker.rab || [])));
  };

  const closeValidationForm = () => {
    setValidatingId(null);
    setValCatatan("");
    setValRab([]);
  };

  const handleValRabChange = (index: number, field: string, value: any) => {
    const newRab = [...valRab];
    newRab[index][field] = value;
    if (field === "jumlah" || field === "hargaSatuan") {
      newRab[index].total = Number(newRab[index].jumlah) * Number(newRab[index].hargaSatuan);
    }
    setValRab(newRab);
    setValAnggaran(newRab.reduce((acc, curr) => acc + curr.total, 0));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ditolak': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Divalidasi Keuangan': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Selesai': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{(isKetua || isAdmin) ? "Daftar Program Kerja" : "Program Kerja"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar usulan program kerja per divisi.</p>
        </div>
        {isUser && (
          <div className="flex gap-2">
            <button onClick={kirimSemuaAjuan} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">Kirim Draf</button>
            <button onClick={() => setIsCreating(!isCreating)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> Buat Proker
            </button>
          </div>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Buat Draf Proker Baru</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Program Kerja</label>
              <input 
                type="text" value={judul} onChange={e => setJudul(e.target.value)} required
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                <input 
                  type="text" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capaian</label>
                <input 
                  type="text" value={capaian} onChange={e => setCapaian(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Line (%)</label>
                <input 
                  type="number" min="0" max="100" value={baseLine} onChange={e => setBaseLine(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target (%)</label>
                <input 
                  type="number" min="0" max="100" value={target} onChange={e => setTarget(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mulai</label>
                  <input type="date" value={waktuMulai} onChange={e => handleWaktuChange("start", e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selesai</label>
                  <input type="date" value={waktuSelesai} onChange={e => handleWaktuChange("end", e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sasaran</label>
                <input 
                  type="text" value={sasaran} onChange={e => setSasaran(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peserta / Mitra</label>
                <input 
                  type="text" value={pesertaMitra} onChange={e => setPesertaMitra(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Rencana Anggaran Biaya (RAB)</h3>
                <button type="button" onClick={addRabItem} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Tambah Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                      <th className="pb-2 w-1/3">Nama Item</th>
                      <th className="pb-2 w-20">Jml</th>
                      <th className="pb-2 w-24">Satuan</th>
                      <th className="pb-2 w-32">Harga</th>
                      <th className="pb-2 text-right">Total</th>
                      <th className="pb-2 w-10 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {rab.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="py-2 pr-2"><input required type="text" value={item.namaItem} onChange={e => handleRabChange(i, "namaItem", e.target.value)} className="w-full border dark:border-gray-700 rounded bg-white dark:bg-gray-800 p-1.5 text-sm"/></td>
                        <td className="py-2 pr-2"><input required type="number" min="1" value={item.jumlah} onChange={e => handleRabChange(i, "jumlah", Number(e.target.value))} className="w-full border dark:border-gray-700 rounded bg-white dark:bg-gray-800 p-1.5 text-sm"/></td>
                        <td className="py-2 pr-2"><input required type="text" value={item.satuan} onChange={e => handleRabChange(i, "satuan", e.target.value)} className="w-full border dark:border-gray-700 rounded bg-white dark:bg-gray-800 p-1.5 text-sm"/></td>
                        <td className="py-2 pr-2"><input required type="number" min="0" value={item.hargaSatuan || ''} onChange={e => handleRabChange(i, "hargaSatuan", Number(e.target.value))} className="w-full border dark:border-gray-700 rounded bg-white dark:bg-gray-800 p-1.5 text-sm"/></td>
                        <td className="py-2 text-right font-medium text-sm">Rp {item.total?.toLocaleString('id-ID')}</td>
                        <td className="py-2 text-center">
                          <button type="button" onClick={() => removeRabItem(i)} disabled={rab.length === 1} className="text-red-500 disabled:opacity-30">X</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-right">
                <span className="text-gray-500 text-sm">Total Estimasi: </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Rp {rab.reduce((acc: number, curr: any) => acc + curr.total, 0).toLocaleString("id-ID")}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-gray-900 text-sm font-medium">Batal</button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50">Simpan Draf</button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="p-12 text-center flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">Gagal memuat data.</div>
        ) : (!data || data.length === 0) ? (
          <div className="p-12 text-center text-gray-500">Belum ada program kerja yang dibuat.</div>
        ) : (
          Object.entries(groupedData).map(([pengusulName, prokers]: [string, any]) => (
            <div key={pengusulName} className="space-y-3">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{pengusulName}</h2>
              <div className="flex flex-col gap-3">
                {prokers.map((proker: any) => (
                  <div key={proker._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="w-full md:w-1/3 space-y-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(proker.status)}`}>{proker.status}</span>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{proker.judul}</h3>
                        <p className="text-xs text-gray-500">{proker.deskripsi}</p>
                      </div>
                      
                      <div className="w-full md:w-1/3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Total: Rp {proker.estimasiAnggaran?.toLocaleString('id-ID')}</span>
                          <span className="text-emerald-600 font-medium">Sisa: Rp {proker.sisaAnggaran?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (((proker.estimasiAnggaran || 0) - (proker.sisaAnggaran || 0)) / (proker.estimasiAnggaran || 1)) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-wrap items-center justify-end gap-2">
                        {isUser && proker.status === 'Draft' && (
                          <>
                            <button onClick={() => openEditModal(proker)} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded">Edit</button>
                            <button onClick={() => hapusDraft(proker._id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded">Hapus</button>
                          </>
                        )}
                        {(isAdmin || isKetua) && proker.status === 'Menunggu Validasi' && (
                          <button onClick={() => openValidationForm(proker)} className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded">Validasi</button>
                        )}
                        <button onClick={() => toggleExpanded(proker._id)} className="text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded flex items-center gap-1">
                          {expandedId === proker._id ? "Tutup" : "Lihat"}
                          {expandedId === proker._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {validatingId === proker._id && (
                      <div className="mt-4 p-4 border border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/30 rounded-lg animate-in fade-in">
                        <h4 className="font-medium text-sm mb-3">Validasi Program Kerja</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Estimasi Disetujui (Rp)</label>
                            <input type="number" value={valAnggaran} onChange={e => setValAnggaran(Number(e.target.value))} className="w-full p-2 text-sm border border-gray-300 rounded bg-white dark:bg-gray-900 mt-1"/>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Catatan Revisi</label>
                            <textarea value={valCatatan} onChange={e => setValCatatan(e.target.value)} rows={2} className="w-full p-2 text-sm border border-gray-300 rounded bg-white dark:bg-gray-900 mt-1"/>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm mb-2">
                              <thead>
                                <tr className="border-b text-xs text-gray-500">
                                  <th className="pb-1 w-1/3">Item RAB</th>
                                  <th className="pb-1">Jml</th>
                                  <th className="pb-1">Harga</th>
                                  <th className="pb-1 text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {valRab.map((r, i) => (
                                  <tr key={i} className="border-b border-gray-100">
                                    <td className="py-1">{r.namaItem}</td>
                                    <td className="py-1"><input type="number" className="w-16 border rounded p-1 text-xs bg-white" value={r.jumlah} onChange={e => handleValRabChange(i, "jumlah", Number(e.target.value))}/></td>
                                    <td className="py-1"><input type="number" className="w-24 border rounded p-1 text-xs bg-white" value={r.hargaSatuan} onChange={e => handleValRabChange(i, "hargaSatuan", Number(e.target.value))}/></td>
                                    <td className="py-1 text-right">Rp {r.total.toLocaleString("id-ID")}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={closeValidationForm} className="text-xs px-3 py-1.5 text-gray-500 bg-gray-100 rounded">Batal</button>
                            <button onClick={() => handleValidasi(proker._id, "Ditolak", valAnggaran, valCatatan, valRab)} className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded">Tolak</button>
                            <button onClick={() => handleValidasi(proker._id, isAdmin ? "Divalidasi Keuangan" : "Selesai", valAnggaran, valCatatan, valRab)} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded">{isAdmin ? "Validasi Keuangan" : "Setujui Ketua"}</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {expandedId === proker._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm animate-in fade-in">
                        {proker.catatan && (
                          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-900/50">
                            <strong>Catatan:</strong> {proker.catatan}
                          </div>
                        )}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 text-xs uppercase">
                                <th className="pb-2 font-medium">Item</th>
                                <th className="pb-2 font-medium">Vol</th>
                                <th className="pb-2 font-medium">Harga</th>
                                <th className="pb-2 font-medium text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {proker.rab?.map((r: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                                  <td className="py-2.5">{r.namaItem}</td>
                                  <td className="py-2.5 text-gray-500">{r.jumlah} {r.satuan}</td>
                                  <td className="py-2.5 text-gray-500">Rp {r.hargaSatuan?.toLocaleString('id-ID')}</td>
                                  <td className="py-2.5 text-right font-medium">Rp {r.total?.toLocaleString('id-ID')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
