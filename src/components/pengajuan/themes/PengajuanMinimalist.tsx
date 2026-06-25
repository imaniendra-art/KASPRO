import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";

export default function PengajuanMinimalist({ data, isLoading, error }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengajuan Dana</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar permintaan dana yang diajukan.</p>
        </div>
        <Link href="/pengajuan/baru" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Buat Pengajuan
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : data?.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">Belum ada pengajuan.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-4 font-medium">Judul</th>
                <th className="p-4 font-medium">Pengusul</th>
                <th className="p-4 font-medium">Nominal</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item: any) => (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.judul}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{item.pengusulId?.namaLengkap}</td>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100">Rp {item.totalNominal?.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/pengajuan/${item._id}`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
