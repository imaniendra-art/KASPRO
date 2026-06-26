import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PengajuanBrutalism({ data, isLoading, error, uploadingId, handleUploadBukti }: any) {
  const { data: session } = useSession();
  const isUser = session?.user?.role === "user";
  const isKetua = session?.user?.role === "ketua";
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="p-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard" className="inline-block border-[4px] border-black px-4 py-2 font-black uppercase text-xl hover:bg-black hover:text-[#e5ff00] transition-colors mb-6 bg-white text-black">
            ← KEMBALI KE DASHBOARD
          </Link>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{(isKetua || isAdmin) ? "DAFTAR PENGAJUAN" : "PENGAJUAN"}</h1>
          <p className="text-xl font-bold uppercase tracking-widest mt-4">Daftar Permintaan Dana</p>
        </div>
        
        {isUser && (
          <Link 
            href="/pengajuan/baru"
            className="border-[4px] border-black px-8 py-4 bg-[#ff003c] text-[#ffffff] font-black text-2xl uppercase hover:bg-black hover:text-[#ff003c] transition-colors text-center"
          >
            + BUAT PENGAJUAN BARU
          </Link>
        )}
      </div>

      <div className="border-[4px] border-black bg-white text-black">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
            <p className="text-2xl font-black uppercase">MEMUAT DATA...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-500 text-[#ffffff] font-black text-2xl uppercase border-b-[4px] border-black">
            GAGAL MEMUAT: {(error as Error).message}
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="p-20 text-center text-4xl font-black uppercase">
            BELUM ADA PENGAJUAN.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[4px] border-black bg-[#e5ff00]">
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black">JUDUL</th>
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black whitespace-nowrap">TANGGAL</th>
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black whitespace-nowrap">NOMINAL</th>
                  <th className="p-6 text-xl font-black uppercase border-r-[4px] border-black">STATUS</th>
                  <th className="p-6 text-xl font-black uppercase text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y-[4px] divide-black">
                {data.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-100 transition-colors group">
                    <td className="p-6 border-r-[4px] border-black">
                      <p className="text-2xl font-black uppercase leading-tight">{item.judul}</p>
                    </td>
                    <td className="p-6 border-r-[4px] border-black text-lg font-bold uppercase whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="p-6 border-r-[4px] border-black text-2xl font-black whitespace-nowrap">
                      RP {item.totalNominal.toLocaleString('id-ID')}
                    </td>
                    <td className="p-6 border-r-[4px] border-black">
                      <span className="inline-block border-[4px] border-black px-3 py-1 text-sm font-black uppercase bg-white">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-6 text-right flex items-center justify-end gap-4 h-full">
                      {(item.status === 'Dicairkan' || item.status === 'Selesai') && (
                        <>
                          <input
                            type="file"
                            id={`bukti-${item._id}`}
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleUploadBukti(item._id, e.target.files?.[0] || null)}
                            disabled={uploadingId === item._id}
                          />
                          <label
                            htmlFor={`bukti-${item._id}`}
                            className="cursor-pointer border-[4px] border-black px-4 py-2 text-sm font-black uppercase bg-[#e5ff00] hover:bg-black hover:text-[#e5ff00] transition-colors whitespace-nowrap"
                          >
                            {uploadingId === item._id ? 'UPLOADING...' : item.status === 'Selesai' ? 'UPLOAD ULANG' : 'UPLOAD BUKTI'}
                          </label>
                        </>
                      )}
                      
                      {item.buktiLpj && (
                        <a 
                          href={item.buktiLpj} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="border-[4px] border-black px-4 py-2 text-sm font-black uppercase bg-white hover:bg-black hover:text-[#e5ff00] transition-colors whitespace-nowrap"
                        >
                          LIHAT BUKTI
                        </a>
                      )}
                      
                      <Link href={`/pengajuan/${item._id}`} className="border-[4px] border-black px-4 py-2 text-sm font-black uppercase bg-black text-[#ffffff] hover:bg-[#e5ff00] hover:text-black transition-colors">
                        DETAIL →
                      </Link>
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
