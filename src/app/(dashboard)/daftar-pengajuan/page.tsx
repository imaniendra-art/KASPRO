"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, FileText } from "lucide-react";

const fetchPengajuan = async () => {
  const res = await fetch("/api/pengajuan");
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json.data;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Review Admin": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Menunggu Ketua": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Disetujui Ketua": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Dicairkan": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Ditolak": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Selesai": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function DaftarSemuaPengajuan() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["semua_pengajuan"],
    queryFn: fetchPengajuan
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Daftar Pengajuan Masuk</h1>
        <p className="text-gray-400 mt-1 text-sm">Kelola semua permintaan dana dari berbagai divisi.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">Gagal memuat data: {(error as Error).message}</div>
        ) : data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>Belum ada pengajuan masuk.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Judul Pengajuan</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pengusul</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Nominal</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((item: any) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{item.judul}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-300 font-medium">{item.pengusulId?.namaLengkap}</p>
                      <p className="text-xs text-gray-500">{item.pengusulId?.divisi}</p>
                    </td>
                    <td className="p-4 font-medium text-white">
                      Rp {item.totalNominal.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/pengajuan/${item._id}`} className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors">
                        Tinjau
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
