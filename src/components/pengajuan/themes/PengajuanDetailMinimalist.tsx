import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function PengajuanDetailMinimalist(props: any) {
  const { 
    p, logs, 
    isAdmin, isKetua, 
    needsAdminAction, needsKetuaAction, needsCairAction, 
    catatanUmum, setCatatanUmum,
    catatanAdmin, setCatatanAdmin,
    catatanUser, setCatatanUser,
    nominalDisetujui, setNominalDisetujui,
    potongPaguMaster, setPotongPaguMaster,
    isSubmitting, handleAction, handleUploadBukti 
  } = props;

  return (
    <div className="space-y-6 ">
      <Link href="/pengajuan" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">← Kembali ke Pengajuan</Link>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{p.judul}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Oleh {p.pengusulId?.namaLengkap} ({p.pengusulId?.divisi})</p>
            {['Dicairkan', 'Selesai'].includes(p.status) && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.potongPaguMaster ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                {p.potongPaguMaster ? 'Dana Pagu' : 'Dana Non-Pagu'}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Pengajuan</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Rp {p.totalNominal?.toLocaleString('id-ID')}</div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {p.status}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Rincian Anggaran (RAB)</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {p.rab?.map((item: any, i: number) => (
              <tr key={i}>
                <td className="p-3 text-gray-900 dark:text-gray-100">{item.namaItem}</td>
                <td className="p-3 text-gray-500 dark:text-gray-400">{item.jumlah} {item.satuan}</td>
                <td className="p-3 text-gray-500 dark:text-gray-400">Rp {item.hargaSatuan?.toLocaleString('id-ID')}</td>
                <td className="p-3 text-gray-900 dark:text-gray-100 font-medium">Rp {item.total?.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Riwayat Status</h3>
        <div className="space-y-4">
          {logs?.map((r: any, i: number) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="mt-1"><CheckCircle className="w-4 h-4 text-emerald-500" /></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {r.aksi || r.status || "Update"} oleh {r.userId?.namaLengkap}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(r.createdAt).toLocaleString('id-ID')} - {r.catatan || "Tidak ada keterangan"}
                </p>
              </div>
            </div>
          ))}
          {logs?.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada riwayat.</p>
          )}
        </div>
      </div>

      {(needsAdminAction || needsKetuaAction || needsCairAction) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Aksi & Keputusan</h3>
          
          {(needsAdminAction || needsKetuaAction) && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nominal Disetujui (Opsional)</label>
                <input 
                  type="number" 
                  value={nominalDisetujui || p.totalNominal}
                  onChange={e => setNominalDisetujui(Number(e.target.value))}
                  className="w-full sm:w-1/2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {isKetua ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan untuk Keuangan</label>
                    <textarea 
                      rows={2}
                      value={catatanAdmin}
                      onChange={e => setCatatanAdmin(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan untuk Pengusul</label>
                    <textarea 
                      rows={2}
                      value={catatanUser}
                      onChange={e => setCatatanUser(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan Tambahan</label>
                  <textarea 
                    rows={2}
                    value={catatanUmum}
                    onChange={e => setCatatanUmum(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {isAdmin && !p.prokerId && (
                <div className="flex items-center gap-3 mt-2">
                  <input 
                    type="checkbox" 
                    id="potongPagu"
                    checked={potongPaguMaster}
                    onChange={(e) => setPotongPaguMaster(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="potongPagu" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Potong Dana dari Pagu Master KASPRO
                  </label>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            {needsAdminAction && (
              <>
                <button onClick={() => handleAction("Reject", "Ditolak")} disabled={isSubmitting} className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Tolak Pengajuan</button>
                <button onClick={() => handleAction("Teruskan", "Menunggu Ketua")} disabled={isSubmitting} className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">Teruskan ke Ketua</button>
              </>
            )}
            
            {needsKetuaAction && (
              <>
                <button onClick={() => handleAction("Reject", "Ditolak")} disabled={isSubmitting} className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Tolak</button>
                <button onClick={() => handleAction("Approve", "Disetujui Ketua")} disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Setujui
                </button>
              </>
            )}
            
            {needsCairAction && (
              <button onClick={() => handleAction("Approve", "Dicairkan")} disabled={isSubmitting} className="px-5 py-2.5 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                Cairkan Dana
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
