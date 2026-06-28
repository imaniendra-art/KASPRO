import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Loader2, FileText, Upload, ChevronDown, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PengajuanMinimalist({ data, isLoading, error, uploadingId, handleUploadBukti }: any) {
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
    <table className="w-full text-left text-sm whitespace-nowrap">
      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
        <tr>
          <th className="p-4 font-medium">Judul</th>
          <th className="p-4 font-medium">Jenis</th>
          <th className="p-4 font-medium">Pengusul</th>
          <th className="p-4 font-medium">Nominal</th>
          <th className="p-4 font-medium">Status</th>
          <th className="p-4 font-medium">Bukti</th>
          <th className="p-4 font-medium">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {tableData.map((item: any) => (
          <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <td className="p-4 font-medium text-gray-900 dark:text-gray-100 truncate max-w-[250px]" title={item.judul}>{item.judul}</td>
            <td className="p-4">
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${item.prokerId ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                {item.prokerId ? "Proker" : "Non Proker"}
              </span>
            </td>
            <td className="p-4 text-gray-500 dark:text-gray-400">
              {item.pengusulId?.namaLengkap} ({item.pengusulId?.unitId?.namaUnit || item.pengusulId?.divisi || item.pengusulId?.role || "-"})
            </td>
            <td className="p-4 font-medium text-gray-900 dark:text-gray-100">Rp {item.totalNominal?.toLocaleString('id-ID')}</td>
            <td className="p-4">
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                {item.status}
              </span>
            </td>
            <td className="p-4">
              {item.buktiLpj ? (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.buktiLpj.startsWith('data:')) {
                      const w = window.open("");
                      if (w) {
                        if (item.buktiLpj.startsWith('data:application/pdf')) {
                          w.document.write(`<iframe src="${item.buktiLpj}" width="100%" height="100%" style="border:none;"></iframe>`);
                        } else {
                          w.document.write(`<img src="${item.buktiLpj}" style="max-width:100%; margin:auto; display:block;"/>`);
                        }
                      }
                    } else {
                      window.open(item.buktiLpj, '_blank');
                    }
                  }}
                  className="text-gray-500 hover:text-blue-600 transition-colors" 
                  title="Lihat Bukti"
                >
                  <FileText className="w-5 h-5" />
                </button>
              ) : (
                <span className="text-gray-300 dark:text-gray-600">-</span>
              )}
            </td>
            <td className="p-4 flex items-center gap-3">
              <Link href={`/pengajuan/${item._id}`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                Detail
              </Link>
              {!isKetua && (item.status === 'Dicairkan' || item.status === 'Selesai') && (
                <div className="relative flex items-center justify-center">
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
                      uploadingId === item._id ? 'text-gray-400' : 'text-emerald-600 hover:text-emerald-500'
                    }`}
                    title="Upload Bukti LPJ"
                  >
                    {uploadingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </label>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{(isKetua || isAdmin) ? "Daftar Pengajuan Dana" : "Pengajuan Dana"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar permintaan dana yang diajukan.</p>
        </div>
        {isUser && (
          <Link href="/pengajuan/baru" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Buat Pengajuan
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : (!data || data.length === 0) ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">Belum ada pengajuan.</div>
        ) : isKetua && groupedData ? (
          <div className="flex flex-col">
            {Object.entries(groupedData).map(([key, group]: [string, any]) => {
              const isExpanded = expandedGroup === key;
              return (
                <div key={key} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div 
                    onClick={() => setExpandedGroup(isExpanded ? null : key)}
                    className="flex justify-between items-center p-5 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{group.namaLengkap}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{group.divisi}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Item</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{group.items.length}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Dana</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Rp {group.totalPermintaan.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-4 overflow-x-auto">
                      {renderTable(group.items)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {renderTable(data)}
          </div>
        )}
      </div>
    </div>
  );
}
