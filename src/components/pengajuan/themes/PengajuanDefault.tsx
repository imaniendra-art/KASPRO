import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, FileText, Loader2, Upload, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Review Admin": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Menunggu Ketua": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Disetujui Ketua": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Dicairkan": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Ditolak": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Selesai": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function PengajuanDefault({ data, isLoading, error, uploadingId, handleUploadBukti }: any) {
  const { data: session } = useSession();
  const isUser = session?.user?.role === "user";
  const isKetua = session?.user?.role === "ketua";
  const isAdmin = session?.user?.role === "admin";

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const groupedData = useMemo(() => {
    if (!isKetua || !data) return null;
    
    return data.reduce((acc: any, item: any) => {
      const pengusulInfo = item.pengusulId;
      const unitName = pengusulInfo?.unitId?.namaUnit || pengusulInfo?.divisi || pengusulInfo?.role || "-";
      const nama = pengusulInfo?.namaLengkap || "Tanpa Nama";
      const groupKey = `${nama} (${unitName})`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = {
          namaLengkap: nama,
          divisi: unitName,
          totalPermintaan: 0,
          items: []
        };
      }
      
      acc[groupKey].items.push(item);
      acc[groupKey].totalPermintaan += (item.totalNominal || 0);
      
      return acc;
    }, {});
  }, [data, isKetua]);

  const renderTable = (tableData: any[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Judul Pengajuan</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Jenis</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Total Nominal</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {tableData.map((item: any) => (
            <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
              <td className="p-4">
                <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.judul}</p>
              </td>
              <td className="p-4">
                <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border tracking-wide uppercase ${item.prokerId ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                  {item.prokerId ? "Proker" : "Non Proker"}
                </span>
              </td>
              <td className="p-4 text-slate-500 dark:text-gray-400 text-sm">
                {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="p-4 font-medium text-slate-900 dark:text-white">
                Rp {item.totalNominal.toLocaleString('id-ID')}
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="p-4 text-right flex items-center justify-end gap-3">
                {!isKetua && (item.status === 'Dicairkan' || item.status === 'Selesai') && (
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
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const w = window.open();
                      if (w) w.document.write(`<img src="${item.buktiLpj}" style="max-width:100%;"/>`);
                    }}
                    className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Lihat Bukti
                  </button>
                )}
                
                <Link href={`/pengajuan/${item._id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{(isKetua || isAdmin) ? "Daftar Pengajuan Dana" : "Pengajuan Anggaran"}</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">Daftar semua permintaan dana yang telah diajukan.</p>
        </div>
        
        {isUser && (
          <Link 
            href="/pengajuan/baru"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
          >
            <Plus className="w-5 h-5" />
            <span>Buat Pengajuan Baru</span>
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-sm dark:shadow-none">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-gray-400">Memuat data pengajuan...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 dark:text-red-400">Gagal memuat data: {(error as Error).message}</div>
        ) : (!data || data.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>Belum ada pengajuan anggaran yang dibuat.</p>
          </div>
        ) : isKetua && groupedData ? (
          <div className="flex flex-col gap-4 p-4">
            {Object.entries(groupedData).map(([key, group]: [string, any]) => {
              const isExpanded = expandedGroup === key;
              return (
                <div key={key} className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-black/20">
                  <div 
                    onClick={() => setExpandedGroup(isExpanded ? null : key)}
                    className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{group.namaLengkap}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">{group.divisi}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div className="hidden sm:block">
                        <p className="text-xs text-slate-500 dark:text-gray-400 text-right">Total Pengajuan</p>
                        <p className="font-medium text-slate-900 dark:text-white text-right">{group.items.length} Item</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-gray-400 text-right">Total Permintaan Dana</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400 text-right">Rp {group.totalPermintaan.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-white/10">
                      {renderTable(group.items)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          renderTable(data)
        )}
      </div>
    </div>
  );
}
