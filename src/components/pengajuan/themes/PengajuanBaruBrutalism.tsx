import { CheckCircle, Eye, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PengajuanBaruBrutalism(props: any) {
  const {
    judul, setJudul,
    deskripsi, setDeskripsi,
    prokerId, setProkerId,
    prokers,
    rab, handleRabChange, addRabItem, removeRabItem, totalNominal,
    handleSubmit, isSubmitting, error, success
  } = props;

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectedProker = prokers?.find((p: any) => p._id === prokerId);

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] border-[4px] border-black bg-[#e5ff00] p-12">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">BERHASIL!</h2>
        <p className="text-xl font-bold uppercase">PENGAJUAN TELAH DIKIRIM.</p>
        <p className="text-sm font-bold uppercase mt-2">MENGALIHKAN...</p>
      </div>
    );
  }

  return (
    <div className="p-8 pb-20 max-w-5xl mx-auto">
      <div className="mb-12">
        <Link href="/pengajuan" className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-white transition-colors mb-6 bg-white text-black">
          ← KEMBALI KE PENGAJUAN
        </Link>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Buat Pengajuan</h1>
        <p className="text-xl font-bold uppercase tracking-widest mt-4">Isi Detail RAB Secara Teliti</p>
      </div>

      {error && (
        <div className="p-6 mb-8 bg-red-500 border-[4px] border-black text-[#ffffff] text-2xl font-black uppercase">
          ERROR: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Detail Utama */}
        <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-3xl font-black uppercase mb-8 border-b-[4px] border-black pb-4">Info Umum</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xl font-black uppercase mb-2">Judul Pengajuan</label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => {
                  const val = e.target.value;
                  const capitalized = val.replace(/\b\w/g, (char) => char.toUpperCase());
                  setJudul(capitalized);
                }}
                placeholder="CONTOH: PEMBELIAN PRINTER"
                className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xl font-black uppercase mb-2">Deskripsi / Latar Belakang</label>
              <textarea
                required
                rows={4}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="JELASKAN TUJUAN PENGAJUAN..."
                className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-[#e5ff00] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xl font-black uppercase mb-2">PILIH PENGAJUAN/PERMINTAAN</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none flex justify-between items-center transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="truncate pr-4 uppercase">
                    {prokerId === "" || !prokerId ? "-- PENGAJUAN / PERMINTAAN BIASA --" : `${selectedProker?.judul} - SISA: RP ${selectedProker?.sisaAnggaran.toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-2xl font-black">↓</span>
                </button>

                {isSelectOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-[4px] border-black z-50 max-h-64 overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                    <button
                      type="button"
                      className="text-left px-6 py-4 hover:bg-[#e5ff00] hover:text-black font-bold text-xl border-b-[4px] border-black transition-colors uppercase"
                      onClick={() => { setProkerId(""); setIsSelectOpen(false); }}
                    >
                      -- PENGAJUAN / PERMINTAAN BIASA --
                    </button>
                    {prokers?.map((p: any, idx: number) => (
                      <button
                        key={p._id}
                        type="button"
                        className={`text-left px-6 py-4 hover:bg-[#e5ff00] hover:text-black font-bold text-xl transition-colors uppercase ${idx !== prokers.length - 1 ? 'border-b-[4px] border-black' : ''}`}
                        onClick={() => { setProkerId(p._id); setIsSelectOpen(false); }}
                      >
                        {p.judul} - SISA: RP {p.sisaAnggaran.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RAB */}
        <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-[4px] border-black pb-4">
            <h3 className="text-3xl font-black uppercase">RAB (Rincian Biaya)</h3>
            <button
              type="button"
              onClick={addRabItem}
              className="border-[4px] border-black px-6 py-2 bg-black text-[#ffffff] font-black uppercase hover:bg-[#e5ff00] hover:text-black transition-colors"
            >
              + TAMBAH BARIS
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b-[4px] border-black">
                  <th className="pb-4 text-left text-xl font-black uppercase">NAMA ITEM</th>
                  <th className="pb-4 text-left text-xl font-black uppercase">JML</th>
                  <th className="pb-4 text-left text-xl font-black uppercase">SATUAN</th>
                  <th className="pb-4 text-left text-xl font-black uppercase">HARGA SATUAN</th>
                  <th className="pb-4 text-left text-xl font-black uppercase">TOTAL</th>
                  <th className="pb-4 text-center text-xl font-black uppercase">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y-[4px] divide-black">
                {rab.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="py-4 pr-4">
                      <input
                        type="text"
                        required
                        value={item.namaItem}
                        onChange={(e) => handleRabChange(index, "namaItem", e.target.value)}
                        placeholder="NAMA ITEM"
                        className="w-full bg-white border-[4px] border-black py-2 px-4 text-lg font-bold text-black focus:outline-none focus:bg-[#e5ff00]"
                      />
                    </td>
                    <td className="py-4 pr-4 w-24">
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.jumlah}
                        onChange={(e) => handleRabChange(index, "jumlah", Number(e.target.value))}
                        className="w-full bg-white border-[4px] border-black py-2 px-4 text-lg font-bold text-black focus:outline-none focus:bg-[#e5ff00]"
                      />
                    </td>
                    <td className="py-4 pr-4 w-32">
                      <input
                        type="text"
                        required
                        value={item.satuan}
                        onChange={(e) => handleRabChange(index, "satuan", e.target.value)}
                        className="w-full bg-white border-[4px] border-black py-2 px-4 text-lg font-bold text-black focus:outline-none focus:bg-[#e5ff00]"
                      />
                    </td>
                    <td className="py-4 pr-4 w-48">
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-black font-black">RP</span>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.hargaSatuan === 0 ? '' : item.hargaSatuan}
                          onChange={(e) => handleRabChange(index, "hargaSatuan", Number(e.target.value))}
                          className="w-full bg-white border-[4px] border-black py-2 pl-12 pr-4 text-lg font-bold text-black focus:outline-none focus:bg-[#e5ff00]"
                        />
                      </div>
                    </td>
                    <td className="py-4 pr-4 w-48">
                      <div className="text-xl font-black">
                        RP {item.total.toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.file && (
                          <button
                            type="button"
                            onClick={() => window.open(URL.createObjectURL(item.file!), '_blank')}
                            className="p-2 border-[4px] border-black bg-white hover:bg-black hover:text-[#ffffff] transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-5 h-5" />
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
                          className={`p-2 border-[4px] border-black cursor-pointer transition-colors ${item.file ? 'bg-[#e5ff00] hover:bg-black hover:text-[#ffffff]' : 'bg-white hover:bg-black hover:text-[#ffffff]'}`}
                          title="Upload"
                        >
                          <Upload className="w-5 h-5" />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeRabItem(index)}
                          disabled={rab.length === 1}
                          className="p-2 border-[4px] border-black bg-[#ff003c] text-[#ffffff] hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-8 border-t-[4px] border-black flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-2xl font-black uppercase">GRAND TOTAL</span>
            <span className="text-4xl md:text-5xl font-black bg-[#e5ff00] px-6 py-2 border-[4px] border-black">
              RP {totalNominal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={isSubmitting || totalNominal === 0}
            className="w-full md:w-auto px-12 py-6 border-[4px] border-black bg-[#ff003c] text-[#ffffff] hover:bg-black transition-colors font-black text-3xl uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]"
          >
            {isSubmitting ? "MEMPROSES..." : "KIRIM PENGAJUAN"}
          </button>
        </div>
      </form>
    </div>
  );
}
