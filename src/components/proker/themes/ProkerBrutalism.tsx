import { FolderKanban, Loader2, Plus, Send, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ProkerBrutalism(props: any) {
  const {
    data, isLoading, error, session,
    isCreating, setIsCreating,
    judul, setJudul, deskripsi, setDeskripsi, estimasiAnggaran, setEstimasiAnggaran,
    submitting, handleCreate, ajukanKeKeuangan, hapusDraft, validasiPagu
  } = props;

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
        
        {session?.user?.role === "Tendik" && (
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="border-[4px] border-black px-8 py-4 bg-[#ff003c] text-white font-black text-2xl uppercase hover:bg-black transition-colors text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]"
          >
            + {isCreating ? "BATAL BUAT" : "BUAT DRAF BARU"}
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#e5ff00] border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
          <h2 className="text-4xl font-black uppercase mb-8 border-b-[4px] border-black pb-4 text-black">DRAF BARU</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xl font-black uppercase mb-2 text-black">Nama Program Kerja</label>
              <input 
                type="text" value={judul} onChange={e => setJudul(e.target.value)} required
                className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                placeholder="NAMA PROGRAM" 
              />
            </div>
            <div>
              <label className="block text-xl font-black uppercase mb-2 text-black">Tujuan / Deskripsi</label>
              <textarea 
                value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required rows={3}
                className="w-full bg-white border-[4px] border-black py-4 px-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                placeholder="TUJUAN PROGRAM" 
              />
            </div>
            <div>
              <label className="block text-xl font-black uppercase mb-2 text-black">Estimasi Biaya Total (Rp)</label>
              <div className="relative">
                <span className="absolute left-6 top-4 text-black font-black text-xl">RP</span>
                <input 
                  type="number" value={estimasiAnggaran} onChange={e => setEstimasiAnggaran(e.target.value)} required min="0"
                  className="w-full bg-white border-[4px] border-black py-4 pl-16 pr-6 text-xl font-bold text-black focus:outline-none focus:bg-black focus:text-white transition-colors"
                  placeholder="0" 
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="submit" disabled={submitting} className="border-[4px] border-black bg-black text-white px-12 py-4 font-black text-2xl uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto">
              {submitting ? "MENYIMPAN..." : "SIMPAN DRAF"}
            </button>
          </div>
        </form>
      )}

      <div className="border-[4px] border-black bg-white text-black">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
            <p className="text-2xl font-black uppercase">MEMUAT DATA...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-500 text-white font-black text-2xl uppercase border-b-[4px] border-black">
            GAGAL MEMUAT: {(error as Error).message}
          </div>
        ) : data?.length === 0 ? (
          <div className="p-20 text-center text-4xl font-black uppercase">
            BELUM ADA PROKER.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[4px] border-black bg-[#ff003c] text-white">
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black">PROGRAM KERJA</th>
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black whitespace-nowrap">ESTIMASI</th>
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black whitespace-nowrap">SISA PAGU</th>
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black">STATUS</th>
                  <th className="p-6 text-xl font-black uppercase text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y-[4px] divide-black">
                {data.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-100 transition-colors group">
                    <td className="p-6 border-r-[4px] border-black">
                      <p className="text-2xl font-black uppercase leading-tight">{item.judul}</p>
                      {session?.user?.role !== "Tendik" && <p className="text-lg font-bold uppercase mt-2">OLEH: {item.pengusulId?.namaLengkap}</p>}
                    </td>
                    <td className="p-6 border-r-[4px] border-black text-2xl font-bold uppercase whitespace-nowrap">
                      RP {item.estimasiAnggaran.toLocaleString('id-ID')}
                    </td>
                    <td className="p-6 border-r-[4px] border-black text-2xl font-black uppercase bg-[#e5ff00] whitespace-nowrap">
                      RP {item.sisaAnggaran.toLocaleString('id-ID')}
                    </td>
                    <td className="p-6 border-r-[4px] border-black">
                      <span className="inline-block border-[4px] border-black px-3 py-1 text-sm font-black uppercase bg-white">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-6 text-right flex flex-col md:flex-row items-center justify-end gap-3 h-full">
                      {session?.user?.role === "Tendik" && item.status === "Draft" && (
                        <>
                          <button onClick={() => ajukanKeKeuangan(item._id)} className="border-[4px] border-black bg-blue-500 text-white px-4 py-2 text-sm font-black uppercase hover:bg-black transition-colors w-full md:w-auto">
                            AJUKAN
                          </button>
                          <button onClick={() => hapusDraft(item._id)} className="border-[4px] border-black bg-red-500 text-white px-4 py-2 hover:bg-black transition-colors w-full md:w-auto" title="HAPUS">
                            <Trash2 className="w-5 h-5 mx-auto" />
                          </button>
                        </>
                      )}
                      
                      {session?.user?.role === "Keuangan" && item.status === "Menunggu Validasi" && (
                        <button onClick={() => validasiPagu(item._id, item.estimasiAnggaran)} className="border-[4px] border-black bg-emerald-500 text-white px-6 py-3 text-lg font-black uppercase hover:bg-black transition-colors w-full md:w-auto">
                          VALIDASI PAGU
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
    </div>
  );
}
