"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, FileText, Loader2, Clock, CheckCircle, XCircle, Upload } from "lucide-react";
import { useState } from "react";

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

export default function DaftarPengajuanSaya() {
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pengajuan"],
    queryFn: fetchPengajuan
  });

  const handleUploadBukti = async (id: string, file: File | null) => {
    if (!file) return;
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("bukti", file);

      const res = await fetch(`/api/pengajuan/${id}/bukti`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Gagal mengunggah bukti");
      }

      alert("Bukti berhasil diunggah! Status pengajuan kini Selesai.");
      queryClient.invalidateQueries({ queryKey: ["pengajuan"] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pengajuan Anggaran</h1>
          <p className="text-gray-400 mt-1 text-sm">Daftar semua permintaan dana yang telah Anda ajukan.</p>
        </div>
        
        <Link 
          href="/pengajuan/baru"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Pengajuan Baru</span>
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400">Memuat data pengajuan...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">Gagal memuat data: {(error as Error).message}</div>
        ) : data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>Belum ada pengajuan anggaran yang dibuat.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Judul Pengajuan</th>
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
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
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 font-medium text-white">
                      Rp {item.totalNominal.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-3">
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
                            className={`cursor-pointer text-sm font-medium flex items-center gap-1 transition-colors ${
                              uploadingId === item._id ? 'text-gray-500' : 'text-emerald-400 hover:text-emerald-300'
                            }`}
                          >
                            {uploadingId === item._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {item.status === 'Selesai' ? 'Upload Ulang' : 'Upload Bukti'}
                          </label>
                        </>
                      )}
                      
                      {item.buktiLpj && (
                        <a 
                          href={item.buktiLpj} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          Lihat Bukti
                        </a>
                      )}
                      
                      <Link href={`/pengajuan/${item._id}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                        Detail
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
