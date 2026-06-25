import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProkerMinimalist({
  data, isLoading, error, isAdding, setIsAdding, newProker, setNewProker, handleAddProker, isSubmitting
}: any) {
  const { data: session } = useSession();
  const isKetua = session?.user?.role === "ketua";
  const groupedData = data?.reduce((acc: any, proker: any) => {
    const pengusulName = proker.pengusulId?.namaLengkap || 'Tanpa Nama Pengusul';
    if (!acc[pengusulName]) {
      acc[pengusulName] = [];
    }
    acc[pengusulName].push(proker);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isKetua ? "Daftar Program Kerja" : "Program Kerja"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar usulan program kerja per divisi.</p>
        </div>
        {!isKetua && (
          <button onClick={() => setIsAdding(!isAdding)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Buat Proker
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddProker} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Proker</label>
            <input type="text" required value={newProker.judul} onChange={e => setNewProker({...newProker, judul: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimasi Anggaran</label>
            <input type="number" required value={newProker.estimasiAnggaran || ''} onChange={e => setNewProker({...newProker, estimasiAnggaran: Number(e.target.value)})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
          </div>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50">
            Simpan
          </button>
        </form>
      )}

      <div className="space-y-8">
        {groupedData && Object.entries(groupedData).map(([pengusulName, prokers]: [string, any]) => (
          <div key={pengusulName} className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{pengusulName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prokers.map((proker: any) => (
                <div key={proker._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight">{proker.judul}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                      proker.status === 'Ditolak' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      proker.status === 'Divalidasi Keuangan' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      proker.status === 'Selesai' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {proker.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Estimasi Awal</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Rp {proker.estimasiAnggaran?.toLocaleString('id-ID') || 0}</span>
                    </div>
                    
                    {proker.status !== 'Ditolak' && proker.status !== 'Draft' && proker.status !== 'Menunggu Validasi' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Terpakai</span>
                          <span className="font-medium text-red-600 dark:text-red-400">Rp {((proker.estimasiAnggaran || 0) - (proker.sisaAnggaran || 0)).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-700">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Sisa Anggaran</span>
                          <span className="font-bold text-green-600 dark:text-green-400">Rp {proker.sisaAnggaran?.toLocaleString('id-ID') || 0}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {proker.status !== 'Ditolak' && proker.status !== 'Draft' && proker.status !== 'Menunggu Validasi' && (
                    <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, (((proker.estimasiAnggaran || 0) - (proker.sisaAnggaran || 0)) / (proker.estimasiAnggaran || 1)) * 100)}%` }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
