import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default function PengajuanDetailMinimalist(props: any) {
  const { data, handleStatusChange, isUpdating, role } = props;

  return (
    <div className="space-y-6 ">
      <Link href="/pengajuan" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">← Kembali ke Pengajuan</Link>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.judul}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Oleh {data.pengusulId?.namaLengkap} ({data.pengusulId?.divisi})</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Pengajuan</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rp {data.totalNominal?.toLocaleString('id-ID')}</div>
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
            {data.rab?.map((item: any, i: number) => (
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
          {data.riwayatStatus?.map((r: any, i: number) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="mt-1"><CheckCircle className="w-4 h-4 text-green-500" /></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{r.status}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(r.timestamp).toLocaleString('id-ID')} - {r.keterangan || "Tidak ada keterangan"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(role === "admin_keuangan" || role === "ketua") && data.status !== "Selesai" && data.status !== "Ditolak" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex gap-4">
          <button onClick={() => handleStatusChange("Ditolak", "Ditolak")} disabled={isSubmitting} className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Tolak
          </button>
          <button onClick={() => handleStatusChange(role === "admin_keuangan" ? "Menunggu Ketua" : "Disetujui Ketua", "Disetujui")} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Setujui
          </button>
        </div>
      )}
    </div>
  );
}
