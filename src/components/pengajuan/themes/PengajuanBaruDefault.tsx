import { ArrowLeft, CheckCircle, Eye, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";

export default function PengajuanBaruDefault(props: any) {
  const {
    judul, setJudul,
    deskripsi, setDeskripsi,
    prokerId, setProkerId,
    prokers,
    rab, handleRabChange, addRabItem, removeRabItem, totalNominal,
    handleSubmit, isSubmitting, error, success
  } = props;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pengajuan Berhasil Dikirim!</h2>
        <p className="text-slate-500 dark:text-gray-400">Anda akan dialihkan kembali ke daftar pengajuan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/pengajuan" className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Buat Pengajuan Baru</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">Isi detail kebutuhan dana dan Rencana Anggaran Biaya (RAB).</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Informasi Umum</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-1.5">Judul Pengajuan</label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => {
                  const val = e.target.value;
                  const capitalized = val.replace(/\b\w/g, (char) => char.toUpperCase());
                  setJudul(capitalized);
                }}
                placeholder="Misal: Pembelian Printer Divisi Humas"
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-1.5">Deskripsi / Latar Belakang</label>
              <textarea
                required
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan secara singkat tujuan pengajuan dana ini..."
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-1.5">Program Kerja (Opsional)</label>
              <select
                value={prokerId}
                onChange={(e) => setProkerId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Tidak ada proker (Jalur Mandiri)</option>
                {prokers?.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.judul} - Sisa Pagu: Rp {p.sisaAnggaran.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
              {prokerId && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  Pengajuan ini akan memotong Sisa Pagu dari program kerja yang dipilih.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Rencana Anggaran Biaya (RAB)</h3>
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
                  <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 w-1/3">Nama Item</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 w-24">Jumlah</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 w-24">Satuan</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 w-40">Harga Satuan</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 w-40">Total</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 dark:text-gray-400 w-24 text-center">Aksi</th>
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
                        placeholder="Contoh: Tinta Printer"
                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.jumlah}
                        onChange={(e) => handleRabChange(index, "jumlah", Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="text"
                        required
                        value={item.satuan}
                        onChange={(e) => handleRabChange(index, "satuan", e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1.5 text-slate-500 text-sm">Rp</span>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.hargaSatuan === 0 ? '' : item.hargaSatuan}
                          onChange={(e) => handleRabChange(index, "hargaSatuan", Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-8 pr-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-slate-900 dark:text-white text-sm font-medium">
                      Rp {item.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {item.file && (
                          <button
                            type="button"
                            onClick={() => window.open(URL.createObjectURL(item.file!), '_blank')}
                            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Preview Lampiran"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <input
                          type="file"
                          id={`file-upload-${index}`}
                          className="hidden"
                          onChange={(e) => handleRabChange(index, "file", e.target.files?.[0] || null)}
                          accept="image/*,.pdf"
                        />
                        <label
                          htmlFor={`file-upload-${index}`}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${item.file ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:text-gray-500 dark:hover:text-blue-400 dark:hover:bg-blue-500/10'}`}
                          title={item.file ? "Ganti File" : "Unggah Lampiran"}
                        >
                          <Upload className="w-4 h-4" />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeRabItem(index)}
                          disabled={rab.length === 1}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
            <span className="text-slate-500 dark:text-gray-400 font-medium">Total Pengajuan</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
              Rp {totalNominal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting || totalNominal === 0}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Kirim Pengajuan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
